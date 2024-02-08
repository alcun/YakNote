document.addEventListener("DOMContentLoaded", function () {


  //Darkmode
  const darkModeToggle = document.getElementById("darkModeToggle");

  // Function to update the dark mode status and the emoji
  function updateDarkMode(isDarkMode) {
    document.body.classList.toggle("dark-mode", isDarkMode);
    darkModeToggle.textContent = isDarkMode ? "🌝" : "🌞";
    chrome.storage.sync.set({ darkMode: isDarkMode });
  }

  // Load the dark mode setting when the extension is loaded
  chrome.storage.sync.get(["darkMode"], function (result) {
    updateDarkMode(result.darkMode);
  });

  // Toggle dark mode when the button is clicked
  darkModeToggle.addEventListener("click", function () {
    const isDarkMode = !document.body.classList.contains("dark-mode");
    updateDarkMode(isDarkMode);
  });

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
      showTooltip("Note saved", "#00ff00");
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
      showTooltip("Note copied", "#01e2d8");
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
    // Remove any existing tooltips
    const existingTooltip = document.querySelector(".tooltip");
    if (existingTooltip) {
      existingTooltip.remove();
    }

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
