import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Only databaseURL is needed for public Firebase read
const firebaseConfig = {
  databaseURL: "https://students-6e271-default-rtdb.firebaseio.com/"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tableBody = document.querySelector("#feesTable tbody");
const collectedEl = document.getElementById("collected");
const toCollectEl = document.getElementById("toCollect");

async function loadFees() {
  const snapshot = await get(ref(db, "/"));
  tableBody.innerHTML = "";

  let totalCollected = 0;
  let totalFee = 0;

  if(snapshot.exists()){
    const students = snapshot.val();
    for(const studentID in students){
      const s = students[studentID];
      const monthlyFee = s.monthlyFee || 0;

      if(s.fees){
        for(const month in s.fees){
          const fee = s.fees[month];

          // Add row to table
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${studentID}</td>
            <td>${s.name}</td>
            <td>${month}</td>
            <td>${fee.status}</td>
            <td>₹${fee.fine || 0}</td>
          `;
          tableBody.appendChild(row);

          // Update totals
          totalFee += monthlyFee; // count all months
          if(fee.status === "paid"){
            totalCollected += monthlyFee + (fee.fine || 0);
          }
        }
      } else {
        // If no fees object, consider all months unpaid
        totalFee += monthlyFee;
      }
    }
  }

  collectedEl.textContent = `₹${totalCollected}`;
  toCollectEl.textContent = `₹${totalFee}`;
}

loadFees();
