import React from 'react';
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

export const buildTerminal = (terminalRef: React.RefObject<HTMLDivElement>) => {
  const terminal = new Terminal({
    cols: 100,
    rows: 40,
    cursorBlink: true,
    theme: {
      background: "#1e1e1e",
      foreground: "#ffffff",
      cursor: "#ffffff",
    },
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    fontSize: 14,
    lineHeight: 1.2,
    scrollback: 1000,
  });

  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  terminal.open(terminalRef.current);
  fitAddon.fit();

  const prompt = () => {
    terminal.write("\r\n$ ");
  };

  terminal.write('Type "help" for available commands\r\n');
  prompt();

  let currentInput = "";

  terminal.onData((data: any) => {
    const code = data.charCodeAt(0);

    if (code === 13) {
      // Enter key
      handleCommand(currentInput.trim());
      currentInput = "";
      prompt();
    } else if (code === 127) {
      // Backspace
      if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        terminal.write("\b \b");
      }
    } else if (code >= 32) {
      // Printable characters
      currentInput += data;
      terminal.write(data);
    }
  });

  const handleCommand = (command: any) => {
    terminal.write("\r\n");

    if (!command) return;

    switch (command.toLowerCase()) {
      case "help":
        terminal.write("Available commands:\r\n");
        terminal.write("  help    - Show this help message\r\n");
        terminal.write("  clear   - Clear the terminal\r\n");
        terminal.write("  date    - Show current date and time\r\n");
        terminal.write("  echo    - Echo back the arguments\r\n");
        terminal.write("  whoami  - Show current user\r\n");
        break;
      case "clear":
        terminal.clear();
        break;
      case "date":
        terminal.write(new Date().toString() + "\r\n");
        break;
      case "whoami":
        terminal.write("obsidian-user\r\n");
        break;
      default:
        if (command.startsWith("echo ")) {
          const message = command.substring(5);
          terminal.write(message + "\r\n");
        } else {
          terminal.write(`Command not found: ${command}\r\n`);
          terminal.write('Type "help" for available commands\r\n');
        }
    }
  };

  return terminal;
};
