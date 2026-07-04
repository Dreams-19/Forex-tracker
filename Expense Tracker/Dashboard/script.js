// Load Overview Page
function loadOverview() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const userNameEl = document.getElementById("userName"); // ✅ fixed ID
  if (userNameEl) userNameEl.textContent = user.name;

  updateOverviewStats(user);
  showLatestExpense();
}

// Update Overview Statistics
function updateOverviewStats(user) {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const userExpenses = expenses.filter(e => e.userEmail === user.email);

  const total = userExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalEl = document.getElementById("totalExpenses");
  if (totalEl) totalEl.textContent = `₵${total}`;

  const latest = userExpenses[userExpenses.length - 1];
  const latestEl = document.getElementById("latestExpense");
  if (latestEl) {
    latestEl.textContent = latest
      ?` ${latest.amount} ${latest.currency || "GHS"} on ${latest.category}`
      : "—";
  }

  const categoryCount = {};
  userExpenses.forEach(e => {
    categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
  });

  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
  const topCategoryEl = document.getElementById("topCategory");
  if (topCategoryEl) topCategoryEl.textContent = topCategory ? topCategory[0] : "—";
}

// Sidebar Toggle
function toggleSidebar() {
  const sidebar = document.getElementById("sidebarMenu");
  if (sidebar) {
    sidebar.classList.toggle("show");
  } else {
    console.error("Sidebar element not found. Check your HTML id='sidebarMenu'.");
  }
}

// Navigation Functions
function goToOverview() {
  window.location.href = "overview.html";
}

function goToAllExpenses() {
  window.location.href = "all-expenses.html";
}

function showExpenseForm() {
  const formSection = document.getElementById("expenseSection");
  if (formSection) {
    formSection.style.display = "block";
    formSection.scrollIntoView({ behavior: "smooth" });
  }
}

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../index.html";
}

// Add Expense
function addExpense() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return;

  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const currency = document.getElementById("currency").value;

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.push({ userEmail: user.email, title, amount, category, date, currency });
  localStorage.setItem("expenses", JSON.stringify(expenses));

  alert("Expense added!");

  // Clear form
  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "Groceries";
  document.getElementById("date").value = "";
  document.getElementById("currency").value = "USD";

  updateOverviewStats(user);
  showLatestExpense();
}

// Show Latest Expense
function showLatestExpense() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return;

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const userExpenses = expenses.filter(e => e.userEmail === user.email);

  const latestDiv = document.getElementById("latestExpense");
  latestDiv.innerHTML = "";

  if (userExpenses.length > 0) {
    const latest = userExpenses[userExpenses.length - 1];

    latestDiv.innerHTML = `
      <h4>Latest Expense</h4>
      <div class="card mb-2">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <strong>${latest.title}</strong> - ${latest.category} - ${latest.amount} ${latest.currency} on ${latest.date}
          </div>
          <div>
            <button class="btn btn-sm btn-info me-2" onclick="editLatestExpense()">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteLatestExpense()">Delete</button>
          </div>
        </div>
      </div>
    `;
  }
}

// Edit Latest Expense
function editLatestExpense() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return;

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const userExpenses = expenses.filter(e => e.userEmail === user.email);
  if (userExpenses.length === 0) return;

  const latest = userExpenses[userExpenses.length - 1];

  document.getElementById("title").value = latest.title;
  document.getElementById("amount").value = latest.amount;
  document.getElementById("category").value = latest.category;
  document.getElementById("date").value = latest.date;
  document.getElementById("currency").value = latest.currency;

  const index = expenses.lastIndexOf(latest);
  if (index >= 0) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  showExpenseForm();
}

// Delete Latest Expense
function deleteLatestExpense() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return;

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const userExpenses = expenses.filter(e => e.userEmail === user.email);
  if (userExpenses.length === 0) return;

  const latest = userExpenses[userExpenses.length - 1];
  const index = expenses.lastIndexOf(latest);

  if (index >= 0) {
    if (!confirm("Delete your latest expense?")) return;
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  showLatestExpense();
  updateOverviewStats(user);
}

// Back Button from All Expenses
function goBack() {
  window.location.href = "overview.html";
}

if (window.location.pathname.includes("overview.html")) {
  window.onload = loadOverview;
}