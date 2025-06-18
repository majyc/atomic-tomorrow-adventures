#!/usr/bin/env python3
"""
LyX to Markdown Converter
Handles master documents with subordinate LyX files included via \include or \input commands.
"""

import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import List, Optional, Tuple


class LyXToMarkdownConverter:
    def __init__(self, master_file: str, output_file: str = None):
        self.master_file = Path(master_file)
        self.output_file = Path(output_file) if output_file else self.master_file.with_suffix('.md')
        self.base_dir = self.master_file.parent
        self.temp_dir = None
        
    def find_included_files(self, lyx_content: str) -> List[str]:
        """Extract included/input file paths from LyX content."""
        included_files = []
        
        # Match \include{filename} and \input{filename} patterns (LaTeX format)
        include_patterns = [
            r'\\include\{([^}]+)\}',
            r'\\input\{([^}]+)\}',
            r'\\InputIfFileExists\{([^}]+)\}',
        ]
        
        for pattern in include_patterns:
            matches = re.findall(pattern, lyx_content)
            for match in matches:
                # Clean up the filename
                filename = match.strip()
                if not filename.endswith('.lyx'):
                    filename += '.lyx'
                included_files.append(filename)
        
        # Match LyX-specific CommandInset include format
        # Pattern: \begin_inset CommandInset include\nLatexCommand input\nfilename "file.lyx"\n\end_inset
        lyx_include_pattern = r'\\begin_inset CommandInset include\s*\nLatexCommand (?:input|include)\s*\nfilename "([^"]+)"\s*\n\\end_inset'
        lyx_matches = re.findall(lyx_include_pattern, lyx_content, re.MULTILINE)
        for match in lyx_matches:
            filename = match.strip()
            if not filename.endswith('.lyx'):
                filename += '.lyx'
            included_files.append(filename)
        
        return included_files
    
    def convert_lyx_to_latex(self, lyx_file: Path) -> Optional[str]:
        """Convert a single LyX file to LaTeX using lyx command."""
        try:
            with tempfile.NamedTemporaryFile(suffix='.tex', delete=False) as temp_tex:
                temp_tex_path = temp_tex.name
            
            # Use lyx to export to LaTeX
            cmd = ['lyx', '--export', 'latex', str(lyx_file)]
            result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(lyx_file.parent))
            
            if result.returncode != 0:
                print(f"Warning: LyX export failed for {lyx_file}: {result.stderr}")
                return None
            
            # LyX exports to filename.tex in the same directory
            latex_file = lyx_file.with_suffix('.tex')
            if latex_file.exists():
                # Try different encodings
                encodings = ['utf-8', 'latin1', 'cp1252', 'iso-8859-1']
                latex_content = None
                
                for encoding in encodings:
                    try:
                        with open(latex_file, 'r', encoding=encoding) as f:
                            latex_content = f.read()
                        break
                    except UnicodeDecodeError:
                        continue
                
                # Clean up the generated LaTeX file
                latex_file.unlink()
                
                if latex_content is None:
                    print(f"Warning: Could not decode {latex_file} with any encoding")
                    return None
                    
                return latex_content
            
            return None
            
        except Exception as e:
            print(f"Error converting {lyx_file} to LaTeX: {e}")
            return None
    
    def convert_latex_to_markdown(self, latex_content: str, title: str = "") -> str:
        """Convert LaTeX content to Markdown using pandoc."""
        try:
            # Write LaTeX content with proper encoding handling
            with tempfile.NamedTemporaryFile(mode='wb', suffix='.tex', delete=False) as temp_tex:
                # Try to encode as UTF-8 first, fall back to latin1 if needed
                try:
                    temp_tex.write(latex_content.encode('utf-8'))
                except UnicodeEncodeError:
                    temp_tex.write(latex_content.encode('latin1'))
                temp_tex_path = temp_tex.name
            
            # Use pandoc to convert LaTeX to Markdown
            cmd = [
                'pandoc',
                '--from', 'latex',
                '--to', 'markdown',
                '--wrap', 'preserve',
                temp_tex_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            # Clean up temp file
            os.unlink(temp_tex_path)
            
            if result.returncode != 0:
                print(f"Warning: Pandoc conversion failed: {result.stderr}")
                return f"# {title}\n\n[Conversion failed for this section]\n\n"
            
            markdown_content = result.stdout
            
            # Add section header if title provided
            if title:
                markdown_content = f"# {title}\n\n{markdown_content}"
            
            return markdown_content
            
        except Exception as e:
            print(f"Error converting LaTeX to Markdown: {e}")
            return f"# {title}\n\n[Error converting this section]\n\n"
    
    def process_master_document(self) -> str:
        """Process the master document and all its included files."""
        print(f"Processing master document: {self.master_file}")
        
        # Read master file
        try:
            # Try different encodings for the LyX file
            encodings = ['utf-8', 'latin1', 'cp1252', 'iso-8859-1']
            master_content = None
            
            for encoding in encodings:
                try:
                    with open(self.master_file, 'r', encoding=encoding) as f:
                        master_content = f.read()
                    break
                except UnicodeDecodeError:
                    continue
            
            if master_content is None:
                print(f"Error: Could not decode master file with any encoding")
                return ""
                
        except Exception as e:
            print(f"Error reading master file: {e}")
            return ""
        
        # Find included files
        included_files = self.find_included_files(master_content)
        print(f"Found {len(included_files)} included files: {included_files}")
        
        # Convert master document
        print("Converting master document...")
        master_latex = self.convert_lyx_to_latex(self.master_file)
        if master_latex:
            combined_markdown = self.convert_latex_to_markdown(master_latex, "Master Document")
        else:
            combined_markdown = "# Master Document\n\n[Master document conversion failed]\n\n"
        
        # Process each included file
        for included_file in included_files:
            included_path = self.base_dir / included_file
            
            if not included_path.exists():
                print(f"Warning: Included file not found: {included_path}")
                combined_markdown += f"\n\n# {included_file}\n\n[File not found: {included_path}]\n\n"
                continue
            
            print(f"Converting included file: {included_file}")
            
            # Convert to LaTeX then Markdown
            latex_content = self.convert_lyx_to_latex(included_path)
            if latex_content:
                section_title = included_file.replace('.lyx', '').replace('_', ' ').title()
                markdown_section = self.convert_latex_to_markdown(latex_content, section_title)
                combined_markdown += f"\n\n{markdown_section}"
            else:
                combined_markdown += f"\n\n# {included_file}\n\n[Conversion failed for this file]\n\n"
        
        return combined_markdown
    
    def convert(self) -> bool:
        """Main conversion method."""
        print(f"Starting LyX to Markdown conversion...")
        print(f"Master file: {self.master_file}")
        print(f"Output file: {self.output_file}")
        
        # Check if required tools are available
        if not self.check_dependencies():
            return False
        
        # Process the master document and all included files
        markdown_content = self.process_master_document()
        
        if not markdown_content.strip():
            print("Error: No content was converted")
            return False
        
        # Write the combined markdown
        try:
            with open(self.output_file, 'w', encoding='utf-8') as f:
                f.write(markdown_content)
            print(f"Conversion completed successfully: {self.output_file}")
            return True
        except Exception as e:
            print(f"Error writing output file: {e}")
            return False
    
    def check_dependencies(self) -> bool:
        """Check if required tools are available."""
        required_tools = ['lyx', 'pandoc']
        missing_tools = []
        
        for tool in required_tools:
            try:
                subprocess.run([tool, '--version'], capture_output=True, check=True)
            except (subprocess.CalledProcessError, FileNotFoundError):
                missing_tools.append(tool)
        
        if missing_tools:
            print(f"Error: Missing required tools: {', '.join(missing_tools)}")
            print("Please install:")
            for tool in missing_tools:
                if tool == 'lyx':
                    print("  - LyX: sudo apt-get install lyx (Ubuntu/Debian) or brew install lyx (macOS)")
                elif tool == 'pandoc':
                    print("  - Pandoc: sudo apt-get install pandoc (Ubuntu/Debian) or brew install pandoc (macOS)")
            return False
        
        return True


def convert_all_lyx_files():
    """Convert all LyX files in the current directory to individual Markdown files."""
    current_dir = Path('.')
    lyx_files = list(current_dir.glob('*.lyx'))
    
    if not lyx_files:
        print("No LyX files found in the current directory")
        return False
    
    print(f"Found {len(lyx_files)} LyX files: {[f.name for f in lyx_files]}")
    successful_conversions = []
    failed_conversions = []
    
    for lyx_file in lyx_files:
        print(f"\n🔄 Converting {lyx_file.name}...")
        md_file = lyx_file.with_suffix('.md')
        
        try:
            # Create a simple converter for individual files
            converter = SingleLyXConverter(lyx_file)
            if converter.convert():
                successful_conversions.append((lyx_file.name, md_file.name))
                print(f"✅ {lyx_file.name} → {md_file.name}")
            else:
                failed_conversions.append(lyx_file.name)
                print(f"❌ Failed to convert {lyx_file.name}")
        except Exception as e:
            failed_conversions.append(lyx_file.name)
            print(f"❌ Error converting {lyx_file.name}: {e}")
    
    print(f"\n📊 Conversion Summary:")
    print(f"✅ Successful: {len(successful_conversions)}")
    print(f"❌ Failed: {len(failed_conversions)}")
    
    if successful_conversions:
        print(f"\n📄 Created files:")
        for lyx_name, md_name in successful_conversions:
            md_path = Path(md_name)
            size = md_path.stat().st_size if md_path.exists() else 0
            print(f"  {md_name} ({size:,} bytes)")
    
    if failed_conversions:
        print(f"\n⚠️  Failed conversions:")
        for filename in failed_conversions:
            print(f"  {filename}")
    
    return len(successful_conversions) > 0


class SingleLyXConverter:
    """Simple converter for individual LyX files without master document logic."""
    
    def __init__(self, lyx_file: Path):
        self.lyx_file = lyx_file
        self.output_file = lyx_file.with_suffix('.md')
    
    def convert_lyx_to_latex(self) -> Optional[str]:
        """Convert a single LyX file to LaTeX using lyx command."""
        try:
            # Use lyx to export to LaTeX
            cmd = ['lyx', '--export', 'latex', str(self.lyx_file)]
            result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(self.lyx_file.parent))
            
            if result.returncode != 0:
                print(f"Warning: LyX export failed for {self.lyx_file}: {result.stderr}")
                return None
            
            # LyX exports to filename.tex in the same directory
            latex_file = self.lyx_file.with_suffix('.tex')
            if latex_file.exists():
                # Try different encodings
                encodings = ['utf-8', 'latin1', 'cp1252', 'iso-8859-1']
                latex_content = None
                
                for encoding in encodings:
                    try:
                        with open(latex_file, 'r', encoding=encoding) as f:
                            latex_content = f.read()
                        break
                    except UnicodeDecodeError:
                        continue
                
                # Clean up the generated LaTeX file
                latex_file.unlink()
                
                if latex_content is None:
                    print(f"Warning: Could not decode {latex_file} with any encoding")
                    return None
                    
                return latex_content
            
            return None
            
        except Exception as e:
            print(f"Error converting {self.lyx_file} to LaTeX: {e}")
            return None
    
    def convert_latex_to_markdown(self, latex_content: str) -> str:
        """Convert LaTeX content to Markdown using pandoc."""
        try:
            # Write LaTeX content with proper encoding handling
            with tempfile.NamedTemporaryFile(mode='wb', suffix='.tex', delete=False) as temp_tex:
                # Try to encode as UTF-8 first, fall back to latin1 if needed
                try:
                    temp_tex.write(latex_content.encode('utf-8'))
                except UnicodeEncodeError:
                    temp_tex.write(latex_content.encode('latin1'))
                temp_tex_path = temp_tex.name
            
            # Use pandoc to convert LaTeX to Markdown
            cmd = [
                'pandoc',
                '--from', 'latex',
                '--to', 'markdown',
                '--wrap', 'preserve',
                temp_tex_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            # Clean up temp file
            os.unlink(temp_tex_path)
            
            if result.returncode != 0:
                print(f"Warning: Pandoc conversion failed: {result.stderr}")
                return "[Conversion failed for this file]"
            
            return result.stdout
            
        except Exception as e:
            print(f"Error converting LaTeX to Markdown: {e}")
            return "[Error converting this file]"
    
    def convert(self) -> bool:
        """Convert the LyX file to Markdown."""
        # Check if required tools are available
        if not self.check_dependencies():
            return False
        
        # Convert to LaTeX
        latex_content = self.convert_lyx_to_latex()
        if not latex_content:
            return False
        
        # Convert to Markdown
        markdown_content = self.convert_latex_to_markdown(latex_content)
        if not markdown_content or markdown_content.strip() == "[Conversion failed for this file]":
            return False
        
        # Write the markdown file
        try:
            with open(self.output_file, 'w', encoding='utf-8') as f:
                f.write(markdown_content)
            return True
        except Exception as e:
            print(f"Error writing output file: {e}")
            return False
    
    def check_dependencies(self) -> bool:
        """Check if required tools are available."""
        required_tools = ['lyx', 'pandoc']
        missing_tools = []
        
        for tool in required_tools:
            try:
                subprocess.run([tool, '--version'], capture_output=True, check=True)
            except (subprocess.CalledProcessError, FileNotFoundError):
                missing_tools.append(tool)
        
        if missing_tools:
            print(f"Error: Missing required tools: {', '.join(missing_tools)}")
            return False
        
        return True


def main():
    if len(sys.argv) == 1:
        # No arguments - convert all LyX files in current directory
        success = convert_all_lyx_files()
        sys.exit(0 if success else 1)
    elif len(sys.argv) >= 2:
        # Original master document mode
        master_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else None
        
        if not Path(master_file).exists():
            print(f"Error: Master file not found: {master_file}")
            sys.exit(1)
        
        converter = LyXToMarkdownConverter(master_file, output_file)
        success = converter.convert()
        
        if success:
            print("\n✅ Conversion completed successfully!")
            print(f"📄 Output file: {converter.output_file}")
            print(f"📊 File size: {converter.output_file.stat().st_size} bytes")
        else:
            print("\n❌ Conversion failed!")
            sys.exit(1)
    else:
        print("Usage:")
        print("  python3 lyx_to_md_converter.py                    # Convert all .lyx files in current directory")
        print("  python3 lyx_to_md_converter.py <master_lyx_file>  # Convert master document with includes")
        print("\nExamples:")
        print("  python3 lyx_to_md_converter.py                    # Convert all LyX files")
        print("  python3 lyx_to_md_converter.py manuscript.lyx     # Convert master document")
        sys.exit(1)


if __name__ == "__main__":
    main()