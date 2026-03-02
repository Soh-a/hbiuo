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
const downloadBtn = document.getElementById("downloadBtn");

/* =========================
   📦 STATE
========================= */
let defaulters = [];

/* =========================
   🚀 LOAD DEFAULTERS
========================= */
async function loadDefaulters() {
  tableBody.innerHTML = "";
  defaulters = [];

  const snapshot = await get(ref(db, "/"));
  if (!snapshot.exists()) return;

  const students = snapshot.val();

  Object.entries(students).forEach(([studentId, student]) => {
    if (!student.fees) return;

    Object.entries(student.fees).forEach(([month, fee]) => {
      if (fee.status === "paid") return;

      const fine = fee.fine || 0;

      defaulters.push({
        studentId,
        name: student.name,
        month,
        fine
      });

      tableBody.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
          <td>${studentId}</td>
          <td>${student.name}</td>
          <td>${month}</td>
          <td>₹${fine}</td>
        </tr>
        `
      );
    });
  });
}

/* =========================
   ⬇️ DOWNLOAD CSV
========================= */
function downloadCSV() {
  if (!defaulters.length) {
    alert("No defaulters found");
    return;
  }

  const header = "Student ID,Name,Month,Fine\n";
  const rows = defaulters
    .map(d => `${d.studentId},${d.name},${d.month},${d.fine}`)
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "defaulters.csv";
  link.click();

  URL.revokeObjectURL(url);
}

/* =========================
   🎯 EVENTS
========================= */
downloadBtn.addEventListener("click", downloadCSV);
loadDefaulters();
