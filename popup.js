document.addEventListener("DOMContentLoaded", function () {
  // Darkmode
  const darkModeToggle = document.getElementById("darkModeToggle");
  const noteInput = document.getElementById("noteInput");
  const saveButton = document.getElementById("saveButton");
  const clearButton = document.getElementById("clearButton");
  const noteList = document.getElementById("noteList");
  const filterInput = document.querySelector(".filter-control"); // Filter input
  // Event listener for the cow icon
  const cowIcon = document.getElementById("cowIcon");
  const textBubble = document.getElementById("textBubble");

  // Function to update the dark mode status and the emoji
  function updateDarkMode(isDarkMode) {
    document.body.classList.toggle("dark-mode", isDarkMode);
    darkModeToggle.textContent = isDarkMode ? "🌝" : "🌞";
    chrome.storage.sync.set({ darkMode: isDarkMode });
  }

  // Function to update the visibility of the filter box
  function updateFilterVisibility() {
    const notes = document.querySelectorAll(".note-list-item");
    filterInput.style.display = notes.length > 0 ? "block" : "none";
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

  // Load saved notes from storage and update filter visibility
  chrome.storage.sync.get({ notes: [] }, function (result) {
    const reversedNotes = result.notes.reverse();
    reversedNotes.forEach(function (note) {
      createNoteListItem(note);
    });
    updateFilterVisibility(); // Update filter visibility after loading notes
  });

  // Save note when saveButton is clicked
  saveButton.addEventListener("click", function () {
    const note = noteInput.value.trim();
    if (note !== "") {
      createNoteListItem(note);
      noteInput.value = "";
      noteInput.focus();
      showTooltip("Note saved", "#00ff00");
      updateFilterVisibility(); // Update filter visibility after saving a note
    }
  });

  // Clear note when clearButton is clicked
  clearButton.addEventListener("click", function () {
    noteInput.value = "";
    noteInput.focus();
    showTooltip("Input cleared", "red");
  });

  // Function to create a list item for a note
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
        updateFilterVisibility(); // Update filter visibility after deleting a note
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

  // Function to save notes to storage
  function saveNotesToStorage() {
    const noteListItems = document.getElementsByClassName("note-list-item");
    const notes = Array.from(noteListItems).map(function (noteListItem) {
      return noteListItem.querySelector("span").textContent;
    });
    chrome.storage.sync.set({ notes: notes });
  }

  // Function to show a tooltip message
  function showTooltip(message, color) {
    const existingTooltip = document.querySelector(".tooltip");
    if (existingTooltip) {
      existingTooltip.remove();
    }

    const tooltip = document.createElement("p");
    tooltip.className = "tooltip";
    tooltip.style.color = color;
    tooltip.textContent = message;
    const statusElement = document.getElementById("status");

    if (!statusElement) {
      console.error("Element with ID 'status' not found.");
      return;
    }

    statusElement.appendChild(tooltip);

    setTimeout(() => {
      if (statusElement.contains(tooltip)) {
        statusElement.removeChild(tooltip);
      }
    }, 2000);
  }

  // Event listener for the filter box
  filterInput.addEventListener("input", filterNotes);

  // Function to filter notes based on the search input

  function filterNotes() {
    const filterValue = filterInput.value.toLowerCase();
    const notes = document.querySelectorAll(".note-list-item");

    notes.forEach((note) => {
      const text = note.textContent.toLowerCase();
      const isVisible = text.includes(filterValue);
      note.style.display = isVisible ? "" : "none"; // Use '' to revert to default display style
    });
  }

  cowIcon.addEventListener("click", function () {
    textBubble.style.display = "block"; // Show the text bubble

    // Hide the text bubble after a delay
    setTimeout(function () {
      textBubble.style.display = "none";
    }, 2000); // Adjust the time (2000ms = 2 seconds) as needed
  });
});
