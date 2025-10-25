# How to Create the .vsix File

## Quick Steps

### 1. Install vsce (one time only)

```bash
npm install -g @vscode/vsce
```

### 2. Package your extension

```bash
vsce package
```

That's it! You'll see output like:

```
DONE  Packaged: /Users/dar/repos/sc-ext/supercollider-vscode-0.1.0.vsix
```

## What Gets Created

A file named: `supercollider-vscode-0.1.0.vsix`

This is your complete extension package that includes:
- ✅ Compiled JavaScript (from TypeScript)
- ✅ Syntax files
- ✅ README and documentation
- ✅ Dependencies
- ✅ Extension manifest

## What to Do With the .vsix File

### Test It Locally

**In VS Code:**
```bash
code --install-extension supercollider-vscode-0.1.0.vsix
```

**In Cursor:**
```bash
cursor --install-extension supercollider-vscode-0.1.0.vsix
```

Or manually:
1. Open VS Code/Cursor
2. Go to Extensions (Cmd+Shift+X)
3. Click `...` menu (top right)
4. Select "Install from VSIX..."
5. Choose your `.vsix` file

### Publish It

**Cursor Marketplace:**
1. Go to https://www.cursor.com/marketplace
2. Sign in with GitHub
3. Upload your `.vsix` file

**Open VSX:**
```bash
ovsx publish supercollider-vscode-0.1.0.vsix
```

**GitHub Release:**
1. Create a release on GitHub
2. Upload the `.vsix` as an attachment

### Share It Directly

Send the `.vsix` file to others:
- Via email
- On your website
- In SuperCollider forums
- Direct download link

## Common Commands

```bash
# Package extension
vsce package

# Package and auto-increment patch version (0.1.0 → 0.1.1)
vsce package --patch

# Package and auto-increment minor version (0.1.0 → 0.2.0)
vsce package --minor

# Package and auto-increment major version (0.1.0 → 1.0.0)
vsce package --major

# See what files will be included
vsce ls

# See file tree that will be packaged
vsce ls --tree

# Package without compiling (if already compiled)
vsce package --no-dependencies
```

## Before Packaging

Make sure to:

1. **Compile TypeScript:**
   ```bash
   npm run compile
   ```

2. **Test your extension:**
   - Press F5 in VS Code to test
   - Or run: `npm test`

3. **Update version in package.json** (if releasing new version):
   ```json
   {
     "version": "0.1.0"  // Change this
   }
   ```

4. **Update CHANGELOG.md** with your changes

## Reducing Package Size

The warning mentions the package has 570 files. To optimize:

### Option 1: Update .vscodeignore

Edit `.vscodeignore` to exclude more files:

```
.vscode/**
.vscode-test/**
src/**
.gitignore
.eslintrc.json
**/*.map
**/*.ts
tsconfig.json
scripts/**
docs/**
*.md
!README.md
!CHANGELOG.md
!LICENSE
node_modules/**/test/**
node_modules/**/tests/**
node_modules/**/*.md
```

Then repackage:
```bash
vsce package
```

### Option 2: Bundle with webpack (Advanced)

For smaller, faster extensions, bundle all JavaScript into one file:

1. Install webpack:
   ```bash
   npm install --save-dev webpack webpack-cli ts-loader
   ```

2. Create `webpack.config.js`
3. Update build scripts
4. Repackage

(See VS Code docs for full bundling guide)

## Troubleshooting

### Error: "Cannot find module"

**Solution:** Run compile first:
```bash
npm run compile
vsce package
```

### Warning: "Extension too large"

**Solution:** Update `.vscodeignore` to exclude test files and docs

### Error: "No README.md found"

**Solution:** Ensure you have a README.md in the root directory

### Error: "Publisher is required"

**Solution:** Add publisher to package.json:
```json
{
  "publisher": "your-publisher-id"
}
```

## File Location

The `.vsix` file is created in your project root:

```
/Users/dar/repos/sc-ext/
├── supercollider-vscode-0.1.0.vsix  ← Here!
├── src/
├── out/
├── package.json
└── ...
```

## Version Control

**Don't commit .vsix files to git!**

They're already in `.gitignore`, but if not:

```bash
echo "*.vsix" >> .gitignore
git add .gitignore
git commit -m "Ignore .vsix files"
```

Instead, create GitHub Releases and attach the `.vsix` there.

## Automation

You can automate packaging in CI/CD:

```yaml
# .github/workflows/package.yml
name: Package Extension

on:
  push:
    tags:
      - 'v*'

jobs:
  package:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run compile
      - run: npm install -g @vscode/vsce
      - run: vsce package
      - uses: actions/upload-artifact@v3
        with:
          name: vsix
          path: "*.vsix"
```

## Summary

**To create .vsix:**
```bash
npm install -g @vscode/vsce  # One time
vsce package                  # Every time you want to package
```

**Your file is ready:**
```
✅ supercollider-vscode-0.1.0.vsix
```

**Now you can:**
- ✅ Test it locally
- ✅ Upload to Cursor Marketplace  
- ✅ Publish to Open VSX
- ✅ Share directly
- ✅ Attach to GitHub releases

That's it! 🎉

