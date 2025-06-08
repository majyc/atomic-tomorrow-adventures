#!/bin/bash

# Resize Legacy Portrait Script (ImageMagick version)
# Reduces the large 1024x1024 portraits to 341x341 to match new sliced portraits

echo "🎨 Atomic Tomorrow Portrait Resizer"
echo "=" | sed 's/./=/g'

# Configuration
PORTRAITS_DIR="../public/portraits"
TARGET_SIZE="341x341"
QUALITY=85

# Check if ImageMagick is available
if ! command -v convert &> /dev/null; then
    echo "❌ Error: ImageMagick is required but not installed"
    echo "📦 Install it with: sudo apt install imagemagick"
    exit 1
fi

# Change to script directory
cd "$(dirname "$0")"

# Find legacy portrait files that need resizing
legacy_files=()
for pattern in m_{1..9}.jpg m_{10..30}.jpg f_{1..9}.jpg f_{10..30}.jpg; do
    if [ -f "$PORTRAITS_DIR/$pattern" ]; then
        # Check file size - if over 100KB, it probably needs resizing
        size=$(stat -c%s "$PORTRAITS_DIR/$pattern" 2>/dev/null)
        if [ "$size" -gt 102400 ]; then  # 100KB
            legacy_files+=("$PORTRAITS_DIR/$pattern")
        fi
    fi
done

if [ ${#legacy_files[@]} -eq 0 ]; then
    echo "❌ No legacy portrait files found that need resizing"
    exit 0
fi

echo "🖼️  Found ${#legacy_files[@]} legacy portraits to resize"
echo "📏 Target size: $TARGET_SIZE"
echo "🎨 JPEG quality: $QUALITY%"
echo ""

total_size_before=0
total_size_after=0
processed=0

for filepath in "${legacy_files[@]}"; do
    filename=$(basename "$filepath")
    
    # Get original file size
    original_size=$(stat -c%s "$filepath")
    total_size_before=$((total_size_before + original_size))
    
    # Get original dimensions
    dimensions=$(identify -format "%wx%h" "$filepath" 2>/dev/null)
    
    if [ -z "$dimensions" ]; then
        echo "❌ Error reading $filename"
        continue
    fi
    
    # Skip if already correct size
    if [ "$dimensions" = "$TARGET_SIZE" ]; then
        echo "⏭️  Skipping $filename (already correct size)"
        total_size_after=$((total_size_after + original_size))
        continue
    fi
    
    # Create backup
    backup_path="${filepath}.backup"
    if [ ! -f "$backup_path" ]; then
        cp "$filepath" "$backup_path"
        echo "💾 Backed up original to $(basename "$backup_path")"
    fi
    
    # Resize image
    if convert "$filepath" -resize "$TARGET_SIZE^" -gravity center -extent "$TARGET_SIZE" -quality "$QUALITY" "${filepath}.tmp"; then
        mv "${filepath}.tmp" "$filepath"
        
        # Get new file size
        new_size=$(stat -c%s "$filepath")
        total_size_after=$((total_size_after + new_size))
        
        # Calculate reduction
        reduction_percent=$((100 - (new_size * 100 / original_size)))
        
        echo "✅ $filename: $dimensions ($(($original_size/1024))KB) → $TARGET_SIZE ($(($new_size/1024))KB) [${reduction_percent}% smaller]"
        processed=$((processed + 1))
    else
        echo "❌ Error processing $filename"
        # Restore backup if conversion failed
        if [ -f "$backup_path" ]; then
            cp "$backup_path" "$filepath"
        fi
        total_size_after=$((total_size_after + original_size))
    fi
done

# Summary
echo ""
echo "🎉 Processing complete!"
echo "📊 Files processed: $processed"
echo "💾 Total size before: $((total_size_before / 1024 / 1024))MB"
echo "💾 Total size after: $((total_size_after / 1024 / 1024))MB"

if [ $total_size_before -gt 0 ]; then
    total_reduction=$((100 - (total_size_after * 100 / total_size_before)))
    savings_mb=$(((total_size_before - total_size_after) / 1024 / 1024))
    echo "🚀 Total reduction: ${total_reduction}% (${savings_mb}MB saved)"
fi

echo ""
echo "💡 Tip: Original files are backed up with .backup extension"
echo "💡 If you're happy with the results, you can delete the .backup files to save space"