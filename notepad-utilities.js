// Detect keystrokes in iframe
document.getElementById("notepad-content").addEventListener(
  "input",
  function () {
    console.log("input event fired");
    let notepadText = document.getElementById("notepad-content").textContent;
    console.log("ContentTyped:" + notepadText);
  },
  false
);

//save or replace content in local storage
// document.getElementById("notepad-content").addEventListener(
//   "keydown",
//   function () {
//     console.log("pause event fired");
//     let notepadText = document.getElementById("notepad-content").textContent;
//     console.log("ContentTyped:" + notepadText);
//     const url = window.location.href; // Ensure this is the right URL context
//     chrome.storage.local.set({ [url]: notepadText }, function () {
//       console.log("Saved content for URL:", url);
//     });
//     alert("Content saved for URL:", url, notepadText);
//   },
//   false
// );

//save content in local storage

document.addEventListener("DOMContentLoaded", function () {
  const notepad = document.getElementById("notepad-content");
  if (notepad) {
    notepad.addEventListener("input", function () {
      const notepadText = notepad.textContent;
      // const url = window.location.href; // Ensure this is the right URL context
      chrome.storage.local.set({ [url]: notepadText }, function () {
        console.log("Saved content for URL:", url);
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const notepad = document.getElementById("notepad-content");
  if (notepad) {
    url = window.location.href;

    chrome.storage.local.get([url], function (result) {
      notepad.textContent = result[url];
    });
    // alert(url, "notepad-content", notepad.textContent);
  }
});
