import { Plugin } from 'obsidian';
import { TerminalView, TERMINAL_VIEW_TYPE } from './src/TerminalView';
import { ObsidianTerminalSettings, ObsidianTerminalSettingTab, DEFAULT_SETTINGS } from './src/settings';
import { SelectShellModal } from './src/selectShellModal';

export default class ObsidianTerminalPlugin extends Plugin {
	settings: ObsidianTerminalSettings;

	async onload() {
		await this.loadSettings();
		// Register terminal view with plugin instance
		this.registerView(TERMINAL_VIEW_TYPE, (leaf) => new TerminalView(leaf, this));

		this.addRibbonIcon('terminal', 'New Terminal', (evt: MouseEvent) => {
			this.activateView();
		});

		this.addCommand({
			id: 'new-terminal',
			name: 'New Terminal',
			callback: () => this.activateView()
		});

		this.addCommand({
			id: 'select-shell',
			name: 'Select Shell',
			callback: () => {
				new SelectShellModal(this.app, this).open();
			}
		});

		this.addSettingTab(new ObsidianTerminalSettingTab(this.app, this));
	}

	async activateView() {
		const { workspace } = this.app;
		let leaf = workspace.getLeavesOfType(TERMINAL_VIEW_TYPE)[0];

		if (!leaf) {
			leaf = workspace.getLeaf(true); // Create new tab in main area
			await leaf.setViewState({ type: TERMINAL_VIEW_TYPE });
		}

		workspace.revealLeaf(leaf);
	}

	async loadSettings() {
		try {
			this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		} catch (error) {
			console.error('Failed to load settings, using defaults:', error);
			this.settings = Object.assign({}, DEFAULT_SETTINGS);
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}