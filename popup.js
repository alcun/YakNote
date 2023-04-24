    // popup.js
    document.addEventListener("DOMContentLoaded", function () {
    const noteInput = document.getElementById("noteInput");
    const saveButton = document.getElementById("saveButton");
    const clearButton = document.getElementById("clearButton");
    const noteList = document.getElementById("noteList");

    // Load saved notes from storage
    chrome.storage.sync.get({ notes: [] }, function (result) {
        result.notes.forEach(function (note) {
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
        }
    });

    // Clear note when clearButton is clicked
    clearButton.addEventListener("click", function () {
        noteInput.value = "";
        noteInput.focus();
    });

    function createNoteListItem(note) {
        const noteListItem = document.createElement("li");
        noteListItem.className = "note-list-item";

        // Create note text span element
        const noteTextSpan = document.createElement("span");
        noteTextSpan.textContent = note;
        noteListItem.appendChild(noteTextSpan);

        // Add delete button to list item
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";
        deleteButton.addEventListener("click", () => {
        const confirmDelete = confirm(
            "Are you sure you want to delete this note?"
        );
        if (confirmDelete) {
            noteList.removeChild(noteListItem);
            saveNotesToStorage();
        }
        });
        noteListItem.appendChild(deleteButton);

        // Add copy button to list item
        const copyButton = document.createElement("button");
        copyButton.textContent = "📋";
        copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(note);
        });
        noteListItem.appendChild(copyButton);
        noteList.appendChild(noteListItem);

        saveNotesToStorage();
    }

    // Save notes to storage
function saveNotesToStorage() {
    const noteListItems = document.getElementsByClassName("note-list-item");
    const notes = Array.from(noteListItems).map(function (noteListItem) {
        return noteListItem.querySelector("span").textContent;
    });
    chrome.storage.sync.set({ notes: notes });
}
    });


    