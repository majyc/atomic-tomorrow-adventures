# Portrait Slicing Scripts

These scripts help you efficiently slice AI-generated sprite sheets into individual portrait files for the Atomic Tomorrow Character Creator.

## Features

- **Smart boundary detection** - Automatically finds optimal split points instead of using mathematical divisions
- **Handles imperfect AI spacing** - Works with non-uniform portrait layouts
- **Preview mode** - See what will be sliced before processing
- **Batch processing** - Handle multiple sprite sheets at once
- **Automatic grid detection** - Guess grid dimensions from aspect ratio
- **Debug mode** - Visual debugging of detection process

## Installation

```bash
pip install Pillow opencv-python numpy
```

Note: OpenCV is optional but recommended for better edge detection. The script will fall back to PIL-based detection if OpenCV is not available.

## Single Image Processing

### Basic Usage

```bash
# Smart detection (recommended for AI-generated images)
python slice-portraits.py your_sprite_sheet.png --gender m --start-num 31

# Specify grid manually
python slice-portraits.py image.png --cols 4 --rows 3 --gender f --start-num 1

# Preview mode (see what will happen without saving files)
python slice-portraits.py image.png --gender m --preview

# Use basic mathematical slicing (fallback)
python slice-portraits.py image.png --gender f --basic
```

### Advanced Options

```bash
# Full example with all options
python slice-portraits.py sprite_sheet.png \
  --output ./my_portraits \
  --cols 4 \
  --rows 3 \
  --gender m \
  --start-num 31 \
  --padding 10 \
  --debug

# Auto-detect grid and preview
python slice-portraits.py image.png --gender f --preview --debug
```

### Command Line Options

- `--output, -o` : Output directory (default: `./portraits`)
- `--cols, -c` : Number of columns (auto-detect if not specified)
- `--rows, -r` : Number of rows (auto-detect if not specified) 
- `--gender, -g` : Gender for filename - `m` or `f` (required)
- `--start-num, -n` : Starting number for output files (default: 1)
- `--padding, -p` : Pixels to crop from each edge (default: 0)
- `--preview` : Show preview without saving files
- `--basic` : Use mathematical slicing instead of smart detection
- `--debug` : Save debug images showing detection process

## Batch Processing

For processing multiple sprite sheets efficiently:

### Create Sample Configuration

```bash
python batch-slice-portraits.py --create-sample batch_config.json
```

### Example Configuration

```json
{
  "output_dir": "./portraits",
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
      "padding": 10,
      "comment": "4x3 grid starting at m_31"
    },
    {
      "input": "female_sheet_1.png", 
      "gender": "f",
      "start_num": 31,
      "comment": "Auto-detect grid, start at f_31"
    }
  ]
}
```

### Run Batch Processing

```bash
python batch-slice-portraits.py batch_config.json
```

### List Available Images

```bash
python batch-slice-portraits.py --list-files /path/to/sprite/sheets/
```

## Output

The scripts generate:

1. **Individual portraits**: `m_1.jpg`, `m_2.jpg`, `f_1.jpg`, etc.
2. **Preview image**: `preview_grid.png` showing detected boundaries
3. **Debug images** (if `--debug` used): Edge detection visualization

## Smart Detection vs Basic Slicing

### Smart Detection (Default)
- Analyzes image to find natural boundaries between portraits
- Uses edge detection to identify gaps and separations
- Handles non-uniform spacing from AI generation
- Creates preview showing detected split lines

### Basic Slicing (`--basic`)
- Uses mathematical divisions (width/cols, height/rows)
- Faster but assumes perfect grid alignment
- Useful as fallback when smart detection fails

## Troubleshooting

### Smart Detection Issues
1. Use `--preview --debug` to see what's being detected
2. Manually specify `--cols` and `--rows` if auto-detection fails
3. Use `--basic` as fallback for problematic images
4. Adjust `--padding` to crop out unwanted borders

### Common Problems
- **Faces cut off**: Increase `--padding` value
- **Wrong grid detected**: Manually specify `--cols` and `--rows`
- **Poor boundary detection**: Try `--basic` mode
- **Missing faces**: Check if image has uniform background

### Debug Output
The `--debug` flag creates:
- `debug_edges.png` - Edge detection visualization
- `preview_grid.png` - Split lines overlay on original image

## Tips for AI-Generated Sprite Sheets

1. **Start with preview mode** to verify detection
2. **Use padding** to avoid cutting into faces (try 5-15 pixels)
3. **Manually specify grid** if the AI created irregular layouts
4. **Check aspect ratio** - script auto-detects common ratios (4:3, 3:3, etc.)
5. **Use batch processing** for multiple sheets with similar layouts

## Examples

```bash
# Process your OpenArt image with smart detection
python slice-portraits.py openart-image_ewHHY_oA_1749326641545_raw.png \
  --gender m --start-num 31 --padding 10 --preview

# If that looks good, run without --preview to actually slice:
python slice-portraits.py openart-image_ewHHY_oA_1749326641545_raw.png \
  --gender m --start-num 31 --padding 10

# For a problematic image, force basic slicing:
python slice-portraits.py problematic_sheet.png \
  --cols 4 --rows 3 --gender f --start-num 1 --basic --padding 15
```

The smart detection should handle the non-uniform spacing in your AI-generated images much better than simple mathematical division!