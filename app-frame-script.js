document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("open-full-note")
    .addEventListener("click", function () {
      window.parent.postMessage({ action: "open-full-note" }, "*");
      alert("clicked");
    });
});
