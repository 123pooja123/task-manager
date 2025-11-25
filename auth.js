// auth.js

// if already logged in, go to dashboard
if (sessionStorage.getItem("user")) {
  window.location.href = "dashboard.html";
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // store simple session
  const user = { email, password };
  sessionStorage.setItem("user", JSON.stringify(user));

  window.location.href = "dashboard.html";
});
