import { ItemView, WorkspaceLeaf, Plugin } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import { StrictMode } from 'react';
import * as path from 'path';
import TerminalComponent from './TerminalComponent';
import ObsidianTerminalPlugin from '../main';

export const TERMINAL_VIEW_TYPE = 'terminal-view';

export class TerminalView extends ItemView {
	root: Root | null = null;
	plugin: ObsidianTerminalPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: ObsidianTerminalPlugin) {
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

		this.root = createRoot(container);
		const handleTerminalExit = () => {
			this.leaf.detach();
		};

		this.root.render(
			<StrictMode>
				<TerminalComponent
					pluginPath={fullPluginPath}
					vaultPath={vaultPath}
					defaultShell={this.plugin.settings.defaultShell}
					onExit={handleTerminalExit}
				/>
			</StrictMode>
		);
	}
}