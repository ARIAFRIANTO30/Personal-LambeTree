// ==============================================================
// OTAK PENJAGA PINTU (VERSI FIREBASE AUTH ASLI)
// Script ini udah ga pake password palsu lagi, langsung konek server!
// ==============================================================

// 1. Panggil pasukan Firebase Auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Kunci gudang data gue
const firebaseConfig = {
    apiKey: "AIzaSyBmt9ogq6y5K9M6O8UYXwVFR7uVjXzMN_w",
    authDomain: "link-tree-project-26581.firebaseapp.com",
    projectId: "link-tree-project-26581",
    storageBucket: "link-tree-project-26581.firebasestorage.app",
    messagingSenderId: "835043240980",
    appId: "1:835043240980:web:a0efb8920eee7128628b01"
};

// Nyalain mesin Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 2. Tangkep elemen HTML yang mau digerakin
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');
const authBtn = document.getElementById('authBtn');
const toggleMode = document.getElementById('toggleMode');
const toggleText = document.getElementById('toggleText');

// Status awal pas web dibuka: Mode Log In
let isLoginMode = true; 

// ==============================================================
// 3. JURUS GANTI MODE (Dari Log in ke Sign up dan sebaliknya)
// ==============================================================
toggleMode.addEventListener('click', (e) => {
    e.preventDefault(); // Biar ga loncat ke atas halamannya
    isLoginMode = !isLoginMode; // Balik statusnya

    if (isLoginMode) {
        // Balikin ke baju Log in
        formTitle.innerText = "Welcome back";
        formSubtitle.innerText = "Log in to your Lambe Official account.";
        authBtn.innerText = "Log in";
        toggleText.innerText = "Don't have an account?";
        toggleMode.innerText = "Sign up";
    } else {
        // Ganti ke baju Sign up (Bikin akun baru)
        formTitle.innerText = "Create account";
        formSubtitle.innerText = "Sign up for free to manage your links.";
        authBtn.innerText = "Sign up";
        toggleText.innerText = "Already have an account?";
        toggleMode.innerText = "Log in";
    }
});

// ==============================================================
// 4. AKSI PAS TOMBOL UTAMA DITEKAN (LOG IN / SIGN UP)
// ==============================================================
authForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Tahan browser biar ga refresh
    
    const email = emailInput.value;
    const password = passwordInput.value;
    const originalText = authBtn.innerText;
    
    // Kasih efek loading biar estetik
    authBtn.innerHTML = "Processing...";
    authBtn.style.opacity = "0.7";
    
    try {
        if (isLoginMode) {
            // JALUR MASUK (LOG IN)
            // Firebase bakal ngecek akunnya ada atau nggak
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "admin.html"; // Kalau sukses, gas ke dashboard!
            
        } else {
            // JALUR BIKIN AKUN (SIGN UP)
            // Firebase bakal bikinin akun baru pake email & password ini
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Mantap! Akun lu berhasil dibikin. Langsung masuk ke Admin ya!");
            window.location.href = "admin.html";
        }
        
    } catch (error) {
        // Kalau error (misal password kependekan atau email udah dipake)
        console.error("Firebase Error: ", error.message);
        
        // Translate errornya biar manusiawi
        if (error.code === 'auth/email-already-in-use') {
            alert("Emailnya udah pernah didaftarin bos! Pake email lain.");
        } else if (error.code === 'auth/weak-password') {
            alert("Password lu kekecilan nyalinya, minimal 6 karakter lah!");
        } else if (error.code === 'auth/invalid-credential') {
            alert("Email atau password lu salah ngab! Cek lagi.");
        } else {
            alert("Error: " + error.message);
        }
        
        // Balikin tombol kayak semula kalau gagal
        authBtn.innerText = originalText;
        authBtn.style.opacity = "1";
    }
});