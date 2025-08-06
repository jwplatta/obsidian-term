
# PTY Helper Script Explanation

This script (`pty_helper.py`) creates a fully interactive pseudo-terminal (PTY) environment in Python, allowing you to run a shell (like zsh) and interact with it programmatically. It is designed to behave like a real terminal, supporting interactive programs and proper terminal resizing.

## Key Features and Steps

1. **PTY Creation**
   - Uses `pty.openpty()` to create a master and slave file descriptor pair. The slave acts as the terminal for the shell process.

2. **Terminal Size Management**
   - Defines `set_pty_window_size()` and `get_terminal_size()` to set and retrieve the terminal window size.
   - Handles `SIGWINCH` (window resize) signals to dynamically update the PTY size, ensuring interactive programs display correctly when the terminal is resized.

3. **Shell Process Launch**
   - Starts a new shell (`/bin/zsh`) using `subprocess.Popen`, connecting its input/output/error to the PTY slave.
   - The shell runs as a child process in its own session (`preexec_fn=os.setsid`).

4. **Raw Terminal Mode**
   - Sets the user's terminal (stdin) to raw mode using `tty.setraw()`, so all keystrokes are sent directly to the PTY without local line buffering or echo.
   - Restores the original terminal settings on exit to avoid leaving the terminal in an unusable state.

5. **I/O Forwarding Loop**
   - Uses `select.select()` to wait for input from either the user (stdin) or the shell (PTY master).
   - Forwards user keystrokes to the shell, and shell output back to the user's terminal, using `os.read` and `os.write` for unbuffered, byte-level communication.
   - Exits cleanly when the shell process terminates or the user closes the input stream.

## Usage

Run the script with Python 3:

```sh
python3 pty_helper.py
```

You will get a zsh prompt. You can run interactive programs (like `claude`, `vim`, etc.) as if you were in a normal terminal. The script handles window resizing and proper input/output forwarding.

## Why Use This Script?

- To embed a real shell or terminal session inside another application (e.g., a GUI, web app, or plugin)
- To automate or mediate terminal interactions while preserving full interactivity
- To ensure compatibility with programs that require a real TTY/PTY (not just pipes)

## Limitations

- Some advanced terminal features (mouse support, true color, etc.) may not be fully supported.
- The script assumes a Unix-like environment (macOS, Linux) and will not work on Windows without major changes.