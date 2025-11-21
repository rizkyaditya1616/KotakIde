// ===============================================
// JAVASCRIPT MURNI (Vanilla JS)
// ===============================================

/**
 * Fungsi untuk menentukan urgensi dan sentimen laporan (Simulasi NLP).
 */
function analyzeLaporan(text) {
    const lowerText = text.toLowerCase();
    let urgency = "RENDAH";
    let sentiment = "Netral";
    let urgencyScore = 0;
    let triggerWords = [];

    // Kata kunci Urgensi TINGGI
    const highUrgencyKeywords = ['ancam', 'pukul', 'kekerasan', 'intimidasi', 'takut', 'perkelahian', 'darah', 'senjata'];
    for (const keyword of highUrgencyKeywords) {
        if (lowerText.includes(keyword)) {
            urgencyScore += 5;
            triggerWords.push(keyword);
        }
    }
    
    // Kata kunci Urgensi SEDANG
    const mediumUrgencyKeywords = ['rusak', 'bocor', 'mati', 'panas', 'kotor', 'berbahaya', 'busuk', 'tidak layak', 'pelayanan buruk'];
    for (const keyword of mediumUrgencyKeywords) {
        if (lowerText.includes(keyword)) {
            urgencyScore += 2;
            triggerWords.push(keyword);
        }
    }

    // Penentuan Urgensi Akhir dan Sentimen
    if (urgencyScore >= 5) {
        urgency = "TINGGI 🚨";
        sentiment = "Negatif Kuat (Marah/Takut)";
    } else if (urgencyScore >= 2) {
        urgency = "SEDANG ⚠️";
        sentiment = "Frustrasi/Tidak Puas";
    }
    
    return {
        urgency: urgency,
        sentiment: sentiment,
        triggerWords: triggerWords.length > 0 ? triggerWords.join(', ') : 'Tidak ditemukan',
        rawScore: urgencyScore
    };
}

// ===============================================
// Logika Pengiriman Formulir & Penyimpanan Data
// ===============================================
document.getElementById('laporanForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const kategori = document.getElementById('kategori').value;
    const judul = document.getElementById('judul').value;
    const detail = document.getElementById('detail').value;

    // 1. Proses Laporan melalui AI Triage
    const aiResult = analyzeLaporan(detail);
    
    // 2. Buat Kode Unik (Simulasi)
    const uniqueCode = 'KOTAK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // 3. Buat Objek Laporan Lengkap untuk disimpan
    const newReport = {
        id: uniqueCode,
        kategori: kategori,
        judul: judul,
        detail: detail,
        urgensiAI: aiResult.urgency,
        sentimenAI: aiResult.sentiment,
        triggerWords: aiResult.triggerWords,
        status: 'BARU',
        tanggal: new Date().toLocaleString()
    };
    
    // 4. AMBIL, TAMBAHKAN, dan SIMPAN ke Local Storage
    let reports = JSON.parse(localStorage.getItem('kotakide_laporan')) || [];
    reports.push(newReport);
    localStorage.setItem('kotakide_laporan', JSON.stringify(reports)); // Data tersimpan

    // 5. Tentukan kelas CSS dan tampilkan hasil
    let urgencyClass = '';
    if (aiResult.urgency.includes('TINGGI')) {
        urgencyClass = 'urgency-high-text';
    } else if (aiResult.urgency.includes('SEDANG')) {
        urgencyClass = 'urgency-medium-text';
    } else {
        urgencyClass = 'urgency-low-text';
    }

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = `
        <h3>✅ Laporan Tersimpan dan Terkirim!</h3>
        <p>Simpan kode unik Anda untuk melacak status penanganan:</p>
        <h2 style="color: #17a2b8;">${uniqueCode}</h2>
        
        <div class="ai-result">
            <strong>[ SIMULASI HASIL AI TRIAGE ]</strong>
            <p>Urgensi Otomatis: <span class="${urgencyClass}">${aiResult.urgency}</span></p>
            <p>Sentimen Dideteksi: <strong>${aiResult.sentiment}</strong></p>
            <p>Kata Kunci Pemicu: ${aiResult.triggerWords}</p>
            <p style="font-style: italic; color: #6c757d;">(Data ini tersedia di Dashboard Admin.)</p>
        </div>
        <p style="text-align: center; margin-top: 15px;">Terima kasih atas keberanian Anda. Kami akan segera bertindak.</p>
    `;

    outputDiv.style.display = 'block';
    document.getElementById('laporanForm').style.display = 'none';
    outputDiv.scrollIntoView({ behavior: 'smooth' });
});
