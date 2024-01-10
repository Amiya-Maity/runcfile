'use strict';
import * as path from 'path';
import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { fileURLToPath } from 'url';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('runcfile.runc', () => {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
	
		if (editor) {
			let filePath = editor.document.fileName;
			filePath = filePath.replaceAll("\\", "/");
			
			if (filePath.endsWith('.c') && filePath.charAt(1) == ':') {
				filePath = "/mnt/"+filePath;
				filePath = filePath.replaceAll(":", "");
				const fileName = path.basename(filePath);
				const op = filePath.replace(fileName, "a.out");
				const opn = filePath.replace(fileName, "");
				// Create a terminal
				const terminal = vscode.window.createTerminal({
					name: 'WSL - Ubuntu',
					shellPath: 'wsl.exe',
					env: {
					},
					cwd: '',
				});
	
				// Build and run the command
				const gccCommand = `gcc "${filePath}" -lm -o  "${op}" ; chmod +x "${op}"; PATH=$PATH:"${opn}"; "${op}"; rm "${op}"`;
				
				// Send the command to the terminal
				terminal.sendText(gccCommand, true);
	
				// Show the terminal
				terminal.show();
			}
			else if (filePath.endsWith('.c') && filePath.charAt(1) != ':') {
				filePath = filePath.replaceAll("//wsl.localhost/Ubuntu", ""); 
				const fileName = path.basename(filePath);
				const op = filePath.replace(fileName, "a.out");
				const opn = filePath.replace(fileName, "");
				// Create a terminal
				const terminal = vscode.window.createTerminal({
					name: 'WSL - Ubuntu',
					shellPath: 'wsl.exe',
					env: {
					},
					cwd: '',
				});

				// Build and run the command
				const gccCommand = `gcc "${filePath}" -lm -o "${op}" ; chmod +x "${op}"; PATH=$PATH:"${opn}"; "${op}"; rm "${op}"`;
				
				// Send the command to the terminal
				terminal.sendText(gccCommand, true);
	
				// Show the terminal
				terminal.show();
			} else {
				vscode.window.showWarningMessage('Not a c file (.c).');
			}
		} else {
			vscode.window.showWarningMessage('Open a c file to run with GCC.');
		}
	});
	
	context.subscriptions.push(disposable);
}