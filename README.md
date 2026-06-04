# OpenCode Context Menu

Add files, folders, and selected code to OpenCode directly from VSCode context menus.

[English](#english) | [中文](#中文)

## English

### Features

- `Add File to OpenCode`: Send the current file as a native relative path reference, or copy it to the clipboard.
- `Add Folder to OpenCode`: Send an Explorer folder as a native relative path reference, or copy it to the clipboard.
- `Add Selection to OpenCode`: Send selected code to OpenCode, or copy it to the clipboard.
- OpenCode actions use a dedicated context menu group, separated from other VSCode menu items.
- `Add Selection to OpenCode` stays visible and is disabled when no code is selected.
- Supports VSCode integrated terminal, clipboard, OpenCode CLI, and automatic fallback modes.

### Usage

1. Right-click in the editor and choose `Add File to OpenCode`, or select code and choose `Add Selection to OpenCode`.
2. Right-click a file in Explorer and choose `Add File to OpenCode`.
3. Right-click a folder in Explorer and choose `Add Folder to OpenCode`.

### Keyboard Shortcuts

- Windows/Linux: `Ctrl+Alt+O F` to add the current file.
- Windows/Linux: `Ctrl+Alt+O S` to add selected code.
- macOS: `Cmd+Alt+O F` to add the current file.
- macOS: `Cmd+Alt+O S` to add selected code.

### Configuration

| Setting | Default | Description |
| --- | --- | --- |
| `opencodeContextMenu.integrationMethod` | `auto` | `auto`, `terminal`, `clipboard`, or `cli`. |
| `opencodeContextMenu.terminalNamePattern` | `opencode` | Case-insensitive regular expression used to find the OpenCode integrated terminal. |
| `opencodeContextMenu.terminalUseActiveWhenNoMatch` | `true` | Send to the active integrated terminal when no terminal name matches. |
| `opencodeContextMenu.terminalSubmitOnSend` | `false` | Submit after sending text to the terminal. Disabled by default so you can review before submitting. |
| `opencodeContextMenu.cliPath` | `opencode` | OpenCode CLI executable path. |
| `opencodeContextMenu.continueLastSession` | `true` | In CLI mode, pass `--continue` by default. |
| `opencodeContextMenu.sessionId` | empty | In CLI mode, use `--session <id>` when configured. |
| `opencodeContextMenu.attachUrl` | empty | In CLI mode, pass `--attach <url>` when configured. |
| `opencodeContextMenu.showNotifications` | `true` | Show success and fallback notifications. |

### Integration Modes

#### Auto

Default mode. The extension first tries to send content to an OpenCode terminal inside VSCode. If no suitable terminal is found, it falls back to the clipboard.

File and folder references use workspace-relative paths with the native separator of the current operating system: Windows uses `\`, while macOS/Linux use `/`.

Windows examples:

```text
@src\extension.ts
@src\commands
@.
```

macOS/Linux examples:

```text
@src/extension.ts
@src/commands
@.
```

#### Terminal

The extension looks for a VSCode integrated terminal whose name matches `opencodeContextMenu.terminalNamePattern`, then writes the content into that terminal.

If your OpenCode terminal is not named `opencode`, rename the terminal tab or update `terminalNamePattern`.

In terminal mode, selected code is sent as a single escaped line. Real newlines are represented as `\n` to prevent the terminal from treating selected-code line breaks as Enter and submitting the OpenCode prompt immediately.

By default, content is inserted but not submitted. To submit immediately after sending, enable:

```json
{
  "opencodeContextMenu.terminalSubmitOnSend": true
}
```

#### Clipboard

The extension copies content that can be pasted into an OpenCode session. Files and folders are copied as native relative path references, such as `@src\commands` on Windows or `@src/commands` on macOS/Linux.

#### CLI

The extension calls:

```bash
opencode run --continue --file <file> <message>
```

If `sessionId` is configured, it uses `--session <id>` instead of `--continue`.

### Development

```bash
npm install
npm run compile
```

Press `F5` in VSCode to launch the Extension Development Host.

The default debug configuration is `Run Extension (Clean)`, which uses `--disable-extensions` to avoid unrelated logs from other installed extensions.

Choose `Run Extension (With Installed Extensions)` when you need to debug in a real user-like environment.

If you see `punycode` deprecation warnings, `Claude code extension...`, or Python virtual environment activation logs, they usually come from other extensions or VSCode dependencies, not from this extension.

### Package

```bash
npm run package
```

## 中文

### 功能

- `Add File to OpenCode`: 将当前文件以系统原生相对路径形式发送到 OpenCode，或复制到剪贴板。
- `Add Folder to OpenCode`: 将资源管理器中的文件夹以系统原生相对路径形式发送到 OpenCode，或复制到剪贴板。
- `Add Selection to OpenCode`: 将选中代码发送到 OpenCode，或复制到剪贴板。
- OpenCode 菜单使用独立右键菜单分组，会通过分隔线和其他 VSCode 菜单项隔开。
- 右键菜单始终显示；未选中代码时，`Add Selection to OpenCode` 会置灰。
- 支持 VSCode 集成终端、剪贴板、CLI、自动降级四种集成方式。

### 使用方式

1. 在编辑器中右键，选择 `Add File to OpenCode` 或选中代码后选择 `Add Selection to OpenCode`。
2. 在资源管理器中文件右键，选择 `Add File to OpenCode`。
3. 在资源管理器中文件夹右键，选择 `Add Folder to OpenCode`。

### 快捷键

- Windows/Linux: `Ctrl+Alt+O F` 添加当前文件。
- Windows/Linux: `Ctrl+Alt+O S` 添加选中代码。
- macOS: `Cmd+Alt+O F` 添加当前文件。
- macOS: `Cmd+Alt+O S` 添加选中代码。

### 配置

| 设置 | 默认值 | 说明 |
| --- | --- | --- |
| `opencodeContextMenu.integrationMethod` | `auto` | `auto`、`terminal`、`clipboard` 或 `cli`。 |
| `opencodeContextMenu.terminalNamePattern` | `opencode` | 用于匹配 OpenCode 集成终端名称的正则表达式。 |
| `opencodeContextMenu.terminalUseActiveWhenNoMatch` | `true` | 找不到匹配终端时，发送到当前激活的集成终端。 |
| `opencodeContextMenu.terminalSubmitOnSend` | `false` | 发送到终端后是否自动回车提交。默认只插入到输入框，便于检查。 |
| `opencodeContextMenu.cliPath` | `opencode` | OpenCode CLI 可执行文件路径。 |
| `opencodeContextMenu.continueLastSession` | `true` | CLI 模式下默认传入 `--continue`。 |
| `opencodeContextMenu.sessionId` | 空 | 指定后 CLI 模式使用 `--session <id>`。 |
| `opencodeContextMenu.attachUrl` | 空 | 指定后 CLI 模式使用 `--attach <url>`。 |
| `opencodeContextMenu.showNotifications` | `true` | 是否显示成功和降级提示。 |

### 集成方式

#### Auto

默认模式。扩展会先尝试把内容发送到 VSCode 集成终端里的 OpenCode；找不到终端时自动降级到剪贴板。

文件和文件夹引用使用工作区相对路径，并跟随当前系统的原生路径分隔符：Windows 使用 `\`，macOS/Linux 使用 `/`。

Windows 示例：

```text
@src\extension.ts
@src\commands
@.
```

macOS/Linux 示例：

```text
@src/extension.ts
@src/commands
@.
```

#### Terminal

扩展会查找名称匹配 `opencodeContextMenu.terminalNamePattern` 的 VSCode 集成终端，并把内容写入该终端。

如果你的 OpenCode 终端名称不是 `opencode`，可以右键终端标签重命名，或修改 `terminalNamePattern`。

在 Terminal 模式下，选中代码会被转成单行转义文本发送，例如把真实换行表示为 `\n`。这是为了避免终端把选中代码里的换行解释为 Enter，导致 OpenCode 会话立即执行。

默认不会自动回车提交。如需发送后立即提交，开启：

```json
{
  "opencodeContextMenu.terminalSubmitOnSend": true
}
```

#### Clipboard

扩展会把可直接粘贴到 OpenCode 会话的内容写入剪贴板。当前文件和文件夹会复制为系统原生相对路径，例如 Windows 的 `@src\commands` 或 macOS/Linux 的 `@src/commands`。

#### CLI

扩展会调用：

```bash
opencode run --continue --file <file> <message>
```

如果配置了 `sessionId`，则使用 `--session <id>` 替代 `--continue`。

### 开发

```bash
npm install
npm run compile
```

在 VSCode 中按 `F5` 启动 Extension Development Host。

默认调试配置是 `Run Extension (Clean)`，会使用 `--disable-extensions` 禁用其他已安装扩展，避免 Claude、Python 等扩展日志混入调试输出。

如果需要在已安装扩展都启用的环境中调试，请在调试面板选择 `Run Extension (With Installed Extensions)`。

如果看到 `punycode` deprecation warning、`Claude code extension...` 或 Python 虚拟环境激活日志，通常来自其他扩展或 VSCode 依赖，不是本插件直接输出。优先使用 `Run Extension (Clean)` 排查本插件问题。

### 打包

```bash
npm run package
```
