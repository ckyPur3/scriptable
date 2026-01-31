# Table of Contents

- [🤖 AI Features & Autonomous Capabilities](#-ai-features--autonomous-capabilities) ⭐ NEW!
- [Interactive Tools & Setup](#interactive-tools--setup)

## Original Scripts
- [LSWeather](#lsweather)
- [LSForecast](#lsforecast)
- [FavContacts](#favcontacts)
- [LSMatrix](#lsmatrix)
- [LSQuotes](#lsquotes)

## Development Tools for iOS Developers
- [iOSDevTools](#iosdevtools) - Comprehensive tool library
- [DevGitHub](#devgithub) - GitHub integration
- [DevAPITester](#devapitester) - API testing and debugging
- [DevCodeSnippets](#devcodesnippets) - Code snippet manager

## AI & Agent Tools
- [AIPromptManager](#aipromptmanager) - AI prompt templates and management
- [AgentOrchestrator](#agentorchestrator) - Agent orchestration and workflow automation

Note: all shortcuts are updated to now run on iOS 15. Download using the links below.
___

## 🤖 AI Features & Autonomous Capabilities

**NEW!** This repository now includes advanced AI-powered features that enable autonomous operation on your iPhone!

### AI-Powered Scripts

- **🧠 AIAssistant.js** - Your personal AI assistant for quick tasks
  - Ask questions and get instant answers
  - Summarize clipboard text
  - Analyze images with AI vision
  - Generate creative content
  - Improve and rewrite text
  - Extract information intelligently

- **📱 SmartNotifications.js** - Context-aware intelligent notifications
  - Morning briefings with personalized content
  - Weather-based alerts and suggestions
  - Calendar summaries and reminders
  - Evening reflections
  - Motivational messages

- **📸 AIPhotoAnalyzer.js** - Analyze photos with AI
  - Describe photo content in detail
  - Extract text from images (OCR)
  - Identify objects and scenes
  - Suggest tags for organization
  - Generate accessibility descriptions
  - Get photo improvement tips

- **⏰ SmartReminders.js** - Natural language reminder creation
  - "Remind me tomorrow at 3pm to call mom"
  - Smart time and date interpretation
  - Priority detection
  - Recurring reminder support

### AI & API Libraries

- **🛠️ lib/ai-utils.js** - Comprehensive AI utilities
  - Support for OpenAI and Claude APIs
  - Image analysis capabilities
  - Text summarization and improvement
  - Smart automation helpers
  - Sentiment analysis
  - Content generation

- **🔌 lib/api-helpers.js** - External API integration
  - REST API client
  - Webhook manager (IFTTT, Zapier, Make)
  - Authentication helpers
  - Pre-built integrations: Notion, Airtable, GitHub, Slack, Discord, Telegram
  - Rate limiting
  - Data storage utilities

### Quick Start

1. **Install**: Copy scripts to your Scriptable folder in iCloud Drive
2. **Configure**: Set your OpenAI or Claude API key in the scripts
3. **Run**: Open any AI script in Scriptable app for interactive menus

### Full Documentation

📖 See **[AI_FEATURES.md](AI_FEATURES.md)** for complete documentation including:
- Detailed feature descriptions
- Setup and configuration guides
- Usage examples and code snippets
- External integration tutorials
- Best practices and troubleshooting

### Example Use Cases

- **Daily Automation**: Morning briefings, evening summaries, weather alerts
- **Photo Management**: Analyze and organize photos with AI tags
- **Smart Reminders**: Create reminders using natural language
- **Text Processing**: Summarize articles, extract info, improve writing
- **External Integrations**: Connect to Notion, Slack, GitHub, and more
- **Webhooks**: Trigger IFTTT, Zapier, or custom automations

### Requirements

- iOS 15 or later
- Scriptable app
- API key from OpenAI or Anthropic (Claude)
- Internet connection for AI features

___

## Interactive Tools & Setup

All scripts now include **interactive setup menus** when run directly in the Scriptable app! This makes it easy to configure settings, preview changes, and customize your widgets without editing code.

### Features

- 🎨 **Visual Configuration** - Use intuitive menus to select themes, colors, and layouts
- ⚙️ **Easy Settings** - Configure all script options through interactive prompts
- 👁️ **Live Preview** - See changes immediately when running scripts in-app
- 💾 **Quick Actions** - Set up widget behaviors with a few taps
- 📋 **Settings Viewer** - Review all current settings at a glance

### Interactive Tools Library

The `lib/interactive-utils.js` library provides reusable interactive components:

- **Menu Selection** - Choose from multiple options
- **Alert Dialogs** - Confirmations and information messages
- **Text Input Prompts** - Enter API keys, custom text, etc.
- **Quick Action Selectors** - Configure contact actions for FavContacts
- **Theme Pickers** - Browse and select color themes
- **Configuration Wizards** - Multi-step setup processes

### Demo Script

Run **InteractiveToolsDemo.js** in the Scriptable app to see all interactive features in action:

- Theme selector demonstrations
- Menu selection examples
- Configuration wizard walkthrough
- Text input prompts
- Quick action selectors
- Save/load configuration demos

### Using Interactive Setup

1. **Run any script in the Scriptable app** (not as a widget or from Shortcuts)
2. **Interactive setup menu will appear** with configuration options
3. **Select options** to configure the script:
   - Choose layouts, themes, and styles
   - Set API keys and preferences
   - Configure display options
   - View current settings
4. **Generate preview** to see your configured overlay/widget

**Note:** Interactive setup changes are temporary (for preview only). To make permanent changes, edit the configuration section of the script or pass parameters from Shortcuts app.

### Script-Specific Interactive Features

#### FavContacts Interactive Setup
- 🎨 Choose from 40+ color themes
- 👤 Select avatar style (contact photo, initials, or symbol)
- ⚡ Configure quick actions (message, FaceTime, email, WhatsApp, etc.)
- 📋 View and verify current settings

#### LSWeather Interactive Setup
- 📐 Select from pre-defined layouts (welcome, minimal, maximal, etc.)
- 🔑 Set OpenWeather API key
- 🌡️ Configure weather units and language
- 📅 Calendar display options
- 💬 Quote settings and categories
- 📋 View all current settings

#### LSForecast Interactive Setup
- 🎨 Choose accent color (presets or custom hex)
- 🔑 Set OpenWeather API key
- 🌡️ Configure weather units and language
- ⏰ Set number of hours/days to display
- 📊 Display settings (icons, graphs, transparency)

#### LSMatrix Interactive Setup
- 🌓 Dark/Light mode toggle
- 🔢 Binary vs Matrix character style
- 🔐 Cryptic text option
- 💬 Matrix movie quotes browser
- 📅 Calendar event settings
- ⏰ 12/24 hour time format

#### LSQuotes Interactive Setup
- 💬 Choose quote source (random API or custom)
- 📝 Edit custom quotes
- 🏷️ Select quote categories (business, wisdom, faith, etc.)
- 📏 Text size and appearance settings
- 🌓 Dark/Light mode

___

## LSWeather

A Scriptable script to add weather & calendar information on the lock screen. The script is meant to be called from Shortcuts app.
It is fully customizable script giving you access to change each data element on the lock screen. 
The script generates an overlay image which is embedded on top of a wallpaper.

![LSWeather](images/LSWeather.png) ![LSWeather_welcome](images/LSWeather_welcome.png)
![LSWeather_showMyWork](images/LSWeather_showMyWork.png) ![LSWeather_feelMotivated](images/LSWeather_feelMotivated.png)
![LSWeather_minimalCalendar](images/LSWeather_minimalCalendar.png) ![LSWeather_maximalWeather](images/LSWeather_maximalWeather.png)

### Features - LSWeather

1. Shows weather, calendar and random quote on the lock screen.
1. Fully automated. Create Automations to run this script/shortcut every hour to get most recent information on your lock screen without manual intervention.
1. Choose from many pre-defined layouts or create your own layout.
1. Use custom SF symbols for weather icons.
1. Supports multiple calendars and configure 2 separate sections of calendars for *work* and *personal* events.
1. Marked ongoing events for better attention.
1. Fully customisable giving you control of each data element.
   - Easily create new data elements for any of the existing fields.
   - Write custom functions to return data in the format that you need.
1. Supports SF symbols as prefixes. 
   - Learn more about SFSymbols [here](https://developer.apple.com/sf-symbols/).
   - Check full list by downloading the macOS app from the above site or visit [sfsymbols.com](https://sfsymbols.com).
1. Run in *test* mode without calling various APIs
1. Compatible with almost all devices running iOS 14.4+. The Shortcut can handle any resolution wallpaper.

### Installation - LSWeather

1. Download and extract the content of this repository.
1. Download the script `LSWeather.js` to **Scriptable** folder in your iCloud Drive.

```javascript
    iCloud Drive/
    ├─ Scriptable/
    │  ├─ LSWeather.js
```

1. Launch Scriptable and make sure that `LSWeather` is listed in the Scripts view.
1. Run the script to check if its working properly. A quicklook window with the default layout overlay will open.
1. Configure wallpapers. You can use either Photos Album or iCloud Folder to use as source of wallpapers
   - Photos Album
     - Create an Album in Photos with name **LSWeather**.
     - Add *some* wallpapers to this Album.
     - Shortcut will automatically pick up a wallpaper at random from this album.
   - iCloud Folder
     - Create a folder in iCloud -> Shortcuts with the name **LSWeather**.
     - Add *some* wallpapers to this folder.
     - Shortcut will automatically pick up a wallpaper at random from this folder.
1. Download and install this [shortcut](https://routinehub.co/shortcut/8282/).
1. Configure the shortcut as mentioned below.
1. Run the shortcut.

### Shortcut Configuration - LSWeather

1. Open the shortcut in Shortcuts app.
1. Set the dictionary key value `layout` to one of the predefined values `'welcome'`, `'minimalWeather'`, `'feelMotivated'`, `'minimalCalendar'`, `'showMyWork'` and `'maximalWeather'`.
1. Set the dictionary key value `apiKey` to your openWeather API key.
   - Note: if `layout` and `apiKey` are not passed from Shortcuts app, it should be defined in the LSWeather script.
1. You can use either Photos Album or iCloud Folder to pick wallpapers for this script. To change that, look for the dictionary with `Photos` and `iCloud` boolean values and set either of them to `true`. Default is Photos.

### Script Configuration - LSWeather

1. OpenWeather API
   - Open the script in the Scriptable editor and add your openweather API key at `const WEATHER_API_KEY=`
   - Get your own API key for free [here](https://home.openweathermap.org/api_keys). Account is needed.
   - Note: Value passed from Shortcuts app will over-ride the API key value set in the script.

1. Template
   - Set `LAYOUT` to one of the predefined values `'welcome'`, `'minimalWeather'`, `'feelMotivated'`, `'minimalCalendar'`, `'showMyWork'` and `'maximalWeather'`.
   - Or use your customer layout by setting `LAYOUT = 'custom'`.
   - Note: Value passed from Shortcuts app will over-ride values set in the script.

1. Configure Weather Details
   - To show/hide weather details set `WEATHER_SHOW_WEATHER` to `true` or `false`. Hiding weather details will not call the openweather API.
   - To change weather units set `WEATHER_UNITS`. Default is `metric`.
   - To change locale/language set `WEATHER_LANG`. Default is `en`.
   - You can get valid values of `WEATHER_UNITS` & `WEATHER_LANG` [here](https://openweathermap.org/api/one-call-api).

1. Configure Calendar Details
   - To show/hide calendar details set `CALENDAR_SHOW_CALENDARS` to `true` or `false`.
   - To show/hide all day events set `CALENDAR_SHOW_ALL_DAY_EVENTS` to `true` or `false`.
   - To show/hide tomorrow events set `CALENDAR_SHOW_TOMORROW_EVENTS` to `true` or `false`.
   - Set-up personal calendars to be displayed with `CALENDAR_PERSONAL_CALENDARS`.
     - Ex. `const CALENDAR_PERSONAL_CALENDARS = ['Gmail','Football'];`.
     - If this variable is empty (`[]`), script will automatically fetch the default calendar for iOS.
   - Set-up work calendars to be displayed with `CALENDAR_WORK_CALENDARS`.
     - Ex. `const CALENDAR_WORK_CALENDARS = ['Work'];`.
     - If this variable is empty (`[]`), script will not display anything. In this case also set `hide` value to 1 for the layout item `workText` (See details below).
   - Maximum personal events to show set `CALENDAR_PERSONAL_MAX_EVENTS`.
   - Maximum work events to show set `CALENDAR_WORK_MAX_EVENTS`.
   - Set-up colors for different calendars with variable `CALENDAR_COLORS`.
   - To turn on/off calendar colors set `CALENDAR_SHOW_COLORS` to `true` or `false`.

1. Configure Quote Details
   - To show/hide quotes set `QUOTE_SHOW_QUOTES` to `true` or `false`. Hiding quotes details will not call the API.
   - Change quote tags with `QUOTE_TAGS` to get quotes for specific categories.
     - Ex. `const QUOTE_TAGS=['wisdom','friendship'].
     - Leave blank to get random quote across all categories.
     - You can get list of all valid tags [here](https://api.quotable.io/tags).
   - To change maximum length of quotes to be fetched set `QUOTE_MAX_LENGTH`.
   - To change quotes wrap length set `QUOTE_WRAP_LENGTH`.

1. Configure Update Notification
   - Whenever an update is available on GitHub, a red update notification will appear on the top right corner. 
   - You can configure the number of days the script should look for an update by setting `UPDATE_CHECK_DAYS`.
   - Set above value to 0 to stop looking for updates (not recommended).

1. To show/hide last wallpaper updated time set `SHOW_LAST_UPDATED_TIME` to `true` or `false`.

1. To test the script without calling the openweather & quotable APIs set `TESTING` to `true`.

1. To change the layout of the data elements update dictionary `layouts`. Checking items which you can change easily to play around with the layout.
   - [ ] source: Source of the data. Valid values are "weather", "calendar", "quote", "text" & "function". 
         When using "function", the key should be the function name and function should return the string to be displayed.
         When using "text", the key should be the text to be displayed.
   - [ ] key: JSON key returned by functions fetchWeather(), fetchCalendar(), fetchQuote(). When the source is "text", key will be displayed as data.
   - [x] prefix: If present, will be prefixed to the data. SFSymbols are allowed in prefix. Use "SFSymbol|symbolName".
   - [x] suffix: If present, will be suffixed to the data. Use "temperature" for temperature data and "speed" for wind data, any other string accepted.
   - [x] x: x co-ordinate of the data element. Valid values are "left_margin", "right_margin", "center" and numbers. You can use relative co-ordinates like "center + 100". 
         Use -ve values to start from right margin i.e -50 will place the element at 50 pixels from the right margin.
   - [x] y: y co-ordinate of the data element. Valid values are "top_margin", "bottom_margin", "center" and numbers. You can use relative co-ordinates like "center + 100". 
   - [x] w: Width of the data element. Valid values are "half", "full" and numbers. You can use relative width like "half - 100".
   - [x] h: Height of the data element. Valid values are "half", "full" and numbers. You can use relative height like "half - 100".
   - [x] font: Font for the data element. Valid values are Font type objects. Predefined fonts are "ultraSmall", "extraSmall", "small", "medium", "large", "veryLarge", "extraLarge", "big" and "veryBig".
   - [x] color: Color for the data element (except icon). Valid values are "light", "dark" or hex code of the color. If null, white will be used.
   - [x] align: Alignment of the data element within the data rectangle. Valid values are "left", "right" or "center".
   - [x] hide: 0 or null to show this data element, 1 to hide, 2 for sunrise/sunset only (to show only 1 of them based on the time of the day).
   - [x] bold: make text bold. Valid values are true or false.


1. Logging
   - To generate logs in the iCloud drive when script is run through shortcut set `LOG_TO_FILE` to `true`. Only set this to true to debug an issue.
   - Check script logs in **LSWeatherLogs** folder in iCloud/Scriptable (logs are only saved to file when the script is run from Shortcuts, else logs are displayed on the console).

### APIs Used - LSWeather

1. OpenWeather API - [https://openweathermap.org](https://openweathermap.org).
1. Quotable API - [https://github.com/lukePeavey/quotable](https://github.com/lukePeavey/quotable).

### Credits - LSWeather

Below widgets/scripts have helped while coding for this script.

1. [Futcal for Scriptable](https://github.com/thejosejorge/futcal-for-scriptable).
1. [Terminal Widget](https://github.com/yaylinda/scriptable).
1. [termiWidget](https://gist.github.com/spencerwooo/7955aefc4ffa5bc8ae7c83d85d05e7a4).
1. Thanks to user [schl3ck](https://talk.automators.fm/u/schl3ck) for the code to tint SF symbols in drawContext which is currently not possible in Scriptable.

### Known Issues - LSWeather

1. The API quotable is sometimes slow and doesn't respond on time. You can set `const QUOTE_SHOW_QUOTES = 'false'` to stop using this API if you are facing this problem.

___

## LSForecast

A Scriptable script to add weather forecast to your lock screen. The script is meant to be called from Shortcuts app.
The script generates an overlay image which is embedded on top of a wallpaper.

![LSForecast](images/LSForecast.png) ![LSForecast_POP_Night](images/LSForecast_POP_Night.png)

### Installation - LSForecast

1. Download and extract the content of this repository.
1. Download the script `LSForecast.js` to **Scriptable** folder in your iCloud Drive.

```javascript
    iCloud Drive/
    ├─ Scriptable/
    │  ├─ LSForecast.js
```

1. Launch Scriptable and make sure that `LSForecast` is listed in the Scripts view.
1. Run the script to check if its working properly. A quicklook window with the default layout overlay will open.
1. Configure wallpapers. You can use either Photos Album or iCloud Folder to use as source of wallpapers
   - Photos Album
     - Create an Album in Photos with name **LSForecast**.
     - Add *some* wallpapers to this Album.
     - Shortcut will automatically pick up a wallpaper at random from this album.
   - iCloud Folder
     - Create a folder in iCloud -> Shortcuts with the name **LSForecast**.
     - Add *some* wallpapers to this folder.
     - Shortcut will automatically pick up a wallpaper at random from this folder.
1. Download and install this [shortcut](https://routinehub.co/shortcut/8378/).
1. Configure the shortcut as mentioned below.
1. Run the shortcut.

### Shortcut Configuration - LSForecast

1. Open the shortcut in Shortcuts app. 
1. Set the dictionary key value `accent` to hexadecimal color code e.g. #FF00FF.
1. Set the dictionary key value `alpha` to set the transparency of the graph. 0 is for fully transparent. 1 is opaque.
1. Set the dictionary key value `apiKey` to your openWeather API key.
   - Note: if `apiKey` is not passed from Shortcuts app, it should be defined in the LSForecast script.
1. You can use either Photos Album or iCloud Folder to pick wallpapers for this script. To change that, look for the dictionary with `Photos` and `iCloud` boolean values and set either of them to `true`. Default is Photos.

### Script Configuration - LSForecast

1. To show/hide weather icons for hourly forecast set `WEATHER_SHOW_HOURLY_ICONS` to either `true` or `false`
1. To show/hide POP (probability of precipitation graph) hourly forecast set `WEATHER_SHOW_POP_GRAPH` to either `true` or `false`
1. To show/hide POP values set `WEATHER_SHOW_POP_VALUES` to either `true` or `false`
1. To show/hide POP graph when POP data is not available (i.e. 0), set `WEATHER_SHOW_ZERO_POP_VALUES` to either `true` or `false`
1. To test the script without calling the openweather set `TESTING` to `true`.
1. To generate logs when script is run through shortcut set `LOG_TO_FILE` to `true`. Only set this to true to debug an issue.
1. Check script logs in **LSForecastLogs** folder in iCloud/Scriptable (logs are only saved to file when the script is run from Shortcuts, else logs are displayed on the console).

### Languages Supported - LSForecast

1. English (en), Portuguese (pt), Spanish (es), French (fr), German (de), Hindi (hi).
   - Translations are done using google translate so might not be accurated.
1. Raise an issue in GitHub or email me at <ajatkj@yahoo.co.in> to fix a translation issue or add translation for new language.

### APIs Used - LSForecast

1. OpenWeather API - [https://openweathermap.org](https://openweathermap.org).

___

## FavContacts

A Scriptable Favourite Contact's widget to quickly call, message, facetime & more your favourite contacts.
Widgets are available in all 3 sizes.

![FavContactsWidgets](images/FavContactsWidgets.png)

### Installation - FavContacts

1. Download and extract the content of this repository.
1. Download the script `FavContacts.js` to **Scriptable** folder in your iCloud Drive.

```javascript
    iCloud Drive/
    ├─ Scriptable/
    │  ├─ FavContacts.js
```

1. Launch Scriptable and make sure that `FavContacts` is listed in the Scripts view.
1. Run the script to check if its working properly. A quicklook widget with the default settings will open.

### Features - FavContacts

1. Call, message, facetime, mail, whatsapp, telegram your favourite people directly from home screen.
1. You can set up-to 4 actions (including the default action to call when you click on the avatar).
1. Easily configure different avatar styles and quick actions.
1. Nearly 40 awesome color themes to chose from.
1. Suppports transparent widgets. Requires package [no-background](https://github.com/supermamon/scriptable-no-background).
   - Once you have installed no-background package, run the script in app and follow on screen instructions to generate wallpaper slices.
1. Supports customizable quick actions per widget (See Set-up Favourites section). 
Note: Due to iOS restrictions, any action on Widget will first call scriptable app and then call the respective action. 

### Set-up Favourties - FavContacts

There are 3 ways to set-up favourite contacts list. Listing them here in order of preference.

1. Favourites Group: Create a group name "Favourites" in Contacts app via iCloud or any other app or sync service which provides it. Add contacts to this group.
1. If you cannot do option 1, you can "mark" individual contacts to be picked up by this script using following method-
   - Go to the contact you want to mark favourite, click on **Edit**
   - Scroll down and click on the **+** sign next to **add social profile**
   - Click on the default profile name and scroll down to the bottom and click on **Add Custom Service**
   - Give the service name as **Scriptable** and Social Profile as **Scriptable** as shown below.  
   ![FavContactsContact](images/FavContactsContact.jpg)
   - Click on Done.
1. You can also provide contact names in the script manually. This is not recommended as it will get over-written everytime you update the script.
1. For custom quick action per contact, use the **Scriptable** service to give custom actions as shown below.  
   ![FavContactsCustomActions](images/FavContactsCustomActions.jpg)

```javascript
let allcontacts = [
    {firstname: 'Firstname', lastname: 'Lastname'},
    {firstnmae: 'Another', lastname: 'Contact'},
]
```

1. Run the script in-app to update the contacts cache which is used to show contacts on the widget.
1. **Note: You will need to run the script *in-app* everytime you make any changes to contact list using either of the 3 options above**

### Script Configuration - FavContacts

1. To show/hide contact names set `SHOW_NAMES` to either `true` or `false`.
1. Choose different avatar styles ("contact", "symbol" or "initials") by setting `AVATAR_STYLE`.
1. Choose from around 40 awesome themes by setting `THEME`. Refer themes section below.
1. Set array `ITEMS_TO_SHOW` to set quick actions. 
   Choose from "facetimeVideo", "facetimeAudio", "message", "email", "spark", "gmail", "outlook", "whatsapp", "telegram", "twitter", "tweetbot", "twitterrific".
   Supported apps are-
   - Messages
   - Facetime Audio/Video
   - Whatsapp
   - Telegram
   - Default mail client
   - Spark Mail
   - Google Mail (Gmail)
   - Outlook Mail
   - Twitter
   - Tweetbot
   - Twitterrific
   - **Note: to use twitter quick action, set Social Profile for "Twitter" with users twitter handle.**

   ![FavContactsTwitter](images/FavContactsTwitter.png)

1. Set no. of quick action items to display using `NO_OF_ITEMS_TO_SHOW`. Minimum value 2, maximum 3. Set it to 0 to hide all actions.
1. For testing purpose you can use `SHOW_GUIDES` and `PREVIEW WIDGET` variables.
1. For minimal set-up, set `SHOW_NAMES` to `false` and `NO_OF_ITEMS_TO_SHOW` to `0`.

![FavContactsMinimal](images/FavContactsMinimal.png)

### Widget Configuration - FavContacts

1. Add multiple widgets by passing widget no. in widget arguments.  
   - No argument or widget no. 0 defaults to 1st widget  
   `1`
1. Set-up different color themes for different widgets-  
   `{"theme": "electricBlueAqua}`
1. Use different avatar style for different widgets-  
   `{"avatar": "contact"}` or `{"avatar": "initials"}`
1. Combine one or more arguments above: Set-up widget no. 2 with theme *islandGreen*-  
   `2,{"theme": "islandGreen", "avatar": "initials"}`
1. Set-up theme as "transparent" and give widget position as argument-  
   `{"theme": "transparent", "pos":"top-right"}`  
   or  
   `{"pos":"top"}`  
   Valid positions are:  
   Small widget: "top-right","top-left","middle-right","middle-left","bottom-right","bottom-left"  
   Medium widget: "top","middle","bottom"  
   Larget widget: "top","bottom"  
   Requires package [no-background](https://github.com/supermamon/scriptable-no-background).

![FavContactsSettings](images/FavContactsSettings.png) ![FavContactsSettings](images/FavContactsSettingsTransparent.png)

### Themes - FavContacts

![FavContactsThemes](images/FavContactsThemes.png)

Theme names should be in *camelCase*. Ex. **Sailor Blue Mint** is **sailorBlueMint** and so on.

Note: Some themes are inspired by Moleskine Studio's Timepage app. Must download app!

___

## LSMatrix

A Scriptable script to generate Matrix style wallpapers for your lock screen.
The script is embedded in the Shortcuts app. In standalone mode, weather details will not be fetched.

![LSMatrix_Dark](images/LSMatrix_Dark.png) ![LSMatrix_Light](images/LSMatrix_Light.png)

### Features - LSMatrix

1. The script displays 1 of many famous quotes from the Matrix Trilogy movies. You can choose to turn if off.
1. Show current weather details.
1. Show upcoming events and configure no. of events to be displayed.
1. Show/hide all-days events.
1. Change the background style to use either binary (0's & 1's) or use the original Matrix style [half-width kana](https://en.wikipedia.org/wiki/Half-width_kana).
1. Enable/disable cryptic style text (with this enabled, some of the letters are changed at random to use greek letters).
1. Supports both dark & light wallpapers (can be system driven or override at Shortcut level)
1. Choose from 24 or 12 hour time format.
1. Show last updated time.
1. Very easily configurable.

### Dependencies - LSMatrix

1. If your system font uses any multi-byte characters (like Hindi) you will need to download the package **GraphemeSplitter** included in my repo to display text correctly on the screen.
1. This package is **not** developed by me, I have merely included it my repository by making minor changes to be able to use in Scriptable.
1. Please give credit to [orling](https://github.com/orling/grapheme-splitter) on GitHub by starring his repo.
1. If the package is not downloaded, each byte of the character will be splitted and displayed on the wallpaper.

### Installation - LSMatrix

1. The script is embedded in the Shortcut so you don't need to actually download the script (unless you want to check it out).
1. Download and install this [shortcut](https://routinehub.co/shortcut/8815/).
1. Set-up Shortcut Automation to run the Shortcut at regular intervals.
1. Carry on further if you want to run the script in Scriptable in standalone mode (Note: in this mode weather details will not be fetched).
1. Download the script `LSMatrix.js` to **Scriptable** folder in your iCloud Drive.

```javascript
    iCloud Drive/
    ├─ Scriptable/
    │  ├─ LSMatrix.js
```

1. Launch Scriptable and make sure that `LSMatrix` is listed in the Scripts view.
1. Run the script to check if its working properly. A quicklook window with Matrix wallpaper will open.

### Shortcut Configuration - LSMatrix

![LSMatrix_Shortcut_Config](images/LSMatrix_Shortcut_Config.png)

### Script Configuration - LSMatrix

1. To show/hide movie quotes set `SHOW_QUOTES` to either `true` or `false`
1. To show/hide last updated time `SHOW_LAST_UPDATED` to either `true` or `false`
1. To show/hide weather datails set `SHOW_WEATHER` to either `true` or `false`
1. To show/hide cryptic text for all screen data, set `CRYPTIC_TEXT` to either `true` or `false`
1. Configure calendars to display by setting `CALENDAR_NAMES` array. Set this to blank or `[]` to show all calendars.
1. To limit no. of upcoming calendar events to display, set `CALENDAR_MAX_EVENTS`. Value 0 is to hide all calendar events.
1. To show/hide all day events set `CALENDAR_SHOW_ALL_DAY_EVENTS` to either `true` or `false`
1. Switch between dark & light wallpapers by setting `DARK_MODE` to `true` or `false`. To use system appearance set `SYSTEM_DARK_MODE` to `true`.
1. To generate binary style wallpaper, set `BINARY_MODE` to `true`. Default is `false` which will use original Matrix style font.

### Languages Supported - LSMatrix

1. English (en), Portuguese (pt), Spanish (es), French (fr), German (de), Hindi (hi).
   - Translations are done using google translate so might not be accurated.
1. Raise an issue in GitHub or email me at <ajatkj@yahoo.co.in> to fix a translation issue or add translation for new language.

___

## LSQuotes

A Scriptable script to add a random quote or a custom quote on your lockscreen.
The script is embedded in the Shortcuts app. In standalone mode you will only see an overlay.

![LSQuotes_1](images/LSQuotes_1.png) ![LSQuotes_2](images/LSQuotes_2.png)

### Features - LSQuotes

1. Display a random quote from api.quotable.com
1. You can choose from dozens of categories or all categories
1. Use a custom quote to remind yourself about important things in life
1. Very easily configurable.

### Installation - LSQuotes

1. Download and extract the content of this repository.
1. Download the script `LSQuotes.js` to **Scriptable** folder in your iCloud Drive.

```javascript
    iCloud Drive/
    ├─ Scriptable/
    │  ├─ LSQuotes.js
```

1. Launch Scriptable and make sure that `LSQuotes` is listed in the Scripts view.
1. Run the script to check if its working properly. A quicklook window with the default layout overlay will open.
1. Configure wallpapers. You can use either Photos Album or iCloud Folder to use as source of wallpapers
   - Photos Album
     - Create an Album in Photos with name **Wallpapers**.
     - Add *some* wallpapers to this Album.
     - Shortcut will automatically pick up a wallpaper at random from this album.
   - iCloud Folder
     - Create a folder in iCloud -> Shortcuts with the name **Wallpapers**.
     - Add *some* wallpapers to this folder.
     - Shortcut will automatically pick up a wallpaper at random from this folder.
1. Download and install this [shortcut](https://routinehub.co/shortcut/11402/).
1. Configure the shortcut as mentioned below.
1. Run the shortcut.

### Shortcut Configuration - LSQuotes

![LSMatrix_Shortcut_Config](images/LSQuotes_Shortcut_Config.jpg)

### Script Configuration - LSQuotes

1. To change the text size, set `TEXT_SIZE` to `small`, `medium` or `large`
1. To use dark box with light text set `DARK_MODE` to either `true` else `false`
1. Configure categories setting `QUOTE_TAGS_DICTIONARY` dictionary. Go to [this](https://api.quotable.io/tags) link to get list of available tags/categories.
1. To limit no. of characters in a quote, set `QUOTE_MAX_LENGTH`.

___

# Development Tools for iOS Developers

The following tools provide comprehensive development utilities specifically designed for iOS iPhone developers using Scriptable.

## iOSDevTools

A comprehensive utility library providing essential functions for iOS development.

### Features - iOSDevTools

1. **Device Utilities**
   - Get detailed device information (model, OS version, battery, storage)
   - Check battery status and low battery mode
   - Network connectivity testing

2. **Network & API Utilities**
   - HTTP requests with automatic retry logic and exponential backoff
   - Request caching with TTL support
   - Robust error handling

3. **File & Storage Management**
   - Save/read data with automatic JSON serialization
   - Directory creation and management
   - File listing and deletion
   - Support for both iCloud and local storage

4. **UI & Notification Utilities**
   - Custom alerts with multiple options
   - Input dialogs
   - Local notifications with scheduling
   - Clipboard operations

5. **Security & Keychain**
   - Secure storage for sensitive data
   - Easy keychain access functions
   - Token and credential management

6. **Logging & Debugging**
   - Advanced logger with multiple levels (INFO, WARN, ERROR, DEBUG)
   - File-based logging
   - Timestamp support

7. **Utility Functions**
   - Date formatting and relative time
   - UUID generation
   - Debounce and throttle functions
   - Sleep/delay utilities

### Installation - iOSDevTools

1. Download `iOSDevTools.js` to your Scriptable folder
2. Import in your scripts: `const DevTools = importModule('iOSDevTools');`
3. Use any of the provided functions

### Usage Example - iOSDevTools

```javascript
const DevTools = importModule('iOSDevTools');

// Get device info
const deviceInfo = DevTools.getDeviceInfo();
console.log(`Device: ${deviceInfo.model}, iOS ${deviceInfo.systemVersion}`);

// Make API request with retry
const result = await DevTools.httpRequestWithRetry('https://api.github.com/users/octocat');
if (result.success) {
    console.log(result.data);
}

// Save to keychain
DevTools.saveToKeychain('api_token', 'my-secret-token');

// Save data to file
DevTools.saveToFile('mydata.json', { key: 'value' });

// Create logger
const logger = new DevTools.Logger('MyApp', true);
logger.info('Application started');
```

___

## DevGitHub

GitHub integration for managing repositories, issues, and pull requests directly from your iPhone.

### Features - DevGitHub

1. **Repository Management**
   - List and browse repositories
   - View repository details and stats
   - Search repositories

2. **Issues & Pull Requests**
   - List open/closed issues
   - Create new issues
   - View pull requests
   - Track PR status

3. **Notifications**
   - Check GitHub notifications
   - Filter unread notifications

4. **Commits**
   - View recent commits
   - Commit history

5. **Dashboard Widget**
   - Repository stats
   - Open issues and PRs count
   - Star and fork counts

### Installation - DevGitHub

1. Download `DevGitHub.js` and `iOSDevTools.js` to Scriptable folder
2. Run the script and enter your GitHub personal access token
3. Token is securely stored in iOS keychain

### Setup - DevGitHub

1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer Settings → Personal Access Tokens
   - Create new token with `repo`, `user`, and `notifications` scopes
   - Copy the token

2. Run `DevGitHub.js` and enter the token when prompted

### Widget Setup - DevGitHub

Add widget to home screen with parameter: `owner/repo`
Example: `github/github`

### Usage - DevGitHub

- **App Mode**: Quick actions menu for repository management
- **Widget Mode**: Shows repository statistics

___

## DevAPITester

Comprehensive API testing and debugging tool for iOS developers.

### Features - DevAPITester

1. **Request Builder**
   - Support for GET, POST, PUT, DELETE methods
   - Custom headers configuration
   - JSON request body support
   - Request timeout settings

2. **Request History**
   - Automatic request logging
   - Response time tracking
   - Success/failure tracking
   - View past requests

3. **Saved Requests**
   - Save request templates
   - Quick re-execution
   - Organize by name

4. **Benchmarking**
   - Performance testing
   - Multiple iteration support
   - Average, min, max response times
   - Success rate tracking

5. **Response Viewer**
   - JSON/text response display
   - Copy to clipboard
   - Response headers
   - Status codes

### Installation - DevAPITester

1. Download `DevAPITester.js` and `iOSDevTools.js` to Scriptable folder
2. Run the script to access the API testing interface

### Usage - DevAPITester

1. **New Request**: Build and execute custom API requests
2. **Saved Requests**: Access previously saved request templates
3. **History**: Review past API calls and responses
4. **Quick Test**: Rapidly test a URL with GET request

___

## DevCodeSnippets

Code snippet manager to save, organize, and reuse code snippets on your iPhone.

### Features - DevCodeSnippets

1. **Snippet Management**
   - Save code snippets with syntax
   - Organize by categories
   - Tag-based organization
   - Full-text search

2. **Pre-loaded Snippets**
   - Async/await patterns
   - Retry logic with backoff
   - Debounce functions
   - API request templates
   - Scriptable widget templates
   - Cache management
   - Object utilities

3. **Organization**
   - Categories: Patterns, Utilities, Scriptable, Network, Storage
   - Tag system for cross-referencing
   - Search functionality

4. **Quick Access**
   - Browse by category
   - Browse by tags
   - Search across all fields
   - One-tap copy to clipboard

### Installation - DevCodeSnippets

1. Download `DevCodeSnippets.js` and `iOSDevTools.js` to Scriptable folder
2. Run the script to access the snippet library

### Usage - DevCodeSnippets

- **Browse**: View snippets organized by category
- **Search**: Find snippets by keyword
- **Tags**: Browse by tag
- **New Snippet**: Add your own code snippets

___

# AI & Agent Tools

## AIPromptManager

AI prompt template library and management system for developers working with AI assistants.

### Features - AIPromptManager

1. **Pre-built Prompt Templates**
   - Code Review
   - Bug Fix Assistant
   - API Documentation Generator
   - Test Case Generator
   - Code Refactoring
   - Code Explanation
   - Performance Optimization
   - Feature Specification
   - Data Structure Design
   - Debugging Assistant

2. **Template Variables**
   - Dynamic variable substitution
   - Automatic variable extraction
   - Interactive variable filling

3. **Organization**
   - Category-based organization
   - Custom prompt creation
   - Template editing

4. **Quick Usage**
   - Fill template with values
   - Copy to clipboard
   - Ready for AI assistants (ChatGPT, Claude, etc.)

### Installation - AIPromptManager

1. Download `AIPromptManager.js` and `iOSDevTools.js` to Scriptable folder
2. Run the script to access the prompt library

### Usage - AIPromptManager

1. **Use Prompt**: Select a template, fill variables, copy to clipboard
2. **Create Prompt**: Build your own custom prompt templates
3. **Browse Prompts**: View all available prompts by category

### Widget - AIPromptManager

Shows prompt library statistics and quick access.

___

## AgentOrchestrator

Intelligent agent system that orchestrates multiple tools and automates workflows.

### Features - AgentOrchestrator

1. **Agent Management**
   - GitHub Agent - Repository and issue management
   - API Testing Agent - Endpoint testing
   - AI Assistant Agent - Code review and prompts
   - Weather Agent - Weather information
   - Contacts Agent - Communication

2. **Task Routing**
   - Intelligent task assignment
   - Automatic agent selection
   - Confidence scoring

3. **Workflow Automation**
   - Pre-defined workflows
   - Morning dev routine
   - API health checks
   - Code review workflows
   - Custom workflow creation

4. **Task Management**
   - Create and track tasks
   - Priority levels
   - Status tracking (pending, in-progress, completed, failed)
   - Task history

5. **Scheduling**
   - Daily workflows
   - Hourly checks
   - Manual execution

### Installation - AgentOrchestrator

1. Download all scripts to Scriptable folder:
   - `AgentOrchestrator.js`
   - `iOSDevTools.js`
   - `DevGitHub.js`
   - `DevAPITester.js`
   - `AIPromptManager.js`

2. Run `AgentOrchestrator.js`

### Usage - AgentOrchestrator

1. **Dashboard**: View all available agents and recent tasks
2. **New Task**: Create a task and let the orchestrator route it to the appropriate agent
3. **Workflows**: Execute or manage automated workflows
4. **Settings**: Configure agent preferences

### Pre-defined Workflows

1. **Morning Dev Routine**
   - Check weather forecast
   - Review GitHub notifications
   - List recent repositories

2. **API Health Check**
   - Test critical endpoints
   - Monitor response times

3. **Code Review Workflow**
   - List open pull requests
   - AI-powered code review

### Widget - AgentOrchestrator

Shows orchestrator statistics: pending tasks, completed tasks, available agents.

___

## Complete Installation

To get the full development toolkit:

```
iCloud Drive/
├─ Scriptable/
│  ├─ iOSDevTools.js
│  ├─ DevGitHub.js
│  ├─ DevAPITester.js
│  ├─ DevCodeSnippets.js
│  ├─ AIPromptManager.js
│  ├─ AgentOrchestrator.js
│  ├─ LSWeather.js
│  ├─ LSForecast.js
│  ├─ FavContacts.js
│  ├─ LSMatrix.js
│  └─ LSQuotes.js
```

## Integration Example

All development tools can work together through the Agent Orchestrator:

```javascript
// Example: Automated workflow
// 1. Agent Orchestrator routes task
// 2. DevGitHub checks for new PRs
// 3. AIPromptManager generates review prompt
// 4. DevAPITester validates API endpoints
// 5. DevCodeSnippets provides reference code
```

## Requirements

- iOS 14.4 or later
- Scriptable app (free on App Store)
- iCloud Drive enabled
- For DevGitHub: GitHub personal access token

## Support

For issues or feature requests, please open an issue on GitHub.

## License

These scripts are provided as-is for personal and educational use.

___

## AITaskAutomation

AI-powered task automation and workflow management system for iOS developers.

### Features - AITaskAutomation

1. **Automated Workflows**
   - Daily standup report generation
   - Code quality monitoring
   - API health checks
   - Custom automation creation

2. **Triggers**
   - Daily scheduled tasks
   - Hourly monitoring
   - Manual execution
   - Custom schedules

3. **Action Types**
   - GitHub activity tracking
   - Commit analysis
   - PR status monitoring
   - API endpoint testing
   - Report generation
   - Notification sending
   - Alert management

4. **Execution Tracking**
   - Complete execution history
   - Success/failure rates
   - Performance metrics
   - Duration tracking

5. **Pre-built Automations**
   - **Daily Standup Report**: Summarize GitHub activity
   - **Code Quality Monitor**: Track code metrics
   - **API Health Monitor**: Test critical endpoints

### Installation - AITaskAutomation

1. Download `AITaskAutomation.js` and `iOSDevTools.js` to Scriptable folder
2. Run the script to configure automations

### Usage - AITaskAutomation

1. **View Automations**: Browse and manage all automations
2. **Run All**: Execute all enabled automations
3. **View Log**: Review execution history

### Automation Actions

Each automation can include multiple actions:

- `github_activity` - Track GitHub commits, PRs, issues
- `analyze_commits` - Analyze code changes
- `check_pr_status` - Monitor pull request status
- `test_endpoints` - Test API endpoint health
- `format_report` - Generate formatted reports
- `generate_summary` - Create summaries
- `notify` - Send notifications
- `alert_on_failure` - Alert when thresholds exceeded

### Widget - AITaskAutomation

Shows automation statistics: active automations, total runs, success rate.

___

## Quick Start Guide

### For iOS Developers

1. **Install Core Library**
   ```
   Download iOSDevTools.js to Scriptable folder
   ```

2. **Choose Your Tools**
   - Need GitHub integration? → `DevGitHub.js`
   - Need API testing? → `DevAPITester.js`
   - Need code snippets? → `DevCodeSnippets.js`

3. **Add AI Capabilities**
   - AI prompts? → `AIPromptManager.js`
   - Automation? → `AITaskAutomation.js`

4. **Orchestrate Everything**
   - Download `AgentOrchestrator.js` to coordinate all tools

### Example Workflows

**Morning Routine**
```
1. AgentOrchestrator runs morning workflow
2. Checks GitHub notifications (DevGitHub)
3. Reviews PR status (DevGitHub)
4. Tests critical APIs (DevAPITester)
5. Sends daily summary notification
```

**Code Review Process**
```
1. DevGitHub lists open PRs
2. AIPromptManager provides review template
3. DevCodeSnippets suggests best practices
4. Result sent via notification
```

**API Development**
```
1. DevAPITester tests new endpoint
2. DevCodeSnippets provides example code
3. AIPromptManager generates documentation prompt
4. Results logged for review
```

___

## Development

This repository includes development tools to help you write, maintain, and contribute to these Scriptable scripts.

### Setup

1. **Install Node.js** (v14 or later) from [nodejs.org](https://nodejs.org/)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Recommended**: Use [VS Code](https://code.visualstudio.com/) with the recommended extensions (you'll be prompted to install them when you open the project)

### Development Tools

- **ESLint**: Lints JavaScript code to catch errors and enforce code style
- **Prettier**: Automatically formats code for consistency
- **TypeScript Definitions**: Provides IntelliSense and autocompletion for Scriptable APIs

### Available Scripts

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format all JavaScript files
npm run format

# Check if files are formatted correctly
npm run format:check

# Run all checks (lint + format check)
npm run check
```

### VS Code Integration

If you use VS Code with the recommended extensions:
- Code is automatically formatted on save
- Linting errors appear as you type
- IntelliSense provides autocomplete for Scriptable APIs

### Continuous Integration

This repository includes a GitHub Actions workflow that automatically:
- Runs ESLint to check for code quality issues
- Verifies code formatting with Prettier

The workflow runs on all pull requests to ensure code quality standards are maintained.

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed information on:
- Development workflow
- Code style guidelines  
- Testing your scripts
- Submitting pull requests

### Resources

- [Scriptable Documentation](https://docs.scriptable.app/)
- [Scriptable Community Forums](https://talk.automators.fm/c/scriptable/)

___

