import * as vscode from 'vscode';
import { OpenCodeConfig } from '../utils/config';
import { SelectionContext } from '../utils/editor';

export function sendFileToTerminal(config: OpenCodeConfig, relativePath: string): void {
  sendToOpenCodeTerminal(config, `@${relativePath}`);
}

export function sendFolderToTerminal(config: OpenCodeConfig, relativePath: string): void {
  sendToOpenCodeTerminal(config, `@${relativePath}`);
}

export function sendSelectionToTerminal(config: OpenCodeConfig, selectionContext: SelectionContext): void {
  sendToOpenCodeTerminal(config, `@${selectionContext.relativePath} ${toSingleLine(selectionContext.text)}`);
}

function toSingleLine(text: string): string {
  return text.replace(/\r\n|\r|\n/g, '\\n');
}

function sendToOpenCodeTerminal(config: OpenCodeConfig, text: string): void {
  const terminal = findOpenCodeTerminal(config);

  if (!terminal) {
    throw new Error('No OpenCode terminal found. Rename your OpenCode terminal to include "opencode", or enable active terminal fallback.');
  }

  terminal.show(false);
  terminal.sendText(text, config.terminalSubmitOnSend);
}

function findOpenCodeTerminal(config: OpenCodeConfig): vscode.Terminal | undefined {
  const matchedTerminal = vscode.window.terminals.find((terminal) => terminalNameMatches(terminal.name, config.terminalNamePattern));

  if (matchedTerminal) {
    return matchedTerminal;
  }

  if (config.terminalUseActiveWhenNoMatch) {
    return vscode.window.activeTerminal;
  }

  return undefined;
}

function terminalNameMatches(name: string, pattern: string): boolean {
  try {
    return new RegExp(pattern, 'i').test(name);
  } catch {
    return name.toLowerCase().includes(pattern.toLowerCase());
  }
}
