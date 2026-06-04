import * as vscode from 'vscode';
import { getConfig } from './config';

export function showInfo(message: string): void {
  if (getConfig().showNotifications) {
    vscode.window.showInformationMessage(message);
  }
}

export function showWarning(message: string): void {
  if (getConfig().showNotifications) {
    vscode.window.showWarningMessage(message);
  }
}
