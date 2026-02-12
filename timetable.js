const form = document.getElementById("timetableForm");
const tableBody = document.querySelector("#timetableTable tbody");

// Load timetable from localStorage
let timetable = JSON.parse(localStorage.getItem("teacherTimetable") || "[]");

function renderTable() {
  tableBody.innerHTML = "";
  timetable.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.day}</td>
      <td>${entry.className}</td>
      <td>${entry.subject}</td>
      <td>${entry.startTime}</td>
      <td>${entry.endTime}</td>
      <td><button data-index="${index}">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// Add new timetable entry
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newEntry = {
    subject: document.getElementById("subject").value,
    className: document.getElementById("className").value,
    day: document.getElementById("day").value,
    startTime: document.getElementById("startTime").value,
    endTime: document.getElementById("endTime").value
  };
  timetable.push(newEntry);
  localStorage.setItem("teacherTimetable", JSON.stringify(timetable));
  form.reset();
  renderTable();
});

// Delete entry
tableBody.addEventListener("click", (e) => {
  if(e.target.tagName === "BUTTON") {
    const index = e.target.getAttribute("data-index");
    timetable.splice(index, 1);
    localStorage.setItem("teacherTimetable", JSON.stringify(timetable));
    renderTable();
  }
});

// Initial render
renderTable();
