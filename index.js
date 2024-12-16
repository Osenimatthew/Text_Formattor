import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOkJP8oimGChOhcKmyGU-PepgHlKMLZeI",
  authDomain: "ceo-database-7aebb.firebaseapp.com",
  projectId: "ceo-database-7aebb",
  storageBucket: "ceo-database-7aebb.firebasestorage.app",
  messagingSenderId: "624837365691",
  appId: "1:624837365691:web:7dfdfe1cfc7a7696407e9e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const domainInput = document.getElementById("domain");
const generateBtn = document.getElementById("generateBtn");
const outputElement = document.getElementById("output");

// Titles to ignore
const TITLES = [
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
];

// Event listener for the Generate button
generateBtn.addEventListener("click", async () => {
  const inputText = domainInput.value.trim();
  const uniqueLines = removeDuplicateLines(inputText);

  const results = await Promise.all(
    uniqueLines.map(async (line) => {
      if (!line.trim()) return ""; // Skip empty lines

      const correctedLine = correctInput(line);
      const domain = extractDomain(correctedLine);

      if (domain) {
        const ceoName = await getCEOName(domain);
        if (ceoName) {
          return `${ceoName}\n${correctedLine}\n\n`; // CEO name found
        }
      }
      return `\n${correctedLine}\n\n`; // No CEO name found, blank line instead
    })
  );

  const formattedOutput = results.join(""); // Combine results with blank lines
  outputElement.textContent = formattedOutput;
});

// Function to remove duplicate lines
function removeDuplicateLines(inputText) {
  const lines = inputText.split("\n");
  const uniqueLines = new Set();
  return lines
    .filter((line) => {
      const trimmed = line.trim();
      if (uniqueLines.has(trimmed)) return false;
      uniqueLines.add(trimmed);
      return true;
    })
    .map((line) => line.trim());
}

// Function to correct the input line
function correctInput(line) {
  // Remove commas
  line = line.replace(/,/g, "");

  // Remove names in brackets
  line = line.replace(/[\(\{\[].*?[\)\}\]]/g, "");

  // Split line into parts
  const parts = line.split(" ");
  const email = parts.find((part) => part.includes("@"));
  const names = parts.filter(
    (part) =>
      !part.includes("@") &&
      !TITLES.some((title) => part.toUpperCase() === title) && // Remove titles
      !part.match(/^[({].*[)}]$/) // Remove names in parentheses or braces
  );

  // Remove middle name if more than 2 names
  let formattedName = "";
  if (names.length > 2) {
    const firstName = capitalizeFirstLetter(names[0]);
    const lastName = capitalizeFirstLetter(names[names.length - 1]);
    formattedName = `${firstName} ${lastName}`;
  } else {
    formattedName = names.map(capitalizeFirstLetter).join(" ");
  }

  // Return the formatted name along with the email unchanged
  return `${formattedName} ${email || ""}`.trim();
}

// Function to capitalize the first letter of each name
function capitalizeFirstLetter(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Function to extract the domain from the email
function extractDomain(input) {
  const email = input.split(" ").find((part) => part.includes("@"));
  if (email) {
    const domain = email.split("@")[1];
    return domain ? domain.toLowerCase().trim() : null;
  }
  return null;
}

// Function to fetch the CEO name from Firestore
async function getCEOName(domain) {
  if (!domain) return null;

  const normalizedDomain = domain.toLowerCase();
  try {
    const domainRef = doc(db, "savedData", normalizedDomain);
    const docSnap = await getDoc(domainRef);

    if (docSnap.exists()) {
      return docSnap.data().ceoNames || null; // Return CEO name if available
    }
    return null; // CEO not found
  } catch (error) {
    console.error("Error fetching CEO name:", error);
    return null; // Error fetching CEO name
  }
}
