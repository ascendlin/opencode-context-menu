import * as vscode from 'vscode';
import { addFile } from './commands/addFile';
import { addFolder } from './commands/addFolder';
import { addSelection } from './commands/addSelection';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('opencodeContextMenu.addFile', addFile),
    vscode.commands.registerCommand('opencodeContextMenu.addFolder', addFolder),
    vscode.commands.registerCommand('opencodeContextMenu.addSelection', addSelection)
  );
}

export function deactivate(): void {}
