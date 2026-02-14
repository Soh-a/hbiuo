// --------------------------
// Firebase Initialization
// --------------------------
const firebaseConfig = {
    apiKey: "AIzaSyC31nwqHDXPRC7WW0iEc5BImAqNa2-dTbc",
    authDomain: "students-6e271.firebaseapp.com",
    databaseURL: "https://students-6e271-default-rtdb.firebaseio.com",
    projectId: "students-6e271",
    storageBucket: "students-6e271.appspot.com",
    messagingSenderId: "336382170224",
    appId: "1:336382170224:web:21b2ace0bb69d5459810b5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --------------------------
// Get Today Date (YYYY-MM-DD)
// --------------------------
function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

// --------------------------
// Toggle Attendance + Save
// --------------------------
function toggleStatus(button) {

    const studentId = button.dataset.studentId;   // e.g. 6002425951
    const studentClass = button.dataset.class;    // e.g. LKG-A
    const date = getTodayDate();

    let status = "Present";

    if (button.innerText === "P") {
        button.innerText = "A";
        button.classList.add("absent");
        status = "Absent";
    } else {
        button.innerText = "P";
        button.classList.remove("absent");
        status = "Present";
    }

    const attendanceData = {
        status: status,
        class: studentClass,
        markedBy: "teacher",
        timestamp: Date.now()
    };

    // --------------------------
    // ROOT LEVEL SAVE
    // --------------------------
    db.ref(`${studentId}/attendance/${date}`)
        .set(attendanceData)
        .then(() => {
            console.log(`Attendance saved for ${studentId} on ${date}`);
        })
        .catch(error => {
            console.error("Attendance save failed", error);
            alert("Failed to save attendance");
        });
}
