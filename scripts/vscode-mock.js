/**
 * Minimal VS Code API mock for unit testing
 */

const EventEmitter = require('events');

class MockStatusBarItem {
    constructor() {
        this.text = '';
        this.tooltip = '';
        this.command = undefined;
        this.alignment = 2;
        this.priority = 100;
        this.name = '';
        this.id = '';
        this.backgroundColor = undefined;
        this.color = undefined;
        this.accessibilityInformation = undefined;
    }
    show() {}
    hide() {}
    dispose() {}
}

const vscode = {
    StatusBarAlignment: {
        Left: 1,
        Right: 2
    },
    
    window: {
        createStatusBarItem(alignment, priority) {
            return new MockStatusBarItem();
        },
        showInformationMessage() {},
        showErrorMessage() {},
        showWarningMessage() {},
        activeTextEditor: undefined
    },
    
    workspace: {
        getConfiguration(section) {
            return {
                get(key, defaultValue) {
                    return defaultValue;
                },
                has(key) {
                    return true;
                },
                update() {},
                inspect() {}
            };
        },
        onDidChangeConfiguration() {
            return { dispose() {} };
        },
        createFileSystemWatcher() {
            return {
                onDidCreate() {},
                onDidChange() {},
                onDidDelete() {},
                dispose() {}
            };
        }
    },
    
    commands: {
        registerCommand() {
            return { dispose() {} };
        },
        executeCommand() {},
        getCommands() {
            return Promise.resolve([]);
        }
    },
    
    extensions: {
        getExtension() {
            return {
                isActive: true,
                activate() {
                    return Promise.resolve();
                }
            };
        }
    },
    
    Uri: {
        file(path) {
            return { fsPath: path };
        }
    },
    
    ConfigurationTarget: {
        Global: 1,
        Workspace: 2,
        WorkspaceFolder: 3
    },
    
    Position: null,  // Will be set below
    Range: null,     // Will be set below
    Selection: null  // Will be set below
};

// Define classes after vscode object is created to avoid reference errors
class Position {
    constructor(line, character) {
        this.line = line;
        this.character = character;
    }
}

class Range {
    constructor(startLine, startChar, endLine, endChar) {
        this.start = new Position(startLine, startChar);
        this.end = new Position(endLine, endChar);
    }
}

class Selection extends Range {
    constructor(anchorLine, anchorChar, activeLine, activeChar) {
        super(anchorLine, anchorChar, activeLine, activeChar);
        this.anchor = new Position(anchorLine, anchorChar);
        this.active = new Position(activeLine, activeChar);
        this.isEmpty = anchorLine === activeLine && anchorChar === activeChar;
    }
}

vscode.Position = Position;
vscode.Range = Range;
vscode.Selection = Selection;

module.exports = vscode;

