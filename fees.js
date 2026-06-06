import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔹 Change your Firebase URL here
const firebaseConfig = {
   apiKey: "AIzaSyC31nwqHDXPRC7WW0iEc5BImAqNa2-dTbc",
  authDomain: "students-6e271.firebaseapp.com",
  databaseURL: "https://students-6e271-default-rtdb.firebaseio.com",
  projectId: "students-6e271",
  storageBucket: "students-6e271.firebasestorage.app",
  messagingSenderId: "336382170224",
  appId: "1:336382170224:web:21b2ace0bb69d5459810b5"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const collectedEl = document.getElementById("collected");
const toCollectEl = document.getElementById("toCollect");

async function loadFeeSummary() {
  const snapshot = await get(ref(db, "students/"));
  let totalCollected = 0;
  let totalFee = 0;

  if(snapshot.exists()){
    const students = snapshot.val();
    for(const studentID in students){
      const s = students[studentID];
      const monthlyFee = s.monthlyFee || 0;
      totalFee += monthlyFee;

      if(s.fees){
        for(const month in s.fees){
          const fee = s.fees[month];
          if(fee.status === "paid"){
            totalCollected += monthlyFee + (fee.fine || 0);
          }
        }
      }
    }
  }

  collectedEl.textContent = `₹${totalCollected}`;
  toCollectEl.textContent = `₹${totalFee}`;
}

loadFeeSummary();
