# AI Features Quick Start Guide

A quick reference for implementing AI and modern iOS features in your Scriptable widgets.

## 🚀 Quick Wins (Easy to Implement)

### 1. Smart Time-Based Content (15 minutes)
```javascript
function getTimeBasedTheme() {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return 'morningTheme';  // Bright, energetic colors
  } else if (hour >= 12 && hour < 17) {
    return 'afternoonTheme';  // Neutral, professional
  } else if (hour >= 17 && hour < 21) {
    return 'eveningTheme';  // Warm, relaxing colors
  } else {
    return 'nightTheme';  // Dark, muted colors
  }
}
```

### 2. Context-Aware Quotes (20 minutes)
```javascript
async function getContextualQuote() {
  const hour = new Date().getHours();
  const calendar = await Calendar.forEvents();
  const todayEvents = await CalendarEvent.today(calendar);
  
  let category = 'general';
  
  if (hour < 12) {
    category = 'motivational';  // Morning motivation
  } else if (todayEvents.length > 5) {
    category = 'business';  // Busy day
  } else if (todayEvents.length === 0) {
    category = 'life';  // Relaxing day
  }
  
  return await fetchQuote(category);
}
```

### 3. Smart Contact Suggestions (30 minutes)
```javascript
// Track contact interactions in FileManager
function trackContactInteraction(contactId) {
  const fm = FileManager.iCloud();
  const path = fm.joinPath(fm.documentsDirectory(), 'contact_history.json');
  
  let history = {};
  if (fm.fileExists(path)) {
    history = JSON.parse(fm.readString(path));
  }
  
  const hour = new Date().getHours();
  const day = new Date().getDay();
  const key = `${contactId}_${day}_${hour}`;
  
  history[key] = (history[key] || 0) + 1;
  fm.writeString(path, JSON.stringify(history));
}

function getSmartContactSuggestions(allContacts) {
  const fm = FileManager.iCloud();
  const path = fm.joinPath(fm.documentsDirectory(), 'contact_history.json');
  
  if (!fm.fileExists(path)) {
    return allContacts.slice(0, 6);  // Default first 6
  }
  
  const history = JSON.parse(fm.readString(path));
  const hour = new Date().getHours();
  const day = new Date().getDay();
  
  // Score contacts based on historical interactions
  const scored = allContacts.map(contact => {
    const key = `${contact.id}_${day}_${hour}`;
    const score = history[key] || 0;
    return { contact, score };
  });
  
  // Sort by score and return top contacts
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 6).map(item => item.contact);
}
```

## 🎯 iOS-Specific Features

### 1. Focus Mode Detection (iOS 15+)
```javascript
// Check if device is in a specific focus mode
async function getFocusMode() {
  // Using Shortcuts integration to pass focus mode
  // In Shortcuts: Pass "Work", "Personal", "Sleep", etc.
  const args = args.widgetParameter;
  
  if (args && args.focusMode) {
    return args.focusMode;
  }
  
  // Fallback: Detect based on time
  const hour = new Date().getHours();
  if (hour >= 9 && hour < 17) return 'Work';
  if (hour >= 22 || hour < 7) return 'Sleep';
  return 'Personal';
}

// Customize widget based on focus
async function getContentForFocus() {
  const focus = await getFocusMode();
  
  const configs = {
    'Work': {
      calendars: ['Work Calendar'],
      contacts: workContacts,
      theme: 'professional'
    },
    'Personal': {
      calendars: ['Personal', 'Family'],
      contacts: personalContacts,
      theme: 'colorful'
    },
    'Sleep': {
      calendars: [],  // Hide calendar at night
      contacts: [],   // Hide contacts
      theme: 'dark'
    }
  };
  
  return configs[focus] || configs['Personal'];
}
```

### 2. Lock Screen Widget (iOS 16+)
```javascript
// Optimize for lock screen circular widget
function createLockScreenWidget() {
  const widget = new ListWidget();
  
  // Circular widgets are typically 76x76 points
  // Keep content minimal and centered
  
  const stack = widget.addStack();
  stack.layoutVertically();
  stack.centerAlignContent();
  
  // Single large icon or number
  const temp = stack.addText("72°");
  temp.font = Font.boldSystemFont(24);
  temp.textColor = Color.white();
  temp.centerAlignText();
  
  // Small label
  const label = stack.addText("Sunny");
  label.font = Font.systemFont(10);
  label.textColor = Color.white();
  label.centerAlignText();
  
  return widget;
}
```

### 3. Dynamic Type Support
```javascript
// Respect system text size settings
function getAccessibleFont(baseSize) {
  // iOS scales fonts automatically, but you can customize
  const dynamicFontSize = Device.isPhone() ? baseSize : baseSize * 1.2;
  
  // Check if user has enabled larger text
  // This is approximation - actual Dynamic Type uses text styles
  return Font.systemFont(dynamicFontSize);
}

// Use text styles (recommended)
function createAccessibleText(text, style = 'body') {
  const textElement = widget.addText(text);
  
  // Use iOS text styles which automatically scale
  const styles = {
    'largeTitle': Font.largeTitle(),
    'title': Font.title1(),
    'headline': Font.headline(),
    'body': Font.body(),
    'caption': Font.caption1()
  };
  
  textElement.font = styles[style] || styles['body'];
  return textElement;
}
```

## 🤖 AI Integration Examples

### 1. Natural Language Calendar Summary
```javascript
async function summarizeCalendar() {
  const calendar = await Calendar.forEvents();
  const events = await CalendarEvent.today(calendar);
  
  if (events.length === 0) {
    return "Free day ahead! 🌟";
  }
  
  if (events.length === 1) {
    return `Just one event: ${events[0].title}`;
  }
  
  const busyHours = events.reduce((total, event) => {
    const duration = (event.endDate - event.startDate) / (1000 * 60 * 60);
    return total + duration;
  }, 0);
  
  if (busyHours > 6) {
    return `Busy day! ${events.length} events (${Math.round(busyHours)}h)`;
  } else if (busyHours > 3) {
    return `Moderate schedule: ${events.length} events`;
  } else {
    return `Light day: ${events.length} events`;
  }
}
```

### 2. Weather-Based Recommendations
```javascript
async function getWeatherRecommendation(weatherData) {
  const temp = weatherData.temp;
  const condition = weatherData.condition;
  const precipitation = weatherData.pop || 0;  // Probability of precipitation
  
  let recommendations = [];
  
  // Temperature-based
  if (temp < 0) {
    recommendations.push("🧥 Bundle up! It's freezing");
  } else if (temp < 10) {
    recommendations.push("🧥 Wear a warm jacket");
  } else if (temp > 30) {
    recommendations.push("☀️ Stay hydrated!");
  }
  
  // Precipitation-based
  if (precipitation > 0.7) {
    recommendations.push("☔ Don't forget your umbrella");
  } else if (precipitation > 0.3) {
    recommendations.push("🌂 Rain possible - bring umbrella");
  }
  
  // Condition-based activities
  if (condition === 'Clear' && temp > 15 && temp < 28) {
    recommendations.push("🚴 Perfect for outdoor activities!");
  }
  
  return recommendations.join('\n') || "Have a great day! 😊";
}
```

### 3. Smart Notification Timing
```javascript
// Suggest optimal times for reminders based on calendar
async function getOptimalReminderTime(event) {
  const eventStart = event.startDate;
  const duration = (event.endDate - eventStart) / (1000 * 60);  // minutes
  
  // Get location if available
  const hasLocation = event.location && event.location.length > 0;
  
  let reminderMinutes = 15;  // Default
  
  if (duration > 120) {  // 2+ hour meetings
    reminderMinutes = 60;  // 1 hour before
  } else if (hasLocation) {
    // If event has location, remind earlier for travel time
    reminderMinutes = 30;
  }
  
  // If it's the first event of the day, remind earlier
  const isFirstEvent = eventStart.getHours() < 10;
  if (isFirstEvent) {
    reminderMinutes = Math.max(reminderMinutes, 30);
  }
  
  return new Date(eventStart.getTime() - reminderMinutes * 60 * 1000);
}
```

## 🎨 Advanced Theming

### 1. Automatic Theme from Wallpaper
```javascript
// Extract dominant color from wallpaper
async function getWallpaperColor() {
  // This is conceptual - Scriptable doesn't have direct wallpaper access
  // But you can prompt user to select a color or use a reference image
  
  // Alternative: Use time-based or preset colors
  const hour = new Date().getHours();
  
  const timeColors = {
    dawn: '#FF9966',      // 5-7am
    morning: '#FFD700',   // 7-11am
    midday: '#87CEEB',    // 11am-2pm
    afternoon: '#FFA500', // 2-5pm
    evening: '#FF6B6B',   // 5-8pm
    night: '#2C3E50'      // 8pm-5am
  };
  
  if (hour >= 5 && hour < 7) return timeColors.dawn;
  if (hour >= 7 && hour < 11) return timeColors.morning;
  if (hour >= 11 && hour < 14) return timeColors.midday;
  if (hour >= 14 && hour < 17) return timeColors.afternoon;
  if (hour >= 17 && hour < 20) return timeColors.evening;
  return timeColors.night;
}
```

### 2. Adaptive Dark Mode
```javascript
function getAdaptiveTheme() {
  const isDark = Device.isUsingDarkAppearance();
  const hour = new Date().getHours();
  
  // Force dark mode during night hours
  const forceNightMode = hour >= 22 || hour < 6;
  
  if (forceNightMode || isDark) {
    return {
      background: '#1a1a1a',
      primary: '#ffffff',
      secondary: '#b0b0b0',
      accent: '#4a9eff'
    };
  } else {
    return {
      background: '#ffffff',
      primary: '#000000',
      secondary: '#666666',
      accent: '#007aff'
    };
  }
}
```

## 📊 Performance Tips

### 1. Efficient Data Caching
```javascript
class SimpleCache {
  constructor(ttlMinutes = 30) {
    this.fm = FileManager.iCloud();
    this.ttl = ttlMinutes * 60 * 1000;  // Convert to milliseconds
  }
  
  getCachePath(key) {
    return this.fm.joinPath(
      this.fm.documentsDirectory(),
      `cache_${key}.json`
    );
  }
  
  set(key, value) {
    const data = {
      value: value,
      timestamp: Date.now()
    };
    const path = this.getCachePath(key);
    this.fm.writeString(path, JSON.stringify(data));
  }
  
  get(key) {
    const path = this.getCachePath(key);
    if (!this.fm.fileExists(path)) {
      return null;
    }
    
    const data = JSON.parse(this.fm.readString(path));
    const age = Date.now() - data.timestamp;
    
    if (age > this.ttl) {
      this.fm.remove(path);
      return null;
    }
    
    return data.value;
  }
  
  clear(key) {
    const path = this.getCachePath(key);
    if (this.fm.fileExists(path)) {
      this.fm.remove(path);
    }
  }
}

// Usage
const cache = new SimpleCache(30);  // 30 minutes TTL

// Try to get from cache
let weather = cache.get('weather');

if (!weather) {
  // Fetch fresh data
  weather = await fetchWeatherData();
  cache.set('weather', weather);
}
```

### 2. Batch API Calls
```javascript
async function getAllData() {
  // Instead of sequential calls, fetch in parallel
  const [weather, calendar, quote] = await Promise.all([
    fetchWeatherData(),
    fetchCalendarData(),
    fetchQuoteData()
  ]);
  
  return { weather, calendar, quote };
}
```

## 🔒 Privacy Best Practices

### 1. Secure API Key Storage
```javascript
// Store API keys in Keychain (Scriptable uses FileManager)
class SecureStorage {
  constructor() {
    this.fm = FileManager.iCloud();
    this.path = this.fm.joinPath(
      this.fm.documentsDirectory(),
      '.secrets.json'
    );
  }
  
  save(key, value) {
    let secrets = {};
    if (this.fm.fileExists(this.path)) {
      secrets = JSON.parse(this.fm.readString(this.path));
    }
    secrets[key] = value;
    this.fm.writeString(this.path, JSON.stringify(secrets));
  }
  
  get(key) {
    if (!this.fm.fileExists(this.path)) {
      return null;
    }
    const secrets = JSON.parse(this.fm.readString(this.path));
    return secrets[key];
  }
}

// Usage
const storage = new SecureStorage();
storage.save('WEATHER_API_KEY', 'your-key-here');
const apiKey = storage.get('WEATHER_API_KEY');
```

### 2. Privacy Mode
```javascript
function createPrivacyModeWidget(widget, enabled) {
  if (enabled) {
    // Hide sensitive information
    widget.addText("Privacy Mode Active 🔒");
    widget.addSpacer();
    widget.addText("Tap to view details");
  } else {
    // Show normal content
    createNormalWidget(widget);
  }
}

// Toggle privacy mode based on context
const isUnlocked = Device.isScreenUnlocked();  // Not available, conceptual
const privacyMode = !isUnlocked;  // Enable when screen is locked
```

## 📱 Complete Example: Smart Weather Widget

```javascript
// Smart Weather Widget with AI features
class SmartWeatherWidget {
  constructor() {
    this.cache = new SimpleCache(30);
  }
  
  async create() {
    const widget = new ListWidget();
    
    // Get context
    const hour = new Date().getHours();
    const focus = await this.getFocusMode();
    
    // Apply adaptive theme
    const theme = this.getAdaptiveTheme();
    widget.backgroundColor = new Color(theme.background);
    
    // Get or fetch data
    let weather = this.cache.get('weather');
    if (!weather) {
      weather = await this.fetchWeather();
      this.cache.set('weather', weather);
    }
    
    // Create content
    this.addHeader(widget, theme);
    this.addWeatherInfo(widget, weather, theme);
    this.addRecommendation(widget, weather, theme);
    
    return widget;
  }
  
  async getFocusMode() {
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 17) return 'Work';
    if (hour >= 22 || hour < 7) return 'Sleep';
    return 'Personal';
  }
  
  getAdaptiveTheme() {
    const isDark = Device.isUsingDarkAppearance();
    return isDark ? {
      background: '#1a1a1a',
      primary: '#ffffff',
      accent: '#4a9eff'
    } : {
      background: '#ffffff',
      primary: '#000000',
      accent: '#007aff'
    };
  }
  
  addHeader(widget, theme) {
    const title = widget.addText("Smart Weather");
    title.font = Font.boldSystemFont(16);
    title.textColor = new Color(theme.primary);
    widget.addSpacer(8);
  }
  
  addWeatherInfo(widget, weather, theme) {
    const stack = widget.addStack();
    stack.layoutHorizontally();
    
    const temp = stack.addText(`${Math.round(weather.temp)}°`);
    temp.font = Font.boldSystemFont(40);
    temp.textColor = new Color(theme.primary);
    
    stack.addSpacer(12);
    
    const conditionStack = stack.addStack();
    conditionStack.layoutVertically();
    
    const condition = conditionStack.addText(weather.condition);
    condition.font = Font.systemFont(14);
    condition.textColor = new Color(theme.primary);
    
    const feels = conditionStack.addText(`Feels like ${Math.round(weather.feelsLike)}°`);
    feels.font = Font.systemFont(12);
    feels.textColor = new Color(theme.accent);
    
    widget.addSpacer(12);
  }
  
  addRecommendation(widget, weather, theme) {
    const recommendation = this.getRecommendation(weather);
    const rec = widget.addText(recommendation);
    rec.font = Font.systemFont(12);
    rec.textColor = new Color(theme.accent);
  }
  
  getRecommendation(weather) {
    if (weather.temp < 10) return "🧥 Wear a warm jacket";
    if (weather.temp > 30) return "☀️ Stay cool and hydrated";
    if (weather.pop > 0.7) return "☔ Bring an umbrella";
    if (weather.condition === 'Clear') return "🌞 Great day for outdoors!";
    return "Have a wonderful day! 😊";
  }
  
  async fetchWeather() {
    // Your weather API call here
    return {
      temp: 22,
      feelsLike: 24,
      condition: 'Clear',
      pop: 0.1
    };
  }
}

// Create and show widget
const smartWidget = new SmartWeatherWidget();
const widget = await smartWidget.create();

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}

Script.complete();
```

## 🎓 Learning Resources

### Official Documentation
- [Scriptable Documentation](https://docs.scriptable.app/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [iOS App Extensions](https://developer.apple.com/app-extensions/)

### Recommended Reading
1. **WidgetKit** - Understanding iOS widgets
2. **Core ML** - On-device machine learning
3. **Natural Language Framework** - Text processing
4. **EventKit** - Calendar and reminders
5. **Contacts Framework** - Contact management

### Community Resources
- Scriptable subreddit
- Automators.fm forum
- RoutineHub for sharing scripts

## 📝 Next Steps

1. **Start Small**: Implement one feature at a time
2. **Test Thoroughly**: Test on different iPhone models and iOS versions
3. **Gather Feedback**: Share with beta testers
4. **Iterate**: Improve based on real usage
5. **Document**: Keep your code well-documented
6. **Share**: Contribute back to the community

---

**Happy Coding!** 🚀

For comprehensive details, see [IPHONE_FEATURES_SUGGESTIONS.md](IPHONE_FEATURES_SUGGESTIONS.md)
