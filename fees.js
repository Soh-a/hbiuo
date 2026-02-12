import { db } from "./firebase.js";
import {
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const feeBody = document.getElementById("feeBody");
const paidEl = document.getElementById("paid");
const unpaidEl = document.getElementById("unpaid");

// ROOT reference
const rootRef = ref(db, "/");

onValue(rootRef, (snapshot) => {
  feeBody.innerHTML = "";
  let totalPaid = 0;
  let totalUnpaid = 0;

  if (!snapshot.exists()) {
    console.warn("No data in Firebase");
    return;
  }

  const rootData = snapshot.val();

  // 🔁 Loop students (mobile numbers)
  Object.keys(rootData).forEach(mobile => {
    const student = rootData[mobile];

    if (!student.fees || !student.monthlyfee) return;

    const monthlyFee = Number(student.monthlyfee);

    // 🔁 Loop months
    Object.keys(student.fees).forEach(month => {
      const fee = student.fees[month];
      const status = fee.status || "unpaid";
      const fine = Number(fee.fine || 0);

      if (status === "paid") {
        totalPaid += monthlyFee + fine;
      } else {
        totalUnpaid += monthlyFee + fine;
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${month.toUpperCase()}</td>
        <td>
          <span class="badge ${
            status === "paid" ? "badge-paid" : "badge-unpaid"
          }">
            ${status.toUpperCase()}
          </span>
        </td>
        <td>₹${fine}</td>
        <td>${fee.paymentId || "-"}</td>
        <td>${fee.paidAt || "-"}</td>
      `;

      feeBody.appendChild(tr);
    });
  });

  paidEl.textContent = `₹${totalPaid}`;
  unpaidEl.textContent = `₹${totalUnpaid}`;
});
