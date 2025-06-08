#!/usr/bin/env python3
"""
Smart Portrait Slicing Script for Atomic Tomorrow Character Creator

This script intelligently detects portrait boundaries in AI-generated sprite sheets
and slices them into individual portrait files with proper naming.

Features:
- Automatic boundary detection using edge analysis
- Handles non-uniform spacing from AI-generated images
- Preview mode to verify detection before slicing
- Manual adjustment options

Usage:
    python slice-portraits.py input_image.png --cols 4 --rows 3 --gender m --start-num 31

Requirements:
    pip install Pillow opencv-python numpy
"""

import argparse
import os
from PIL import Image, ImageFilter, ImageOps
import numpy as np
try:
    import cv2
    HAS_OPENCV = True
except ImportError:
    HAS_OPENCV = False
    print("Warning: OpenCV not available. Using basic edge detection.")
import math

def analyze_image_histogram(img_array):
    """
    Analyze the color distribution in the image to help determine thresholds
    """
    print("=== Image Color Analysis ===")
    
    # Overall histogram
    hist, bins = np.histogram(img_array.flatten(), bins=50, range=(0, 255))
    
    print("Color distribution (value -> count):")
    for i, (bin_start, count) in enumerate(zip(bins[:-1], hist)):
        if count > 1000:  # Only show significant populations
            bin_end = bins[i+1]
            print(f"  {bin_start:.0f}-{bin_end:.0f}: {count:,} pixels ({count/img_array.size*100:.1f}%)")
    
    # Find the most common "background" color (should be high values)
    high_value_mask = img_array >= 200
    if np.any(high_value_mask):
        background_values = img_array[high_value_mask]
        bg_hist, bg_bins = np.histogram(background_values, bins=20, range=(200, 255))
        most_common_bg_idx = np.argmax(bg_hist)
        most_common_bg_value = (bg_bins[most_common_bg_idx] + bg_bins[most_common_bg_idx + 1]) / 2
        print(f"Most common background value: ~{most_common_bg_value:.0f} ({bg_hist[most_common_bg_idx]:,} pixels)")
        return int(most_common_bg_value - 10)  # Slightly lower threshold to catch variations
    else:
        print("No clear background detected, using default threshold")
        return 240

def detect_split_lines(img_array, direction='vertical', expected_splits=3, min_gap=20):
    """
    Detect optimal split lines using constrained local optimization
    
    Start with mathematical divisions, then locally optimize each line to find
    maximum white pixels while constraining search to avoid edge attractions.
    
    Args:
        img_array: numpy array of grayscale image
        direction: 'vertical' or 'horizontal'
        expected_splits: number of split lines expected
        min_gap: minimum pixels between split lines (unused in this approach)
    
    Returns:
        List of pixel positions for split lines
    """
    # Analyze image colors first to determine optimal threshold
    if direction == 'vertical':  # Only do this once
        white_threshold = analyze_image_histogram(img_array)
        print(f"Using adaptive white threshold: {white_threshold}")
    else:
        white_threshold = 230  # Use a reasonable default for horizontal pass
    
    if direction == 'vertical':
        # Count white pixels in each column
        white_counts = np.sum(img_array >= white_threshold, axis=0)
        total_size = img_array.shape[1]
        grid_divisions = expected_splits + 1  # 5 columns = 4 splits + 1
        expected_max = img_array.shape[0]  # Should approach image height for clear columns
    else:
        # Count white pixels in each row
        white_counts = np.sum(img_array >= white_threshold, axis=1)
        total_size = img_array.shape[0]
        grid_divisions = expected_splits + 1  # 3 rows = 2 splits + 1
        expected_max = img_array.shape[1]  # Should approach image width for clear rows
    
    print(f"White pixel counts ({direction}): min={np.min(white_counts)}, max={np.max(white_counts)}, mean={np.mean(white_counts):.1f}")
    print(f"Expected max for clear line: {expected_max}")
    
    # Check if we're finding truly clear lines
    clear_lines = white_counts >= (expected_max * 0.95)  # 95% white = clear line
    if np.any(clear_lines):
        clear_positions = np.where(clear_lines)[0]
        print(f"Found {len(clear_positions)} nearly clear lines at positions: {clear_positions[:10]}...")  # Show first 10
    else:
        print("No completely clear lines found - may need different approach")
    
    # Start with mathematical divisions (even spacing)
    segment_size = total_size / grid_divisions
    initial_splits = []
    for i in range(1, grid_divisions):
        pos = int(i * segment_size)
        initial_splits.append(pos)
    
    print(f"Initial mathematical splits ({direction}): {initial_splits}")
    
    # For each split line, locally optimize to find maximum white pixels
    optimized_splits = []
    
    for i, split_pos in enumerate(initial_splits):
        # Calculate search range - half way to neighboring divisions
        if i == 0:
            # First split - search from 0 to halfway to next split
            search_start = max(0, split_pos - int(segment_size // 2))
            search_end = min(total_size - 1, split_pos + int(segment_size // 2))
        elif i == len(initial_splits) - 1:
            # Last split - search from halfway to prev split to end
            search_start = max(0, split_pos - int(segment_size // 2))
            search_end = min(total_size - 1, split_pos + int(segment_size // 2))
        else:
            # Middle split - search within bounds of neighboring segments
            search_start = max(0, split_pos - int(segment_size // 2))
            search_end = min(total_size - 1, split_pos + int(segment_size // 2))
        
        # Find position with maximum white pixels in search range
        best_pos = split_pos
        best_count = white_counts[split_pos]
        
        for pos in range(search_start, search_end + 1):
            if white_counts[pos] > best_count:
                best_count = white_counts[pos]
                best_pos = pos
        
        optimized_splits.append(best_pos)
        print(f"Split {i+1} ({direction}): {split_pos} -> {best_pos} (white pixels: {best_count})")
    
    print(f"Optimized splits ({direction}): {optimized_splits}")
    return optimized_splits

def find_content_boundaries(profile, threshold_percentile=10):
    """
    Find where the actual content starts and ends (ignoring empty margins)
    """
    # Calculate threshold as a percentile of the profile values
    threshold = np.percentile(profile, threshold_percentile)
    
    # Find first and last positions above threshold
    above_threshold = np.where(profile > threshold)[0]
    
    if len(above_threshold) == 0:
        return 0, len(profile) - 1
    
    content_start = above_threshold[0]
    content_end = above_threshold[-1]
    
    # Add some padding to avoid cutting off edges
    padding = max(5, len(profile) // 100)
    content_start = max(0, content_start - padding)
    content_end = min(len(profile) - 1, content_end + padding)
    
    return content_start, content_end

def find_gaps_in_content(content_profile, expected_splits, min_gap):
    """
    Find gaps (valleys) within the content area that likely separate portraits
    """
    gaps = []
    
    # Look for local minima that could be gaps
    for i in range(min_gap, len(content_profile) - min_gap):
        is_valley = True
        current_val = content_profile[i]
        
        # Check if this is lower than surrounding area
        window_size = min_gap // 2
        for j in range(max(0, i - window_size), min(len(content_profile), i + window_size + 1)):
            if j != i and content_profile[j] < current_val:
                is_valley = False
                break
        
        if is_valley:
            # Make sure it's far enough from existing gaps
            if not gaps or min([abs(i - g) for g in gaps]) >= min_gap:
                gaps.append(i)
    
    return gaps

def fallback_to_content_splits(content_start, content_end, expected_splits):
    """
    Fallback to mathematical divisions within the content area
    """
    content_size = content_end - content_start
    segment_size = content_size / (expected_splits + 1)
    
    splits = []
    for i in range(1, expected_splits + 1):
        pos = content_start + int(i * segment_size)
        splits.append(pos)
    
    return splits

def find_peaks_simple(profile, min_gap, max_peaks):
    """
    Simple peak detection without scipy
    """
    peaks = []
    for i in range(1, len(profile) - 1):
        if profile[i] > profile[i-1] and profile[i] > profile[i+1]:
            # Check minimum distance from existing peaks
            if not peaks or min([abs(i - p) for p in peaks]) >= min_gap:
                peaks.append(i)
                if len(peaks) >= max_peaks:
                    break
    return peaks

def fallback_to_mathematical_splits(total_size, expected_splits, detected_lines):
    """
    Fallback to mathematical divisions when detection fails
    """
    mathematical_splits = []
    segments = expected_splits + 1
    segment_size = total_size / segments
    
    for i in range(1, segments):
        pos = int(i * segment_size)
        mathematical_splits.append(pos)
    
    # If we have some detected lines, try to use them as corrections
    if detected_lines:
        # Use detected lines that are close to mathematical positions
        final_splits = []
        for math_pos in mathematical_splits:
            closest_detected = min(detected_lines, key=lambda x: abs(x - math_pos))
            if abs(closest_detected - math_pos) < total_size * 0.1:  # Within 10%
                final_splits.append(closest_detected)
            else:
                final_splits.append(math_pos)
        return final_splits
    
    return mathematical_splits

def make_square_portrait(img, background_color=(255, 255, 255)):
    """
    Pad a portrait image to make it square while preserving aspect ratio
    
    Args:
        img: PIL Image to make square
        background_color: RGB tuple for padding color (default: white)
    
    Returns:
        PIL Image that is square
    """
    width, height = img.size
    
    # If already square, return as-is
    if width == height:
        return img
    
    # Determine the size of the square (use the larger dimension)
    square_size = max(width, height)
    
    # Create a new square image with background color
    square_img = Image.new('RGB', (square_size, square_size), background_color)
    
    # Calculate position to center the original image
    x_offset = (square_size - width) // 2
    y_offset = (square_size - height) // 2
    
    # Paste the original image onto the square background
    square_img.paste(img, (x_offset, y_offset))
    
    return square_img

def create_edge_map(img):
    """
    Create an edge map using available libraries
    """
    if HAS_OPENCV:
        # Convert PIL to cv2 format
        img_array = np.array(img)
        if len(img_array.shape) == 3:
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        else:
            gray = img_array
        
        # Use Canny edge detection
        edges = cv2.Canny(gray, 50, 150)
        return edges
    else:
        # Fallback using PIL
        gray = img.convert('L')
        edges = gray.filter(ImageFilter.FIND_EDGES)
        return np.array(edges)

def detect_portrait_boundaries(img, cols, rows, debug=False):
    """
    Detect the actual boundaries of portraits in the image
    
    Returns:
        tuple: (vertical_splits, horizontal_splits) - pixel positions for grid lines
    """
    print(f"Analyzing image for {cols}x{rows} portrait grid...")
    
    # Convert to grayscale for analysis
    if img.mode != 'L':
        gray_img = img.convert('L')
    else:
        gray_img = img
    
    img_array = np.array(gray_img)
    
    if debug:
        # Save debug images
        print("Saving debug images...")
        
        # Create a visualization of white pixel density
        white_threshold = 243  # From histogram analysis
        
        # Vertical density (per column)
        vertical_density = np.sum(img_array >= white_threshold, axis=0)
        
        # Horizontal density (per row)  
        horizontal_density = np.sum(img_array >= white_threshold, axis=1)
        
        # Save density plots as images for visualization
        try:
            import matplotlib
            matplotlib.use('Agg')  # Use non-interactive backend
            import matplotlib.pyplot as plt
            
            plt.figure(figsize=(15, 5))
            
            plt.subplot(1, 2, 1)
            plt.plot(vertical_density)
            plt.title('White Pixel Density by Column')
            plt.xlabel('Column (x position)')
            plt.ylabel('White pixel count')
            plt.axhline(y=img_array.shape[0] * 0.95, color='r', linestyle='--', label='95% threshold')
            plt.legend()
            
            plt.subplot(1, 2, 2)
            plt.plot(horizontal_density)
            plt.title('White Pixel Density by Row')
            plt.xlabel('Row (y position)')
            plt.ylabel('White pixel count')
            plt.axhline(y=img_array.shape[1] * 0.95, color='r', linestyle='--', label='95% threshold')
            plt.legend()
            
            plt.tight_layout()
            plt.savefig('debug_density.png', dpi=150, bbox_inches='tight')
            plt.close()
            print("Saved density analysis as debug_density.png")
        except ImportError:
            print("Matplotlib not available, skipping density plots")
            print(f"To install: pip install matplotlib")
            
            # Print the data as text instead
            print(f"Vertical density stats: min={np.min(vertical_density)}, max={np.max(vertical_density)}, mean={np.mean(vertical_density):.1f}")
            print(f"Horizontal density stats: min={np.min(horizontal_density)}, max={np.max(horizontal_density)}, mean={np.mean(horizontal_density):.1f}")
            
            # Find peaks in the data
            vert_peaks = []
            for i in range(1, len(vertical_density)-1):
                if vertical_density[i] > vertical_density[i-1] and vertical_density[i] > vertical_density[i+1] and vertical_density[i] > np.mean(vertical_density) * 1.5:
                    vert_peaks.append((i, vertical_density[i]))
            
            horiz_peaks = []
            for i in range(1, len(horizontal_density)-1):
                if horizontal_density[i] > horizontal_density[i-1] and horizontal_density[i] > horizontal_density[i+1] and horizontal_density[i] > np.mean(horizontal_density) * 1.5:
                    horiz_peaks.append((i, horizontal_density[i]))
            
            print(f"High vertical density peaks: {vert_peaks[:10]}")  # Show first 10
            print(f"High horizontal density peaks: {horiz_peaks[:10]}")  # Show first 10
    
    # Detect vertical split lines (between columns)
    vertical_splits = []
    if cols > 1:
        vertical_splits = detect_split_lines(img_array, 'vertical', cols - 1)
        print(f"Detected vertical splits at: {vertical_splits}")
    
    # Detect horizontal split lines (between rows)  
    horizontal_splits = []
    if rows > 1:
        horizontal_splits = detect_split_lines(img_array, 'horizontal', rows - 1)
        print(f"Detected horizontal splits at: {horizontal_splits}")
    
    return vertical_splits, horizontal_splits

def create_preview_image(img, vertical_splits, horizontal_splits, output_path='preview.png'):
    """
    Create a preview image showing detected split lines
    """
    preview = img.copy()
    
    if HAS_OPENCV:
        # Use OpenCV for drawing lines
        preview_array = np.array(preview)
        
        # Draw vertical lines in red
        for x in vertical_splits:
            cv2.line(preview_array, (x, 0), (x, preview_array.shape[0]), (255, 0, 0), 3)
        
        # Draw horizontal lines in blue
        for y in horizontal_splits:
            cv2.line(preview_array, (0, y), (preview_array.shape[1], y), (0, 0, 255), 3)
        
        preview = Image.fromarray(preview_array)
    else:
        # Fallback: create a simple overlay
        from PIL import ImageDraw
        draw = ImageDraw.Draw(preview)
        
        # Draw vertical lines
        for x in vertical_splits:
            draw.line([(x, 0), (x, img.size[1])], fill='red', width=3)
        
        # Draw horizontal lines  
        for y in horizontal_splits:
            draw.line([(0, y), (img.size[0], y)], fill='blue', width=3)
    
    preview.save(output_path)
    print(f"Preview saved as {output_path}")
    return preview

def slice_portraits_smart(input_path, output_dir, cols, rows, gender, start_num, crop_padding=0, debug=False, square_output=True):
    """
    Smart slice function that detects portrait boundaries
    
    Args:
        input_path: Path to input image
        output_dir: Directory to save individual portraits
        cols: Number of columns in the grid
        rows: Number of rows in the grid
        gender: 'm' or 'f' for male/female
        start_num: Starting number for output files
        crop_padding: Pixels to crop from each edge of each slice
        debug: Save debug images for analysis
        square_output: If True, pad portraits to square dimensions
    """
    
    # Open the source image
    try:
        img = Image.open(input_path)
        print(f"Loaded image: {img.size[0]}x{img.size[1]} pixels")
    except Exception as e:
        print(f"Error loading image: {e}")
        return
    
    # Detect portrait boundaries
    vertical_splits, horizontal_splits = detect_portrait_boundaries(img, cols, rows, debug)
    
    # Create boundary coordinates
    x_coords = [0] + vertical_splits + [img.size[0]]
    y_coords = [0] + horizontal_splits + [img.size[1]]
    
    x_coords.sort()
    y_coords.sort()
    
    print(f"Grid coordinates:")
    print(f"X (vertical): {x_coords}")
    print(f"Y (horizontal): {y_coords}")
    
    # Create preview image
    preview_path = os.path.join(output_dir if output_dir else '.', 'preview_grid.png')
    create_preview_image(img, vertical_splits, horizontal_splits, preview_path)
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    portrait_num = start_num
    
    # Extract portraits using detected boundaries
    for row in range(rows):
        for col in range(cols):
            # Get boundary coordinates for this cell
            left = x_coords[col]
            right = x_coords[col + 1] 
            top = y_coords[row]
            bottom = y_coords[row + 1]
            
            # Apply padding (crop inward)
            if crop_padding > 0:
                left += crop_padding
                top += crop_padding
                right -= crop_padding
                bottom -= crop_padding
            
            # Extract the portrait
            portrait_img = img.crop((left, top, right, bottom))
            
            # Make square if requested
            if square_output:
                portrait_img = make_square_portrait(portrait_img)
            
            # Generate output filename
            output_filename = f"{gender}_{portrait_num}.jpg"
            output_path = os.path.join(output_dir, output_filename)
            
            # Convert to RGB if necessary (for JPEG output)
            if portrait_img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                rgb_img = Image.new('RGB', portrait_img.size, (255, 255, 255))
                if portrait_img.mode == 'P':
                    portrait_img = portrait_img.convert('RGBA')
                rgb_img.paste(portrait_img, mask=portrait_img.split()[-1] if portrait_img.mode == 'RGBA' else None)
                portrait_img = rgb_img
            
            # Save with high quality
            portrait_img.save(output_path, 'JPEG', quality=95, optimize=True)
            print(f"Saved: {output_filename} ({portrait_img.size[0]}x{portrait_img.size[1]}) from [{left},{top},{right},{bottom}]")
            
            portrait_num += 1
    
    print(f"\nSlicing complete! Created {cols * rows} portraits.")
    print(f"Files saved in: {output_dir}")
    print(f"Preview grid saved as: {preview_path}")
    
    # Update portrait counts in the React app
    try:
        import subprocess
        result = subprocess.run(['npm', 'run', 'update-portraits'], 
                              capture_output=True, text=True, cwd='..')
        if result.returncode == 0:
            print(f"✅ Portrait counts updated in React app")
        else:
            print(f"⚠️  Could not update portrait counts: {result.stderr}")
    except Exception as e:
        print(f"⚠️  Could not update portrait counts: {e}")
        print(f"   Run 'npm run update-portraits' manually to update counts")

def slice_portraits_basic(input_path, output_dir, cols, rows, gender, start_num, crop_padding=0, square_output=True):
    """
    Basic slice function using mathematical divisions (fallback method)
    
    Args:
        input_path: Path to the input image
        output_dir: Directory to save individual portraits
        cols: Number of columns in the grid
        rows: Number of rows in the grid
        gender: 'm' or 'f' for male/female
        start_num: Starting number for output files
        crop_padding: Pixels to crop from each edge of each slice
        square_output: If True, pad portraits to square dimensions
    """
    
    # Open the source image
    try:
        img = Image.open(input_path)
        print(f"Loaded image: {img.size[0]}x{img.size[1]} pixels")
    except Exception as e:
        print(f"Error loading image: {e}")
        return
    
    # Calculate slice dimensions using mathematical divisions
    slice_width = img.size[0] // cols
    slice_height = img.size[1] // rows
    
    print(f"Using mathematical slicing into {cols}x{rows} grid, each slice: {slice_width}x{slice_height}")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    portrait_num = start_num
    
    for row in range(rows):
        for col in range(cols):
            # Calculate slice boundaries
            left = col * slice_width
            top = row * slice_height
            right = left + slice_width
            bottom = top + slice_height
            
            # Apply padding (crop inward)
            if crop_padding > 0:
                left += crop_padding
                top += crop_padding
                right -= crop_padding
                bottom -= crop_padding
            
            # Extract the slice
            slice_img = img.crop((left, top, right, bottom))
            
            # Make square if requested
            if square_output:
                slice_img = make_square_portrait(slice_img)
            
            # Generate output filename
            output_filename = f"{gender}_{portrait_num}.jpg"
            output_path = os.path.join(output_dir, output_filename)
            
            # Convert to RGB if necessary (for JPEG output)
            if slice_img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                rgb_img = Image.new('RGB', slice_img.size, (255, 255, 255))
                if slice_img.mode == 'P':
                    slice_img = slice_img.convert('RGBA')
                rgb_img.paste(slice_img, mask=slice_img.split()[-1] if slice_img.mode == 'RGBA' else None)
                slice_img = rgb_img
            
            # Save with high quality
            slice_img.save(output_path, 'JPEG', quality=95, optimize=True)
            print(f"Saved: {output_filename} ({slice_img.size[0]}x{slice_img.size[1]})")
            
            portrait_num += 1
    
    print(f"\nSlicing complete! Created {cols * rows} portraits.")
    print(f"Files saved in: {output_dir}")
    
    # Update portrait counts in the React app
    try:
        import subprocess
        result = subprocess.run(['npm', 'run', 'update-portraits'], 
                              capture_output=True, text=True, cwd='..')
        if result.returncode == 0:
            print(f"✅ Portrait counts updated in React app")
        else:
            print(f"⚠️  Could not update portrait counts: {result.stderr}")
    except Exception as e:
        print(f"⚠️  Could not update portrait counts: {e}")
        print(f"   Run 'npm run update-portraits' manually to update counts")

def auto_detect_grid(img, min_faces=4):
    """
    Attempt to auto-detect grid dimensions based on image aspect ratio
    """
    width, height = img.size
    aspect_ratio = width / height
    
    # Common grid configurations
    grids = [
        (4, 3),  # 4x3 = 12 faces
        (4, 4),  # 4x4 = 16 faces  
        (3, 3),  # 3x3 = 9 faces
        (5, 3),  # 5x3 = 15 faces
        (6, 3),  # 6x3 = 18 faces
        (4, 2),  # 4x2 = 8 faces
        (3, 2),  # 3x2 = 6 faces
    ]
    
    best_match = None
    best_score = float('inf')
    
    for cols, rows in grids:
        if cols * rows < min_faces:
            continue
            
        grid_aspect = cols / rows
        score = abs(aspect_ratio - grid_aspect)
        
        if score < best_score:
            best_score = score
            best_match = (cols, rows)
    
    return best_match

def main():
    parser = argparse.ArgumentParser(description='Smart slice multi-portrait images for Atomic Tomorrow')
    parser.add_argument('input', help='Input image file path')
    parser.add_argument('--output', '-o', default='./public/portraits', help='Output directory (default: ./public/portraits)')
    parser.add_argument('--cols', '-c', type=int, help='Number of columns (auto-detect if not specified)')
    parser.add_argument('--rows', '-r', type=int, help='Number of rows (auto-detect if not specified)')
    parser.add_argument('--gender', '-g', choices=['m', 'f'], required=True, help='Gender for filename (m/f)')
    parser.add_argument('--start-num', '-n', type=int, default=1, help='Starting number for output files (default: 1)')
    parser.add_argument('--padding', '-p', type=int, default=0, help='Pixels to crop from each edge (default: 0)')
    parser.add_argument('--preview', action='store_true', help='Show preview without saving files')
    parser.add_argument('--basic', action='store_true', help='Use basic mathematical slicing instead of smart detection')
    parser.add_argument('--debug', action='store_true', help='Save debug images showing detection process')
    parser.add_argument('--no-square', action='store_true', help='Keep original aspect ratio instead of making square')
    
    args = parser.parse_args()
    
    # Load image for analysis
    try:
        img = Image.open(args.input)
    except Exception as e:
        print(f"Error loading image: {e}")
        return
    
    # Auto-detect grid if not specified
    if not args.cols or not args.rows:
        detected = auto_detect_grid(img)
        if detected:
            cols, rows = detected
            print(f"Auto-detected grid: {cols}x{rows} (aspect ratio: {img.size[0]/img.size[1]:.2f})")
            
            if not args.cols:
                args.cols = cols
            if not args.rows:
                args.rows = rows
        else:
            print("Could not auto-detect grid. Please specify --cols and --rows")
            return
    
    if args.preview:
        print(f"PREVIEW MODE")
        print(f"Input: {args.input} ({img.size[0]}x{img.size[1]})")
        print(f"Grid: {args.cols}x{args.rows}")
        print(f"Output directory: {args.output}")
        
        # Create output directory for preview image
        os.makedirs(args.output, exist_ok=True)
        
        if args.basic:
            slice_width = img.size[0] // args.cols
            slice_height = img.size[1] // args.rows
            print(f"Basic mode - Each slice: {slice_width}x{slice_height}")
            
            # Create a simple preview for basic mode
            from PIL import ImageDraw
            preview = img.copy()
            draw = ImageDraw.Draw(preview)
            
            # Draw grid lines
            for col in range(1, args.cols):
                x = col * slice_width
                draw.line([(x, 0), (x, img.size[1])], fill='red', width=3)
            for row in range(1, args.rows):
                y = row * slice_height
                draw.line([(0, y), (img.size[0], y)], fill='blue', width=3)
            
            preview_path = os.path.join(args.output, 'preview_grid.png')
            preview.save(preview_path)
            print(f"Preview saved: {preview_path}")
        else:
            print("Smart mode - detecting optimal boundaries...")
            vertical_splits, horizontal_splits = detect_portrait_boundaries(img, args.cols, args.rows, args.debug)
            print(f"Detected boundaries: V={vertical_splits}, H={horizontal_splits}")
            
            # Create preview image showing detected boundaries
            preview_path = os.path.join(args.output, 'preview_grid.png')
            create_preview_image(img, vertical_splits, horizontal_splits, preview_path)
            
        print(f"Would create {args.cols * args.rows} files: {args.gender}_1.jpg to {args.gender}_{args.cols * args.rows}.jpg")
        print("Use without --preview to actually slice the image")
    else:
        square_output = not args.no_square
        
        if args.basic:
            print("Using basic mathematical slicing...")
            slice_portraits_basic(
                args.input, 
                args.output, 
                args.cols, 
                args.rows, 
                args.gender, 
                args.start_num,
                args.padding,
                square_output
            )
        else:
            print("Using smart boundary detection...")
            slice_portraits_smart(
                args.input, 
                args.output, 
                args.cols, 
                args.rows, 
                args.gender, 
                args.start_num,
                args.padding,
                args.debug,
                square_output
            )

if __name__ == '__main__':
    main()