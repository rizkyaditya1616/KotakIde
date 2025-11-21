// ===============================================
// KREDENSIAL ADMIN DAN FUNGSI UTAMA
// ===============================================
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123'; 

// ===============================================
// FUNGSI MUAT DAN TAMPILKAN LAPORAN DARI LOCAL STORAGE
// ===============================================
function loadReports() {
    // Ambil data dari Local Storage
    const reports = JSON.parse(localStorage.getItem('kotakide_laporan')) || [];
    const tableBody = document.getElementById('laporan-body');
    
    // Kosongkan tabel sebelum diisi
    tableBody.innerHTML = '';

    if (reports.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-secondary">Belum ada laporan yang tersimpan di browser ini.</td></tr>';
        return;
    }
    
    // Urutkan laporan berdasarkan Urgensi (Tinggi > Sedang > Rendah)
    reports.sort((a, b) => {
        const urgencyOrder = { 'TINGGI': 3, 'SEDANG': 2, 'RENDAH': 1 };
        const aUrgency = a.urgensiAI.split(' ')[0]; // Ambil TINGGI/SEDANG/RENDAH
        const bUrgency = b.urgensiAI.split(' ')[0];
        return urgencyOrder[bUrgency] - urgencyOrder[aUrgency];
    });

    // Hitung statistik saat ini
    const highPriorityCount = reports.filter(r => r.urgensiAI.includes('TINGGI')).length;
    const newReportCount = reports.filter(r => r.status === 'BARU').length;
    
    // Update statistik cepat (Quick Stats)
    document.getElementById('stat-new-count').textContent = newReportCount;
    document.getElementById('stat-high-count').textContent = highPriorityCount;


    // Iterasi dan isi baris tabel
    reports.forEach(report => {
        let rowClass = '';
        if (report.urgensiAI.includes('TINGGI')) {
            rowClass = 'urgency-high';
        } else if (report.urgensiAI.includes('SEDANG')) {
            rowClass = 'urgency-medium';
        }
        
        const newRow = `
            <tr class="${rowClass}">
                <td>${report.urgensiAI}</td>
                <td>${report.sentimenAI}</td>
                <td>${report.kategori}</td>
                <td>
                    <strong>${report.judul}</strong> 
                    <br><small class="text-muted">${report.tanggal}</small>
                    <br><small class="text-info">${report.id}</small>
                </td>
                <td class="${report.status === 'BARU' ? 'status-baru' : 'text-success'}">${report.status}</td>
                <td>
                    <button class="btn btn-sm btn-outline-info" 
                        onclick="alert('Kode: ${report.id}\\nKategori: ${report.kategori}\\nDetail: ${report.detail}\\nStatus: ${report.status}')">
                        Lihat Detail
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" disabled>Ubah Status</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += newRow;
    });
}

// ===============================================
// FUNGSI LOGIN DAN LOGOUT
// ===============================================
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    attemptLogin();
});

function attemptLogin() {
    const inputUser = document.getElementById('username').value;
    const inputPass = document.getElementById('password').value;
    
    if (inputUser === ADMIN_USER && inputPass === ADMIN_PASS) {
        document.getElementById('login-prompt').style.display = 'none';
        document.getElementById('dashboard-content').style.display = 'block';
        
        // Panggil fungsi untuk memuat data laporan setelah login berhasil!
        loadReports(); 
        
    } else {
        alert('Username atau Password salah. Silakan coba lagi.');
    }
}

function logout() {
    document.getElementById('login-prompt').style.display = 'block';
    document.getElementById('dashboard-content').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    alert('Anda telah logout.');
}

// Inisialisasi: Sembunyikan dashboard saat halaman pertama dimuat
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('dashboard-content').style.display = 'none';
});
