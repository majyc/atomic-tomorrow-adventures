# Setting up VSCode in Ubuntu WSL as Claude IDE

## Prerequisites

1. **Windows Subsystem for Linux (WSL)** with Ubuntu installed
2. **VSCode** installed on Windows
3. **WSL extension** for VSCode installed
4. **Claude for VSCode extension** installed (already done)

## Step-by-Step Setup

### 1. Install VSCode WSL Extension
- Open VSCode on Windows
- Install the "WSL" extension (ms-vscode-remote.remote-wsl)
- Install the "Remote Development" extension pack (recommended)

### 2. Connect VSCode to WSL
- Open VSCode
- Press `Ctrl+Shift+P` to open command palette
- Type "WSL: Connect to WSL" and select it
- VSCode will connect to your Ubuntu WSL environment
- A new VSCode window will open running inside WSL

### 3. Verify WSL Environment
- Open terminal in VSCode (`Ctrl+`` ` or Terminal > New Terminal)
- Verify you're in WSL: `uname -a` (should show Linux)
- Check current directory: `pwd`
- Navigate to your project: `cd /home/joshua/projects/atomic-tomorrow-adventures`

### 4. Install Code Command in WSL PATH
- In the WSL VSCode window, press `Ctrl+Shift+P`
- Type "Shell Command: Install 'code' command in PATH"
- Select it to install the `code` command in your WSL environment
- Test it: `code --version` in the terminal

### 5. Set up Claude IDE Integration
- In the VSCode terminal (connected to WSL), run:
  ```bash
  claude
  ```
- The Claude for VSCode extension will auto-install and connect
- Follow any prompts to authenticate with your Claude account

### 6. Configure Claude Settings
- Run `/config` in Claude to adjust preferences
- Set diff tool to "auto" for automatic IDE detection:
  ```
  /config set diff_tool auto
  ```

### 7. Test the Setup
- Open your project in VSCode WSL: `code .`
- Start Claude from the project root directory: `claude`
- Test Claude commands like `/help` or `/status`
- Try opening files with Claude and verify they appear in VSCode

## Troubleshooting

### Common Issues:

1. **Claude command not found**
   - Ensure you're running `claude` from within the WSL environment
   - Check that Claude CLI is installed in WSL, not just Windows

2. **VSCode doesn't open files from Claude**
   - Verify the `code` command works: `code test.txt`
   - Restart VSCode completely if needed
   - Check that you're using the WSL-connected VSCode window

3. **Permission issues**
   - Ensure VSCode has permission to install extensions
   - Check file permissions in your project directory: `ls -la`

4. **Extension conflicts**
   - Disable other AI coding assistants temporarily to test
   - Check VSCode extension logs for conflicts

### Useful Commands:

- Connect to WSL from Windows: `wsl`
- Open current directory in VSCode from WSL: `code .`
- Check WSL version: `wsl --version`
- Restart WSL: `wsl --shutdown` (from Windows)

## Best Practices

1. Always start Claude from your project root directory
2. Keep your WSL Ubuntu updated: `sudo apt update && sudo apt upgrade`
3. Use WSL-connected VSCode for all development work
4. Configure your shell profile (`.bashrc` or `.zshrc`) with aliases if needed
5. Consider setting up SSH keys for GitHub if working with repositories

## Project-Specific Notes

For this Atomic Tomorrow Adventures project:
- Start Claude from `/home/joshua/projects/atomic-tomorrow-adventures/`
- The project contains both Jekyll and React components
- Use appropriate commands for each stack (see CLAUDE.md for details)