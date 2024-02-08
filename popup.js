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

  function showTooltip(message, color) {
    const tooltip = document.createElement("p");
    tooltip.className = "tooltip";
    tooltip.style.color = color;
    tooltip.textContent = message;
  
    // Get the element with the ID 'status'
    const statusElement = document.getElementById("status");
  
    // Ensure the 'status' element exists
    if (!statusElement) {
      console.error("Element with ID 'status' not found.");
      return;
    }
  
    // Append the tooltip as a child of the 'status' element
    statusElement.appendChild(tooltip);
  
    // Removing the tooltip after 2 seconds
    setTimeout(() => {
      statusElement.removeChild(tooltip);
    }, 2000);
  }
  



});
