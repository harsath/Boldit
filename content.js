const nodeExclusionList = 'input, textarea, svg, img, canvas, style, script, iframe, video, audio';
let boldEnabled = false;  // Bold toggle status

// Function to apply bold for all text-containing elements
function applyBoldText(element, isBold) {
    element.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            const span = document.createElement('span');
            span.style.fontWeight = isBold ? 'bold' : 'normal';  // Apply or remove bold
            span.textContent = node.textContent;
            node.parentNode.replaceChild(span, node);
        } else if (node.nodeType === Node.ELEMENT_NODE && !node.closest(nodeExclusionList)) {
            applyBoldText(node, isBold);  // Recursively apply bold to child elements
        }
    });
}

// Function to save the bold state to Chrome's local storage
function saveBoldState(isBold) {
    chrome.storage.local.set({ boldEnabled: isBold });
}

// Load the saved bold state and apply it on page load
chrome.storage.local.get(['boldEnabled'], function(result) {
    boldEnabled = result.boldEnabled || false;  // Default to false if no state is saved
    if (boldEnabled) {
        applyBoldText(document.body, true);  // Apply bold if it was previously enabled
    }
});

// Event listener for keyboard input to toggle bold with 'b' key
document.addEventListener('keydown', function(event) {
    const isInputField = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable;
    if (!isInputField && event.key === 'b') {
        boldEnabled = !boldEnabled;  // Toggle bold state
        applyBoldText(document.body, boldEnabled);  // Apply or remove bold
        saveBoldState(boldEnabled);  // Save the new state
    }
});

