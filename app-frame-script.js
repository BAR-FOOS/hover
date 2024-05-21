document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("open-full-note")
    .addEventListener("click", function () {
      chrome.runtime.sendMessage({ action: "open-full-note" });
      //close popup
      window.close();
    });
});
