'use strict';
import * as path from 'path';
import * as vscode from 'vscode';

interface CustomTerminal {
    terminal: vscode.Terminal;
    cwd: string;
}

export function activate(context: vscode.ExtensionContext) {
    const createdTerminals: CustomTerminal[] = [];

    const disposable = vscode.commands.registerCommand('runcfile.runc', () => {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            let filePath = editor.document.fileName;
            filePath = filePath.replaceAll("\\", "/");

            let customTerminal: CustomTerminal | undefined;

            if (filePath.endsWith('.c') && filePath.charAt(1) == ':') {
                filePath = "/mnt/" + filePath;
                filePath = filePath.replaceAll(":", "");
                const fileName = path.basename(filePath);
                const op = filePath.replace(fileName, "a.out");
                const opn = filePath.replace(fileName, "");

                // Check if a terminal for C files already exists
                customTerminal = createdTerminals.find(term => term.terminal.name === 'WSL - Ubuntu' && term.cwd === opn);

                if (!customTerminal) {
                    // Create a new terminal
                    const terminal = vscode.window.createTerminal({
                        name: 'WSL - Ubuntu',
                        shellPath: 'wsl.exe',
                        env: {},
                    });

                    customTerminal = { terminal, cwd: opn };
                    createdTerminals.push(customTerminal);
                }

                // Build and run the command
                const gccCommand = `gcc "${filePath}" -lm -o  "${op}" && chmod +x "${op}" && "${op}" && rm "${op}"`;

                // Send the command to the terminal
                customTerminal.terminal.sendText(gccCommand, true);

                // Show the terminal
                customTerminal.terminal.show();
            } else if (filePath.endsWith('.c') && filePath.charAt(1) != ':') {
                filePath = filePath.replaceAll("//wsl.localhost/Ubuntu", "");
                const fileName = path.basename(filePath);
                const op = filePath.replace(fileName, "a.out");
                const opn = filePath.replace(fileName, "");

                // Check if a terminal for C files already exists
                customTerminal = createdTerminals.find(term => term.terminal.name === 'WSL - Ubuntu' && term.cwd === opn);

                if (!customTerminal) {
                    // Create a new terminal
                    const terminal = vscode.window.createTerminal({
                        name: 'WSL - Ubuntu',
                        shellPath: 'wsl.exe',
                        env: {},
                    });

                    customTerminal = { terminal, cwd: opn };
                    createdTerminals.push(customTerminal);
                }

                // Build and run the command
                const gccCommand = `gcc "${filePath}" -lm -o "${op}" && chmod +x "${op}" && "${op}" && rm "${op}"`;

                // Send the command to the terminal
                customTerminal.terminal.sendText(gccCommand, true);

                // Show the terminal
                customTerminal.terminal.show();
            } else if (filePath.endsWith('.java')) {
                const className = path.parse(filePath).name;
                const opn = filePath.replace(className + ".java", "");

                // Check if a terminal for Java files already exists
                customTerminal = createdTerminals.find(term => term.terminal.name === 'CMD - Windows' && term.cwd === opn);

                if (!customTerminal) {
                    // Create a new terminal
                    const terminal = vscode.window.createTerminal({
                        name: 'CMD - Windows',
                        shellPath: 'cmd.exe',
                        env: {},
                    });

                    customTerminal = { terminal, cwd: opn };
                    createdTerminals.push(customTerminal);
                }

                // Build and run the command for Java file in CMD
                const javaCommand = `cd ${opn} && javac ${className}.java && java ${className} && del ${className}.class`;

                // Send the command to the terminal
                customTerminal.terminal.sendText(javaCommand, true);

                // Show the terminal
                customTerminal.terminal.show();
            } else {
                vscode.window.showWarningMessage('Unsupported file type.');
            }
        } else {
            vscode.window.showWarningMessage('Open a file to run.');
        }
    });

    context.subscriptions.push(disposable);
}
