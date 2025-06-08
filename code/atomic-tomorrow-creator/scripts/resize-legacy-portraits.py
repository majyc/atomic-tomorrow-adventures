#!/usr/bin/env python3
"""
Resize Legacy Portrait Script
Reduces the large 1024x1024 portraits (m_1 to m_30, f_1 to f_30) to 341x341 
to match the new sliced portraits and reduce file sizes significantly.
"""

import os
import sys
from PIL import Image
import glob

def resize_portraits():
    """Resize legacy portraits to match new portrait dimensions"""
    
    # Configuration
    portraits_dir = "../public/portraits"
    target_size = (341, 341)  # Match the new sliced portraits
    quality = 85  # JPEG quality (good balance of size vs quality)
    
    # Find legacy portrait files (m_1 to m_30, f_1 to f_30)
    legacy_patterns = [
        "m_[1-9].jpg", "m_[12][0-9].jpg", "m_30.jpg",  # m_1 to m_30
        "f_[1-9].jpg", "f_[12][0-9].jpg", "f_30.jpg"   # f_1 to f_30
    ]
    
    legacy_files = []
    for pattern in legacy_patterns:
        legacy_files.extend(glob.glob(os.path.join(portraits_dir, pattern)))
    
    legacy_files.sort()
    
    if not legacy_files:
        print("❌ No legacy portrait files found")
        return
    
    print(f"🖼️  Found {len(legacy_files)} legacy portraits to resize")
    print(f"📏 Target size: {target_size[0]}x{target_size[1]}")
    print(f"🎨 JPEG quality: {quality}%")
    print()
    
    total_size_before = 0
    total_size_after = 0
    processed = 0
    
    for filepath in legacy_files:
        try:
            # Get original file size
            original_size = os.path.getsize(filepath)
            total_size_before += original_size
            
            # Check if file is already small enough (skip if under 100KB)
            if original_size < 100 * 1024:
                print(f"⏭️  Skipping {os.path.basename(filepath)} (already optimized: {original_size//1024}KB)")
                total_size_after += original_size
                continue
            
            # Open and resize image
            with Image.open(filepath) as img:
                # Get original dimensions
                original_width, original_height = img.size
                
                # Skip if already correct size
                if img.size == target_size:
                    print(f"⏭️  Skipping {os.path.basename(filepath)} (already correct size)")
                    total_size_after += original_size
                    continue
                
                # Convert to RGB if necessary (removes transparency)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize with high-quality resampling
                # Use LANCZOS for older PIL versions, or ANTIALIAS as fallback
                try:
                    resized_img = img.resize(target_size, Image.LANCZOS)
                except AttributeError:
                    resized_img = img.resize(target_size, Image.ANTIALIAS)
                
                # Create backup filename
                backup_path = filepath + '.backup'
                
                # Backup original (only if backup doesn't exist)
                if not os.path.exists(backup_path):
                    os.rename(filepath, backup_path)
                    print(f"💾 Backed up original to {os.path.basename(backup_path)}")
                
                # Save resized image
                resized_img.save(filepath, 'JPEG', quality=quality, optimize=True)
                
                # Get new file size
                new_size = os.path.getsize(filepath)
                total_size_after += new_size
                
                # Calculate reduction
                reduction_percent = ((original_size - new_size) / original_size) * 100
                
                print(f"✅ {os.path.basename(filepath)}: {original_width}x{original_height} ({original_size//1024}KB) → {target_size[0]}x{target_size[1]} ({new_size//1024}KB) [{reduction_percent:.1f}% smaller]")
                
                processed += 1
                
        except Exception as e:
            print(f"❌ Error processing {os.path.basename(filepath)}: {e}")
    
    # Summary
    print()
    print(f"🎉 Processing complete!")
    print(f"📊 Files processed: {processed}")
    print(f"💾 Total size before: {total_size_before // (1024*1024):.1f}MB")
    print(f"💾 Total size after: {total_size_after // (1024*1024):.1f}MB")
    
    if total_size_before > 0:
        total_reduction = ((total_size_before - total_size_after) / total_size_before) * 100
        savings_mb = (total_size_before - total_size_after) / (1024*1024)
        print(f"🚀 Total reduction: {total_reduction:.1f}% ({savings_mb:.1f}MB saved)")
    
    print()
    print("💡 Tip: Original files are backed up with .backup extension")
    print("💡 If you're happy with the results, you can delete the .backup files to save space")

if __name__ == "__main__":
    # Check if PIL is available
    try:
        from PIL import Image
    except ImportError:
        print("❌ Error: PIL (Pillow) is required but not installed")
        print("📦 Install it with: pip install Pillow")
        sys.exit(1)
    
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print("🎨 Atomic Tomorrow Portrait Resizer")
    print("=" * 50)
    
    resize_portraits()