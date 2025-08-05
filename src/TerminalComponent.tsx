import React, { useEffect, useRef } from 'react';
import { buildTerminal } from './buildTerminal';

interface TerminalComponentProps {
  pluginPath?: string;
  vaultPath?: string;
  onExit?: () => void;
}

const TerminalComponent = ({ pluginPath, vaultPath, onExit }: TerminalComponentProps) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const terminal = buildTerminal(terminalRef, pluginPath, vaultPath, onExit);

    // Open terminal and fit it
    if (terminalRef.current) {
      terminal.open(terminalRef.current);

      // Fit terminal to container after opening
      const fitAddon = (terminal as any).fitAddon;
      if (fitAddon) {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          fitAddon.fit();
        }, 100);
      }

      // Handle container resize
      const resizeObserver = new ResizeObserver(() => {
        if (fitAddon) {
          setTimeout(() => fitAddon.fit(), 10);
        }
      });

      resizeObserver.observe(terminalRef.current);

      return () => {
        console.log('Cleaning up terminal');
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
        height: '100%', 
        width: '100%', 
        display: 'flex',
        flexDirection: 'column'
      }} 
      ref={terminalRef} 
    />
  );
};

export default TerminalComponent;