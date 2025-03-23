# Windows-compatible script to add front matter to markdown files
# Usage: nu add-frontmatter.nu rules/

def add-front-matter [dir: string] {
    # Check if directory ends with / and add it if not
    let directory = if ($dir | str ends-with "/") { $dir } else { $dir + "/" }

    # Now try to match markdown files more directly
    let pattern = $"($directory)*.md"
    let files = glob $pattern 
    print $"Found ($files | length) markdown files in ($directory)"
    
    # Process each file
    for file in $files {
        print $"Processing file: ($file)"
        let file_path = $file
    
        # Read file content
        let content = open $file_path
        
        # Check if file already has front matter
        if not ($content | str starts-with "---") {
            # Get filename without extension and create a title
            let filename = ($file_path | path basename | path parse).stem
            let title = $filename | str replace -a "-" " " | str replace -a "_" " " | split words | each { |word| $word | str capitalize } | str join " "
            
            # Create front matter
            let front_matter = $"---\r\nlayout: default\r\ntitle: ($title)\r\n---\r\n\r\n"
            let new_content = $front_matter + $content
            
            # Save the new content back to the file
            $new_content | save -f $file_path
            print $"Added front matter to ($file_path)"
        } else {
            print $"Skipping ($file_path) - already has front matter"
        }
    }
}

# Get command line arguments
def main [dir?: string] {
    if $dir != null {
        add-front-matter $dir
    } else {
        echo "Please provide a directory path, e.g.: nu add-frontmatter.nu rules/"
    }
}