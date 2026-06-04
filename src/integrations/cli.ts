import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { spawn } from 'child_process';
import { OpenCodeConfig } from '../utils/config';
import { SelectionContext } from '../utils/editor';

export async function sendFileViaCli(
  config: OpenCodeConfig,
  filePath: string,
  workingDirectory?: string
): Promise<void> {
  const args = buildRunArgs(config, [
    '--file',
    filePath,
    'Add this file to the current OpenCode session context.'
  ]);

  await runOpenCode(config.cliPath, args, workingDirectory);
}

export async function sendFolderViaCli(
  config: OpenCodeConfig,
  folderPath: string,
  workingDirectory?: string
): Promise<void> {
  const args = buildRunArgs(config, [
    '--file',
    folderPath,
    'Add this folder to the current OpenCode session context.'
  ]);

  await runOpenCode(config.cliPath, args, workingDirectory);
}

export async function sendSelectionViaCli(
  config: OpenCodeConfig,
  selectionContext: SelectionContext,
  workingDirectory?: string
): Promise<void> {
  const tempFile = await createSelectionTempFile(selectionContext);

  try {
    const source = `${selectionContext.relativePath}:${selectionContext.startLine}-${selectionContext.endLine}`;
    const args = buildRunArgs(config, [
      '--file',
      tempFile,
      `Add this selected code to the current OpenCode session context. Source: ${source}`
    ]);

    await runOpenCode(config.cliPath, args, workingDirectory);
  } finally {
    await fs.rm(path.dirname(tempFile), { recursive: true, force: true });
  }
}

function buildRunArgs(config: OpenCodeConfig, trailingArgs: string[]): string[] {
  const args = ['run'];

  if (config.sessionId) {
    args.push('--session', config.sessionId);
  } else if (config.continueLastSession) {
    args.push('--continue');
  }

  if (config.attachUrl) {
    args.push('--attach', config.attachUrl);
  }

  return args.concat(trailingArgs);
}

function runOpenCode(cliPath: string, args: string[], workingDirectory?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cliPath, args, {
      cwd: workingDirectory,
      shell: false,
      windowsHide: true
    });

    let stderr = '';
    let stdout = '';

    child.stdout?.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error((stderr || stdout || `OpenCode CLI exited with code ${code}`).trim()));
    });
  });
}

async function createSelectionTempFile(selectionContext: SelectionContext): Promise<string> {
  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'opencode-selection-'));
  const extension = path.extname(selectionContext.filePath) || '.txt';
  const tempFile = path.join(tempDirectory, `selection${extension}`);
  const header = [
    `Source: ${selectionContext.relativePath}`,
    `Lines: ${selectionContext.startLine}-${selectionContext.endLine}`,
    '',
    selectionContext.text
  ].join('\n');

  await fs.writeFile(tempFile, header, 'utf8');

  return tempFile;
}
