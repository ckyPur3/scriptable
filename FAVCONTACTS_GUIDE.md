# FavContacts Widget - Complete Guide

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Setup Methods](#setup-methods)
- [Interactive Configuration](#interactive-configuration)
- [Widget Parameters](#widget-parameters)
- [Available Themes](#available-themes)
- [Quick Actions](#quick-actions)
- [Custom Actions Per Contact](#custom-actions-per-contact)
- [Troubleshooting](#troubleshooting)
- [Advanced Tips](#advanced-tips)

## Overview

FavContacts is a customizable Scriptable widget that displays your favorite contacts with quick action buttons for instant communication. Call, message, FaceTime, email, or use messaging apps like WhatsApp, Signal, Telegram, and more - all directly from your home screen!

## Features

✨ **Multiple Widget Sizes**
- Small: 1 contact (tap to call)
- Medium: 4 contacts with action buttons
- Large: 8 contacts with action buttons

🎨 **40+ Beautiful Themes**
- Single color themes (kraftBrown, royalBlue, etc.)
- Contrasting themes (sailorBlueMint, electricBlueAqua, etc.)
- Transparent widget support

👤 **3 Avatar Styles**
- Contact Photo: Shows actual contact pictures
- Initials: Displays contact initials in a circle
- SF Symbol: Uses customizable SF Symbols

⚡ **Quick Actions** (up to 3 per contact)
- Phone: Messages, FaceTime Video/Audio
- Messaging Apps: WhatsApp, Signal, Telegram, Messenger
- Email: Default Mail, Gmail, Outlook, Spark
- Social: Twitter (multiple clients supported)

🎛️ **Interactive Setup Menu**
- Easy theme selection
- Avatar style picker
- Quick action configuration
- Built-in usage guide

## Installation

### Step 1: Download Script

1. Download `FavContacts.js` from the repository
2. Save it to your **Scriptable** folder in iCloud Drive:
   ```
   iCloud Drive/
   ├─ Scriptable/
   │  ├─ FavContacts.js
   ```

### Step 2: Launch Scriptable

1. Open the Scriptable app
2. Verify that `FavContacts` appears in your Scripts list

### Step 3: Optional Dependencies

For transparent widgets, install the [no-background](https://github.com/supermamon/scriptable-no-background) module.

## Quick Start

### First Time Setup

1. **Choose a setup method** (see [Setup Methods](#setup-methods) below)
2. **Run FavContacts in Scriptable app**
   - The interactive setup menu will appear
   - Select "Update Contacts & Continue"
   - Wait for confirmation message
3. **Add widget to home screen**
   - Long press on home screen
   - Tap "+" icon
   - Select "Scriptable"
   - Choose widget size
   - Select "FavContacts" as the script
4. **Done!** Your contacts widget is ready

## Setup Methods

Choose **ONE** of these three methods to set up your favorite contacts:

### Method 1: Favourites Group (Recommended)

**Best for:** Users with iCloud Contacts

1. Open **Contacts** app (on Mac or iCloud.com)
2. Create a new group named **"Favourites"** (exact spelling required)
3. Add your favorite contacts to this group
4. Run FavContacts script in Scriptable app

**Pros:** 
- Easy to manage
- No contact modification needed
- Works with any sync service supporting groups

### Method 2: Social Profile Tag

**Best for:** Users who can't create contact groups

1. Open a contact in the Contacts app
2. Tap **Edit**
3. Scroll down and tap **add social profile**
4. Change the default profile to **Add Custom Service**
5. Enter:
   - **Service**: `Scriptable`
   - **User Name**: `Scriptable`
6. Tap **Done**
7. Repeat for other favorite contacts
8. Run FavContacts script in Scriptable app

**Pros:**
- Works without group support
- Can add custom quick actions (see below)

### Method 3: Manual Array (Not Recommended)

**Best for:** Testing or when other methods fail

1. Open `FavContacts.js` in Scriptable editor
2. Find the `allcontacts` array (around line 84)
3. Add contacts manually:
   ```javascript
   let allcontacts = [
       {firstname: 'John', lastname: 'Doe'},
       {firstname: 'Jane', lastname: 'Smith'},
   ]
   ```
4. Save and run the script

**Cons:**
- Requires editing script code
- Changes lost when updating script
- More error-prone

## Interactive Configuration

When you run FavContacts in the Scriptable app, an interactive setup menu appears:

### 🎨 Choose Theme
- Browse themes in organized groups
- Preview theme names
- Instantly apply selected theme

### 👤 Avatar Style
Choose how contacts appear:
- **Contact Photo**: Shows actual contact pictures (requires photos in Contacts app)
- **Initials**: Displays first letter of first and last name
- **SF Symbol**: Uses person icon (customizable in script)

### ⚡ Quick Actions
Configure action buttons:
1. Select how many buttons (0, 2, or 3)
2. Choose actions from available apps
3. Actions appear in the order selected

### 📋 View Settings
See current configuration:
- Active theme
- Avatar style
- Number of action buttons
- Selected quick actions

### ℹ️ How to Use
Built-in guide with:
- Setup instructions
- Widget size information
- Parameter examples
- Quick reference

### ✅ Update Contacts & Continue
- Scans contacts using selected method
- Updates contact cache
- Shows confirmation with count
- Generates widget preview

## Widget Parameters

Customize individual widgets by adding parameters when editing the widget:

### Basic Examples

**Widget Number** (shows different contacts)
```
2
```
Shows contacts 5-8 (widget 2 of medium/large size)

**Custom Theme**
```
{"theme": "sailorBlueMint"}
```

**Avatar Style**
```
{"avatar": "initials"}
```

**Combined Parameters**
```
2,{"theme": "electricBlueAqua", "avatar": "contact"}
```

### Transparent Widget

**Small Widget**
```
{"theme": "transparent", "pos": "top-left"}
```

Valid positions for small: 
- `top-left`, `top-right`
- `middle-left`, `middle-right`  
- `bottom-left`, `bottom-right`

**Medium Widget**
```
{"theme": "transparent", "pos": "top"}
```

Valid positions for medium: `top`, `middle`, `bottom`

**Large Widget**
```
{"theme": "transparent", "pos": "bottom"}
```

Valid positions for large: `top`, `bottom`

## Available Themes

### Single Color Themes
- **Brown/Orange**: kraftBrown, orangeyellow, cadmiumOrange
- **Red/Pink**: red, scarletRed, peachBlossomPink, flourescentPink, wednesdayPink
- **Purple/Blue**: brilliantViolet, royalBlue, antwerpBlue, skyBlue, articBlue
- **Green**: seaweedGreen, oxideGreen, kiwiGreen
- **Neutral**: bonoboGrey, lunaBlack, white, classic, classicGrey, black

### Contrasting Themes
- **Elegant**: ultraViolet, sailorBlueMint, iceFlowPurple, islandGreen
- **Bold**: blueOrange, blackOrange, cherryTomatoRose, cherryTomatoBlack
- **Vibrant**: spaceCherry, electricBlueAqua, blazingYellowBlack, fieryRedTeal
- **Natural**: forestMoss, agingCopper, skyBlueWhite, greenBlack
- **Subtle**: powderedSugar, lemonPurple

### Special Themes
- **transparent**: Uses wallpaper background (requires no-background module)

## Quick Actions

### Communication Apps

**Phone**
- `message` - 📱 Messages (SMS/iMessage)
- `facetimeVideo` - 📹 FaceTime Video
- `facetimeAudio` - 📞 FaceTime Audio

**Messaging Platforms**
- `whatsapp` - 💬 WhatsApp
- `signal` - 🔒 Signal
- `telegram` - ✈️ Telegram
- `messenger` - 💬 Facebook Messenger

**Email Clients**
- `email` - 📧 Default Mail app
- `gmail` - 📧 Gmail
- `outlook` - 📧 Outlook
- `spark` - 📧 Spark Mail

**Social Media**
- `twitter` - 🐦 Official Twitter app
- `twitterrific` - 🐦 Twitterrific
- `tweetbot` - 🐦 Tweetbot

### Requirements

**For Phone Actions** (message, FaceTime, WhatsApp, Signal, Telegram, Messenger)
- Contact must have a phone number

**For Email Actions** (email, gmail, outlook, spark)
- Contact must have an email address

**For Twitter Actions**
- Contact must have "Twitter" social profile set
- Enter username without @ symbol

## Custom Actions Per Contact

Override default quick actions for specific contacts:

1. Open the contact in Contacts app
2. Add/Edit the **Scriptable** social profile
3. In the **User Name** field, enter comma-separated actions:
   ```
   whatsapp,facetimeVideo,message
   ```
4. Save the contact
5. Run FavContacts in Scriptable to update

**Example:**
- **Contact:** Your mom
- **Custom Actions:** `facetimeVideo,message`
- **Result:** Widget shows FaceTime and Messages buttons (no email)

**Example 2:**
- **Contact:** Business partner  
- **Custom Actions:** `email,message,telegram`
- **Result:** Widget shows Email, Messages, and Telegram buttons

## Troubleshooting

### Widget Shows Setup Message

**Problem:** Widget displays "Set-up your contact list"

**Solutions:**
1. Make sure you've added favorites using one of the three methods
2. Run FavContacts script in Scriptable app
3. Select "Update Contacts & Continue"
4. Wait for success message
5. Check widget refreshes (may take a minute)

### No Contacts Appear

**Problem:** Widget shows "You don't need X widgets"

**Solutions:**
1. Verify you have contacts in "Favourites" group (Method 1)
2. Check contacts have "Scriptable" social profile (Method 2)
3. Verify `allcontacts` array is filled (Method 3)
4. Run script in app to update cache
5. Check widget parameter (lower widget number if needed)

### Contact Photos Don't Show

**Problem:** Widget shows initials instead of photos

**Solutions:**
1. Ensure contacts have photos in Contacts app
2. Run script in app to update image cache
3. Check avatar style isn't set to "initials" or "symbol"
4. Try removing and re-adding widget

### Quick Actions Don't Work

**Problem:** Tapping action button does nothing

**Solutions:**
1. Ensure contact has required info (phone for WhatsApp, email for Gmail, etc.)
2. Verify target app is installed
3. Check app URL schemes haven't changed
4. For Twitter: verify username is in Twitter social profile

### Transparent Theme Not Working

**Problem:** Widget shows solid color instead of wallpaper

**Solutions:**
1. Install [no-background](https://github.com/supermamon/scriptable-no-background) module
2. Run no-background setup first
3. Set correct widget position parameter
4. Verify wallpaper slice is generated for your position

### Widget Doesn't Update

**Problem:** Changes don't appear in widget

**Solutions:**
1. Long press widget → Remove Widget
2. Re-add widget from scratch
3. Run script in app again
4. Wait a few minutes for iOS to refresh
5. Try restarting device if issue persists

## Advanced Tips

### Multiple Widgets with Different Styles

Create varied home screen layouts:

**Widget 1:** Close family (small, photo style)
```
1,{"theme": "sailorBlueMint", "avatar": "contact"}
```

**Widget 2:** Work contacts (medium, initials)
```
2,{"theme": "classic", "avatar": "initials"}
```

**Widget 3:** Friends (large, mixed)
```
3,{"theme": "electricBlueAqua"}
```

### Theme Matching

Match widgets to wallpaper:
1. Use color picker to find wallpaper colors
2. Find matching theme or use transparent
3. Set consistent theme across all FavContacts widgets

### Efficient Contact Management

**Best Practice:**
1. Use "Favourites" group (Method 1)
2. Order contacts by priority in group
3. First 8 contacts appear on first large widget
4. Next 8 on widget 2, etc.

### Custom Symbol for All Contacts

Edit the script configuration (around line 92):
```javascript
const CONTACTS_SYMBOL_STYLE = "star.circle.fill"; // or any valid SF Symbol
```

Valid symbols: `person.circle.fill`, `heart.circle.fill`, `star.circle.fill`, etc.

Find symbols at [SF Symbols](https://developer.apple.com/sf-symbols/)

### Show/Hide Contact Names

Edit script configuration (around line 88):
```javascript
let SHOW_NAMES = true;  // Show names below avatars
```

Useful for:
- **true**: When you want to see names (especially with symbols/initials)
- **false**: Cleaner look with contact photos

### Default Quick Actions

Set your preferred default actions (around line 91):
```javascript
let ITEMS_TO_SHOW = ["facetimeVideo","message","email"];
```

These apply to all contacts unless overridden per contact.

## Script Configuration Reference

Key configuration variables in the script:

```javascript
// Avatar style: "contact", "symbol", or "initials"
let AVATAR_STYLE = "contact"

// Theme name (see Available Themes section)
let THEME = "antwerpBlue";

// Show contact names below avatars
let SHOW_NAMES = false;

// Number of quick action buttons (0-3)
let NO_OF_ITEMS_TO_SHOW = 2;

// Default quick actions for all contacts
let ITEMS_TO_SHOW = ["twitter","facetimeVideo","message","whatsapp","spark","gmail"];

// SF Symbol for contacts without photos (when using symbol style)
const CONTACTS_SYMBOL_STYLE = "person.circle.fill";
```

## Support

For issues, suggestions, or contributions:
- **GitHub**: [ckyPur3/scriptable](https://github.com/ckyPur3/scriptable)
- **Original Author**: Ankit Jain (<ajatkj@yahoo.co.in>)

## Version History

- **v2.1**: Added Signal, Messenger support, comprehensive documentation, improved error handling
- **v2.0**: Added interactive setup menu, multiple themes, transparent widget support
- **v1.x**: Initial release with basic functionality

---

**Note:** FavContacts requires iOS 14.4+ and the Scriptable app. Some features may require specific iOS versions or app installations.
