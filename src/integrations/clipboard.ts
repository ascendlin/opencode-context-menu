import * as vscode from 'vscode';
import { SelectionContext } from '../utils/editor';

export async function copyFilePrompt(relativePath: string): Promise<void> {
  await vscode.env.clipboard.writeText(`@${relativePath}`);
}

export async function copyFolderPrompt(relativePath: string): Promise<void> {
  await vscode.env.clipboard.writeText(`@${relativePath}`);
}

export async function copySelectionPrompt(selectionContext: SelectionContext): Promise<void> {
  await vscode.env.clipboard.writeText(`@${selectionContext.relativePath} ${toSingleLine(selectionContext.text)}`);
}

function toSingleLine(text: string): string {
  return text.replace(/\r\n|\r|\n/g, '\\n');
}
