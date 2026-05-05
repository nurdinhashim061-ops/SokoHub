import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let currentUser = null;

// CHECK LOGIN
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Login first");
    window.location.href = "login.html";
  } else {
    currentUser = user;
    loadMyProducts();
  }
});

// POST PRODUCT
window.postProduct = async function () {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const whatsapp = document.getElementById("whatsapp").value;
  const imageFile = document.getElementById("image").files[0];

  const imageRef = ref(storage, "products/" + imageFile.name);
  await uploadBytes(imageRef, imageFile);

  const imageURL = await getDownloadURL(imageRef);

  await addDoc(collection(db, "products"), {
    title,
    price,
    whatsapp,
    imageURL,
    sellerId: currentUser.uid
  });

  alert("Product uploaded");
  loadMyProducts();
};

// LOAD SELLER PRODUCTS
async function loadMyProducts() {
  const q = query(
    collection(db, "products"),
    where("sellerId", "==", currentUser.uid)
  );

  const snapshot = await getDocs(q);

  let html = "";

  snapshot.forEach(doc => {
    const p = doc.data();

    html += `
      <div>
        <img src="${p.imageURL}" width="100">
        <h4>${p.title}</h4>
        <p>${p.price}</p>
      </div>
    `;
  });

  document.getElementById("myProducts").innerHTML = html;
}