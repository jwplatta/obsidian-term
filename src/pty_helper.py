#!/usr/bin/env python3

import pty
import tty
import os
import sys
import select
import subprocess
import fcntl
import termios
import struct
import signal


def set_pty_window_size(fd, rows, cols):
    winsize = struct.pack("HHHH", rows, cols, 0, 0)
    fcntl.ioctl(fd, termios.TIOCSWINSZ, winsize)


def get_terminal_size():
    try:
        if sys.stdout.isatty():
            import struct, fcntl, termios
            s = struct.pack("HHHH", 0, 0, 0, 0)
            fd = sys.stdout.fileno()
            size = fcntl.ioctl(fd, termios.TIOCGWINSZ, s)
            rows, cols, _, _ = struct.unpack("HHHH", size)
            return rows, cols
        else:
            return os.get_terminal_size()
    except Exception:
        return 24, 80  # fallback


def main():
    master, slave = pty.openpty()

    # Set initial terminal size from environment variables
    cols = int(os.environ.get('COLUMNS', '80'))
    rows = int(os.environ.get('LINES', '24'))
    set_pty_window_size(slave, rows, cols)

    # Get vault path from environment variable, fallback to current directory
    vault_path = os.environ.get('VAULT_PATH', os.getcwd())
    
    # Get shell from environment variable, fallback to zsh
    shell_path = os.environ.get('SHELL', '/bin/zsh')

    shell = subprocess.Popen(
        [shell_path],
        stdin=slave,
        stdout=slave,
        stderr=slave,
        cwd=vault_path,
        preexec_fn=os.setsid
    )

    os.close(slave)

    stdin_fd = sys.stdin.fileno()
    stdout_fd = sys.stdout.fileno()

    # Don't set raw mode since we're running as a subprocess
    # Just forward data between stdin/stdout and the PTY
    try:
        while True:
            if shell.poll() is not None:
                break

            ready, _, _ = select.select([sys.stdin, master], [], [], 0.1)

            if sys.stdin in ready:
                try:
                    data = os.read(stdin_fd, 1024)
                    if not data:
                        break
                    os.write(master, data)
                except OSError:
                    break

            if master in ready:
                try:
                    output = os.read(master, 1024)
                    if output:
                        os.write(stdout_fd, output)
                        sys.stdout.flush()
                except OSError:
                    break
    except KeyboardInterrupt:
        pass
    finally:
        # Clean up
        if shell.poll() is None:
            shell.terminate()
        os.close(master)


if __name__ == '__main__':
    main()