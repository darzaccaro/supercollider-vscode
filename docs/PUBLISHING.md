# Publishing the SuperCollider Extension

## Publishing to VS Code AND Cursor

This guide covers publishing to both:
- 📘 **VS Code Marketplace** (Visual Studio Code)
- 🟦 **Cursor Marketplace** (Cursor IDE)

## Prerequisites

### For VS Code Marketplace

1. ✅ A Microsoft/Azure account
2. ✅ A Visual Studio Marketplace publisher account
3. ✅ A Personal Access Token (PAT)
4. ✅ The `vsce` CLI tool installed

### For Cursor Marketplace

1. ✅ A GitHub account
2. ✅ Your extension published on VS Code Marketplace OR
3. ✅ A `.vsix` file to upload directly

## Step 1: Install vsce (VS Code Extension Manager)

```bash
npm install -g @vscode/vsce
```

Verify installation:
```bash
vsce --version
```

## Step 2: Create a Publisher Account

### 2.1 Sign in to Visual Studio Marketplace

1. Go to https://marketplace.visualstudio.com/
2. Click "Sign In" (top right)
3. Sign in with your Microsoft account

### 2.2 Create a Publisher

1. Go to https://marketplace.visualstudio.com/manage
2. Click "Create Publisher"
3. Fill in the form:
   - **Publisher Name**: Choose a unique ID (e.g., `darzaccaro` or `supercollider-vscode`)
   - **Display Name**: What users see (e.g., "Dar Zaccaro")
   - **Email**: Your contact email
4. Click "Create"

**Important**: Remember your Publisher ID - you'll need it in `package.json`!

## Step 3: Create a Personal Access Token (PAT)

### 3.1 Create Azure DevOps Organization (if needed)

1. Go to https://dev.azure.com
2. Sign in with your Microsoft account
3. Create a new organization (or use existing)

### 3.2 Generate Personal Access Token

1. In Azure DevOps, click your profile icon (top right)
2. Click "Personal access tokens"
3. Click "+ New Token"
4. Configure the token:
   - **Name**: "vsce" or "VS Code Extension Publishing"
   - **Organization**: Your organization
   - **Expiration**: Choose duration (90 days, 1 year, or custom)
   - **Scopes**: Select "Custom defined"
   - Click "Show all scopes"
   - Find and check **Marketplace > Manage** (this gives publish rights)
5. Click "Create"
6. **IMPORTANT**: Copy the token immediately! You won't see it again.

Save this token securely (e.g., in a password manager).

## Step 4: Update package.json

Update the `publisher` field in `package.json`:

```json
{
  "name": "supercollider-vscode",
  "displayName": "SuperCollider",
  "description": "SuperCollider language support with LSP and server control",
  "version": "0.1.0",
  "publisher": "YOUR_PUBLISHER_ID",  // ← Change this!
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/sc-ext.git"  // ← Add your repo
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/sc-ext/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/sc-ext#readme",
  "icon": "icon.png",  // ← Optional: Add a 128x128 icon
  // ... rest of the file
}
```

## Step 5: Prepare Your Extension

### 5.1 Add Important Files

Create a `.vscodeignore` file (if not exists) to exclude development files:

```
.vscode/**
.vscode-test/**
src/**
.gitignore
.yarnrc
vsc-extension-quickstart.md
**/tsconfig.json
**/.eslintrc.json
**/*.map
**/*.ts
node_modules/**
.github/**
scripts/**
docs/**
*.md
!README.md
!CHANGELOG.md
!LICENSE
```

### 5.2 Create an Icon (Optional but Recommended)

Create a 128x128 PNG icon named `icon.png` in the root directory.

### 5.3 Update README.md

Make sure your README has:
- Clear description
- Installation instructions
- Usage examples
- Screenshots (if possible)
- Requirements
- License information

### 5.4 Create CHANGELOG.md

Document your release history:

```markdown
# Change Log

## [0.1.0] - 2025-01-XX

### Added
- Initial release
- Syntax highlighting for .sc and .scd files
- Code evaluation with Cmd+Enter
- Smart block evaluation
- Help system integration (Cmd+D)
- Server control commands
- OSC communication with sclang
- Status bar integration

### Features
- 80+ automated tests
- CI/CD ready
- Comprehensive documentation
```

## Step 6: Package the Extension

Test packaging locally first:

```bash
vsce package
```

This creates a `.vsix` file (e.g., `supercollider-vscode-0.1.0.vsix`).

### Test the Package

Install it locally to test:

```bash
code --install-extension supercollider-vscode-0.1.0.vsix
```

Test thoroughly, then uninstall:

```bash
code --uninstall-extension YOUR_PUBLISHER_ID.supercollider-vscode
```

## Step 7: Publish the Extension

### 7.1 Login with vsce

```bash
vsce login YOUR_PUBLISHER_ID
```

Enter your Personal Access Token when prompted.

### 7.2 Publish

```bash
vsce publish
```

This will:
1. ✅ Package your extension
2. ✅ Validate all files
3. ✅ Upload to the marketplace
4. ✅ Make it available to users

**Alternative**: Publish with version bump:

```bash
vsce publish minor  # 0.1.0 → 0.2.0
vsce publish patch  # 0.1.0 → 0.1.1
vsce publish major  # 0.1.0 → 1.0.0
```

## Step 8: Verify Publication

1. Go to https://marketplace.visualstudio.com/
2. Search for your extension
3. Or visit: `https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER_ID.supercollider-vscode`

The extension should appear within a few minutes!

## Updating Your Extension

### Update Version

Edit `package.json`:

```json
{
  "version": "0.2.0"  // Increment version
}
```

### Update CHANGELOG.md

Document changes:

```markdown
## [0.2.0] - 2025-01-XX

### Added
- New feature X
- Improvement Y

### Fixed
- Bug Z
```

### Publish Update

```bash
vsce publish
```

Or with automatic version bump:

```bash
vsce publish patch  # For bug fixes
vsce publish minor  # For new features
vsce publish major  # For breaking changes
```

## Best Practices

### Before Publishing

- ✅ Test thoroughly
- ✅ Update documentation
- ✅ Add screenshots/GIFs to README
- ✅ Run linter: `npm run lint`
- ✅ Run tests: `npm test`
- ✅ Check all links work
- ✅ Verify license is correct

### After Publishing

- 📢 Announce on social media
- 📢 Share with SuperCollider community
- 📢 Add to SuperCollider wiki/resources
- 📊 Monitor feedback and issues
- 🐛 Fix bugs promptly
- 📝 Keep documentation updated

## Common Issues

### Issue: "Publisher not found"

**Solution**: Make sure you created the publisher at https://marketplace.visualstudio.com/manage

### Issue: "Personal Access Token expired"

**Solution**: Create a new token in Azure DevOps and login again:
```bash
vsce login YOUR_PUBLISHER_ID
```

### Issue: "Extension name already taken"

**Solution**: Change the `name` field in `package.json` to something unique

### Issue: "Package too large"

**Solution**: Check `.vscodeignore` excludes:
- `node_modules/` (except production dependencies)
- `src/**` (source files, only include `out/**`)
- Test files
- Documentation

## Security Notes

### Protect Your PAT

- ❌ Never commit PAT to git
- ❌ Never share PAT publicly
- ✅ Store in password manager
- ✅ Use environment variables in CI/CD
- ✅ Regenerate if compromised

### For CI/CD Publishing

Set PAT as GitHub secret:

```yaml
# .github/workflows/publish.yml
name: Publish Extension

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run compile
      - run: npm install -g @vscode/vsce
      - run: vsce publish -p ${{ secrets.VSCE_PAT }}
```

## Maintenance

### Regular Updates

- Release bug fixes promptly
- Add requested features
- Keep dependencies updated
- Monitor VS Code API changes
- Test with new VS Code versions

### Version Numbers (Semantic Versioning)

- **Patch** (0.1.1): Bug fixes, small improvements
- **Minor** (0.2.0): New features, backward compatible
- **Major** (1.0.0): Breaking changes

## Resources

- **VS Code Extension Publishing**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- **vsce Documentation**: https://github.com/microsoft/vscode-vsce
- **Marketplace Management**: https://marketplace.visualstudio.com/manage
- **Azure DevOps**: https://dev.azure.com

## Quick Reference

```bash
# Install vsce
npm install -g @vscode/vsce

# Login
vsce login YOUR_PUBLISHER_ID

# Package locally
vsce package

# Test installation
code --install-extension supercollider-vscode-0.1.0.vsix

# Publish
vsce publish

# Publish with version bump
vsce publish patch   # Bug fixes
vsce publish minor   # New features
vsce publish major   # Breaking changes

# Unpublish (use with caution!)
vsce unpublish YOUR_PUBLISHER_ID.supercollider-vscode
```

---

# Publishing to Cursor Marketplace

Cursor is a popular AI-powered code editor based on VS Code. It has its own marketplace but also supports VS Code extensions.

## Option 1: Automatic Sync from VS Code Marketplace (Recommended)

Cursor automatically syncs popular extensions from the VS Code Marketplace. Once you publish to VS Code:

1. **Publish to VS Code first** (follow steps above)
2. **Wait 24-48 hours** for Cursor to automatically sync
3. **Your extension appears in Cursor** - no extra work!

This is the easiest method and keeps both marketplaces in sync automatically.

## Option 2: Direct Submission to Cursor

If you want to publish to Cursor directly or need faster availability:

### Step 1: Prepare Your Extension

Same as VS Code preparation - create a `.vsix` file:

```bash
vsce package
```

### Step 2: Submit to Cursor Marketplace

1. **Visit Cursor Extension Marketplace**: https://cursor.directory/
2. **Sign in with GitHub**
3. **Click "Submit Extension"** or "Publish Extension"
4. **Fill in the form**:
   - Extension name
   - Description
   - Category (Programming Languages)
   - Upload `.vsix` file OR provide VS Code Marketplace link
   - Add screenshots/demo GIFs
   - Link to GitHub repository

5. **Submit for review**

The Cursor team will review your submission (usually 1-3 days).

### Step 3: Alternative - Direct Installation Link

You can also share your extension for Cursor users via direct `.vsix` file:

```bash
# Users can install in Cursor with:
cursor --install-extension supercollider-vscode-0.1.0.vsix
```

## Option 3: Open VSX Registry (Universal)

**Open VSX** is an open-source alternative registry that works with VS Code, Cursor, and other editors.

### Publish to Open VSX

1. **Create an account**: https://open-vsx.org/
2. **Get an access token**: https://open-vsx.org/user-settings/tokens
3. **Install ovsx CLI**:
   ```bash
   npm install -g ovsx
   ```

4. **Login**:
   ```bash
   ovsx login
   ```

5. **Publish**:
   ```bash
   ovsx publish
   ```

Your extension will now be available on Open VSX, which Cursor and other editors can use!

## Recommended Publishing Strategy

For maximum reach, publish to all three:

```bash
# 1. Publish to VS Code Marketplace
vsce publish

# 2. Publish to Open VSX Registry
ovsx publish

# 3. Wait for automatic Cursor sync OR submit directly to Cursor
```

### Publishing Workflow

```mermaid
VS Code Marketplace
    ↓
    ├─→ Automatically syncs to Cursor (24-48h)
    └─→ Available to VS Code users immediately

Open VSX Registry
    ↓
    └─→ Available to Cursor, VS Code, and other editors

Direct Cursor Submission
    ↓
    └─→ Available to Cursor users immediately
```

## Verification

### Verify on VS Code
1. Open VS Code
2. Go to Extensions (Cmd+Shift+X)
3. Search for "SuperCollider"
4. Your extension should appear!

### Verify on Cursor
1. Open Cursor
2. Go to Extensions (Cmd+Shift+X)
3. Search for "SuperCollider"
4. Your extension should appear!

Or visit:
- VS Code: `https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.supercollider-vscode`
- Cursor: `https://cursor.directory/extensions/YOUR_PUBLISHER.supercollider-vscode`
- Open VSX: `https://open-vsx.org/extension/YOUR_PUBLISHER/supercollider-vscode`

## Update Both Platforms

When you release an update:

```bash
# Update version in package.json, then:

# 1. Publish to VS Code
vsce publish

# 2. Publish to Open VSX
ovsx publish

# 3. Cursor auto-updates within 24-48h
#    OR manually submit new .vsix to Cursor
```

## Platform-Specific Considerations

### VS Code
- ✅ Largest user base
- ✅ Automatic updates
- ✅ Built-in analytics
- ⚠️ Requires Microsoft account

### Cursor
- ✅ AI-powered features
- ✅ Growing community
- ✅ Syncs from VS Code automatically
- ⚠️ Smaller marketplace (for now)

### Open VSX
- ✅ Open source
- ✅ No corporate dependency
- ✅ Works with multiple editors
- ⚠️ Smaller user base than VS Code

## Installation Commands

Users can install your extension in different ways:

### VS Code
```bash
# From marketplace
code --install-extension YOUR_PUBLISHER.supercollider-vscode

# From .vsix file
code --install-extension supercollider-vscode-0.1.0.vsix
```

### Cursor
```bash
# From marketplace
cursor --install-extension YOUR_PUBLISHER.supercollider-vscode

# From .vsix file
cursor --install-extension supercollider-vscode-0.1.0.vsix
```

## Marketing Your Extension

### Announce on Multiple Channels

1. **SuperCollider Community**
   - SuperCollider mailing list
   - SuperCollider forum
   - sccode.org

2. **VS Code Community**
   - Twitter/X with #vscode hashtag
   - Reddit r/vscode

3. **Cursor Community**
   - Cursor Discord
   - Cursor community forums
   - Twitter/X with #cursor hashtag

4. **GitHub**
   - Add badges to README
   - Create a release
   - Share on GitHub Discussions

### Add Badges to README

```markdown
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/YOUR_PUBLISHER.supercollider-vscode)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.supercollider-vscode)
[![Cursor Directory](https://img.shields.io/badge/Cursor-Directory-blue)](https://cursor.directory/extensions/YOUR_PUBLISHER.supercollider-vscode)
[![Open VSX](https://img.shields.io/open-vsx/v/YOUR_PUBLISHER/supercollider-vscode)](https://open-vsx.org/extension/YOUR_PUBLISHER/supercollider-vscode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## Congratulations! 🎉

Once published to both platforms, your extension will be:
- ✅ Searchable in VS Code Extensions marketplace
- ✅ Searchable in Cursor Extensions marketplace  
- ✅ Available on Open VSX (optional)
- ✅ Installable with one click in both editors
- ✅ Auto-updated for all users
- ✅ Available to the global SuperCollider community on both platforms!

---

**Good luck with your extension! The SuperCollider community will love it in both VS Code AND Cursor! 🎵**

