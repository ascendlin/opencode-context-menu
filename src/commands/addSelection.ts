import * as vscode from 'vscode';
import { copySelectionPrompt } from '../integrations/clipboard';
import { sendSelectionViaCli } from '../integrations/cli';
import { sendSelectionToTerminal } from '../integrations/terminal';
import { getConfig } from '../utils/config';
import { getActiveFileEditor, getSelectionContext, getWorkspaceDirectory } from '../utils/editor';
import { showInfo, showWarning } from '../utils/notifications';

export async function addSelection(): Promise<void> {
  const editor = getActiveFileEditor();

  if (!editor) {
    vscode.window.showWarningMessage('OpenCode: no file editor is active.');
    return;
  }

  const selectionContext = getSelectionContext(editor);

  if (!selectionContext) {
    vscode.window.showWarningMessage('OpenCode: select code before using this command.');
    return;
  }

  const config = getConfig();
  const workingDirectory = getWorkspaceDirectory(editor.document.uri);

  if (config.integrationMethod === 'auto') {
    try {
      sendSelectionToTerminal(config, selectionContext);
      showInfo('OpenCode: selected code sent to terminal.');
    } catch (error) {
      await copySelectionPrompt(selectionContext);
      showWarning(`OpenCode terminal unavailable; selected code copied instead. ${getErrorMessage(error)}`);
    }
    return;
  }

  if (config.integrationMethod === 'terminal') {
    sendSelectionToTerminal(config, selectionContext);
    showInfo('OpenCode: selected code sent to terminal.');
    return;
  }

  if (config.integrationMethod === 'clipboard') {
    await copySelectionPrompt(selectionContext);
    showInfo('OpenCode: selected code copied. Paste it into your OpenCode session.');
    return;
  }

  await sendSelectionViaCli(config, selectionContext, workingDirectory);
  showInfo('OpenCode: selected code sent through CLI.');
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
