document.addEventListener("DOMContentLoaded", async function () {
  // Auto-fill current tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    document.getElementById("linkInput").value = tabs[0].url;
  });

  // Fetch categories
  try {
    const response = await fetch("http://localhost:3000/veille/titles");
    const titles = await response.json();

    const titleSelect = document.getElementById("titleSelect");
    titleSelect.innerHTML =
      '<option value="">-- Select existing category or create new one below --</option>';

    if (titles && titles.length > 0) {
      titles.forEach((title) => {
        const option = document.createElement("option");
        option.value = title;
        option.textContent = title;
        titleSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});

document
  .getElementById("linkForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const url = document.getElementById("linkInput").value;
    const description = document.getElementById("descriptionInput").value;
    const selectedTitle = document.getElementById("titleSelect").value;
    const newTitle = document.getElementById("newTitleInput").value.trim();

    // Validation
    if (!url) {
      alert("Please provide a URL");
      return;
    }

    if (!description) {
      alert("Please provide a description");
      return;
    }

    if (!selectedTitle && !newTitle) {
      alert("Please either select an existing category or create a new one");
      return;
    }

    // Use new title if provided, otherwise use selected title
    const finalTitle = newTitle || selectedTitle;

    const data = {
      url: url,
      description: description,
      titres: finalTitle,
    };

    console.log("Sending data:", data); // Debug log

    try {
      const response = await fetch("http://localhost:3000/veille", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Server response:", result); // Debug log

      if (response.ok) {
        alert("Link shared successfully!");
        // Clear form
        document.getElementById("descriptionInput").value = "";
        document.getElementById("newTitleInput").value = "";
        document.getElementById("titleSelect").value = "";
        window.close();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error sharing link:", error);
      alert("Failed to share link. Please try again.");
    }
  });

// Add event listeners to handle category input
document.getElementById("titleSelect").addEventListener("change", function () {
  const newTitleInput = document.getElementById("newTitleInput");
  if (this.value) {
    newTitleInput.value = ""; // Clear new title input if category is selected
    newTitleInput.disabled = true;
  } else {
    newTitleInput.disabled = false;
  }
});

document.getElementById("newTitleInput").addEventListener("input", function () {
  const titleSelect = document.getElementById("titleSelect");
  if (this.value.trim()) {
    titleSelect.value = ""; // Clear category selection if new title is being typed
    titleSelect.disabled = true;
  } else {
    titleSelect.disabled = false;
  }
});
