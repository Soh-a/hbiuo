/* =========================
   🔐 AUTH GUARD (DV ONLY)
========================= */
 const isLoggedIn = localStorage.getItem("isLoggedIn");
const role = (localStorage.getItem("erpRole") || "").toLowerCase();

if (isLoggedIn !== "true" || role !== "dv") {
  alert("Unauthorized access");
  window.location.replace("login.html");
}
/* =========================
   🔥 FIREBASE INIT
========================= */
firebase.initializeApp({
  apiKey: "AIzaSyC31nwqHDXPRC7WW0iEc5BImAqNa2-dTbc",
  authDomain: "students-6e271.firebaseapp.com",
  databaseURL: "https://students-6e271-default-rtdb.firebaseio.com",
  projectId: "students-6e271"
});

const db = firebase.database();

/* =========================
   🎓 LOAD STUDENTS
   (students are in ROOT)
========================= */
let totalStudents = 0;
let classCount = {};

db.ref("/").once("value", snap => {
  snap.forEach(child => {
    const s = child.val();

    // student पहचान
    if (s && s.name && s.class && s.monthlyfee) {
      totalStudents++;

      if (!classCount[s.class]) {
        classCount[s.class] = 1;
      } else {
        classCount[s.class]++;
      }
    }
  });

  document.getElementById("totalStudents").innerText = totalStudents;
  buildClassChart(classCount);
});

/* =========================
   👨‍🏫 LOAD STAFF
========================= */
db.ref("staff").once("value", snap => {
  document.getElementById("totalEmployees").innerText = snap.numChildren();
});

/* =========================
   📊 CLASS WISE CHART
========================= */
function buildClassChart(data) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  new Chart(document.getElementById("classChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Students",
        data: values,
        backgroundColor: "#2563eb"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

/* =========================
   💰 FEE COLLECTION CHART
========================= */
let paid = 0;
let unpaid = 0;

db.ref("/").once("value", snap => {
  snap.forEach(child => {
    const s = child.val();
    if (s && s.fees) {
      Object.values(s.fees).forEach(m => {
        if (m.status === "paid") paid++;
        else unpaid++;
      });
    }
  });

  new Chart(document.getElementById("feeChart"), {
    type: "doughnut",
    data: {
      labels: ["Paid", "Unpaid"],
      datasets: [{
        data: [paid, unpaid],
        backgroundColor: ["#16a34a", "#dc2626"]
      }]
    },
    options: { responsive: true }
  });
});
