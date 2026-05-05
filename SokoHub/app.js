import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, doc, setDoc, query, where 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import { 
  getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";

// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyCdV3AQSdjye6OTn0Yq8ClzzEyU4O_NJkM",
  authDomain: "sokohub-96616.firebaseapp.com",
  projectId: "sokohub-96616",
  storageBucket: "sokohub-96616.appspot.com",
  messagingSenderId: "720956121693",
  appId: "1:720956121693:web:c0c21dd813b072253b63b4",
  measurementId: "G-L79289HFJW"
};

// ================= INIT ONCE ONLY =================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// ================= AUTH =================
window.showRegister = function () {
  const email = prompt("Email");
  const password = prompt("Password");

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Registered"))
    .catch(err => alert(err.message));
};

window.showLogin = function () {
  const email = prompt("Email");
  const password = prompt("Password");

  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Logged in"))
    .catch(err => alert(err.message));
};

window.logout = function () {
  signOut(auth);
};

// ================= POST PRODUCT =================
window.postProduct = async function () {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const whatsapp = document.getElementById("whatsapp").value;
  const imageFile = document.getElementById("image").files[0];

  const imageRef = ref(storage, "products/" + imageFile.name);
  await uploadBytes(imageRef, imageFile);

  const imageURL = await getDownloadURL(imageRef);

  await addDoc(collection(db, "products"), {
    title,
    price,
    description,
    whatsapp,
    imageURL
  });

  alert("Product posted!");
};

// ================= LOAD PRODUCTS =================
window.loadProducts = async function () {
  const snapshot = await getDocs(collection(db, "products"));

  let html = "";

  snapshot.forEach(docSnap => {
    const p = docSnap.data();

    html += `
      <div class="product">
        <img src="${p.imageURL}" width="100%" style="border-radius:10px;" />

        <h3>${p.title}</h3>
        <p>${p.price} Tsh</p>
        <p>${p.description}</p>

        <button onclick="likeProduct('${docSnap.id}')">❤️ Like</button>

        <a class="wa-btn"
           href="https://wa.me/${p.whatsapp}?text=Nahitaji%20kununua:%20${p.title}"
           target="_blank">
           💬 Chat Seller
        </a>
      </div>
    `;
  });

  document.getElementById("products").innerHTML = html;
};

// ================= LIKE =================
window.likeProduct = async function(productId) {
  const userId = auth.currentUser?.uid || "guest";

  await setDoc(doc(db, "likes", productId + "_" + userId), {
    productId,
    userId
  });

  alert("Liked ❤️");
};

// ================= MPESA (PLACEHOLDER) =================
window.payWithMpesa = function () {
  alert("Redirecting to M-Pesa...");
};
window.filterCategory = async function (category) {
  const snapshot = await getDocs(collection(db, "products"));

  let html = "";

  snapshot.forEach(doc => {
    const p = doc.data();

    if (category === "all" || p.category === category) {
      html += `
        <div class="product">
          <img src="${p.imageURL}" />

          <h3>${p.title}</h3>
          <p>${p.price} Tsh</p>

          <a class="wa-btn"
             href="https://wa.me/${p.whatsapp}?text=Nahitaji ${p.title}"
             target="_blank">
             💬 WhatsApp
          </a>
        </div>
      `;
    }
  });

  document.getElementById("products").innerHTML = html;
};