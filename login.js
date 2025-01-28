import {
  initializeApp,
  getApps,
  getApp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOkJP8oimGChOhcKmyGU-PepgHlKMLZeI",
  authDomain: "ceo-database-7aebb.firebaseapp.com",
  projectId: "ceo-database-7aebb",
  storageBucket: "ceo-database-7aebb.appspot.com",
  messagingSenderId: "624837365691",
  appId: "1:624837365691:web:7dfdfe1cfc7a7696407e9e",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use the already initialized app
}

// Initialize Firebase
const auth = getAuth();
const loginButton = document.getElementById("login");
const logoutButton = document.getElementById("logout");
const protectedContent = document.getElementById("hide-browse");
const protectedLink = document.getElementById("hide-playlist");

// Login event listener
const submit = document.getElementById("submit");
if (submit) {
  submit.addEventListener("click", function (event) {
    event.preventDefault();
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value;

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        // After setting persistence, attempt to sign in the user
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        alert("Signing in, please click OK");
        window.location.href = "main.html";
      })
      .catch((error) => {
        alert("Sorry, invalid login details");
      });
  });
}

// Google sign-in authentication
const googleSignInBtn = document.getElementById("googlesignin");
if (googleSignInBtn) {
  googleSignInBtn.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        alert("Logged in with Google");
        window.location.href = "main.html";
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  });
}

// Password reset
const reset = document.getElementById("reset");
if (reset) {
  reset.addEventListener("click", function (event) {
    event.preventDefault();
    const email = document.getElementById("Email").value;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Email sent.");
      })
      .catch((error) => {
        alert("Error, please input your email!");
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout");
  const auth = getAuth();

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link behavior

      // Call Firebase signOut function
      signOut(auth)
        .then(() => {
          console.log("User successfully logged out.");
          alert("You have logged out.");
        })
        .catch((error) => {
          console.error("Error logging out: ", error);
        });
    });
  }
});
