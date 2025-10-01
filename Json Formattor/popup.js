document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('input');
  const urlInput = document.getElementById('urlInput');
  const loadBtn = document.getElementById('loadBtn');
  const formatBtn = document.getElementById('formatBtn');
  const clearBtn = document.getElementById('clearBtn');
  const searchInput = document.getElementById('searchInput');
  const searchCount = document.getElementById('searchCount');
  const output = document.getElementById('output');
  const error = document.getElementById('error');

  // Simple syntax highlighting (keywords in blue, strings in green, numbers in purple)
  function highlightJson(jsonString) {
    jsonString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    jsonString = jsonString.replace(/"([^"\\]|\\.)*"/g, '<span style="color: green;">$&</span>');
    jsonString = jsonString.replace(/\b([0-9]+|[0-9]+.[0-9]+)\b/g, '<span style="color: purple;">$&</span>');
    jsonString = jsonString.replace(/\b(true|false|null)\b/gi, '<span style="color: blue;">$&</span>');
    return jsonString;
  }

  // Highlight search term in text (needs to work with HTML from syntax highlighting)
  function highlightSearch(html, searchTerm) {
    if (!searchTerm) return { highlighted: html, count: 0 };
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Function to recursively search and highlight text nodes
    function highlightTextNodes(node, term) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const matches = text.match(regex) || [];
        
        if (matches.length > 0) {
          const newHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
          const newSpan = document.createElement('span');
          newSpan.innerHTML = newHTML;
          node.parentNode.replaceChild(newSpan, node);
          return matches.length;
        }
        return 0;
      } else if (node.nodeType === Node.ELEMENT_NODE && 
                 node.classList.contains('search-highlight')) {
        // Skip already highlighted search terms
        return 0;
      } else if (node.nodeType === Node.ELEMENT_NODE && 
                 node.childNodes) {
        let totalCount = 0;
        // Use Array.from to create a static collection of child nodes
        Array.from(node.childNodes).forEach(child => {
          totalCount += highlightTextNodes(child, term);
        });
        return totalCount;
      }
      return 0;
    }
    
    const count = highlightTextNodes(tempDiv, searchTerm);
    return { highlighted: tempDiv.innerHTML, count };
  }

  // Format JSON and save to storage
  function formatJson(text, searchTerm = '') {
    error.textContent = '';
    output.innerHTML = '';
    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      const highlightedJson = highlightJson(formatted);
      const { highlighted, count } = highlightSearch(highlightedJson, searchTerm);
      output.innerHTML = highlighted;
      searchCount.textContent = searchTerm ? `(${count} matches)` : '';
      // Save data to chrome.storage.local
      chrome.storage.local.set({
        jsonInput: text,
        jsonUrl: urlInput.value.trim(),
        jsonOutput: formatted,
        searchQuery: searchTerm
      });
    } catch (e) {
      error.textContent = 'Invalid JSON: ' + e.message;
      searchCount.textContent = '';
    }
  }

  // Clear all inputs and storage
  function clearAll() {
    input.value = '';
    urlInput.value = '';
    searchInput.value = '';
    output.innerHTML = '';
    error.textContent = '';
    searchCount.textContent = '';
    
    // Clear storage
    chrome.storage.local.remove(['jsonInput', 'jsonUrl', 'jsonOutput', 'searchQuery']);
  }

  // Restore saved data when popup opens
  chrome.storage.local.get(['jsonInput', 'jsonUrl', 'jsonOutput', 'searchQuery'], function(data) {
    if (data.jsonInput) {
      input.value = data.jsonInput;
    }
    if (data.jsonUrl) {
      urlInput.value = data.jsonUrl;
    }
    if (data.searchQuery) {
      searchInput.value = data.searchQuery;
    }
    if (data.jsonOutput) {
      const highlightedJson = highlightJson(data.jsonOutput);
      const { highlighted, count } = highlightSearch(highlightedJson, data.searchQuery || '');
      output.innerHTML = highlighted;
      searchCount.textContent = data.searchQuery ? `(${count} matches)` : '';
    }
  });

  // Load from URL and save to storage
  loadBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) return;
    try {
      const response = await fetch(url);
      const text = await response.text();
      input.value = text;
      formatJson(text, searchInput.value.trim()); // Auto-format and apply search
    } catch (e) {
      error.textContent = 'Error loading URL: ' + e.message;
      searchCount.textContent = '';
    }
  });

  // Format button
  formatBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (text) {
      formatJson(text, searchInput.value.trim());
    }
  });

  // Clear button
  clearBtn.addEventListener('click', clearAll);

  // Search input handler
  searchInput.addEventListener('input', () => {
    const text = input.value.trim();
    if (text && output.innerHTML) {
      formatJson(text, searchInput.value.trim());
    } else {
      chrome.storage.local.set({ searchQuery: searchInput.value.trim() });
      searchCount.textContent = '';
    }
  });
});