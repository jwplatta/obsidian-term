import { ItemView, WorkspaceLeaf, Plugin } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import { StrictMode } from 'react';
import * as path from 'path';
import TerminalComponent from './TerminalComponent'

export const TERMINAL_VIEW_TYPE = 'terminal-view';

export class TerminalView extends ItemView {
	root: Root | null = null;
	plugin: Plugin;

	constructor(leaf: WorkspaceLeaf, plugin: Plugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType() {
		return TERMINAL_VIEW_TYPE;
	}

	getDisplayText() {
		return 'Terminal';
	}

	getIcon() {
		return 'terminal';
	}

	async onOpen() {
		await this.render();
	}

	async onClose() {
		this.root?.unmount();
	}

	private async render() {
		const container = this.containerEl.children[1];
		container.empty();

		const vaultPath = (this.app.vault.adapter as any).basePath;
		const fullPluginPath = path.join(vaultPath, this.plugin.manifest.dir);
		
		console.log('Vault path:', vaultPath);
		console.log('Plugin manifest dir:', this.plugin.manifest.dir);
		console.log('Full plugin path:', fullPluginPath);
		
		this.root = createRoot(container);
		const handleTerminalExit = () => {
			console.log('Terminal exited, closing leaf');
			this.leaf.detach();
		};

		this.root.render(
			<StrictMode>
				<TerminalComponent 
					pluginPath={fullPluginPath} 
					vaultPath={vaultPath} 
					onExit={handleTerminalExit}
				/>
			</StrictMode>
		);
	}
}