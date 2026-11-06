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
        });
    }

    // 2. APPOINTMENT FORM KE WHATSAPP
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const patientName = document.getElementById('patientName').value.trim();
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const message = document.getElementById('message').value.trim();

            if (patientName && service && date) {
                const whatsappNumber = "6289673320727"; 
                const text = `Halo Institut Medika Nusantara,\n\nSaya ingin mengajukan permohonan Janji Temu:\n\n` +
                             `• *Nama Pasien*: ${patientName}\n` +
                             `• *Layanan*: Poli ${service.toUpperCase()}\n` +
                             `• *Tanggal Rencana*: ${date}\n` +
                             `• *Catatan*: ${message ? message : '-'}\n\n` +
                             `Mohon konfirmasinya. Terima kasih.`;

                window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
                appointmentForm.reset();
            }
        });
    }

    // 3. LOAD BERITA KE TICKER OTOMATIS
    loadNewsTicker();

    function loadNewsTicker() {
        const newsTrack = document.getElementById('newsTrack');
        if (!newsTrack) return;

        const newsList = JSON.parse(localStorage.getItem('imn_news_data') || '[]');
        if (newsList.length > 0) {
            let newsHTML = '';
            newsList.forEach(item => {
                newsHTML += `<span class="news-item" style="margin-right: 40px;">📢 <strong>${item.date || ''}</strong>: ${item.title}</span>`;
            });
            newsTrack.innerHTML = newsHTML;
        } else {
            fetch('data.json')
                .then(res => res.json())
                .then(data => {
                    if (data.news && data.news.length > 0) {
                        let newsHTML = '';
                        data.news.forEach(item => {
                            newsHTML += `<span class="news-item" style="margin-right: 40px;">📢 ${item.title}</span>`;
                        });
                        newsTrack.innerHTML = newsHTML;
                    }
                })
                .catch(() => {});
        }
    }

    // 4. LOAD DATA DOKTER
    loadDoctors();

    function loadDoctors() {
        const docContainer = document.querySelector('.doctor-placeholder');
        if (!docContainer) return;

        const localDoctors = JSON.parse(localStorage.getItem('imn_doctor_data') || 'null');
        if (localDoctors && localDoctors.length > 0) {
            renderDoctors(localDoctors);
        } else {
            fetch('data.json')
                .then(res => res.json())
                .then(data => {
                    if (data.doctors) renderDoctors(data.doctors);
                })
                .catch(() => {
                    docContainer.innerHTML = `<p style="color:var(--text-light);">Belum ada jadwal dokter yang dikonfigurasi.</p>`;
                });
        }
    }

    function renderDoctors(doctors) {
        const docContainer = document.querySelector('.doctor-placeholder');
        if (!docContainer) return;

        let html = `<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px; text-align:left;">`;
        doctors.forEach(doc => {
            html += `
                <div style="background:var(--white); padding:20px; border-radius:12px; border:1px solid var(--border); box-shadow:var(--shadow-sm);">
                    <div style="font-size:1.2rem; margin-bottom:6px;">👨‍⚕️</div>
                    <strong style="color:var(--navy-dark); display:block;">${doc.name}</strong>
                    <span style="color:var(--blue-accent); font-size:0.8rem; font-weight:700;">${doc.spec}</span><br>
                    <small style="color:var(--text-light); font-size:0.75rem;">${doc.sched}</small>
                </div>
            `;
        });
        html += `</div>`;
        docContainer.innerHTML = html;
        docContainer.style.background = 'transparent';
        docContainer.style.border = 'none';
    }

    // 5. ANIMASI SCROLL DUAL-DIRECTION (NAIK & TURUN)
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
