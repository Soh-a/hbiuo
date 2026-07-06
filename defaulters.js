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
  
  // FIXED: Pointing path reference explicitly to target the "/students" parent structure
  const snapshot = await get(ref(db, "/students"));
  if(!snapshot.exists()) {
    renderTable();
    return;
  }

  const students = snapshot.val();

  Object.entries(students).forEach(([studentId, student]) => {
    // Safety fallback if a structural child node is empty or malformed
    if(!student || typeof student !== 'object') return;
    if(!student.fees) return;

    Object.entries(student.fees).forEach(([month, fee]) => {
      if(!fee) return;
      
      allRecords.push({
        studentId,
        name: student.name || "N/A",
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
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#9ca3af; padding:20px;">No records found</td></tr>`;
    return;
  }

  filteredRecords.forEach(r => {
    tableBody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${r.studentId}</td>
        <td><strong>${r.name}</strong></td>
        <td>${r.month}</td>
        <td>
          <span class="${r.status === "paid" ? "badge-paid" : "badge-unpaid"}">
            ${r.status.toUpperCase()}
          </span>
        </td>
        <td>₹${Number(r.fine).toLocaleString()}</td>
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

  // Wrapped elements in quotes to handle any unexpected comma characters safely inside student names
  let csv = '"Student ID","Name","Month","Status","Fine"\n';
  filteredRecords.forEach(r => {
    csv += `"${r.studentId}","${r.name}","${r.month}","${r.status.toUpperCase()}",${r.fine}\n`;
  });

  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
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
