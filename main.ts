import { Plugin } from 'obsidian';
import { TerminalView, TERMINAL_VIEW_TYPE } from './src/TerminalView';

export default class ObsidianTerminalPlugin extends Plugin {
	async onload() {
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
}