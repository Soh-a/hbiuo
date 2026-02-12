/*************************
 FIREBASE INIT (v8)
*************************/
firebase.initializeApp({
  apiKey: "AIzaSyC31nwqHDXPRC7WW0iEc5BImAqNa2-dTbc",
  authDomain: "students-6e271.firebaseapp.com",
  databaseURL: "https://students-6e271-default-rtdb.firebaseio.com",
  projectId: "students-6e271",
  storageBucket: "students-6e271.appspot.com",
  messagingSenderId: "336382170224",
  appId: "1:336382170224:web:21b2ace0bb69d5459810b5"
});

const db = firebase.database();

/*************************
 ELEMENT REFERENCES
*************************/
const totalStudents = document.getElementById("totalStudents");
const totalEmployees = document.getElementById("totalEmployees");
const totalTransport = document.getElementById("totalTransport");
const totalHostel = document.getElementById("totalHostel");

let classChart, employeeChart, salaryChart, transportChart, hostelChart, feeChart;

/*************************
 GLOBALS
*************************/
const CLASSES = ["LKG","UKG","1","2","3","4","5","6","7","8","9","10","11","12"];
const STAFF_ROLES = ["Teacher","Accountant","Librarian","Non-Teaching","Other"];

let students = {};
let staff = {};
let transport = {};
let hostel = {};

/*************************
 LOAD DATA
*************************/
db.ref("/").on("value", snap => {
  const allData = snap.val();
  console.log("Firebase data:", allData);

  if(!allData) return;

  // Separate data
  staff = allData.staff || {};
  delete allData.staff;

  transport = allData.transport || {};
  delete allData.transport;

  hostel = allData.hostel || {};
  delete allData.hostel;

  students = allData;

  updateMetrics();
  renderCharts();
});

/*************************
 UPDATE TOP METRICS
*************************/
function updateMetrics(){
  totalStudents.innerText = Object.keys(students).length;
  totalEmployees.innerText = Object.keys(staff).length;
  totalTransport.innerText = transport.vehicles || 0;
  totalHostel.innerText = hostel.hostels || 0;
}

/*************************
 RENDER CHARTS
*************************/
function renderCharts(){

  // 1️⃣ CLASS WISE STUDENTS
  const classCounts = {};
  CLASSES.forEach(c=>classCounts[c]=0);
  Object.values(students).forEach(s=>{
    if(s.class && classCounts[s.class]!==undefined) classCounts[s.class]++;
  });
  renderBarChart("classChart", Object.keys(classCounts), Object.values(classCounts), "#3b82f6");

  // 2️⃣ EMPLOYEES DISTRIBUTION
  const roleCounts = {};
  STAFF_ROLES.forEach(r=>roleCounts[r]=0);
  Object.values(staff).forEach(s=>{
    if(s.role && roleCounts[s.role]!==undefined) roleCounts[s.role]++;
    else roleCounts["Other"]++;
  });
  renderDoughnutChart("employeeChart", Object.keys(roleCounts), Object.values(roleCounts));

  // 3️⃣ SALARIES
  const salaryValues = {Today:0, Week:0, Month:0, Year:0};
  Object.values(staff).forEach(s=>{
    const sal = Number(s.salary||0);
    salaryValues.Today += sal;
    salaryValues.Week += sal;
    salaryValues.Month += sal;
    salaryValues.Year += sal;
  });
  renderBarChart("salaryChart", Object.keys(salaryValues), Object.values(salaryValues), "#10b981");

  // 4️⃣ TRANSPORT
  const transportValues = [
    transport.vehicles||0,
    transport.drivers||0,
    transport.routes||0
  ];
  renderBarChart("transportChart", ["Vehicles","Drivers","Routes"], transportValues, "#fde68a");

  // 5️⃣ HOSTEL
  const hostelValues = [
    hostel.hostels||0,
    hostel.rooms||0,
    hostel.beds||0,
    hostel.students||0
  ];
  renderBarChart("hostelChart", ["Hostels","Rooms","Beds","Students"], hostelValues, "#c7d2fe");

  // 6️⃣ STUDENT FEE COLLECTION
  const months = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
  const feesPerMonth = months.map(m=>{
    let total=0;
    Object.values(students).forEach(s=>{
      if(!s.fees) return;
      const f = s.fees[m.toLowerCase()];
      if(f && f.status==="paid") total += Number(s.monthlyfee||0);
    });
    return total;
  });
  renderBarChart("feeChart", months, feesPerMonth, "#f87171");
}

/*************************
 CHART HELPERS
*************************/
function renderBarChart(canvasId, labels, data, color){
  const ctx = document.getElementById(canvasId);
  if(window[canvasId]) window[canvasId].destroy();
  window[canvasId] = new Chart(ctx,{
    type:"bar",
    data:{labels, datasets:[{label:"", data, backgroundColor:color, borderRadius:6}]},
    options:{responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}
  });
}

function renderDoughnutChart(canvasId, labels, data){
  const ctx = document.getElementById(canvasId);
  if(window[canvasId]) window[canvasId].destroy();
  window[canvasId] = new Chart(ctx,{
    type:"doughnut",
    data:{labels, datasets:[{data, backgroundColor:["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ef4444"]}]},
    options:{responsive:true, plugins:{legend:{position:"bottom"}}}
  });
 }