import * as vscode from 'vscode';

export type IntegrationMethod = 'auto' | 'terminal' | 'clipboard' | 'cli';

export interface OpenCodeConfig {
  integrationMethod: IntegrationMethod;
  terminalNamePattern: string;
  terminalUseActiveWhenNoMatch: boolean;
  terminalSubmitOnSend: boolean;
  cliPath: string;
  continueLastSession: boolean;
  sessionId: string;
  attachUrl: string;
  showNotifications: boolean;
}

const CONFIG_SECTION = 'opencodeContextMenu';

export function getConfig(): OpenCodeConfig {
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION);

  return {
    integrationMethod: config.get<IntegrationMethod>('integrationMethod', 'auto'),
    terminalNamePattern: config.get<string>('terminalNamePattern', 'opencode').trim() || 'opencode',
    terminalUseActiveWhenNoMatch: config.get<boolean>('terminalUseActiveWhenNoMatch', true),
    terminalSubmitOnSend: config.get<boolean>('terminalSubmitOnSend', false),
    cliPath: config.get<string>('cliPath', 'opencode').trim() || 'opencode',
    continueLastSession: config.get<boolean>('continueLastSession', true),
    sessionId: config.get<string>('sessionId', '').trim(),
    attachUrl: config.get<string>('attachUrl', '').trim(),
    showNotifications: config.get<boolean>('showNotifications', true)
  };
}
