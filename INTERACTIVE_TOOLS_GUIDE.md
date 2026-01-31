# Interactive Tools & Setup Guide

This guide explains how to use the new interactive setup features in all Scriptable scripts.

## Overview

All scripts now include **interactive setup menus** when run directly in the Scriptable app. This makes configuration easy without editing code!

## Quick Start

1. **Open Scriptable app** on your iOS device
2. **Tap any script** (FavContacts, LSWeather, LSForecast, LSMatrix, or LSQuotes)
3. **Interactive menu appears** automatically
4. **Configure settings** through the menu options
5. **Generate preview** to see your customizations

## Interactive Features by Script

### 🎨 FavContacts - Contact Widget Setup

**Main Menu Options:**
- **Choose Theme** - Browse 40+ color themes organized in groups
- **Avatar Style** - Select between contact photo, initials, or symbol
- **Quick Actions** - Configure up to 3 quick action buttons
  - Choose from: Messages, FaceTime, WhatsApp, Telegram, Email apps, Twitter
- **View Settings** - See current configuration

**Example Workflow:**
1. Run FavContacts in app
2. Select "Choose Theme" → Browse themes → Pick "antwerpBlue"
3. Select "Avatar Style" → Choose "Contact Photo"
4. Select "Quick Actions" → Choose 3 actions like FaceTime, Messages, WhatsApp
5. Select "Update Contacts & Continue" to refresh and preview

### 🌤️ LSWeather - Lock Screen Weather Setup

**Main Menu Options:**
- **Select Layout** - Choose from 6 pre-defined layouts
  - welcome, minimalWeather, feelMotivated, minimalCalendar, showMyWork, maximalWeather
- **Set API Key** - Enter your OpenWeather API key
- **Weather Settings** - Configure units (metric/imperial) and language
- **Calendar Settings** - Toggle all-day events, tomorrow events, colors
- **Quote Settings** - Enable/disable quotes and set categories
- **View Settings** - Review all current settings
- **Generate Preview** - See the overlay with your settings

**Example Workflow:**
1. Run LSWeather in app
2. Select "Select Layout" → Choose "welcome"
3. Select "Set API Key" → Enter your API key
4. Select "Weather Settings" → Set to "Metric" and "English"
5. Select "Generate Preview" to see the result

### 🌦️ LSForecast - Weather Forecast Setup

**Main Menu Options:**
- **Accent Color** - Choose from presets or enter custom hex code
  - Presets: White, Light Blue, Orange, Red, Yellow, Green, Purple, Aqua
- **Set API Key** - Enter OpenWeather API key
- **Weather Options** - Configure units, language, hours/days to display
- **Display Settings** - Toggle hourly icons, POP graph, transparency
- **View Settings** - See current configuration
- **Generate Preview** - Create forecast overlay

**Example Workflow:**
1. Run LSForecast in app
2. Select "Accent Color" → Choose "Light Blue" or enter "#83a598"
3. Select "Weather Options" → Set hours to 8, days to 7
4. Select "Display Settings" → Set transparency to 30%
5. Select "Generate Preview"

### 🟢 LSMatrix - Matrix Wallpaper Setup

**Main Menu Options:**
- **Style Settings** - Configure appearance
  - Dark/Light mode toggle
  - Binary vs Matrix characters
  - Cryptic text option
  - System appearance sync
- **Quote Settings** - Enable Matrix movie quotes and browse them
- **Calendar Settings** - Configure event display
- **Time Format** - Switch between 12/24 hour
- **View Settings** - Review configuration
- **Generate Preview** - Create Matrix wallpaper

**Quote Browser Feature:**
- Browse 40+ famous Matrix movie quotes
- See quotes from Neo, Morpheus, Trinity, Agent Smith, The Oracle, and more

**Example Workflow:**
1. Run LSMatrix in app
2. Select "Style Settings" → Enable "Dark Mode" and "Binary Mode"
3. Select "Quote Settings" → Enable quotes → Browse quotes
4. Select "Time Format" → Choose "24-hour"
5. Select "Generate Preview"

### 💬 LSQuotes - Quote Overlay Setup

**Main Menu Options:**
- **Quote Source** - Choose random quotes from API or use custom quote
- **Custom Quote** - Edit your personal quote/message
- **Quote Categories** - Select from 11 categories
  - business, wisdom, faith, friendship, success, inspirational, life, love, happiness, humorous, motivational
- **Appearance** - Set text size (small/medium/large) and dark/light mode
- **View Settings** - See current configuration
- **Generate Preview** - Create quote overlay

**Example Workflow:**
1. Run LSQuotes in app
2. Select "Quote Source" → Choose "Custom Quote"
3. Select "Custom Quote" → Enter "Be the change you want to see!"
4. Select "Appearance" → Choose "Large" text, "Dark Mode"
5. Select "Generate Preview"

## 🎮 InteractiveToolsDemo - Try All Features

Run **InteractiveToolsDemo.js** to explore all interactive capabilities:

- **Theme Selector Demo** - See how theme picker works
- **Menu Selection Demo** - Example of option menus
- **Configuration Wizard Demo** - Multi-step setup process
- **Text Input Demo** - Prompt for text entry
- **Confirmation Demo** - Yes/No confirmations
- **Quick Actions Selector** - Contact action picker
- **Save/Load Config Demo** - Configuration persistence

## Important Notes

### ⚠️ Temporary Settings
Settings configured through interactive menus are **temporary** (for preview only). To make permanent changes:

1. **Edit the script** configuration section (marked with comments)
2. **Pass parameters** from Shortcuts app
3. **Widget parameters** for widget-specific settings

### ✅ Widget Functionality
- Interactive menus **only appear in Scriptable app**
- Widgets on home screen work exactly as before
- No breaking changes to existing functionality
- Shortcuts integration unchanged

### 💡 Best Practices

1. **Test settings** with interactive menu first
2. **Note your preferred settings** from the settings viewer
3. **Edit script** to make settings permanent
4. **Use widget parameters** for different widgets with different settings

## Technical Details

### Interactive Utilities Library
Location: `lib/interactive-utils.js`

**Available Functions:**
- `showMenu(title, message, options, cancelable)` - Display option menu
- `showAlert(title, message)` - Show information alert
- `showConfirmation(title, message)` - Yes/No confirmation
- `promptForText(title, message, placeholder, defaultValue)` - Text input
- `promptForSecureText(title, message, placeholder)` - Password input
- `selectQuickActions(availableActions, maxSelections)` - Quick action picker
- `selectTheme(themes, currentTheme)` - Theme selector
- `configurationWizard(steps)` - Multi-step configuration
- `saveConfiguration(fileName, config)` - Save to file
- `loadConfiguration(fileName)` - Load from file

### Custom Integration
You can use these utilities in your own scripts:

```javascript
// Import the library
const utils = importModule("lib/interactive-utils");

// Use interactive functions
const theme = await utils.selectTheme(myThemes);
const confirmed = await utils.showConfirmation("Continue?", "Are you sure?");
const apiKey = await utils.promptForText("API Key", "Enter your key");
```

## Troubleshooting

### Menu doesn't appear
- Make sure you're running the script **in the Scriptable app**, not as a widget
- Check that you're not running from Shortcuts app

### Settings don't persist
- Interactive settings are temporary for preview
- Edit the script or use widget parameters for permanent changes

### Import error in custom scripts
- Ensure `lib/interactive-utils.js` exists in your Scriptable folder
- Use: `importModule("lib/interactive-utils")`

## Support

For issues or questions:
1. Check the main README.md for script-specific documentation
2. Review the configuration section in each script
3. Try the InteractiveToolsDemo.js to verify setup

## Summary

Interactive tools make Scriptable scripts more accessible and user-friendly. You can:
- ✅ Configure settings without editing code
- ✅ Preview changes immediately
- ✅ Browse options interactively
- ✅ Learn available features through menus
- ✅ Test different configurations easily

Enjoy your enhanced Scriptable experience! 🎉
