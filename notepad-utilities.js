// Detect keystrokes in iframe
document.getElementById("notepad-content").addEventListener(
  "input",
  function () {
    console.log("input event fired");
    let notepadText = document.getElementById("notepad-content").innerText;
    console.log("ContentTyped:" + notepadText);
  },
  false
);

document.addEventListener("DOMContentLoaded", function () {
  const notepad = document.getElementById("notepad-content");
  if (notepad) {
    notepad.addEventListener("input", function () {
      const notepadText = notepad.innerText;

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
      notepad.innerText = result[url];
    });
    // alert(url, "notepad-content", notepad.innerText );
  }
});
