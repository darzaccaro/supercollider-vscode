# Publishing Without Microsoft Account

## Alternative Publishing Routes

You can publish your extension without a Microsoft account using these platforms:

1. 🟦 **Cursor Marketplace** (Direct submission)
2. 🌐 **Open VSX Registry** (Open source)
3. 📦 **GitHub Releases** (Direct distribution)

## Option 1: Cursor Marketplace (Recommended)

Cursor allows direct extension submissions without requiring VS Code Marketplace.

### Step 1: Package Your Extension

```bash
# Install vsce (one-time)
npm install -g @vscode/vsce

# Package your extension
vsce package
```

This creates: `supercollider-vscode-0.1.0.vsix`

### Step 2: Submit to Cursor

1. **Visit Cursor Directory**: https://www.cursor.com/marketplace
   - Alternative: https://cursor.directory/

2. **Sign in with GitHub** (no Microsoft account needed!)

3. **Submit Extension**:
   - Click "Submit Extension" or "Publish"
   - Fill out the form:
     - **Name**: SuperCollider
     - **Description**: SuperCollider language support with LSP and server control
     - **Category**: Programming Languages
     - **Upload**: Your `.vsix` file
     - **Repository**: Link to your GitHub repo
     - **Screenshots**: Add demo images/GIFs (optional but recommended)

4. **Submit for Review**
   - Cursor team reviews (usually 1-3 days)
   - You'll get an email when approved

5. **Your extension goes live!**
   - Searchable in Cursor Extensions
   - One-click install for users

### Benefits
- ✅ No Microsoft account needed
- ✅ No Azure DevOps setup
- ✅ Direct submission process
- ✅ Growing AI-powered editor community

## Option 2: Open VSX Registry

Open VSX is a vendor-neutral, open-source extension registry.

### Step 1: Create Open VSX Account

1. Go to https://open-vsx.org/
2. Click "Sign Up" (top right)
3. Sign in with **GitHub** (no Microsoft needed!)
4. Complete profile

### Step 2: Create Namespace

1. Go to https://open-vsx.org/user-settings/namespaces
2. Click "Create Namespace"
3. Enter a name (e.g., "darzaccaro" or "supercollider-vscode")
4. Submit

### Step 3: Generate Access Token

1. Go to https://open-vsx.org/user-settings/tokens
2. Click "Create Access Token"
3. Give it a name (e.g., "Publishing Token")
4. Copy the token (save it securely!)

### Step 4: Install ovsx CLI

```bash
npm install -g ovsx
```

### Step 5: Publish

```bash
# Login with your token
ovsx login

# Or use token directly
export OVSX_PAT=your_token_here

# Publish
ovsx publish

# Or publish specific file
ovsx publish supercollider-vscode-0.1.0.vsix
```

Your extension is now live on Open VSX!

### Benefits
- ✅ No Microsoft account needed
- ✅ Open source and vendor-neutral
- ✅ Works with Cursor, VSCodium, Theia, and more
- ✅ Simple CLI publishing
- ✅ Automatic from GitHub Actions (optional)

## Option 3: GitHub Releases (Direct Distribution)

Share your extension directly via GitHub.

### Step 1: Create GitHub Release

```bash
# Tag your version
git tag v0.1.0
git push origin v0.1.0
```

### Step 2: Create Release on GitHub

1. Go to your repo on GitHub
2. Click "Releases" → "Create a new release"
3. Choose your tag (v0.1.0)
4. Add release notes (copy from CHANGELOG.md)
5. **Upload** your `.vsix` file as an attachment
6. Click "Publish release"

### Step 3: Share Installation Instructions

Add to your README:

```markdown
## Installation from GitHub Release

1. Download the latest `.vsix` file from [Releases](https://github.com/yourusername/sc-ext/releases)
2. Open VS Code or Cursor
3. Go to Extensions (Cmd+Shift+X)
4. Click `...` menu → "Install from VSIX..."
5. Select the downloaded file
```

### Benefits
- ✅ No accounts needed (except GitHub)
- ✅ Full control over distribution
- ✅ Direct downloads
- ✅ Works immediately

## Recommended Strategy (No Microsoft)

### For Maximum Reach:

```bash
# 1. Package extension
vsce package

# 2. Publish to Open VSX (vendor-neutral)
ovsx publish

# 3. Submit to Cursor Marketplace
# Visit cursor.com/marketplace and upload .vsix

# 4. Create GitHub Release
git tag v0.1.0
git push origin v0.1.0
# Then upload .vsix to GitHub release
```

This gives you:
- ✅ Open VSX users (Cursor, VSCodium, Theia, etc.)
- ✅ Direct Cursor marketplace presence
- ✅ GitHub users can download directly

## Comparison: Publishing Options

| Platform | Account Needed | Review Time | User Base | Auto-Updates |
|----------|---------------|-------------|-----------|--------------|
| **VS Code Marketplace** | Microsoft | None | Largest | ✅ |
| **Cursor Marketplace** | GitHub | 1-3 days | Growing | ✅ |
| **Open VSX** | GitHub | None | Medium | ✅ |
| **GitHub Releases** | GitHub | None | Direct | ❌ |

## Automated Publishing (GitHub Actions)

You can automate publishing to Open VSX and GitHub Releases:

### .github/workflows/publish.yml

```yaml
name: Publish Extension

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Compile
        run: npm run compile
      
      - name: Package extension
        run: |
          npm install -g @vscode/vsce
          vsce package
      
      - name: Publish to Open VSX
        run: |
          npm install -g ovsx
          ovsx publish -p ${{ secrets.OVSX_PAT }}
      
      - name: Upload VSIX to Release
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ github.event.release.upload_url }}
          asset_path: ./supercollider-vscode-0.1.0.vsix
          asset_name: supercollider-vscode-0.1.0.vsix
          asset_content_type: application/octet-stream
```

Then add your Open VSX token to GitHub Secrets:
1. Go to GitHub repo → Settings → Secrets
2. Add secret: `OVSX_PAT` = your Open VSX token

## Step-by-Step: Publishing to Cursor Only

If you just want Cursor for now:

### 1. Package
```bash
vsce package
```

### 2. Go to Cursor Marketplace
Visit: https://www.cursor.com/marketplace (or https://cursor.directory/)

### 3. Sign in with GitHub
Click "Sign In" → Use GitHub OAuth

### 4. Submit Extension
- Click "Submit" or "Add Extension"
- Upload your `.vsix` file
- Fill in details:
  - Name: SuperCollider
  - Description: SuperCollider language support with LSP and server control
  - Category: Programming Languages
  - Repository: https://github.com/yourusername/sc-ext
  - Add screenshots if you have them

### 5. Wait for Approval
Usually 1-3 days. You'll get an email.

### 6. Live!
Your extension appears in Cursor Extensions marketplace.

## Users Can Install From:

### Open VSX
```bash
# In Cursor or compatible editors
code --install-extension darzaccaro.supercollider-vscode
# Uses Open VSX registry automatically in some editors
```

### Direct VSIX
```bash
# Download .vsix from GitHub or your website
cursor --install-extension supercollider-vscode-0.1.0.vsix
```

### Cursor Marketplace
Once approved, users just:
1. Open Cursor
2. Go to Extensions (Cmd+Shift+X)
3. Search "SuperCollider"
4. Click Install!

## Marketing Without VS Code Marketplace

### Announce on:

1. **SuperCollider Community**
   - SuperCollider mailing list
   - SuperCollider forum
   - sccode.org

2. **Cursor Community**
   - Cursor Discord: https://discord.gg/cursor
   - Cursor subreddit: r/cursor
   - Twitter/X: #cursor hashtag

3. **Open VSX Community**
   - Open VSX discussions
   - VSCodium community
   - Eclipse Theia community

4. **GitHub**
   - Create detailed release notes
   - Share in relevant communities
   - Add badges to README

### Add Badges (No Microsoft)

```markdown
[![Open VSX](https://img.shields.io/open-vsx/v/darzaccaro/supercollider-vscode)](https://open-vsx.org/extension/darzaccaro/supercollider-vscode)
[![Cursor Directory](https://img.shields.io/badge/Cursor-Directory-blue)](https://cursor.directory/extensions/supercollider)
[![GitHub Release](https://img.shields.io/github/v/release/yourusername/sc-ext)](https://github.com/yourusername/sc-ext/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
```

## Advantages of This Approach

### No Microsoft Lock-in
- ✅ Publish without Microsoft account
- ✅ Publish without Azure DevOps
- ✅ Open source friendly
- ✅ Vendor-neutral

### Still Reach Users
- ✅ Cursor users (growing community)
- ✅ Open VSX users (multiple editors)
- ✅ Direct downloads from GitHub
- ✅ Can add VS Code later if you want

### Simple Process
- ✅ Just GitHub account needed
- ✅ One-time setup
- ✅ Easy automation
- ✅ Full control

## You Can Always Add VS Code Later

Once you fix Microsoft account issues:
```bash
# When ready, add VS Code Marketplace
vsce login your-publisher-id
vsce publish
```

Your extension continues working on all other platforms!

## Summary: Easiest Path Without Microsoft

```bash
# 1. Package (one time)
npm install -g @vscode/vsce
vsce package

# 2. Upload to Cursor
# Go to cursor.com/marketplace
# Sign in with GitHub
# Upload .vsix file

# Done! Your extension is live on Cursor!
```

Optional bonus:
```bash
# Also publish to Open VSX (5 minutes)
npm install -g ovsx
ovsx login
ovsx publish
```

---

**You don't need Microsoft to share your extension with the world! 🎉**

