// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;
/*
Script: LSQuotes.js
Author: Ankit Jain (<ajatkj@yahoo.co.in>)
Date: 25.03.2022
Version: 1.1
Purpose: This script generates an overlay with a quotes (from api)
*/
/* Change Log 
31.03.2022 - Add support for multi-byte characters (depends on external module GraphemeSplitter)
             Download from https://github.com/orling/grapheme-splitter and leave a star!!
*/

const LOG_FILE_PATH = "LSQuotesLogs";
const LOG_TO_FILE = true; // Only set to true if you want to debug any issue
let LOG_STEP = 1;

const SIZES = {
    small: {font: 50, width: 50, height: 50, radius: 15},
    medium: {font: 60, width: 60, height: 60, radius: 20},
    large: {font: 80, width: 80, height: 80, radius: 25},
    extraLarge: {font: 100, width: 100, height: 100, radius: 50}
}
const DEVICE_RESOLUTION = Device.screenResolution();
const IMAGE_HEIGHT = DEVICE_RESOLUTION.height;
const IMAGE_WIDTH = DEVICE_RESOLUTION.width;
const BASE_QUOTES_URL='https://api.quotable.io/random';

let TEXT_SIZE = 'small'
let DARK_MODE = true;
let CUSTOM_QUOTE = null
let DEFAULT_QUOTE = "😀Be the change you want to see in the world!"
let CUSTOM_QUOTE_FLAG = true
let QUOTE_MAX_LENGTH = 50
let QUOTE_TAGS_DICTIONARY = {'business': true, 'wisdom': false, 'faith': false}

if (!config.runsInApp) {
    let input = args.shortcutParameter;
    if (typeof input.parameters !== 'undefined') {
        let inputParams = JSON.parse(input.parameters);
        if (typeof inputParams.customQuoteFlag !== 'undefined') CUSTOM_QUOTE_FLAG = inputParams.customQuoteFlag;
        if (typeof inputParams.quotesMaxLength !== 'undefined') QUOTE_MAX_LENGTH = inputParams.quotesMaxLength;
        if (typeof inputParams.quoteTags !== 'undefined') QUOTE_TAGS_DICTIONARY = inputParams.quoteTags;
        if (typeof inputParams.darkMode !== 'undefined') DARK_MODE = inputParams.darkMode;
        if (typeof inputParams.textSize !== 'undefined') TEXT_SIZE = inputParams.textSize.toLowerCase();
    }
    if (typeof input.customQuote !== 'undefined') CUSTOM_QUOTE = input.customQuote;
} else {
    // Show interactive setup menu when running in app
    const showSetup = await showInteractiveQuotesSetup();
    if (showSetup === false) {
        Script.complete();
        return;
    }
}

if (CUSTOM_QUOTE_FLAG && CUSTOM_QUOTE === null) CUSTOM_QUOTE_FLAG = false;

if (TEXT_SIZE !== 'small' && TEXT_SIZE !== 'medium' && TEXT_SIZE !== 'large') TEXT_SIZE = 'medium'

if (DARK_MODE) {
    BG = '#000000'
    FG = '#F4FAFA'
} else {
    BG = '#F4FAFA'
    FG = '#000000'
}
const REGEX = /[^\u0000-\u00ff]/; 
// Import grapheme-splitter to split unicode string containing multiple diaeresis
splitModulePresent = false;
try {
    graphemeSplitter = importModule('GraphemeSplitter')
    splitModulePresent = true;
} catch (error) {
    splitModulePresent = false;
}

let TEXT_WIDTH = SIZES[TEXT_SIZE].width;
let TEXT_HEIGHT = SIZES[TEXT_SIZE].height;
let TEXT_FONT = new Font("TrebuchetMS", SIZES[TEXT_SIZE].font);
let TEXT_COLS = Math.floor(IMAGE_WIDTH/(TEXT_WIDTH+5));

let overlayImage = await createOverlay();
let overlayBase64String = encodeOverlayImage(overlayImage);
if (config.runsInApp) {
    QuickLook.present(overlayImage);
    Script.complete();
} else return overlayBase64String; // return to Shortcut

/*---------------------------------------------------------------
Function definitions
---------------------------------------------------------------*/
function encodeOverlayImage(overlayImage){
  let overlayBase64String;
  try {
    const rawOverlay = Data.fromPNG(overlayImage);
    if (rawOverlay === null) {
        console.log("Error converting Image to Data");
        return;
    }
    overlayBase64String = rawOverlay.toBase64String();
    if (overlayBase64String === null) {
        console.log("Error converting Date to Base64 String");
        return;
    }
  } catch(error) {
    console.log(error);
    return;
  }
  return overlayBase64String;
}

async function createOverlay(){
    let wrapText = (s, w) => s.replace(
        new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), ' $1^ '
    );
    
    let imgCanvas=new DrawContext();
    let bufferWidth = 4;
    imgCanvas.opaque = false;
    imgCanvas.size = new Size(IMAGE_WIDTH,IMAGE_HEIGHT);
    imgCanvas.setFont(TEXT_FONT);
    imgCanvas.setTextColor(new Color(FG));
    
    quote = await fetchQuotes()
    writeLOG(quote)
    lines = wrapText(quote,(TEXT_COLS - bufferWidth)).split('^');
    writeLOG(lines.join(','))

    let x = bufferWidth
    let y = (IMAGE_HEIGHT/2) - (lines.length * TEXT_HEIGHT/2)
    
    lines.forEach(function(line){
        [imgCanvas, x, y] = print(imgCanvas,line,"center",y)
    })
    img = imgCanvas.getImage();
    return img;
}

function createRoundedRect(w,h){
    let imgCanvas = new DrawContext();
    imgCanvas.opaque = false;
    imgCanvas.size = new Size(w,h);
    radius = SIZES[TEXT_SIZE].radius
    path = new Path()
    path.addRoundedRect(new Rect(0,0,w,h),radius,radius)
    imgCanvas.setFillColor(new Color(BG, 0.5))
    imgCanvas.addPath(path)
    imgCanvas.fillPath()
    return imgCanvas.getImage()
}

function print(imgCanvas,line,x,y){
    space = ' '
    gap = 5
    roundedRect = createRoundedRect(TEXT_WIDTH,TEXT_HEIGHT)
    // To split unicode characters you need special libraries
    if (containsDoubleByte(line) && splitModulePresent) chars = graphemeSplitter.splitGraphemes(line.toUpperCase());
    else chars = line.replace(/^\s+|\s+$/gm,'').toUpperCase().split("");
    
    if (x == "center") x = Math.round((TEXT_COLS - chars.length)/2) * (TEXT_WIDTH+gap);
    chars.forEach(function(ch){
        if (ch != space) imgCanvas.drawImageInRect(roundedRect,new Rect(x,y,TEXT_WIDTH,TEXT_HEIGHT));
        imgCanvas.drawText(ch,new Point(x+10,y-2));
        x = x + TEXT_WIDTH + gap;
    })
    y = y + TEXT_HEIGHT + gap;
    return [imgCanvas,x,y];
}

async function fetchQuotes(){
  
  writeLOG(JSON.stringify(QUOTE_TAGS_DICTIONARY))

  if (CUSTOM_QUOTE_FLAG) return CUSTOM_QUOTE;

  // convert quote tags dictionary with "true" values to array
  var QUOTE_TAGS = Object.keys(QUOTE_TAGS_DICTIONARY).reduce(function (QUOTE_TAGS, key) {
    if (QUOTE_TAGS_DICTIONARY[key]) QUOTE_TAGS[key] = QUOTE_TAGS_DICTIONARY[key];
        return QUOTE_TAGS;
    }, {}); 

  let quotesURL;
  if ((Object.keys(QUOTE_TAGS).length === 0 && QUOTE_TAGS.constructor === Object) || (QUOTE_TAGS.all !== undefined && QUOTE_TAGS.all)) {
    quotesURL = BASE_QUOTES_URL + '?maxLength=' + QUOTE_MAX_LENGTH;
  } else {
    quotesURL = BASE_QUOTES_URL + '?maxLength=' + QUOTE_MAX_LENGTH + '&tags=' + Object.keys(QUOTE_TAGS).join('%7C'); // %7C is code for |
  }

  writeLOG("URL " + quotesURL)

  let response;
  try {
    const request = new Request(quotesURL);
    request.timeoutInterval = 30;
    response = await request.loadJSON();
  } catch (error) {
    writeLOG("Error in fetching request " + error)
    return DEFAULT_QUOTE;
  }

  // Error in fetching - statusCode is present in response in case of error
  if (response.statusCode !== undefined) {
    writeLOG("No quotes found")
    return DEFAULT_QUOTE
  }

  writeLOG("Response: " + JSON.stringify(response))
  return response.content
}

async function writeLOG(logMsg){
  if (!config.runsInApp && LOG_TO_FILE) {
    const fm = FileManager.iCloud();
    let logPath = fm.joinPath(fm.documentsDirectory(), LOG_FILE_PATH);
    if (!fm.fileExists(logPath)) fm.createDirectory(logPath);
    const logFile = fm.joinPath(logPath, 'Step_' + LOG_STEP);
    fm.writeString(logFile, logMsg);
  } else console.log ("Step_" + LOG_STEP + ": " + logMsg);
  LOG_STEP++;
}

function containsDoubleByte(str) {
    if (!str.length) return false;
    if (str.charCodeAt(0) > 255) return true;
    return REGEX.test(str);
}

// Interactive setup menu for LSQuotes
async function showInteractiveQuotesSetup() {
    const alert = new Alert();
    alert.title = "LSQuotes Setup";
    alert.message = "Configure your quote overlay";
    
    alert.addAction("💬 Quote Source");
    alert.addAction("📝 Custom Quote");
    alert.addAction("🏷️ Quote Categories");
    alert.addAction("🎨 Appearance");
    alert.addAction("📋 View Settings");
    alert.addAction("✅ Generate Preview");
    alert.addCancelAction("Cancel");
    
    const choice = await alert.presentAlert();
    
    if (choice === -1) {
        return false;
    }
    
    switch (choice) {
        case 0:
            await selectQuoteSource();
            return await showInteractiveQuotesSetup();
        case 1:
            await editCustomQuote();
            return await showInteractiveQuotesSetup();
        case 2:
            await selectQuoteCategories();
            return await showInteractiveQuotesSetup();
        case 3:
            await configureQuoteAppearance();
            return await showInteractiveQuotesSetup();
        case 4:
            await viewQuotesSettings();
            return await showInteractiveQuotesSetup();
        case 5:
            return true; // Continue to generate preview
    }
}

// Quote source selector
async function selectQuoteSource() {
    const alert = new Alert();
    alert.title = "Quote Source";
    alert.message = "Choose where to get quotes from";
    
    alert.addAction("💬 Random Quote (API)");
    alert.addAction("📝 Custom Quote");
    alert.addCancelAction("Cancel");
    
    const choice = await alert.presentAlert();
    if (choice !== -1) {
        CUSTOM_QUOTE_FLAG = choice === 1;
        
        const confirm = new Alert();
        confirm.title = "Quote Source Set";
        confirm.message = CUSTOM_QUOTE_FLAG 
            ? "Using custom quote"
            : "Using random quotes from API";
        confirm.addAction("OK");
        await confirm.presentAlert();
        
        if (CUSTOM_QUOTE_FLAG && CUSTOM_QUOTE === null) {
            await editCustomQuote();
        }
    }
}

// Custom quote editor
async function editCustomQuote() {
    const alert = new Alert();
    alert.title = "Custom Quote";
    alert.message = "Enter your custom quote or message";
    alert.addTextField("Quote", CUSTOM_QUOTE || DEFAULT_QUOTE);
    alert.addAction("Save");
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    if (response === 0) {
        CUSTOM_QUOTE = alert.textFieldValue(0);
        CUSTOM_QUOTE_FLAG = true;
        
        const confirm = new Alert();
        confirm.title = "Custom Quote Saved";
        confirm.message = `Quote: "${CUSTOM_QUOTE}"`;
        confirm.addAction("OK");
        await confirm.presentAlert();
    }
}

// Quote categories selector
async function selectQuoteCategories() {
    const availableCategories = [
        'business', 'wisdom', 'faith', 'friendship', 
        'success', 'inspirational', 'life', 'love',
        'happiness', 'humorous', 'motivational'
    ];
    
    const alert = new Alert();
    alert.title = "Quote Categories";
    alert.message = "Select categories for random quotes";
    
    const currentCategories = Object.keys(QUOTE_TAGS_DICTIONARY).filter(k => QUOTE_TAGS_DICTIONARY[k]);
    alert.message += `\n\nCurrent: ${currentCategories.length > 0 ? currentCategories.join(", ") : "None"}`;
    
    availableCategories.forEach(cat => {
        const enabled = QUOTE_TAGS_DICTIONARY[cat] ? "✓ " : "";
        alert.addAction(enabled + cat);
    });
    alert.addAction("✅ Done");
    alert.addCancelAction("Cancel");
    
    const choice = await alert.presentAlert();
    
    if (choice === -1 || choice === availableCategories.length) {
        return;
    }
    
    const selectedCategory = availableCategories[choice];
    QUOTE_TAGS_DICTIONARY[selectedCategory] = !QUOTE_TAGS_DICTIONARY[selectedCategory];
    
    await selectQuoteCategories(); // Show menu again
}

// Appearance settings
async function configureQuoteAppearance() {
    const alert = new Alert();
    alert.title = "Appearance Settings";
    alert.message = "Configure how quotes look";
    
    alert.addAction("📏 Text Size: " + TEXT_SIZE.toUpperCase());
    alert.addAction("🌓 Dark Mode: " + (DARK_MODE ? "ON" : "OFF"));
    alert.addAction("📐 Max Length: " + QUOTE_MAX_LENGTH);
    alert.addAction("✅ Done");
    alert.addCancelAction("Cancel");
    
    const choice = await alert.presentAlert();
    if (choice === -1 || choice === 3) return;
    
    if (choice === 0) {
        const sizeAlert = new Alert();
        sizeAlert.title = "Text Size";
        sizeAlert.addAction("Small");
        sizeAlert.addAction("Medium");
        sizeAlert.addAction("Large");
        sizeAlert.addCancelAction("Cancel");
        
        const sizeChoice = await sizeAlert.presentAlert();
        if (sizeChoice !== -1) {
            TEXT_SIZE = ['small', 'medium', 'large'][sizeChoice];
        }
        await configureQuoteAppearance();
    } else if (choice === 1) {
        DARK_MODE = !DARK_MODE;
        await configureQuoteAppearance();
    } else if (choice === 2) {
        const lengthAlert = new Alert();
        lengthAlert.title = "Maximum Quote Length";
        lengthAlert.message = "Enter maximum characters for quote";
        lengthAlert.addTextField("Length", QUOTE_MAX_LENGTH.toString());
        lengthAlert.addAction("Save");
        lengthAlert.addCancelAction("Cancel");
        
        const response = await lengthAlert.presentAlert();
        if (response === 0) {
            const value = parseInt(lengthAlert.textFieldValue(0));
            if (!isNaN(value) && value > 0) {
                QUOTE_MAX_LENGTH = value;
            }
        }
        await configureQuoteAppearance();
    }
}

// View current settings
async function viewQuotesSettings() {
    const activeCategories = Object.keys(QUOTE_TAGS_DICTIONARY).filter(k => QUOTE_TAGS_DICTIONARY[k]);
    
    const settings = `Current LSQuotes Settings:

Quote Source:
- Type: ${CUSTOM_QUOTE_FLAG ? "Custom" : "Random (API)"}
${CUSTOM_QUOTE_FLAG ? `- Custom Quote: "${CUSTOM_QUOTE || DEFAULT_QUOTE}"` : ""}

Categories:
${activeCategories.length > 0 ? activeCategories.map(c => `- ${c}`).join("\n") : "- None (all categories)"}

Appearance:
- Text Size: ${TEXT_SIZE.toUpperCase()}
- Dark Mode: ${DARK_MODE}
- Max Length: ${QUOTE_MAX_LENGTH}

Note: Changes are temporary. Edit script to save permanently.`;
    
    const alert = new Alert();
    alert.title = "Current Settings";
    alert.message = settings;
    alert.addAction("OK");
    await alert.presentAlert();
}