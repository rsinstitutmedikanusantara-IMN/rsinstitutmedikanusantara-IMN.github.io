// ==========================================
// INSTITUT MEDIKA NUSANTARA - SCRIPT.JS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. MOBILE MENU TOGGLE
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            menuToggle.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                menuToggle.textContent = '☰';
            });
        });
    }

    // 2. DARK MODE TOGGLE
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        if (localStorage.getItem('imn_theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀';
        }
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            themeToggle.textContent = isDark ? '☀' : '☾';
            localStorage.setItem('imn_theme', isDark ? 'dark' : 'light');
        });
    }

    // 3. APPOINTMENT FORM KE WHATSAPP
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const patientName = document.getElementById('patientName').value.trim();
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const message = document.getElementById('message').value.trim();

            if (patientName && service && date) {
                try {
                    const whatsappNumber = "6289673320727"; 
                    const text = `Halo Institut Medika Nusantara,\n\nSaya ingin mengajukan permohonan Janji Temu:\n\n` +
                                 `• *Nama Pasien*: ${patientName}\n` +
                                 `• *Layanan*: Poli ${service.toUpperCase()}\n` +
                                 `• *Tanggal Rencana*: ${date}\n` +
                                 `• *Catatan*: ${message ? message : '-'}\n\n` +
                                 `Mohon konfirmasinya. Terima kasih.`;

                    alert('Permohonan janji temu berhasil diproses! Mengarahkan ke WhatsApp IMN...');
                    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
                    appointmentForm.reset();
                } catch (error) {
                    alert('Maaf, pengiriman janji temu gagal diproses. Silakan coba kembali.');
                }
            } else {
                alert('Mohon lengkapi data formulir janji temu dengan benar.');
            }
        });
    }

    // 4. LOAD PAPAN APRESIASI DI BERANDA
    const appreciationGrid = document.getElementById('appreciationGrid');
    if (appreciationGrid) {
        const appreciations = JSON.parse(localStorage.getItem('imn_appreciation_data') || '[]');
        if (appreciations.length > 0) {
            let appHTML = '';
            appreciations.forEach(item => {
                let maskedName = "Pasien Anonim";
                if (item.name && item.name.length > 2) {
                    maskedName = item.name.charAt(0) + '*'.repeat(item.name.length - 2) + item.name.slice(-1);
                } else if (item.name) {
                    maskedName = item.name.charAt(0) + '*';
                }

                appHTML += `
                    <div style="background: var(--ivory); padding: 25px; border-radius: var(--radius-md); border: 1px solid var(--warm-taupe); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <span style="font-size: 0.65rem; font-weight: 700; padding: 3px 8px; background: var(--champagne); color: var(--navy-dark); border-radius: 999px;">${item.type}</span>
                                <small style="color: var(--text-light); font-size: 0.7rem;">${item.date}</small>
                            </div>
                            <p style="font-weight: 700; color: var(--sapphire); font-size: 0.8rem; margin-bottom: 6px;">Kategori: ${item.category}</p>
                            <p style="font-size: 0.88rem; color: var(--text); font-style: italic; line-height: 1.5; margin-bottom: 14px;">"${item.detail}"</p>
                        </div>
                        <div style="border-top: 1px solid var(--warm-taupe); padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                            <strong style="font-size: 0.78rem; color: var(--navy-dark);">${maskedName}</strong>
                            <span style="font-size: 0.65rem; color: var(--text-light);">Verified Patient</span>
                        </div>
                    </div>
                `;
            });
            appreciationGrid.innerHTML = appHTML;
        }
    }

    // 5. LOAD BERITA TICKER
    const newsTrack = document.getElementById('newsTrack');
    if (newsTrack) {
        const newsList = JSON.parse(localStorage.getItem('imn_news_data') || '[]');
        if (newsList.length > 0) {
            let newsHTML = '';
            newsList.forEach(item => {
                newsHTML += `<span class="news-item" style="margin-right: 40px;">📢 <strong>${item.date || ''}</strong>: ${item.title}</span>`;
            });
            newsTrack.innerHTML = newsHTML;
        }
    }

    // 6. LOAD DOKTER
    const docContainer = document.querySelector('.doctor-placeholder');
    if (docContainer) {
        const localDoctors = JSON.parse(localStorage.getItem('imn_doctor_data') || 'null');
        if (localDoctors && localDoctors.length > 0) {
            renderDoctors(localDoctors);
        } else {
            fetch('data.json')
                .then(res => res.json())
                .then(data => {
                    if (data.doctors && data.doctors.length > 0) renderDoctors(data.doctors);
                })
                .catch(() => {
                    docContainer.innerHTML = `<p style="color:var(--text-light); font-size:0.85rem;">Belum ada jadwal dokter yang dikonfigurasi.</p>`;
                });
        }
    }

    function renderDoctors(doctors) {
        let html = `<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px; text-align:left;">`;
        doctors.forEach(doc => {
            html += `
                <div style="background:var(--ivory); padding:20px; border-radius:12px; border:1px solid var(--warm-taupe); box-shadow:var(--shadow-sm);">
                    <div style="font-size:1.2rem; margin-bottom:6px;">👨‍⚕️</div>
                    <strong style="color:var(--navy-dark); display:block;">${doc.name}</strong>
                    <span style="color:var(--sapphire); font-size:0.8rem; font-weight:700;">${doc.spec}</span><br>
                    <small style="color:var(--text-light); font-size:0.75rem;">${doc.sched}</small>
                </div>
            `;
        });
        html += `</div>`;
        docContainer.innerHTML = html;
        docContainer.style.background = 'transparent';
        docContainer.style.border = 'none';
    }

    // 7. ANIMASI SCROLL DUAL-DIRECTION
    let lastScrollTop = 0;
    const reveals = document.querySelectorAll('.reveal');

    window.addEventListener('scroll', () => {
        let st = window.pageYOffset || document.documentElement.scrollTop;
        let isScrollingDown = st > lastScrollTop;
        lastScrollTop = st <= 0 ? 0 : st;
        const windowHeight = window.innerHeight;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - 80 && elementTop > -100) {
                reveal.classList.add('active-up');
                reveal.classList.remove('active-down');
            } else if (!isScrollingDown && elementTop >= windowHeight - 80) {
                reveal.classList.remove('active-up');
            }
        });
    });
});
