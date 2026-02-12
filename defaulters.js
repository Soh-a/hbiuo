import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔹 Change your Firebase URL here
const firebaseConfig = {
  databaseURL: "https://students-6e271-default-rtdb.firebaseio.com/"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tableBody = document.querySelector("#defaultersTable tbody");
const downloadBtn = document.getElementById("downloadBtn");

let defaulters = [];

async function loadDefaulters() {
  const snapshot = await get(ref(db, "/"));
  tableBody.innerHTML = "";
  defaulters = [];

  if(snapshot.exists()){
    const students = snapshot.val();
    for(const studentID in students){
      const s = students[studentID];
      if(s.fees){
        for(const month in s.fees){
          const fee = s.fees[month];
          if(fee.status !== "paid"){
            defaulters.push({
              id: studentID,
              name: s.name,
              month: month,
              fine: fee.fine || 0
            });
            tableBody.innerHTML += `<tr>
              <td>${studentID}</td>
              <td>${s.name}</td>
              <td>${month}</td>
              <td>₹${fee.fine || 0}</td>
            </tr>`;
          }
        }
      }
    }
  }
}

function downloadCSV() {
  if(defaulters.length === 0) { alert("No defaulters"); return; }
  let csv = "StudentID,Name,Month,Fine\n";
  defaulters.forEach(d => { csv += `${d.id},${d.name},${d.month},${d.fine}\n`; });
  const blob = new Blob([csv], {type: "text/csv"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "defaulters.csv";
  link.click();
}

// Event listener
downloadBtn.addEventListener("click", downloadCSV);
loadDefaulters();
