const fileInput = document.getElementById("registerPhoto");
const resultDiv = document.getElementById("result");
const processingDiv = document.getElementById("processing");

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  resultDiv.innerHTML = "";
  processingDiv.textContent = "Processing image, please wait... ⏳";

  try {
    // Run OCR
    const { data: { text } } = await Tesseract.recognize(file, 'eng', { logger: m => console.log(m) });

    processingDiv.textContent = "Processing complete ✅";

    // Parse text lines
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    let total = 0, attended = 0;
    let attendanceList = "<ul>";

    lines.forEach(line => {
      total++;
      // Simple assumption: line ends with P (present) or A (absent)
      const isPresent = /P$/i.test(line);
      if (isPresent) attended++;
      attendanceList += `<li><span>${line.replace(/P$/i,'').replace(/A$/i,'').trim()}</span><span>${isPresent ? "Present ✅" : "Absent ❌"}</span></li>`;
    });

    attendanceList += "</ul>";

    const percentage = total > 0 ? ((attended / total) * 100).toFixed(2) : 0;
    attendanceList += `<p>Total Students: ${total} | Present: ${attended} | Attendance: ${percentage}%</p>`;

    resultDiv.innerHTML = attendanceList;

  } catch (err) {
    processingDiv.textContent = "Error processing image ❌";
    console.error(err);
  }
});
