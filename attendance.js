function previewPhoto() {
  const file = document.getElementById("photo").files[0];
  const img = document.getElementById("preview");

  if (file) {
    img.src = URL.createObjectURL(file);
    img.style.display = "block";
  }
}

function calculate() {
  const rows = document.querySelectorAll("#attTable tbody tr");
  let present = 0, absent = 0;

  rows.forEach(row => {
    const status = row.querySelector("select").value;
    status === "Present" ? present++ : absent++;
  });

  const total = present + absent;
  const percent = ((present / total) * 100).toFixed(1);

  document.getElementById("result").innerHTML =
    `Total Students: ${total}<br>
     Present: ${present}<br>
     Absent: ${absent}<br>
     Attendance: ${percent}%`;
}
