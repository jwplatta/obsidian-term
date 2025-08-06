import {
    App,
    PluginSettingTab,
    Setting
} from 'obsidian';
import ObsidianTerminalPlugin from '../main';

export interface ObsidianTerminalSettings {
    defaultShell: string;
}

export const DEFAULT_SETTINGS: ObsidianTerminalSettings = {
    defaultShell: '/bin/zsh'
};

export class ObsidianTerminalSettingTab extends PluginSettingTab {
    plugin: ObsidianTerminalPlugin;

    constructor(app: App, plugin: ObsidianTerminalPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName('Default Shell')
            .setDesc('Select the shell to use for terminal sessions')
            .addDropdown(dropdown => dropdown
                .addOption('/bin/bash', 'Bash')
                .addOption('/bin/zsh', 'Zsh')
                .setValue(this.plugin.settings.defaultShell)
                .onChange(async (value) => {
                    this.plugin.settings.defaultShell = value;
                    await this.plugin.saveSettings();
                })
            );
    }
}