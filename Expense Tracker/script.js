// Register User
function registerUser() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    alert("This email is already registered.");
    return;
  }

  // Save new user
  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Log them in immediately
  localStorage.setItem("loggedInUser", JSON.stringify(newUser));

  // ✅ Redirect to overview
  window.location.href = "Dashboard/overview.html";
}

// Login User
function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "Dashboard/overview.html"; // ✅ redirect to overview
  } else {
    alert("Invalid login details");
  }
}

// Logout User
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html"; // back to login page
}

// Toggle Forms
function showRegister() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("registerSection").style.display = "block";
}

function showLogin() {
  document.getElementById("registerSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
}

// Redirect to Overview Page
function goToOverview() {
  window.location.href = "Dashboard/overview.html";
}