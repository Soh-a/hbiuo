import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* =========================
   🔥 FIREBASE INIT
========================= */
const firebaseConfig = {
  databaseURL: "https://students-6e271-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* =========================
   📄 DOM ELEMENTS
========================= */
const tableBody = document.querySelector("#defaultersTable tbody");
const monthFilter = document.getElementById("monthFilter");
const statusFilter = document.getElementById("statusFilter");
const downloadBtn = document.getElementById("downloadBtn");

/* =========================
   📦 STATE
========================= */
let allRecords = [];
let filteredRecords = [];

/* =========================
   📥 LOAD DATA
========================= */
async function loadData(){
  allRecords = [];
  const snapshot = await get(ref(db, "/"));
  if(!snapshot.exists()) return;

  const students = snapshot.val();

  Object.entries(students).forEach(([studentId, student]) => {
    if(!student.fees) return;

    Object.entries(student.fees).forEach(([month, fee]) => {
      allRecords.push({
        studentId,
        name: student.name,
        month,
        status: fee.status || "unpaid",
        fine: fee.fine || 0
      });
    });
  });

  applyFilters();
}

/* =========================
   🔍 FILTER LOGIC
========================= */
function applyFilters(){
  const m = monthFilter.value;
  const s = statusFilter.value;

  filteredRecords = allRecords.filter(r => {
    if(m && r.month !== m) return false;
    if(s && r.status !== s) return false;
    return true;
  });

  renderTable();
}

/* =========================
   🖥️ RENDER TABLE
========================= */
function renderTable(){
  tableBody.innerHTML = "";

  if(!filteredRecords.length){
    tableBody.innerHTML = `<tr><td colspan="5">No records found</td></tr>`;
    return;
  }

  filteredRecords.forEach(r => {
    tableBody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${r.studentId}</td>
        <td>${r.name}</td>
        <td>${r.month}</td>
        <td class="${r.status === "paid" ? "badge-paid" : "badge-unpaid"}">
          ${r.status.toUpperCase()}
        </td>
        <td>₹${r.fine}</td>
      </tr>
    `);
  });
}

/* =========================
   ⬇ DOWNLOAD CSV
========================= */
function downloadCSV(){
  if(!filteredRecords.length){
    alert("No data to download");
    return;
  }

  let csv = "Student ID,Name,Month,Status,Fine\n";
  filteredRecords.forEach(r => {
    csv += `${r.studentId},${r.name},${r.month},${r.status},${r.fine}\n`;
  });

  const blob = new Blob([csv], {type:"text/csv"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "fee-status-report.csv";
  link.click();
}

/* =========================
   🎯 EVENTS
========================= */
monthFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);
downloadBtn.addEventListener("click", downloadCSV);

/* =========================
   🚀 START
========================= */
loadData();
