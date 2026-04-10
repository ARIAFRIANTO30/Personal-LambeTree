import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, setDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBmt9ogq6y5K9M6O8UYXwVFR7uVjXzMN_w",
    authDomain: "link-tree-project-26581.firebaseapp.com",
    projectId: "link-tree-project-26581",
    storageBucket: "link-tree-project-26581.firebasestorage.app",
    messagingSenderId: "835043240980",
    appId: "1:835043240980:web:a0efb8920eee7128628b01"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// AUTH CHECK
onAuthStateChanged(auth, (user) => {
    if (user) { 
        document.getElementById('dashboardScreen').style.display = "flex"; 
        initData(); 
    } else { 
        window.location.href = "login.html"; 
    }
});

window.logoutBos = () => { if(confirm("Keluar dari admin?")) signOut(auth).then(() => location.href="login.html"); };

function initData() {
    // SYNC PROFILE
    const profRef = doc(db, "profile", "main");
    onSnapshot(profRef, (s) => {
        if(s.exists()){
            const d = s.data();
            document.getElementById('profName').value = d.name || "";
            document.getElementById('profBio').value = d.bio || "";
            document.getElementById('profImg').value = d.imgUrl || "";
            document.getElementById('previewImg').src = d.imgUrl || "img/Logo_Saya.png";
            document.getElementById('dispName').innerText = d.name || "Lambe Official Shop";
            
            // Potong bio jika kepanjangan seperti di screenshot
            let bioText = d.bio || "Discover one-of-a-kind designs that bring people together! Explore our collectio...";
            if(bioText.length > 80) bioText = bioText.substring(0, 80) + "...";
            document.getElementById('dispBio').innerText = bioText;
        }
    });

    document.getElementById('saveProfBtn').onclick = async () => {
        await setDoc(profRef, { 
            name: document.getElementById('profName').value, 
            bio: document.getElementById('profBio').value, 
            imgUrl: document.getElementById('profImg').value 
        }, {merge:true});
        showToast("Profile Updated!");
        document.getElementById('profileForm').style.display = "none";
        if(window.refreshPreview) window.refreshPreview();
    };

    // SYNC LINKS
    const colRef = collection(db, "links");
    document.getElementById('saveBtn').onclick = async () => {
        const title = document.getElementById('linkTitle').value;
        const url = document.getElementById('linkUrl').value;
        const id = document.getElementById('editId').value;
        if(id) { await updateDoc(doc(db, "links", id), {title, url}); }
        else { await addDoc(colRef, {title, url, createdAt: new Date()}); }
        resetForm(); showToast("Link Saved!");
    };

    // Render List Link
    onSnapshot(query(colRef, orderBy("createdAt", "desc")), (snapshot) => {
        const listContainer = document.getElementById('admin-link-list');
        let html = "";
        
        if (snapshot.empty) {
            html = '<div style="text-align:center; padding:40px; color:#6B7280; font-weight:500; border: 2px dashed #E5E7EB; border-radius: 20px;">Belum ada link. Klik "Add Link" untuk mulai.</div>';
        } else {
            snapshot.forEach((linkDoc) => {
                const data = linkDoc.data();
                const fakeClicks = Math.floor(Math.random() * 15); 
                
                html += `
                    <div class="link-card-real">
                        <div class="drag-zone">
                            <i class="fas fa-ellipsis-vertical"></i>
                            <i class="fas fa-ellipsis-vertical" style="margin-left:-2px;"></i>
                        </div>
                        
                        <div class="card-content">
                            <div class="card-title-row">
                                ${data.title} 
                                <i class="fas fa-pen" style="font-size:11px; cursor:pointer; color:#9CA3AF;" onclick="window.siapEdit('${linkDoc.id}', '${data.title.replace(/'/g, "\\'")}', '${data.url}')"></i>
                            </div>
                            <div class="card-url-row">${data.url}</div>
                            <div class="card-tools">
                                <i class="far fa-image"></i>
                                <i class="far fa-star"></i>
                                <i class="fas fa-chart-bar"></i>
                                <span style="font-size:12px; font-weight:600; color:#6B7280;">${fakeClicks} clicks</span>
                            </div>
                        </div>
                        
                        <div class="card-actions">
                            <label class="switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                            <i class="far fa-trash-can trash-btn" onclick="window.hapusLink('${linkDoc.id}')"></i>
                        </div>
                    </div>`;
            });
        }
        listContainer.innerHTML = html;
        if(window.refreshPreview) window.refreshPreview();
    });

// Update Toast biar pesannya dinamis
window.showToast = (m) => { 
    const t = document.getElementById('toast'); 
    document.getElementById('toastMsg').innerText = m;
    t.className = "show"; 
    setTimeout(() => t.className = "", 3000); 
};

// ... (Sisanya tetap sama) ...

    window.siapEdit = (id, t, u) => {
        document.getElementById('editId').value = id;
        document.getElementById('linkTitle').value = t;
        document.getElementById('linkUrl').value = u;
        document.getElementById('linkForm').style.display = "block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.hapusLink = async (id) => { if(confirm("Hapus?")) await deleteDoc(doc(db, "links", id)); };

    function resetForm() {
        document.getElementById('editId').value = "";
        document.getElementById('linkTitle').value = "";
        document.getElementById('linkUrl').value = "";
        document.getElementById('linkForm').style.display = "none";
    }
}

function showToast(m) { const t = document.getElementById('toast'); t.innerText = m; t.className = "show"; setTimeout(() => t.className = "", 3000); }