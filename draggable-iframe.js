var baseMouseX, baseMouseY;
var dragging = false;

document.addEventListener("mousedown", handleMousedown);
document.addEventListener("touchstart", handleTouchstart, { passive: false });

function handleMousedown(evt) {
  return handleDragStart(evt);
}

function handleTouchstart(evt) {
  evt.preventDefault();
  return handleDragStart(evt.touches[0]);
}

function handleDragStart({ clientX, clientY }) {
  dragging = true;
  baseMouseX = clientX;
  baseMouseY = clientY;

  window.parent.postMessage(
    {
      msg: "NOTEPAD_DRAG_START",
      mouseX: clientX,
      mouseY: clientY,
    },
    "*"
  );

  document.addEventListener("mouseup", handleDragEnd);
  document.addEventListener("touchend", handleDragEnd);
  document.addEventListener("mousemove", handleMousemove);
  document.addEventListener("touchmove", handleTouchmove, { passive: false });
}

function handleMousemove(evt) {
  return handleDragging(evt);
}

function handleTouchmove(evt) {
  evt.preventDefault();
  return handleDragging(evt.touches[0]);
}

function handleDragging({ clientX, clientY }) {
  window.parent.postMessage(
    {
      msg: "NOTEPAD_DRAG_MOUSEMOVE",
      offsetX: clientX - baseMouseX,
      offsetY: clientY - baseMouseY,
    },
    "*"
  );
}

function handleDragEnd() {
  window.parent.postMessage(
    {
      msg: "NOTEPAD_DRAG_END",
    },
    "*"
  );

  document.removeEventListener("mouseup", handleDragEnd);
  document.removeEventListener("touchend", handleDragEnd);
  document.removeEventListener("mousemove", handleMousemove);
  document.removeEventListener("mousemove", handleTouchmove);
}

// Enable drag and resize features using interact.js
interact("#notepad-container")
  .draggable({
    // Enable drag on the entire container
    listeners: {
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

        // Translate the element
        target.style.transform = `translate(${x}px, ${y}px)`;

        // Update the position attributes
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
      },
    },
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true,
      }),
    ],
    inertia: true,
  })
  .resizable({
    // Enable resize from right and bottom edges
    edges: { left: false, right: true, bottom: true, top: false },
    listeners: {
      move(event) {
        let target = event.target;
        let x = parseFloat(target.getAttribute("data-x")) || 0;
        let y = parseFloat(target.getAttribute("data-y")) || 0;

        // Update the element's style
        target.style.width = `${event.rect.width}px`;
        target.style.height = `${event.rect.height}px`;

        // Translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.transform = `translate(${x}px, ${y}px)`;

        // Update attributes
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
