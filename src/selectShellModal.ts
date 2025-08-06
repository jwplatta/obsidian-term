import { App, SuggestModal, Notice } from 'obsidian';
import ObsidianTerminalPlugin from '../main';

interface ShellOption {
    path: string;
    name: string;
    description: string;
}

export class SelectShellModal extends SuggestModal<ShellOption> {
    plugin: ObsidianTerminalPlugin;

    constructor(app: App, plugin: ObsidianTerminalPlugin) {
        super(app);
        this.plugin = plugin;
        this.setPlaceholder('Select a shell...');
    }

    getSuggestions(query: string): ShellOption[] {
        const shells: ShellOption[] = [
            {
                path: '/bin/bash',
                name: 'Bash',
                description: 'Bourne Again Shell'
            },
            {
                path: '/bin/zsh',
                name: 'Zsh',
                description: 'Z Shell'
            }
        ];

        return shells.filter(shell =>
            shell.name.toLowerCase().includes(query.toLowerCase()) ||
            shell.path.toLowerCase().includes(query.toLowerCase()) ||
            shell.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(shell: ShellOption, el: HTMLElement) {
        el.createEl('div', { text: shell.name, cls: 'suggestion-title' });
        el.createEl('small', { text: shell.path, cls: 'suggestion-note' });
        el.createEl('div', { text: shell.description, cls: 'suggestion-aux' });
    }

    async onChooseSuggestion(shell: ShellOption, evt: MouseEvent | KeyboardEvent) {
        this.plugin.settings.defaultShell = shell.path;
        await this.plugin.saveSettings();
        new Notice(`Default shell changed to ${shell.name} (${shell.path})`);
    }
}