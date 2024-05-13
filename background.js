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

// document.addEventListener("DOMContentLoaded", function () {
//   var notepad = document.getElementById("notepad-content");
//   if (notepad) {
//     notepad.addEventListener("input", function () {
//       const textContent = notepad.textContent;
//       const pageUrl = window.location.href;
//       chrome.storage.local.set({ [pageUrl]: textContent }, function () {
//         console.log("Content saved for:", pageUrl);
//       });
//     });

//     // Load existing content from storage
//     chrome.storage.local.get([window.location.href], function (result) {
//       if (result[window.location.href]) {
//         notepad.textContent = result[window.location.href];
//       }
//     });
//   } else {
//     console.log("Notepad element not found");
//   }
// });
