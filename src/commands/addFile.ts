import * as vscode from 'vscode';
import { copyFilePrompt } from '../integrations/clipboard';
import { sendFileViaCli } from '../integrations/cli';
import { sendFileToTerminal } from '../integrations/terminal';
import { getConfig } from '../utils/config';
import { getActiveFileEditor, getRelativePath, getWorkspaceDirectory } from '../utils/editor';
import { showInfo, showWarning } from '../utils/notifications';

export async function addFile(uri?: vscode.Uri): Promise<void> {
  const editor = uri ? undefined : getActiveFileEditor();
  const fileUri = uri ?? editor?.document.uri;

  if (!fileUri || fileUri.scheme !== 'file') {
    vscode.window.showWarningMessage('OpenCode: no file editor is active.');
    return;
  }

  const config = getConfig();
  const filePath = fileUri.fsPath;
  const relativePath = getRelativePath(fileUri);
  const workingDirectory = getWorkspaceDirectory(fileUri);

  if (config.integrationMethod === 'auto') {
    try {
      sendFileToTerminal(config, relativePath);
      showInfo('OpenCode: file reference sent to terminal.');
    } catch (error) {
      await copyFilePrompt(relativePath);
      showWarning(`OpenCode terminal unavailable; file reference copied instead. ${getErrorMessage(error)}`);
    }
    return;
  }

  if (config.integrationMethod === 'terminal') {
    sendFileToTerminal(config, relativePath);
    showInfo('OpenCode: file reference sent to terminal.');
    return;
  }

  if (config.integrationMethod === 'clipboard') {
    await copyFilePrompt(relativePath);
    showInfo('OpenCode: file reference copied. Paste it into your OpenCode session.');
    return;
  }

  await sendFileViaCli(config, filePath, workingDirectory);
  showInfo('OpenCode: file sent through CLI.');
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
