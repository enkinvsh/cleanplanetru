# Icon Generation Guide

## Required Icons for PWA

### 1. Standard Icons
- **icon-192.png** (192x192px) - Standard app icon
- **icon-512.png** (512x512px) - High-resolution icon
- **icon-maskable-512.png** (512x512px) - Maskable icon for Android

### 2. Apple Touch Icon
- **apple-touch-icon.png** (180x180px) - iOS home screen icon

### 3. Favicon
- **favicon.ico** (32x32px) - Browser tab icon

---

## Design Specifications

### Logo Design
**Primary Element:** Leaf icon 🌿 (Lucide React `Leaf` component)
**Colors:**
- Background: Linear gradient `#10B981` → `#059669` (emerald)
- Icon: White `#FFFFFF`
- Border radius: 20-25% of size

### Style
- Modern, clean design
- Glassmorphism effect (optional)
- Shadow: `0 10px 40px rgba(16, 185, 129, 0.3)`

---

## Quick Generation Methods

### Option 1: Online Generator (Easiest)
1. Go to [https://www.pwabuilder.com/imageGenerator](https://www.pwabuilder.com/imageGenerator)
2. Upload a 512x512 base image
3. Download all generated sizes
4. Place in `/services/frontend/public/`

### Option 2: Figma/Sketch
1. Create 512x512 artboard
2. Add emerald gradient background
3. Add white leaf icon (centered)
4. Export as PNG at 1x, 2x, 3x
5. Resize to required dimensions

### Option 3: ImageMagick (Command Line)
```bash
# Install ImageMagick
brew install imagemagick

# Create base 512x512 icon (you'll need a source image)
convert source.png -resize 512x512 icon-512.png

# Generate other sizes
convert icon-512.png -resize 192x192 icon-192.png
convert icon-512.png -resize 180x180 apple-touch-icon.png
convert icon-512.png -resize 32x32 favicon.ico

# Create maskable version (add padding)
convert icon-512.png -gravity center -extent 640x640 -resize 512x512 icon-maskable-512.png
```

### Option 4: Canva (Free)
1. Create 512x512 design
2. Add emerald gradient background
3. Add leaf icon from Canva library
4. Download as PNG
5. Use online resizer for other sizes

---

## Temporary Placeholder

Until you generate proper icons, you can use a simple colored square:

```bash
# Create temporary placeholder (emerald square)
convert -size 512x512 xc:"#10B981" icon-512.png
convert -size 192x192 xc:"#10B981" icon-192.png
convert -size 180x180 xc:"#10B981" apple-touch-icon.png
```

---

## File Placement

```
services/frontend/public/
├── icon-192.png
├── icon-512.png
├── icon-maskable-512.png
├── apple-touch-icon.png
└── favicon.ico
```

---

## Testing Icons

### Browser
1. Open https://clean.meybz.asia
2. Open DevTools → Application → Manifest
3. Check "Icons" section
4. Verify all icons load correctly

### Mobile
1. Open site on mobile device
2. Tap "Add to Home Screen"
3. Verify icon appears correctly
4. Check installed app icon

---

## Recommended Tool

**PWA Builder Image Generator**
- URL: https://www.pwabuilder.com/imageGenerator
- Upload one 512x512 image
- Downloads all required sizes
- Includes maskable versions
- **FREE**

---

## Notes for Developer

- Icons are referenced in `manifest.json`
- Maskable icons have safe zone (80% of canvas)
- Apple touch icon is referenced in `layout.tsx`
- Test on both Android and iOS
- Lighthouse will warn if icons are missing
