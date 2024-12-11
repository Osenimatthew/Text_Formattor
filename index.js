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

  // Capitalize names and format emails
  const formattedNames = formatNames(uniqueText);

  // Format the text by adding two <br> tags after each line
  const formattedTextWithBrTags = formatTextWithBrTags(formattedNames);

  // Display the formatted text in the output div
  outputDiv.innerHTML = formattedTextWithBrTags; // Use innerHTML to render <br> tags
});

// Function to remove duplicate lines
function removeDuplicateLines(inputText) {
  const lines = inputText.split("\n");
  const uniqueLines = new Set();
  const filteredLines = lines.filter((line) => {
    if (uniqueLines.has(line.trim())) {
      return false;
    }
    uniqueLines.add(line.trim());
    return true;
  });
  return filteredLines.join("\n");
}

// Function to capitalize first and last name, excluding titles
function formatNames(inputText) {
  const titles = [
    "MSc",
    "FRICS",
    "PhD",
    "MD",
    "Esq",
    "M.A",
    "GPhT",
    "LMSW",
    "CALP",
    "LD",
    "RD",
    "MDS",
    "OTD",
    "OTR/L",
    "M.Ed",
    "MDS",
  ]; // Titles to ignore

  const lines = inputText.split("\n");

  const formattedLines = lines.map((line) => {
    const parts = line.split(" ");
    const email = parts.find((part) => part.includes("@"));
    const names = parts.filter(
      (part) =>
        !part.includes("@") &&
        !titles.some((title) => part.toUpperCase() === title) // Remove titles
    );

    if (names.length < 1) return line; // If no names are found, return the line as it is

    const firstName =
      names[0].charAt(0).toUpperCase() + names[0].slice(1).toLowerCase();
    const lastName =
      names[names.length - 1].charAt(0).toUpperCase() +
      names[names.length - 1].slice(1).toLowerCase();

    return `${firstName} ${lastName} ${email}`;
  });

  return formattedLines.join("\n");
}

// Function to format text by adding two <br> tags after each line
function formatTextWithBrTags(inputText) {
  const lines = inputText.split("\n");
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
