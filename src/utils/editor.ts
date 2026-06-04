import * as path from 'path';
import * as vscode from 'vscode';

export interface SelectionContext {
  text: string;
  filePath: string;
  relativePath: string;
  startLine: number;
  endLine: number;
  languageId: string;
}

export function getActiveFileEditor(): vscode.TextEditor | undefined {
  const editor = vscode.window.activeTextEditor;

  if (!editor || editor.document.uri.scheme !== 'file') {
    return undefined;
  }

  return editor;
}

export function getWorkspaceDirectory(uri: vscode.Uri): string | undefined {
  return vscode.workspace.getWorkspaceFolder(uri)?.uri.fsPath;
}

export function getRelativePath(uri: vscode.Uri): string {
  const workspaceDirectory = getWorkspaceDirectory(uri);

  if (!workspaceDirectory) {
    return path.basename(uri.fsPath);
  }

  return path.relative(workspaceDirectory, uri.fsPath) || '.';
}

export function getSelectionContext(editor: vscode.TextEditor): SelectionContext | undefined {
  const text = editor.document.getText(editor.selection);

  if (!text) {
    return undefined;
  }

  return {
    text,
    filePath: editor.document.uri.fsPath,
    relativePath: getRelativePath(editor.document.uri),
    startLine: editor.selection.start.line + 1,
    endLine: editor.selection.end.line + 1,
    languageId: editor.document.languageId
  };
}
