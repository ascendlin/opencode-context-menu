import * as vscode from 'vscode';
import { copyFolderPrompt } from '../integrations/clipboard';
import { sendFolderViaCli } from '../integrations/cli';
import { sendFolderToTerminal } from '../integrations/terminal';
import { getConfig } from '../utils/config';
import { getRelativePath, getWorkspaceDirectory } from '../utils/editor';
import { showInfo, showWarning } from '../utils/notifications';

export async function addFolder(uri?: vscode.Uri): Promise<void> {
  const folderUri = uri ?? await pickFolder();

  if (!folderUri || folderUri.scheme !== 'file') {
    vscode.window.showWarningMessage('OpenCode: no folder is selected.');
    return;
  }

  const config = getConfig();
  const folderPath = folderUri.fsPath;
  const relativePath = getRelativePath(folderUri);
  const workingDirectory = getWorkspaceDirectory(folderUri);

  if (config.integrationMethod === 'auto') {
    try {
      sendFolderToTerminal(config, relativePath);
      showInfo('OpenCode: folder reference sent to terminal.');
    } catch (error) {
      await copyFolderPrompt(relativePath);
      showWarning(`OpenCode terminal unavailable; folder reference copied instead. ${getErrorMessage(error)}`);
    }
    return;
  }

  if (config.integrationMethod === 'terminal') {
    sendFolderToTerminal(config, relativePath);
    showInfo('OpenCode: folder reference sent to terminal.');
    return;
  }

  if (config.integrationMethod === 'clipboard') {
    await copyFolderPrompt(relativePath);
    showInfo('OpenCode: folder reference copied. Paste it into your OpenCode session.');
    return;
  }

  await sendFolderViaCli(config, folderPath, workingDirectory);
  showInfo('OpenCode: folder sent through CLI.');
}

async function pickFolder(): Promise<vscode.Uri | undefined> {
  const folders = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Add Folder to OpenCode'
  });

  return folders?.[0];
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
