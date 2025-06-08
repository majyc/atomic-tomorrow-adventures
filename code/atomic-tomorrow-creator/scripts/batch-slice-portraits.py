#!/usr/bin/env python3
"""
Batch Portrait Slicing Script for Atomic Tomorrow Character Creator

Process multiple sprite sheets at once with different configurations.

Usage:
    python batch-slice-portraits.py config.json

Requirements:
    pip install Pillow opencv-python numpy
"""

import json
import argparse
import os
import sys
from pathlib import Path

# Import the slicing functions from the main script
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from slice_portraits import slice_portraits_smart, slice_portraits_basic, auto_detect_grid
from PIL import Image

def load_batch_config(config_path):
    """
    Load batch processing configuration from JSON file
    
    Example config.json:
    {
        "output_dir": "./all_portraits",
        "default_padding": 5,
        "use_smart_detection": true,
        "debug": false,
        "batches": [
            {
                "input": "male_sheet_1.png",
                "gender": "m",
                "start_num": 31,
                "cols": 4,
                "rows": 3,
                "padding": 10
            },
            {
                "input": "female_sheet_1.png", 
                "gender": "f",
                "start_num": 31
            }
        ]
    }
    """
    try:
        with open(config_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading config: {e}")
        return None

def create_sample_config(output_path):
    """
    Create a sample configuration file
    """
    sample_config = {
        "output_dir": "./portraits",
        "default_padding": 5,
        "use_smart_detection": True,
        "debug": False,
        "batches": [
            {
                "input": "male_sheet_1.png",
                "gender": "m",
                "start_num": 31,
                "cols": 4,
                "rows": 3,
                "padding": 10,
                "comment": "4x3 grid starting at m_31"
            },
            {
                "input": "female_sheet_1.png", 
                "gender": "f",
                "start_num": 31,
                "comment": "Auto-detect grid, start at f_31"
            },
            {
                "input": "male_sheet_2.png",
                "gender": "m", 
                "start_num": 43,
                "cols": 3,
                "rows": 4,
                "use_basic": True,
                "comment": "Force basic slicing for this problematic sheet"
            }
        ]
    }
    
    try:
        with open(output_path, 'w') as f:
            json.dump(sample_config, f, indent=2)
        print(f"Sample configuration created: {output_path}")
        return True
    except Exception as e:
        print(f"Error creating sample config: {e}")
        return False

def process_batch(config):
    """
    Process all images in the batch configuration
    """
    if not config:
        return False
    
    # Global settings
    global_output = config.get('output_dir', './portraits')
    global_padding = config.get('default_padding', 0)
    use_smart = config.get('use_smart_detection', True)
    debug = config.get('debug', False)
    
    print(f"Batch processing {len(config['batches'])} images...")
    print(f"Output directory: {global_output}")
    print(f"Smart detection: {'enabled' if use_smart else 'disabled'}")
    
    # Create output directory
    os.makedirs(global_output, exist_ok=True)
    
    total_portraits = 0
    
    for i, batch in enumerate(config['batches']):
        print(f"\n--- Processing batch {i+1}/{len(config['batches'])} ---")
        
        # Get batch settings
        input_path = batch['input']
        gender = batch['gender']
        start_num = batch.get('start_num', 1)
        cols = batch.get('cols')
        rows = batch.get('rows')
        padding = batch.get('padding', global_padding)
        use_basic = batch.get('use_basic', not use_smart)
        batch_debug = batch.get('debug', debug)
        
        if 'comment' in batch:
            print(f"Note: {batch['comment']}")
        
        # Check if input file exists
        if not os.path.exists(input_path):
            print(f"Warning: Input file not found: {input_path}")
            continue
        
        # Load image for analysis
        try:
            img = Image.open(input_path)
            print(f"Processing: {input_path} ({img.size[0]}x{img.size[1]})")
        except Exception as e:
            print(f"Error loading {input_path}: {e}")
            continue
        
        # Auto-detect grid if not specified
        if not cols or not rows:
            detected = auto_detect_grid(img)
            if detected:
                if not cols:
                    cols = detected[0]
                if not rows:
                    rows = detected[1]
                print(f"Auto-detected grid: {cols}x{rows}")
            else:
                print(f"Could not auto-detect grid for {input_path}, skipping...")
                continue
        
        # Choose slicing method
        if use_basic:
            print(f"Using basic slicing: {cols}x{rows} grid")
            slice_portraits_basic(
                input_path, global_output, cols, rows, 
                gender, start_num, padding
            )
        else:
            print(f"Using smart detection: {cols}x{rows} grid")
            slice_portraits_smart(
                input_path, global_output, cols, rows, 
                gender, start_num, padding, batch_debug
            )
        
        # Count portraits created
        batch_portraits = cols * rows
        total_portraits += batch_portraits
        print(f"Created {batch_portraits} portraits from this batch")
    
    print(f"\n=== Batch processing complete! ===")
    print(f"Total portraits created: {total_portraits}")
    print(f"All files saved in: {global_output}")
    
    return True

def main():
    parser = argparse.ArgumentParser(description='Batch process multiple portrait sprite sheets')
    parser.add_argument('config', nargs='?', help='JSON configuration file path')
    parser.add_argument('--create-sample', '-s', metavar='FILE', help='Create a sample configuration file')
    parser.add_argument('--list-files', '-l', metavar='DIR', help='List image files in directory for config creation')
    
    args = parser.parse_args()
    
    if args.create_sample:
        if create_sample_config(args.create_sample):
            print("Edit the configuration file and run:")
            print(f"python {sys.argv[0]} {args.create_sample}")
        return
    
    if args.list_files:
        print(f"Image files in {args.list_files}:")
        try:
            for ext in ['*.png', '*.jpg', '*.jpeg', '*.bmp', '*.tiff']:
                for file in Path(args.list_files).glob(ext):
                    print(f"  {file.name}")
        except Exception as e:
            print(f"Error listing files: {e}")
        return
    
    if not args.config:
        print("Usage: python batch-slice-portraits.py config.json")
        print("       python batch-slice-portraits.py --create-sample sample.json")
        print("       python batch-slice-portraits.py --list-files /path/to/images/")
        return
    
    # Load and process configuration
    config = load_batch_config(args.config)
    if config:
        process_batch(config)
    else:
        print("Failed to load configuration file.")

if __name__ == '__main__':
    main()