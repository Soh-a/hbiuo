function addExam() {
  const exam = examName.value;
  const cls = className.value;
  const sub = subject.value;
  const date = date.value;
  const time = time.value;
  const dur = duration.value;

  if (!exam || !cls || !sub || !date || !time || !dur) {
    alert("Please fill all fields");
    return;
  }

  const row = `
    <tr>
      <td>${exam}</td>
      <td>${cls}</td>
      <td>${sub}</td>
      <td>${date}</td>
      <td>${time}</td>
      <td>${dur} hrs</td>
    </tr>
  `;

  document.querySelector("#timeTable tbody").innerHTML += row;

  // Clear inputs
  examName.value = "";
  className.value = "";
  subject.value = "";
  duration.value = "";
}
