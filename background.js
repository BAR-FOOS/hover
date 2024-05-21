// Listen for the action to be clicked
chrome.action.onClicked.addListener(function (tab) {
  // Inject "interact.min.js" into the current tab
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["interact.min.js"],
    },
    () => {
      // After "interact.min.js", inject "mark.min.js"
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: ["mark.min.js"],
        },
        () => {
          // After "mark.min.js", inject "contentscript.js"
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["contentscript.js"],
          });
        }
      );
    }
  );
});

// Listen for messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "open-full-note") {
    console.log("Message received in background script");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "open-full-note" });
    });
  }
});
