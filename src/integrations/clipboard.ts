import * as vscode from 'vscode';
import { SelectionContext } from '../utils/editor';

export async function copyFilePrompt(relativePath: string): Promise<void> {
  await vscode.env.clipboard.writeText(`@${relativePath}`);
}

export async function copyFolderPrompt(relativePath: string): Promise<void> {
  await vscode.env.clipboard.writeText(`@${relativePath}`);
}

export async function copySelectionPrompt(selectionContext: SelectionContext): Promise<void> {
  const source = `${selectionContext.relativePath}:${selectionContext.startLine}-${selectionContext.endLine}`;
  const content = [
    `Selected code from ${source}:`,
    '',
    `\`\`\`${selectionContext.languageId}`,
    selectionContext.text,
    '```'
  ].join('\n');

  await vscode.env.clipboard.writeText(content);
}
