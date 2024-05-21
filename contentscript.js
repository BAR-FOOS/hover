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

// Reset Selection End Timeout
var selectionEndTimeout = null;

// Use chrome.runtime.onMessage instead of window.addEventListener
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "verify") {
    console.log("Verification message received in content script");
    sendResponse({ status: "Content script ready" });
    return;
  }

  if (request.action === "open-full-note") {
    console.log("Message received in content script");
    addFrame();
  }
});

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
  // Create buttons
  var buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";
  buttonContainer.style.padding = "5px";
  buttonContainer.style.backgroundColor = "#f0f0f0";
  buttonContainer.style.borderBottom = "1px solid #ccc";

  var deleteButton = document.createElement("button");
  deleteButton.id = "delete-button";
  deleteButton.textContent = "#";
  deleteButton.style =
    "background-color: #007bff; border: none; color: white; padding: 5px 10px; font-size: 14px; cursor: pointer; border-radius: 4px;";

  var minimizeButton = document.createElement("button");
  minimizeButton.id = "minimize-button";
  minimizeButton.textContent = "-";
  minimizeButton.style =
    "background-color: #007bff; border: none; color: white; padding: 5px 10px; font-size: 14px; cursor: pointer; border-radius: 4px;";

  var closeButton = document.createElement("button");
  closeButton.id = "close-button";
  closeButton.textContent = "X";
  closeButton.style =
    "background-color: #007bff; border: none; color: white; padding: 5px 10px; font-size: 14px; cursor: pointer; border-radius: 4px;";

  var transparencyButton = document.createElement("button");
  transparencyButton.id = "transparency-button";
  transparencyButton.textContent = "T";
  transparencyButton.style =
    "background-color: #007bff; border: none; color: white; padding: 5px 10px; font-size: 14px; cursor: pointer; border-radius: 4px;";

  buttonContainer.appendChild(deleteButton);
  buttonContainer.appendChild(minimizeButton);
  buttonContainer.appendChild(closeButton);
  buttonContainer.appendChild(transparencyButton);

  // Append elements to the container
  appContainerDiv.appendChild(buttonContainer);
  appContainerDiv.appendChild(appIframe);
  document.getElementsByTagName("head")[0].appendChild(appContainerStyleLink);
  parentDocument.body.insertBefore(
    appContainerDiv,
    parentDocument.body.firstChild
  );
  parentDocument.body.insertBefore(
    appContainerScript,
    parentDocument.body.firstChild
  );

  // Add event listeners
  deleteButton.addEventListener("click", function () {
    notepadContent.innerHTML = "";
  });

  minimizeButton.addEventListener("click", function () {
    toggleVisibility(appContainerDiv);
  });

  closeButton.addEventListener("click", function () {
    // appContainerDiv.style.display = "none";
    appContainerDiv.remove();
  });

  transparencyButton.addEventListener("click", function () {
    if (appContainerDiv.style.opacity == "0.5") {
      appContainerDiv.style.opacity = "1";
    } else {
      appContainerDiv.style.opacity = "0.5";
    }
  });

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
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform = target.style.transform =
    "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

function dragMoveListener(event) {
  console.log("Drag Move Event Fired");
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform = target.style.transform =
    "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

function userSelectionChanged() {
  // wait 500 ms after the last selection change event
  if (selectionEndTimeout) {
    clearTimeout(selectionEndTimeout);
    console.log("User Selection Changed");
  }
  selectionEndTimeout = setTimeout(function () {
    document.dispatchEvent(new Event("selectionEnd"));
  }, 1000);
}

// Get text from selection
function getSelectionText() {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  console.log("Text:" + text);

  return text;
}

function fadeIn(element, delay, increment) {
  var op = 0; // initial opacity
  var timer = setInterval(function () {
    if (op >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = op;
    op += increment;
  }, delay);
}

function performMark() {
  // Read the keyword
  var keyword = typedInput.value;

  // Determine selected options
  var options = {};
  [].forEach.call(optionInputs, function (opt) {
    options[opt.value] = opt.checked;
  });

  // Remove previous marked elements and mark
  // the new keyword inside the context
  markInstance.unmark({
    done: function () {
      markInstance.mark(keyword, options);
    },
  });
  alert("marked");
}
