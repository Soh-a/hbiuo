/***********************
 🔐 BASIC SECURITY
***********************/
if (localStorage.getItem("erpRole") !== "DV") {
  alert("Unauthorized access");
  window.location.href = "login.html";
}

/***********************
 🔥 FIREBASE CONFIG
***********************/
var firebaseConfig = {
  apiKey: "AIzaSyC31nwqHDXPRC7WW0iEc5BImAqNa2-dTbc",
  authDomain: "students-6e271.firebaseapp.com",
  databaseURL: "https://students-6e271-default-rtdb.firebaseio.com",
  projectId: "students-6e271"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

/***********************
 📊 LOAD DASHBOARD
***********************/
loadDashboard();

function loadDashboard() {
  loadStudents();
  loadFeeChart();
  loadEmployees();
}

/***********************
 👩‍🎓 STUDENTS (ROOT)
***********************/
function loadStudents() {
  db.ref("/").once("value", snap => {
    const data = snap.val() || {};

    let studentCount = 0;
    let classCount = {};

    Object.values(data).forEach(s => {
      if (!s || !s.fees) return; // skip if no fees → not a student

      studentCount++;

      const cls = s.class || "Unknown";
      classCount[cls] = (classCount[cls] || 0) + 1;
    });

    document.getElementById("totalStudents").innerText = studentCount;
    drawBarChart("classChart", classCount, "Students per Class");
  });
}

/***********************
 👩‍💼 EMPLOYEES / STAFF
***********************/
function loadEmployees() {
  db.ref("/staff").once("value", snap => {
    const data = snap.val() || {};

    let employeeCount = 0;
    let departmentCount = {};

    Object.values(data).forEach(emp => {
      if (!emp || !emp.name) return;

      employeeCount++;

      const dept = emp.department || "Unknown";
      departmentCount[dept] = (departmentCount[dept] || 0) + 1;
    });

    document.getElementById("totalEmployees").innerText = employeeCount;
    drawBarChart("departmentChart", departmentCount, "Employees per Department");
  });
}

/***********************
 💰 FEES (STUDENTS)
***********************/
function loadFeeChart() {
  db.ref("/").once("value", snap => {
    const data = snap.val() || {};

    const months = [
      "april","may","june","july","august","september",
      "october","november","december","january","february","march"
    ];

    let monthly = {};
    months.forEach(m => monthly[m] = 0);

    Object.values(data).forEach(s => {
      if (!s || !s.fees || !s.monthlyFee) return;

      const fee = Number(s.monthlyFee);

      months.forEach(m => {
        if (s.fees[m]?.status === "paid") {
          monthly[m] += fee;
        }
      });
    });

    drawBarChart("feeChart", monthly, "Fees Collected");
  });
}

/***********************
 📈 CHART HELPERS
***********************/
function drawBarChart(canvasId, data, label) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: label,
        data: Object.values(data),
        backgroundColor: "#2563eb"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

function drawPieChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  new Chart(canvas, {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: [
          "#60a5fa","#34d399","#fbbf24",
          "#f87171","#a78bfa","#fb7185"
        ]
      }]
    },
    options: { responsive: true }
  });
}
