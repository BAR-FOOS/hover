function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });
}

// Load interact.js and then initialize the frame and interact.js features
loadScript(chrome.runtime.getURL("interact.min.js"))
  .then(() => {
    // Add App Frame to the Page
    // addFrame();
  })
  .catch((error) => console.error(error));

// Listen for messages from iframe
window.addEventListener("message", function (event) {
  if (event.data.action === "open-full-note") {
    addFrame();
  }
});

// Reset Selection End Timeout
var selectionEndTimeout = null;

// var markInstance = new Mark(document.querySelector("body"));

/*
--------------
EVENT HANDLERS
--------------
*/

// Handle Keypress (for shortcuts)
document.onkeyup = function (e) {
  console.log("Parent Document KeyUp:" + e.keyCode);

  if (e.keyCode == 77) {
    toggleVisibility(document.getElementById("app-container"));
  }
};

document.onselectionchange = userSelectionChanged;

document.addEventListener("selectionEnd", function () {
  // reset selection timeout
  selectionEndTimeout = null;

  // TODO: Do your cool stuff here........
  console.log("User Selection Ended");

  // get user selection
  var selectedText = getSelectionText();
  // if the selection is not empty show it :)
  if (selectedText != "") {
    chrome.runtime.sendMessage(
      { selectedText: selectedText.toString() },
      function (response) {
        console.log("Response" + response);
      }
    );
  }
});

/*
--------------
FUNCTIONS
--------------
*/

function addFrame() {
  let parentDocument = document;

  var appContainerDiv = parentDocument.createElement("div");
  var appIframe = parentDocument.createElement("iframe");

  var appContainerStyleLink = parentDocument.createElement("link");
  var appContainerScript = parentDocument.createElement("script");

  appContainerDiv.id = "app-container";
  appContainerDiv.className += "resize-drag";
  appContainerDiv.style.position = "fixed";
  appContainerDiv.style.top = "20px";
  appContainerDiv.style.left = "20px";
  appContainerDiv.style.zIndex = "9999";
  appContainerDiv.style.backgroundColor = "white";
  appContainerDiv.style.border = "1px solid #ccc";
  appContainerDiv.style.borderRadius = "4px";
  appContainerDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
  appContainerDiv.style.width = "300px"; // Set a default width
  appContainerDiv.style.height = "400px"; // Set a default height

  // get the css file from the extension
  appContainerStyleLink.href = chrome.runtime.getURL("app-frame-style.css");
  appContainerStyleLink.type = "text/css";
  appContainerStyleLink.rel = "stylesheet";
  appIframe.id = "app-frame";
  appIframe.src = chrome.runtime.getURL("app-frame.html");

  appIframe.allowTransparency = "true";
  appIframe.style.width = "100%";
  appIframe.style.height = "100%";
  appIframe.style.border = "none";

  appContainerDiv.appendChild(appIframe);
  document.getElementsByTagName("head")[0].appendChild(appContainerStyleLink);
  parentDocument.body.insertBefore(
    appContainerDiv,
    parentDocument.body.firstChild
  );

  // Add event listeners for interact.js features after the iframe loads
  appIframe.onload = function () {
    interact(appContainerDiv)
      .draggable({
        listeners: {
          move(event) {
            const target = event.target;
            const x =
              (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
            const y =
              (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute("data-x", x);
            target.setAttribute("data-y", y);
          },
        },
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
            endOnly: true,
          }),
        ],
      })
      .resizable({
        edges: { left: false, right: true, bottom: true, top: false },
        listeners: {
          move(event) {
            let target = event.target;
            let x = parseFloat(target.getAttribute("data-x")) || 0;
            let y = parseFloat(target.getAttribute("data-y")) || 0;

            target.style.width = `${event.rect.width}px`;
            target.style.height = `${event.rect.height}px`;

            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute("data-x", x);
            target.setAttribute("data-y", y);
          },
        },
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: "parent",
          }),
          interact.modifiers.restrictSize({
            min: { width: 100, height: 50 },
          }),
        ],
        inertia: true,
      });
  };

  fadeIn(appContainerDiv, 20, 0.075);
}

function toggleVisibility(obj) {
  if (obj.classList.contains("minimized")) {
    obj.classList.remove("minimized");
  } else {
    obj.classList.add("minimized");
  }
}

function dragMoveListener(event) {
  console.log("Drag Move Event Fired");
}
