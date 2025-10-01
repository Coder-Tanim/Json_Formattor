# Simple JSON Formatter - Chrome Extension

A lightweight Chrome extension that helps you format, validate, and explore JSON data directly in your browser popup with persistent storage.

## ✨ Features

- **🔄 JSON Formatting**: Automatically format and indent JSON for better readability
- **🎨 Syntax Highlighting**: Color-coded JSON syntax with different colors for strings, numbers, and keywords
- **🌐 URL Loading**: Fetch and format JSON directly from URLs
- **🔍 Search Functionality**: Find and highlight specific terms within your JSON data
- **💾 Persistent Storage**: Your JSON data and settings are saved between browser sessions
- **✅ Validation**: Real-time JSON validation with detailed error messages
- **🧹 One-Click Clear**: Quickly clear all inputs and start fresh
- **📱 Clean Interface**: Simple, intuitive popup design

## 🚀 Installation

### Manual Installation
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension icon will appear in your toolbar

## 📖 Usage

1. **Click the extension icon** in your Chrome toolbar
2. **Enter JSON** in one of two ways:
   - 📝 Paste JSON directly into the text area
   - 🔗 Enter a URL containing JSON and click "Load from URL"
3. **Click "Format JSON"** to validate and format your JSON
4. **Use the search box** to find and highlight specific terms within the JSON
5. **Click "Clear All"** to reset the form and start fresh

## 🖼️ Screenshot
<img width="548" height="705" alt="Screenshot_3" src="https://github.com/user-attachments/assets/1a933f98-2d9c-4d5d-89d4-9fbab1de78fc" />

## 🔧 Technical Details

### Key Files

- **`manifest.json`**: Chrome extension configuration using Manifest V3
- **`popup.html`**: The main interface with input fields and buttons
- **`popup.js`**: Core functionality including:
  - JSON parsing and validation
  - Syntax highlighting
  - Search and highlight functionality
  - Chrome storage API integration
- **`popup.css`**: Responsive styling for the popup interface

### Core Functions

```javascript
// Format and highlight JSON with search
function formatJson(text, searchTerm = '')

// Load JSON from URL
async function loadFromUrl(url)

// Clear all inputs and storage
function clearAll()

// Syntax highlighting for JSON
function highlightJson(jsonString)

// Search and highlight terms
function highlightSearch(html, searchTerm)
