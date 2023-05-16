document.addEventListener("DOMContentLoaded", function () {
  const noteInput = document.getElementById("noteInput");
  const saveButton = document.getElementById("saveButton");
  const clearButton = document.getElementById("clearButton");
  const noteList = document.getElementById("noteList");

  // Load saved notes from storage
  chrome.storage.sync.get({ notes: [] }, function (result) {
    const reversedNotes = result.notes.reverse();
    reversedNotes.forEach(function (note) {
      createNoteListItem(note);
    });
  });

  // Save note when saveButton is clicked
  saveButton.addEventListener("click", function () {
    const note = noteInput.value.trim();
    if (note !== "") {
      createNoteListItem(note);
      noteInput.value = "";
      noteInput.focus();
      showTooltip("Note saved", "green");
    }
  });

  // Clear note when clearButton is clicked
  clearButton.addEventListener("click", function () {
    noteInput.value = "";
    noteInput.focus();
    showTooltip("Input cleared", "red");
  });

  function createNoteListItem(note) {
    const noteListItem = document.createElement("li");
    noteListItem.className = "note-list-item";

    const noteTextSpan = document.createElement("span");
    noteTextSpan.textContent = note;
    noteListItem.appendChild(noteTextSpan);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteButton.addEventListener("click", () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this note?"
      );
      if (confirmDelete) {
        noteList.removeChild(noteListItem);
        saveNotesToStorage();
        showTooltip("Note deleted", "red");
      }
    });
    noteListItem.appendChild(deleteButton);

    const copyButton = document.createElement("button");
    copyButton.textContent = "📋";
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(note);
      showTooltip("Note copied", "blue");
    });
    noteListItem.appendChild(copyButton);
    noteList.prepend(noteListItem);

    saveNotesToStorage();
  }

  function saveNotesToStorage() {
    const noteListItems = document.getElementsByClassName("note-list-item");
    const notes = Array.from(noteListItems).map(function (noteListItem) {
      return noteListItem.querySelector("span").textContent;
    });
    chrome.storage.sync.set({ notes: notes });
  }

  // Show tooltip with the given message and color
  function showTooltip(message, color) {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = message;
    tooltip.style.color = color;
    document.body.appendChild(tooltip);

    const inputRect = noteInput.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const top = inputRect.top - tooltipRect.height - 10;
    const left = inputRect.left + (inputRect.width - tooltipRect.width) / 2;
    tooltip.style.top = top + "px";
    tooltip.style.left = left + "px";

    setTimeout(() => {
      document.body.removeChild(tooltip);
    }, 2000);
  }
});
