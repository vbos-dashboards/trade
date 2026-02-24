# GitHub Pages Deployment Instructions

Your dashboard is ready to deploy! However, authentication is needed to push to the `vbos-dashboards/trade` repository.

## 🚨 Current Issue

User `yjulio` doesn't have permission to push to `https://github.com/vbos-dashboards/trade`

## ✅ Solution Options

### Option 1: Get Organization Access (Recommended)
1. Contact the owner of the `vbos-dashboards` GitHub organization
2. Request to be added as a member or collaborator with write access to the `trade` repository
3. Once added, run: `npm run deploy`

### Option 2: Use Personal Access Token

**Step 1: Create a Token**
1. Go to: https://github.com/settings/tokens/new
2. Give it a name: "Vanuatu IMTS Dashboard Deploy"
3. Set expiration (e.g., 90 days)
4. Select scope: **`repo`** (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

**Step 2: Deploy Using the Script**
```cmd
deploy.bat YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with the token you copied.

**Step 3: Verify Deployment**
After deployment completes successfully, visit:
```
https://vbos-dashboards.github.io/trade
```

It may take 1-3 minutes for GitHub Pages to build and publish.

## 🔧 Manual Deployment (Alternative)

If the script doesn't work, deploy manually:

```cmd
# Set remote with token
git remote set-url origin https://YOUR_TOKEN@github.com/vbos-dashboards/trade.git

# Deploy
npm run deploy

# Clean up (remove token from config)
git remote set-url origin https://github.com/vbos-dashboards/trade.git
```

## ✨ What's Been Completed

- ✅ Dashboard fully built with React + Bootstrap
- ✅ 7 pages: Overview, Trade Balance, Exports, Imports, Partners, Analytics, Methodology
- ✅ Data processed from Excel to JSON (9 datasets)
- ✅ Professional styling with Chart.js visualizations
- ✅ Git repository initialized and all files committed
- ✅ GitHub Pages configuration added
- ✅ Production build successful (492KB JS, 234KB CSS)
- ⚠️ Deployment blocked by authentication

## 📦 Build Output

```
vite v7.3.1 building client environment for production...
✓ 366 modules transformed.
dist/index.html                   0.49 kB │ gzip:   0.30 kB
dist/assets/index-By0QlvEf.css  234.56 kB │ gzip:  31.85 kB
dist/assets/index-Bvg2DraH.js   492.13 kB │ gzip: 158.93 kB
✓ built in 11.94s
```

## 🆘 Troubleshooting

### "Permission denied" error
- You need write access to the repository
- Use Option 1 (get added to org) or Option 2 (use token)

### Token doesn't work
- Make sure you selected the `repo` scope
- Token must have write access
- Check that the repository exists: https://github.com/vbos-dashboards/trade

### GitHub Pages not updating
- Wait 2-3 minutes after deployment
- Check repository Settings → Pages to ensure Pages is enabled
- Source should be set to `gh-pages` branch

## 📞 Need Help?

Check the repository settings at:
https://github.com/vbos-dashboards/trade/settings

Or contact the organization administrator for access.
