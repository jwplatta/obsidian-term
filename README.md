# Obsidian Terminal

A full-featured terminal interface plugin for Obsidian that brings native terminal functionality directly into your knowledge workspace. Built with React and xterm.js, it provides a seamless command-line experience within Obsidian.

![Plugin Version](https://img.shields.io/badge/version-1.0.0-blue)
![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22obsidian-terminal%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Native Terminal Experience
- Full xterm.js terminal emulation with 256-color support
- Real PTY (pseudoterminal) process integration
- Native shell access (bash, zsh, powershell, etc.)
- Proper cursor handling and scrollback buffer (1000 lines)

### Obsidian Integration
- **Theme Integration**: Automatically adapts to your Obsidian theme colors
- **Workspace Integration**: Opens as native Obsidian view/tab
- **Ribbon Icon**: Quick access from sidebar
- **Command Palette**: Launch via `New Terminal` command

### Terminal Features
- **Keyboard Shortcuts**: Cmd/Ctrl+K to clear terminal
- **Dynamic Resizing**: Automatically adjusts to container size

### Smart Path Handling
- Automatically starts in your vault directory
- Access to full filesystem from terminal
- Plugin-aware path resolution

## Installation

### From Obsidian Community Plugins
1. Open Obsidian Settings
2. Navigate to Community Plugins and disable Safe Mode
3. Click Browse and search for "Terminal"
4. Install and enable the plugin

### Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/jwplatta/obsidian-terminal/releases)
2. Extract files to `<vault>/.obsidian/plugins/obsidian-terminal/`
3. Reload Obsidian and enable the plugin in Community Plugins settings

### For Developers
```bash
git clone https://github.com/jwplatta/obsidian-terminal.git
cd obsidian-terminal
npm install
npm run build
```

## Usage

### Opening a Terminal
**Method 1: Ribbon Icon**
- Click the terminal icon (=�) in the left sidebar

**Method 2: Command Palette**
- Press `Cmd/Ctrl + P` to open command palette
- Type "New Terminal" and press Enter

**Method 3: Hotkey (Optional)**
- Set a custom hotkey in Obsidian Settings > Hotkeys > New Terminal

### Terminal Shortcuts
- **Clear Terminal**: `Ctrl + K`
- **Standard terminal shortcuts** work as expected (`Ctrl+C`, `Ctrl+Z`, etc.)

### Multiple Terminals
- Each "New Terminal" command creates a separate terminal instance
- Switch between terminals using Obsidian's tab system
- Each terminal maintains its own session and history

## Requirements

### System Requirements
- **Desktop Only**: This plugin requires desktop Obsidian (Windows, macOS, Linux)
- **Python 3**: Required for PTY process handling
- **Node.js**: For development/building from source

### Obsidian Version
- Minimum Obsidian version: **0.15.0**
- Tested with Obsidian versions: 0.15.0+

### Platform Support
- **macOS**: Full support

## Configuration

Currently, the plugin uses sensible defaults. Future versions will include:

- Shell preference selection
- Custom font family and size
- Color theme customization
- Keyboard shortcut configuration
- Startup directory options

## Troubleshooting

### Common Issues

**Terminal doesn't open or shows blank screen**
- Ensure Python 3 is installed and accessible via `python3` command
- Check Obsidian Developer Console (Cmd/Ctrl+Shift+I) for error messages
- Try disabling and re-enabling the plugin

**Commands not working properly**
- Verify you're in the correct directory (`pwd`)
- Check that your shell environment is properly configured
- Some commands requiring TTY interaction may not work perfectly

**Plugin conflicts**
- Try disabling other terminal/command-line plugins temporarily
- Check for conflicts with vim-mode or other keyboard-heavy plugins

**Performance issues**
- Large terminal output may cause slowdown
- Try clearing terminal history with `Cmd/Ctrl + K`
- Consider closing unused terminal tabs

### Getting Help

1. **Check Issues**: [GitHub Issues](https://github.com/jwplatta/obsidian-terminal/issues)
2. **Create Issue**: Report bugs or request features

## Development

### Building from Source
```bash
# Clone repository
git clone https://github.com/jwplatta/obsidian-terminal.git
cd obsidian-terminal

# Install dependencies
npm install

# Development build (with watch mode)
npm run dev

# Production build
npm run build
```

### Project Structure
```
src/
  TerminalView.tsx      # Obsidian view integration
  TerminalComponent.tsx # React terminal component
  buildTerminal.ts      # Terminal configuration & PTY
  pty_helper.py         # Python PTY process handler
main.ts                   # Plugin entry point
manifest.json             # Plugin manifest
package.json              # Node.js dependencies
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Technical Details

### Architecture
- **Frontend**: React 19+ with TypeScript
- **Terminal**: xterm.js with FitAddon
- **Process**: Python PTY helper for shell integration
- **Build**: esbuild for fast compilation

### Dependencies
- `@xterm/xterm`: Terminal emulator
- `@xterm/addon-fit`: Terminal resizing
- `react`: UI framework
- `obsidian`: Plugin API

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

- Built by [Joseph Platta](https://github.com/jwplatta)
- Uses [xterm.js](https://xtermjs.org/) for terminal emulation
- Inspired by various terminal implementations in VS Code and other editors

## Changelog

### Version 1.0.0
- Initial release
- Full terminal emulation with xterm.js
- PTY process integration
- Obsidian theme integration
- Basic keyboard shortcuts

---

**Like this plugin?** Please star the repository and leave a review in the Obsidian community!

**Found a bug?** Please report it in [GitHub Issues](https://github.com/jwplatta/obsidian-terminal/issues).
