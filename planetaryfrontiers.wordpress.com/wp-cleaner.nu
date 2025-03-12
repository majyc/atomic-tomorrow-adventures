# WordPress XML Cleaner
# This script reads a WordPress XML export file and removes:
#  - All wp: namespace tags (including unclosed tags)
#  - XML comments
#  - Description tags
#  - GUID tags
#  - Category tags
# to create a cleaner, more compact version of the XML.

def main [
    input_file: string,  # Path to the WordPress XML export file
    output_file: string  # Path where the cleaned XML file will be saved
] {
    # Read the XML file as raw text
    let xml_content = (open --raw $input_file | str trim)
    
    # Define regex patterns to match tags we want to remove
    
    # Patterns for WordPress tags
    let wp_content_pattern = '<wp:[^>]*>.*?</wp:[^>]*>'
    let wp_selfclose_pattern = '<wp:[^>/]*\/>'
    let wp_empty_pattern = '<wp:[^>]*>[\s\n]*</wp:[^>]*>'
    let wp_unclosed_pattern = '<wp:[^>]*>(?!.*?</wp:[^>]*>)'
    
    # Patterns for specific tag types
    let description_pattern = '<description>.*?</description>'
    let guid_pattern = '<guid.*?>.*?</guid>'
    let category_pattern = '<category.*?>.*?</category>'
    let empty_category_pattern = '<category.*?></category>'
    let selfclose_category_pattern = '<category.*?\/>'
    
    # Pattern for XML comments
    let xml_comment_pattern = '<!--.*?-->'
    
    # Apply the regex substitutions to remove all unwanted tags
    # The -m flag enables multiline matching (dot will match newlines)
    let without_wp_content = ($xml_content | str replace -a -r -m $wp_content_pattern "")
    let without_wp_empty = ($without_wp_content | str replace -a -r -m $wp_empty_pattern "")
    let without_wp_selfclose = ($without_wp_empty | str replace -a -r $wp_selfclose_pattern "")
    let without_wp_unclosed = ($without_wp_selfclose | str replace -a -r -m $wp_unclosed_pattern "")
    
    let without_description = ($without_wp_unclosed | str replace -a -r -m $description_pattern "")
    let without_guid = ($without_description | str replace -a -r -m $guid_pattern "")
    let without_category = ($without_guid | str replace -a -r -m $category_pattern "")
    let without_empty_category = ($without_category | str replace -a -r -m $empty_category_pattern "")
    let without_selfclose_category = ($without_empty_category | str replace -a -r $selfclose_category_pattern "")
    
    let without_wp_tags = ($without_selfclose_category | str replace -a -r -m $xml_comment_pattern "")
    
    # Clean up consecutive empty lines - using simpler approach to avoid escape issues
    let cleaned_xml = ($without_wp_tags | lines | str trim | where { |line| $line != "" } | str join "\n")
    
    # Display a summary of the changes
    let original_size = ($xml_content | str length)
    let new_size = ($cleaned_xml | str length)
    let size_reduction = ($original_size - $new_size)
    let percentage = (($size_reduction | into float) / ($original_size | into float) * 100.0)
    
    let formatted_percentage = ($percentage | into string -d 2)
    
    print $"Processing ($input_file)..."
    print $"Original size: ($original_size) bytes"
    print $"New size: ($new_size) bytes"
    print $"Reduction: ($size_reduction) bytes ($formatted_percentage) %"
    
    # Save the cleaned XML to the output file
    $cleaned_xml | save -f $output_file
    
    print $"Cleaned XML saved to ($output_file)"
}

# Example usage:
# ./wordpress-xml-cleaner.nu export.xml cleaned-export.xml