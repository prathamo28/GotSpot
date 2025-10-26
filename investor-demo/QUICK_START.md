# ⚡ GotSpot Investor Demo - Quick Start

Get your demo running locally in 5 minutes!

---

## 📋 Requirements

- **Node.js** 16 or higher
- **npm** (comes with Node.js)
- **Git** (optional)

**Don't have Node.js?** Download: https://nodejs.org

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
# Navigate to investor-demo folder
cd investor-demo

# Install all packages
npm install
```

This will take 2-3 minutes ⏱️

---

### Step 2: Run the App

```bash
# Start development server
npm start
```

The app will automatically open in your browser at:
**http://localhost:3000**

---

### Step 3: Login

Use demo credentials:
- **Email**: `demo@gotspot.com`
- **Password**: `gotspot2025`

---

## 🎯 What You'll See

1. **Login Page** - Professional login interface
2. **City Selection** - Choose from 20 Polish cities
3. **Map View** - Interactive map with search

---

## 🛠️ Available Scripts

### Development

```bash
npm start
```
Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
```
Creates optimized production build in `build/` folder.

### Testing

```bash
npm test
```
Runs test suite (if tests are added).

---

## 📁 Project Structure

```
investor-demo/
├── public/              # Static files
│   ├── index.html      # HTML template
│   ├── manifest.json   # PWA manifest
│   └── robots.txt      # SEO
├── src/
│   ├── components/     # React components
│   │   ├── LoginForm.tsx
│   │   ├── CitySelect.tsx
│   │   └── CityMapPage.tsx
│   ├── data/           # City data
│   │   └── cities.ts
│   ├── App.tsx         # Main app component
│   ├── App.css         # App styles
│   └── index.tsx       # Entry point
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
└── vercel.json         # Vercel config
```

---

## 🎨 Customization

### Update Demo Credentials

Edit `src/App.tsx`:

```typescript
const handleLogin = (email: string, password: string) => {
  if (email === 'YOUR_EMAIL' && password === 'YOUR_PASSWORD') {
    // ...
  }
};
```

### Change Branding

Edit `src/components/LoginForm.tsx`:

```typescript
<h1>YourBrand</h1>
<p>Your tagline here</p>
```

### Add More Cities

Edit `src/data/cities.ts`:

```typescript
export const POLISH_CITIES = {
  'NewCity': { name: 'NewCity', lat: 52.52, lng: 13.405 },
  // ...
};
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm start
```

### Module Not Found

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Map Not Loading

1. Check internet connection
2. Open browser console (F12)
3. Look for errors
4. Clear browser cache

---

## 📱 Mobile Testing

### Test on Your Phone

1. Find your computer's IP:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Start app:
   ```bash
   npm start
   ```

3. On phone, visit:
   ```
   http://YOUR_IP:3000
   ```
   Example: `http://192.168.1.100:3000`

---

## 🚀 Deploy to Vercel

See **DEPLOY_TO_VERCEL.md** for detailed instructions.

Quick deploy:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## 📚 Learn More

### Documentation
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Leaflet**: https://leafletjs.com

### Tutorials
- **React Tutorial**: https://react.dev/learn
- **TypeScript Basics**: https://www.typescriptlang.org/docs/handbook/intro.html

---

## 🎯 Next Steps

1. ✅ Run the demo locally
2. ✅ Test all features
3. ✅ Customize branding
4. ✅ Deploy to Vercel
5. ✅ Share with investors

---

## 📞 Need Help?

**Issues?** Check:
- Browser console (F12)
- Terminal output
- Node.js version (`node --version`)

**Questions?** Contact:
- Email: founder@gotspot.com
- GitHub Issues: [Your repo]

---

**Happy coding! 🚀**

*© 2025 GotSpot. All rights reserved.*

