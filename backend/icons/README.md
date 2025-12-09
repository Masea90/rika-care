# RIKA Care PWA Icons

## Icon Requirements

For a fully functional PWA, you need icons in the following sizes:
- 72x72px
- 96x96px
- 128x128px
- 144x144px
- 152x152px
- 192x192px (required for Android)
- 384x384px
- 512x512px (required for Android splash screen)

## Temporary Placeholder Icons

Currently using SVG placeholders. For production, please:

1. **Design your app icon** with:
   - RIKA brand colors (#C4A484, #FFF9F5)
   - Clear, recognizable symbol (leaf, flower, beauty-related)
   - Works well at small sizes

2. **Generate all sizes** using:
   - Online tool: https://www.pwabuilder.com/imageGenerator
   - OR Figma/Photoshop export at different sizes
   - OR use ImageMagick:
   ```bash
   convert icon-512x512.png -resize 192x192 icon-192x192.png
   convert icon-512x512.png -resize 144x144 icon-144x144.png
   # etc.
   ```

3. **Replace the SVG files** in this directory with PNG files

## Maskable Icons

For Android adaptive icons, icons at 192x192 and 512x512 should be "maskable":
- Add 10% safe zone padding around important content
- Ensure no text/logos get cut off when masked

## Icon Design Tips

✅ Use high contrast colors
✅ Simple, clear design
✅ Test at small sizes (favicon)
✅ Include brand elements
✅ Make it distinctive

❌ Don't use gradients excessively
❌ Avoid tiny text
❌ Don't use photos (use illustrations)
