# 🗺️ Map Setup Guide

## Overview
Your Contact page has a full-width embedded map section that's completely controlled from the backend in the `pageContent` schema.

---

## Backend Configuration

### Location in Database
**File**: `backend/models/PageContent.js`  
**Section**: `contactPage`

```javascript
contactPage: {
  mapEmbedCode: "",    // Your iframe embed code goes here
  mapHeight: "600px"   // Controls map height (accepts CSS values)
}
```

---

## How to Get Map Embed Code

### Option 1: Google Maps (RECOMMENDED)
1. Go to [Google Maps](https://maps.google.com)
2. Search for your location
3. Click the **Share** button (usually top-left)
4. Click **Embed a map**
5. Copy the entire `<iframe>` code
6. Example:
```html
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.234567..." width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
```

**For Admin Panel**: Simplify to:
```html
<iframe src="https://www.google.com/maps/embed?pb=!1m18!..." width="100%" height="100%" style="border:0;" loading="lazy"></iframe>
```

---

### Option 2: Mapbox
1. Create account at [mapbox.com](https://www.mapbox.com)
2. Create a new map style
3. Get the embed code from your map dashboard
4. Example format:
```html
<iframe src="https://api.mapbox.com/styles/v1/username/style-id.html?..." width="100%" height="100%" style="border:none;"></iframe>
```

---

### Option 3: Apple Maps
1. Go to [maps.apple.com](https://maps.apple.com)
2. Find your location
3. Click **Share** → **Embed Map**
4. Copy the embed code
5. Example:
```html
<iframe src="https://maps.apple.com/maps?..." width="100%" height="100%" style="border:0;"></iframe>
```

---

## Frontend Map Component

Your Contact.jsx has the map section already configured:

```jsx
{/* Map Section */}
{(pageData.mapEmbedCode || content?.mapEmbedCode) && (
  <section className="w-full bg-[#f7f4ef] pt-0" style={{ height: pageData.mapHeight || content?.mapHeight || '600px' }}>
    <div 
      className="w-full h-full grayscale-[25%] hover:grayscale-0 transition-all duration-700" 
      dangerouslySetInnerHTML={{ __html: pageData.mapEmbedCode || content?.mapEmbedCode }} 
    />
  </section>
)}
```

**Features**:
- ✅ Full-width responsive embedding
- ✅ Grayscale hover effect (turns colorful on hover)
- ✅ Height controlled by `mapHeight` field
- ✅ Supports both old and new data structure
- ✅ Fallback if no map configured

---

## Step-by-Step Admin Setup

### In Admin Panel (ManageContent.jsx):

1. **Go to Admin** → Login
2. **Edit Content** → Scroll to "Map Settings"
3. **Map Embed Code Field**:
   - Paste your complete iframe code
   - Make sure `width="100%"` for responsiveness
4. **Map Height Field**:
   - Default: `600px` (good for desktop)
   - Adjust as needed
   - Examples: `500px`, `700px`, `80vh`
5. **Click Save** - Changes appear instantly on Contact page

---

## Recommended Embed Code Template

Copy and customize:

```html
<iframe src="YOUR_MAP_EMBED_URL_HERE" width="100%" height="100%" style="border:0;border-radius:0.5rem;" loading="lazy"></iframe>
```

Replace `YOUR_MAP_EMBED_URL_HERE` with:
- **Google Maps**: `https://www.google.com/maps/embed?pb=...`
- **Mapbox**: `https://api.mapbox.com/styles/...`
- **Apple Maps**: `https://maps.apple.com/maps?...`

---

## Testing the Map

1. Update backend with your embed code
2. Go to Contact page
3. Should see full-width map
4. Hover over map → Should turn from grayscale to color
5. Click on map → Should be interactive (zoom, pan)
6. Test on mobile → Should resize properly

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Map shows blank | Check embed URL is valid in admin panel |
| Map too small/big | Adjust `mapHeight` value (e.g., `"600px"` → `"750px"`) |
| Map controls not working | Ensure iframe src URL is complete |
| Mobile map looks wrong | Map automatically adjusts - check container width |
| Grayscale effect not working | CSS is automatic - clear browser cache |
| "No map configured" message | Check if embed code was saved in admin |

---

## Data Flow

```
Admin Panel → Input map embed code and height
        ↓
Backend saves to MongoDB contactPage
        ↓
Public Contact page reads from API
        ↓
Contact.jsx renders iframe with embed code
        ↓
CSS applies grayscale → hover → color effect
        ↓
User interacts with map (zoom, pan, etc)
```

---

## Backend API Response

When Contact page loads, API returns:

```json
{
  "contactPage": {
    "mapEmbedCode": "<iframe src=\"https://www.google.com/maps/...\" width=\"100%\" height=\"100%\" />",
    "mapHeight": "600px"
  }
}
```

---

## Pro Tips 🎯

1. **Google Maps is easiest** - Recommended for most use cases
2. **Use height 500px-700px** - Too small looks cramped, too big wastes space
3. **Always use `width="100%"`** - Ensures responsive design
4. **Test on mobile** - Map should still be interactive
5. **Add location cards** - Complement map with Location pins and details
6. **Update periodically** - Keep business address current

---

## Troubleshooting Checklist

- [ ] Embed code has `width="100%"`
- [ ] Embed code is complete (full src URL)
- [ ] Admin saved the changes
- [ ] Browser cache cleared (Ctrl+Shift+Del)
- [ ] Contact page is loading (check browser DevTools)
- [ ] Database has the mapEmbedCode field populated

---

## Next Steps

1. Get your map embed code (Google Maps easiest)
2. Log into Admin Panel
3. Go to ManageContent → Find Map Settings section
4. Paste embed code
5. Adjust height if needed
6. Save changes
7. Go to public Contact page
8. Verify map displays and is interactive
9. Done! 🎉

---

**Last Updated:** April 4, 2026

For more help, see:
- [API.md](API.md) - API field names and structure
- [SETUP.md](SETUP.md) - Environment and backend setup
- [ARCHITECTURE.md](ARCHITECTURE.md) - Full system design
