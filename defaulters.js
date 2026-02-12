import { db } from "./firebase.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const defaulterBody = document.getElementById("defaulterBody");

// ROOT reference
const rootRef = ref(db);

get(rootRef).then(snapshot => {
  if (!snapshot.exists()) {
    defaulterBody.innerHTML = `<tr><td colspan="6">No data found</td></tr>`;
    return;
  }

  defaulterBody.innerHTML = "";

  snapshot.forEach(studentSnap => {
    const student = studentSnap.val();

    // Skip non-student nodes
    if (!student.fees) return;

    const name = student.name || "N/A";
    const cls = student.class || "N/A";
    const mobile = student.mobile || studentSnap.key;
    const monthlyFee = Number(student.monthlyfee) || 0;

    Object.keys(student.fees).forEach(month => {
      const fee = student.fees[month];

      if (fee.status !== "paid") {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${name}</td>
          <td>${cls}</td>
          <td>${mobile}</td>
          <td>${month.toUpperCase()}</td>
          <td><span class="badge">UNPAID</span></td>
          <td class="amount">₹${monthlyFee}</td>
        `;
        defaulterBody.appendChild(row);
      }
    });
  });

  if (defaulterBody.innerHTML === "") {
    defaulterBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;color:green;font-weight:600">
          🎉 No Fee Defaulters
        </td>
      </tr>
    `;
  }

}).catch(err => {
  console.error(err);
  defaulterBody.innerHTML = `<tr><td colspan="6">Error loading data</td></tr>`;
});
