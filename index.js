// Add event listener to the button
document.querySelector("button").addEventListener("click", () => {
  const inputField = document.getElementById("domain");
  const outputDiv = document.querySelector(".output");
  const copyBtn = document.querySelector("#copyBtn");
  copyBtn.style.display = "block";

  // Get the input text value
  const inputText = inputField.value.trim();

  // Remove duplicate lines
  const uniqueText = removeDuplicateLines(inputText);

  // Format the text by adding two <br> tags after each line
  const formattedText = formatTextWithBrTags(uniqueText);

  // Display the formatted text in the output div
  outputDiv.innerHTML = formattedText; // Use innerHTML to render <br> tags
});

// Function to remove duplicate lines
function removeDuplicateLines(inputText) {
  // Split the input text into lines
  const lines = inputText.split("\n");

  // Use a Set to store unique lines
  const uniqueLines = new Set();

  // Filter the lines to keep only the unique ones
  const filteredLines = lines.filter((line) => {
    if (uniqueLines.has(line.trim())) {
      return false; // Duplicate line, skip it
    }
    uniqueLines.add(line.trim()); // Add to the set
    return true; // Keep this line
  });

  // Join the filtered lines back into a single string
  return filteredLines.join("\n");
}

// Function to format text by adding two <br> tags after each line
function formatTextWithBrTags(inputText) {
  // Split the text into lines
  const lines = inputText.split("\n");

  // Add two <br> tags after each line
  const formattedText = lines.map((line) => `${line}<br><br><br>`).join("");

  return formattedText;
}

// Add event listener to the Copy button
document.getElementById("copyBtn").addEventListener("click", () => {
  const outputDiv = document.querySelector(".output");
  const inputField = document.getElementById("domain");

  // Get the text content of the output div
  const outputText = outputDiv.innerHTML.replace(/<br>/g, "\n");

  // Copy the text to the clipboard
  navigator.clipboard
    .writeText(outputText)
    .then(() => {
      document.querySelector("#copyBtn").style.display = "none";
      const notification = document.getElementById("notification");
      notification.textContent = "Copied!";
      notification.classList.add("show");

      // Hide the notification after 3 seconds
      setTimeout(() => {
        notification.classList.remove("show");

        // Reset the input field
        inputField.value = "";

        // Clear the output div
        outputDiv.innerHTML = "";

        // Hide the Copy button
        document.querySelector("#copyBtn").style.display = "none";
      }, 3000);
    })
    .catch((err) => {
      console.error("Error copying text: ", err);
    });
});
