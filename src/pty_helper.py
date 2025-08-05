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

    def resize_pty(signum=None, frame=None):
        rows, cols = get_terminal_size()
        set_pty_window_size(slave, rows, cols)

    resize_pty()
    signal.signal(signal.SIGWINCH, resize_pty)

    shell = subprocess.Popen(
        ['/bin/zsh'],
        stdin=slave,
        stdout=slave,
        stderr=slave,
        preexec_fn=os.setsid
    )

    os.close(slave)

    stdin_fd = sys.stdin.fileno()
    old_tty = termios.tcgetattr(stdin_fd)
    try:
        tty.setraw(stdin_fd)
        while True:
            if shell.poll() is not None:
                break

            ready, _, _ = select.select([sys.stdin, master], [], [], 0.1)

            if sys.stdin in ready:
                data = os.read(stdin_fd, 1024)
                if not data:
                    break
                os.write(master, data)

            if master in ready:
                try:
                    output = os.read(master, 1024)
                    if output:
                        os.write(sys.stdout.fileno(), output)
                except OSError:
                    break
    finally:
        termios.tcsetattr(stdin_fd, termios.TCSADRAIN, old_tty)


if __name__ == '__main__':
    main()