// Listen for our action to be clicked
chrome.action.onClicked.addListener(function (tab) {
  // For the current tab, inject the "interact.min.js" file & execute it
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["interact.min.js"],
    },
    () => {
      // After interact.min.js, inject mark.min.js
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: ["mark.min.js"],
        },
        () => {
          // After mark.min.js, inject contentscript.js
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["contentscript.js"],
          });
        }
      );
    }
  );
});
