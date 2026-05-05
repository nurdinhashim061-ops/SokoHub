import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadAllProducts() {
  const snapshot = await getDocs(collection(db, "products"));

  let html = "";

  snapshot.forEach(doc => {
    const p = doc.data();

    html += `
      <div>
        <h3>${p.title}</h3>
        <p>${p.price}</p>
      </div>
    `;
  });

  document.getElementById("allProducts").innerHTML = html;
}

loadAllProducts();