# 🗺️ Map Setup Guide

## Overview
Your Contact page has a full-width embedded map section that's completely controlled from the backend in the `pageContent` schema.

---

## Backend Configuration

### Location in Database
**File**: `backend/models/PageContent.js`  
**Section**: `contactPage.mapSection`

```javascript
mapSection: {
  embedCode: "",    // Your iframe embed code goes here
  mapHeight: "600px" // Controls map height (accepts CSS values)
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
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.234567..." width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
```

**Paste into Admin Panel**: Copy ONLY the `src` URL (starting with `https://www.google.com/maps/embed?pb=...`) and paste it like:
```
<iframe src="https://www.google.com/maps/embed?pb=!1m18!..." width="100%" height="600px" style="border:0;" loading="lazy"></iframe>
```

---

### Option 2: Mapbox
1. Create account at [mapbox.com](https://www.mapbox.com)
2. Create a new map style
3. Get the embed code from your map dashboard
4. Example format:
```html
<iframe src="https://api.mapbox.com/styles/v1/username/style-id.html?..." width="100%" height="600px" style="border:none;"></iframe>
```

---

### Option 3: Apple Maps
1. Go to [maps.apple.com](https://maps.apple.com)
2. Find your location
3. Click **Share** → **Embed Map**
4. Copy the embed code
5. Example:
```html
<iframe src="https://maps.apple.com/maps?..." width="100%" height="600px" style="border:0;"></iframe>
```

---

## Current Frontend Code

Your Contact.jsx already has the map section set up:

```jsx
{/* Map Section */}
<section className="relative w-full bg-gray-100 overflow-hidden group">
  <div 
    className="w-full transition-all duration-500 group-hover:grayscale-0 grayscale-[30%]"
    dangerouslySetInnerHTML={{
      __html: content?.contactPage?.mapSection?.embedCode || 
              '<div class="w-full h-96 bg-gray-200 flex items-center justify-center"><p>No map configured</p></div>'
    }}
    style={{
      height: content?.contactPage?.mapSection?.mapHeight || '600px'
    }}
  />
</section>
```

**Features**:
- ✅ Full-width responsive embedding
- ✅ Grayscale hover effect (turns colorful on hover)
- ✅ Height controlled by `mapHeight` field
- ✅ Fallback message if no map configured

---

## Step-by-Step Admin Setup

### In Admin Panel (ManageCampaigns or similar):

1. **Find Contact Page Settings** → Scroll to "Map Configuration"
2. **Map Embed Code Field**:
   - Paste your `<iframe src="..." width="100%" height="..." />`
   - Make sure `width="100%"` for responsiveness
3. **Map Height Field**:
   - Default: `600px` (good for desktop)
   - Mobile: Can use `500px` or `80vh`
   - Recommended values: 
     - Desktop: `600px` - `800px`
     - Tablet: `500px` - `600px`
     - Mobile: handled automatically via `height` in iframe HTML

---

## Recommended Embed Code Template

Copy this template and replace URLs:

```html
<iframe src="YOUR_MAP_URL_HERE" width="100%" height="100%" style="border:0;border-radius:0.5rem;" allow="geolocation" loading="lazy"></iframe>
```

---

## Testing the Map

1. Update the backend with your embed code
2. Refresh the Contact page
3. Hover over the map to see the grayscale → color transition
4. Test mobile responsiveness (should adjust height automatically)
5. Click inside map to interact (zoom, pan, etc.) - works seamlessly!

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Map shows blank | Check embed URL is valid and complete |
| Map too small/big | Adjust `mapHeight` value (e.g., "600px" → "750px") |
| Map controls not working | Ensure `allow="geolocation"` is in iframe |
| Mobile map cuts off | Use percentage-based heights like "500px" for mobile viewport |
| Grayscale effect not working | Check CSS is loading (should be automatic) |

---

## Current Map Styling

The map container includes:
- **Grayscale on load**: `grayscale-[30%]` (slightly desaturated)
- **Hover to color**: `group-hover:grayscale-0` (full color)
- **Smooth transition**: 500ms animation
- **Rounded corners**: Integrated into Contact page design

---

## Data Flow

```
Admin Panel Input (mapEmbedCode, mapHeight)
         ↓
Backend sends to Frontend via /api/page-content
         ↓
Contact.jsx receives via useEffect + useState
         ↓
dangerouslySetInnerHTML renders iframe
         ↓
CSS grayscale effect applied
         ↓
User hovers → Grayscale removed → Color visible
```

---

## Backend API Response Example

When Contact page loads, backend returns:

```json
{
  "contactPage": {
    "mapSection": {
      "embedCode": "<iframe src=\"https://www.google.com/maps/embed?pb=...\" width=\"100%\" height=\"100%\" style=\"border:0;\" loading=\"lazy\"></iframe>",
      "mapHeight": "600px"
    }
  }
}
```

---

## Pro Tips 🎯

1. **Google Maps is best** for most use cases (most reliable, good zoom levels)
2. **Keep height at 600px minimum** for desktop - too short looks cramped
3. **Use `width="100%"` always** - ensures responsiveness
4. **Test on mobile** - map should still be interactive and sized properly
5. **For multiple locations** - consider adding location cards with Glass effect (already done in your Locations section!)

---

## Next Steps

1. Go to Google Maps (or your preferred provider)
2. Find your business location
3. Get the embed code
4. Log into Admin Panel
5. Paste the code into **Map Embed Code** field
6. Set **Map Height** (try `600px` first)
7. Save & refresh Contact page
8. Done! 🎉

