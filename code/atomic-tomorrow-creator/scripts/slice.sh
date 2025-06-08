#!/bin/bash
# Convenience wrapper for portrait slicing scripts

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VENV_DIR="$PROJECT_ROOT/portrait_env"

# Check if virtual environment exists
if [ ! -d "$VENV_DIR" ]; then
    echo "Setting up virtual environment..."
    python3 -m venv "$VENV_DIR"
    
    # Check if venv creation succeeded
    if [ ! -f "$VENV_DIR/bin/activate" ]; then
        echo "Error: Failed to create virtual environment"
        exit 1
    fi
    
    source "$VENV_DIR/bin/activate"
    pip install -r "$SCRIPT_DIR/requirements.txt"
    echo "Setup complete!"
else
    # Activate existing environment
    if [ -f "$VENV_DIR/bin/activate" ]; then
        source "$VENV_DIR/bin/activate"
    else
        echo "Error: Virtual environment exists but activation script not found"
        exit 1
    fi
fi

# Run the slice-portraits.py script with all arguments (using python from venv)
python "$SCRIPT_DIR/slice-portraits.py" "$@"

# Store exit code before deactivating
EXIT_CODE=$?

# Deactivate if the function exists (it should after sourcing activate)
if command -v deactivate >/dev/null 2>&1; then
    deactivate
fi

# Exit with the same code as the Python script
exit $EXIT_CODE