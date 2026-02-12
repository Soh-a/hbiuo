import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getDatabase } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
export const db = getDatabase(app);
