import React, { useEffect, useRef } from 'react';
import { buildTerminal } from './buildTerminal';

interface TerminalComponentProps {
  pluginPath?: string;
  vaultPath?: string;
  defaultShell?: string;
  onExit?: () => void;
}

interface TerminalDimensions {
  cols: number;
  rows: number;
}

// Calculate terminal dimensions based on container size
const calculateTerminalDimensions = (container: HTMLElement): TerminalDimensions => {
  // Terminal font settings (should match buildTerminal.ts)
  const fontSize = 14;
  const fontFamily = 'Monaco, Menlo, "Ubuntu Mono", monospace';
  const lineHeight = 1.2;

  // Create a temporary element to measure character dimensions
  const measureEl = document.createElement('div');
  measureEl.style.fontFamily = fontFamily;
  measureEl.style.fontSize = `${fontSize}px`;
  measureEl.style.lineHeight = `${lineHeight}`;
  measureEl.style.position = 'absolute';
  measureEl.style.visibility = 'hidden';
  measureEl.style.whiteSpace = 'pre';
  measureEl.textContent = 'M'; // Use 'M' as it's typically the widest character

  document.body.appendChild(measureEl);
  const charWidth = measureEl.offsetWidth;
  const charHeight = measureEl.offsetHeight;
  document.body.removeChild(measureEl);

  // Get container dimensions
  const containerRect = container.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;

  // Calculate dimensions with some padding to account for terminal margins/borders
  const padding = 80; // Small padding to prevent overflow
  const cols = Math.max(10, Math.floor((containerWidth - padding) / charWidth));
  const rows = Math.max(5, Math.floor((containerHeight - padding) / charHeight));

  return { cols, rows };
};

const TerminalComponent = ({ pluginPath, vaultPath, defaultShell, onExit }: TerminalComponentProps) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Calculate initial dimensions
    const dimensions = calculateTerminalDimensions(terminalRef.current);
    const terminal = buildTerminal(terminalRef, dimensions.cols, dimensions.rows, pluginPath, vaultPath, defaultShell, onExit);

    // Open terminal
    if (terminalRef.current) {
      terminal.open(terminalRef.current);

      // Handle container resize with dynamic terminal resizing
      const resizeObserver = new ResizeObserver(() => {
        if (terminalRef.current) {
          const newDimensions = calculateTerminalDimensions(terminalRef.current);

          // Only resize if dimensions actually changed
          if (newDimensions.cols !== terminal.cols || newDimensions.rows !== terminal.rows) {
            terminal.resize(newDimensions.cols, newDimensions.rows);
          }
        }
      });

      resizeObserver.observe(terminalRef.current);

      return () => {
        resizeObserver.disconnect();
        // Clean up PTY process first
        if ((terminal as any).cleanup) {
          (terminal as any).cleanup();
        }
        terminal.dispose();
      };
    }
  }, []);

  return (
    <div
      style={{
        paddingLeft: '10px',
        paddingBottom: '50px',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'auto'
      }}
      ref={terminalRef}
    />
  );
};

export default TerminalComponent;