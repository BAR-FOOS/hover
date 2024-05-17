// document.getElementById("delete-button").addEventListener("click", function () {
//   document.getElementById("notepad-content").innerHTML = "";
// });

// document
//   .getElementById("minimize-button")
//   .addEventListener("click", function () {
//     var container = document.getElementById("notepad-app-container");
//     if (container.classList.contains("minimized")) {
//       container.classList.remove("minimized");
//     } else {
//       container.classList.add("minimized");
//     }
//   });

// document.getElementById("close-button").addEventListener("click", function () {
//   document.getRootNode.style.display = "none";
// });

// // Initialize interact.js for draggable and resizable functionality
// loadScript(chrome.runtime.getURL("interact.min.js"))
//   .then(() => {
//     interact("#notepad-app-container")
//       .draggable({
//         listeners: {
//           move(event) {
//             const target = event.target;
//             const x =
//               (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
//             const y =
//               (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

//             target.style.transform = `translate(${x}px, ${y}px)`;

//             target.setAttribute("data-x", x);
//             target.setAttribute("data-y", y);
//           },
//         },
//         inertia: true,
//         modifiers: [
//           interact.modifiers.restrictRect({
//             restriction: "parent",
//             endOnly: true,
//           }),
//         ],
//       })
//       .resizable({
//         edges: { left: false, right: true, bottom: true, top: false },
//         listeners: {
//           move(event) {
//             let target = event.target;
//             let x = parseFloat(target.getAttribute("data-x")) || 0;
//             let y = parseFloat(target.getAttribute("data-y")) || 0;

//             target.style.width = `${event.rect.width}px`;
//             target.style.height = `${event.rect.height}px`;

//             x += event.deltaRect.left;
//             y += event.deltaRect.top;

//             target.style.transform = `translate(${x}px, ${y}px)`;

//             target.setAttribute("data-x", x);
//             target.setAttribute("data-y", y);
//           },
//         },
//         modifiers: [
//           interact.modifiers.restrictEdges({
//             outer: "parent",
//           }),
//           interact.modifiers.restrictSize({
//             min: { width: 100, height: 50 },
//           }),
//         ],
//         inertia: true,
//       });
//   })
//   .catch((error) => console.error(error));

// function loadScript(url) {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement("script");
//     script.src = url;
//     script.onload = () => resolve(script);
//     script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
//     document.head.appendChild(script);
//   });
// }
