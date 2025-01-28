import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOkJP8oimGChOhcKmyGU-PepgHlKMLZeI",
  authDomain: "ceo-database-7aebb.firebaseapp.com",
  projectId: "ceo-database-7aebb",
  storageBucket: "ceo-database-7aebb.appspot.com",
  messagingSenderId: "624837365691",
  appId: "1:624837365691:web:7dfdfe1cfc7a7696407e9e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const submit = document.getElementById("submit");
submit.addEventListener("click", async function (event) {
  event.preventDefault();

  const email = document.getElementById("Email").value;
  const password = document.getElementById("Password").value;
  const auth = getAuth();

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);
    alert(
      "Signed up successfully! A verification email has been sent. Please verify your email before logging in."
    );

    // Sign out the user to prevent access before verification
    await auth.signOut();

    // Optionally redirect to a login page or a verification reminder page
    window.location.href = "index.html";
  } catch (error) {
    // Handle errors
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(`Error: ${errorMessage} (Code: ${errorCode})`);
  }
});

// google sign in authentication
document.getElementById("googlesignup").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  signInWithPopup(auth, provider)
    .then((result) => {
      // Successful Google login
      const user = result.user;
      alert("Logged in with Google");
      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Error: ${errorMessage}`);
    });
});
