import React from 'react';
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

export const buildTerminal = (terminalRef: React.RefObject<HTMLDivElement>, cols: number, rows: number, pluginPath?: string, vaultPath?: string, onExit?: () => void) => {
  const getComputedCSSValue = (cssVar: string): string => {
    if (typeof document !== 'undefined' && document.body) {
      const computedStyle = getComputedStyle(document.body);
      const value = computedStyle.getPropertyValue(cssVar).trim();
      console.log(`CSS Variable ${cssVar}:`, value);
      return value;
    }
    return '#1e1e1e';
  };

  const backgroundPrimary = getComputedCSSValue('--background-primary') || '#1e1e1e';
  const textNormal = getComputedCSSValue('--text-normal') || '#ffffff';
  const textAccent = getComputedCSSValue('--text-accent') || '#ffffff';

  const terminal = new Terminal({
    cols: cols,
    rows: rows,
    cursorBlink: true,
    theme: {
      background: backgroundPrimary,
      foreground: textNormal,
      cursor: textAccent,
    },
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    fontSize: 14,
    lineHeight: 1.2,
    scrollback: 1000,
  });

  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  // Store fitAddon on terminal for later use
  (terminal as any).fitAddon = fitAddon;

  // Start PTY process
  let ptyProcess: ChildProcess | null = null;

  const startPtyProcess = () => {
    // Use the plugin path if provided, otherwise fallback to __dirname
    const basePath = pluginPath || __dirname;
    const ptyHelperPath = path.join(basePath, 'pty_helper.py');

    // console.log('Starting PTY process with path:', ptyHelperPath);
    // console.log('Plugin path:', pluginPath);
    // console.log('Vault path:', vaultPath);
    // console.log('__dirname:', __dirname);

    ptyProcess = spawn('python3', [ptyHelperPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        COLUMNS: terminal.cols.toString(),
        LINES: terminal.rows.toString(),
        VAULT_PATH: vaultPath || process.cwd(),
      }
    });

    console.log('PTY process spawned with PID:', ptyProcess.pid);

    // Handle PTY output
    ptyProcess.stdout?.on('data', (data: Buffer) => {
      terminal.write(data.toString());
      terminal.scrollToBottom();
    });

    ptyProcess.stderr?.on('data', (data: Buffer) => {
      terminal.write(data.toString());
      terminal.scrollToBottom();
    });

    // Handle PTY process exit
    ptyProcess.on('close', (code: number | null, signal: string | null) => {
      console.log(`PTY process exited with code ${code}, signal: ${signal}`);

      // Only auto-close if it's a clean exit (code 0) or explicit exit command
      // Don't auto-close on errors or startup failures
      if (onExit && code === 0) {
        console.log('PTY process exited cleanly, calling onExit callback');
        onExit();
      } else {
        terminal.write(`\r\nPTY process exited with code ${code}, signal: ${signal}\r\n`);
        terminal.write('Press any key to restart...\r\n');
      }
    });

    // Handle PTY errors
    ptyProcess.on('error', (error: Error) => {
      console.log('PTY Error:', error.message);
      // Don't auto-close on errors, let user see the error message
      terminal.write(`\r\nPTY Error: ${error.message}\r\n`);
      terminal.write('Press any key to restart...\r\n');
    });
  };

  // Start the PTY process
  startPtyProcess();

  // Handle terminal input - send to PTY
  terminal.onData((data: string) => {
    if (ptyProcess && ptyProcess.stdin) {
      ptyProcess.stdin.write(data);
    }
  });

  // Handle keyboard shortcuts
  terminal.attachCustomKeyEventHandler((event: KeyboardEvent) => {
    // Debug key events
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      console.log('Clear shortcut detected:', {
        key: event.key,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey
      });
      event.preventDefault();
      event.stopPropagation();
      terminal.clear();
      return false; // Prevent default behavior
    }
    return true; // Allow normal key processing
  });

  // Handle terminal resize
  terminal.onResize(({ cols, rows }) => {
    if (ptyProcess && ptyProcess.stdin) {
      // Send resize signal to PTY helper
      // This would need to be implemented in pty_helper.py
      process.env.COLUMNS = cols.toString();
      process.env.LINES = rows.toString();
    }
  });

  // Cleanup function
  const cleanup = () => {
    if (ptyProcess) {
      ptyProcess.kill('SIGTERM');
      ptyProcess = null;
    }
  };

  (terminal as any).cleanup = cleanup;

  return terminal;
};
