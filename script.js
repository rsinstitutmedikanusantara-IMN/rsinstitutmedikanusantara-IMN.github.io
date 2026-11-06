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
            const isOpen = mainNav.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            menuToggle.textContent = isOpen ? '✕' : '☰';
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
    const savedTheme = localStorage.getItem('imn_theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            themeToggle.textContent = isDarkMode ? '☀' : '☾';
            localStorage.setItem('imn_theme', isDarkMode ? 'dark' : 'light');
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

    // 4. LOAD DATA DOKTER & KONTAK (PRIORITAS LOCALSTORAGE ADMIN, FALLBACK KE data.json)
    loadDoctorsAndContact();

    function loadDoctorsAndContact() {
        const localDoctors = JSON.parse(localStorage.getItem('imn_doctor_data') || 'null');
        const localContact = JSON.parse(localStorage.getItem('imn_contact_data') || 'null');

        if (localDoctors && localDoctors.length > 0) {
            renderDoctorList(localDoctors);
        } else {
            fetch('data.json')
                .then(res => res.json())
                .then(data => {
                    if (data.doctors) renderDoctorList(data.doctors);
                    if (data.contact) renderContact(data.contact);
                })
                .catch(err => console.log('Menggunakan data lokal...', err));
        }

        if (localContact && localContact.address) {
            renderContact(localContact);
        }
    }

    function renderDoctorList(doctors) {
        const docContainer = document.querySelector('.doctor-placeholder');
        if (docContainer && doctors.length > 0) {
            let docHTML = `<div class="services-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); text-align: left;">`;
            doctors.forEach(doc => {
                docHTML += `
                    <div class="service-card" style="box-shadow: var(--shadow-sm);">
                        <div class="service-icon">👨‍⚕️</div>
                        <h3>${doc.name}</h3>
                        <p style="color: var(--blue-accent); font-weight:700; margin-bottom:4px;">${doc.spec}</p>
                        <small style="color: var(--text-light);">${doc.sched}</small>
                    </div>
                `;
            });
            docHTML += `</div>`;
            docContainer.innerHTML = docHTML;
            docContainer.style.background = 'transparent';
            docContainer.style.border = 'none';
        }
    }

    function renderContact(contact) {
        const items = document.querySelectorAll('.contact-item p');
        if (items.length >= 4) {
            items[0].textContent = contact.address;
            items[1].textContent = contact.phone;
            items[2].textContent = contact.email;
            items[3].textContent = contact.hours;
        }
    }

    // 5. LOAD WALL OF APPRECIATION (PUJIAN PASIEN)
    const appreciationGrid = document.getElementById('appreciationGrid');
    const appreciations = JSON.parse(localStorage.getItem('imn_appreciation_data') || '[]');

    if (appreciationGrid && appreciations.length > 0) {
        let appHTML = '';
        appreciations.forEach(item => {
            let maskedName = "Pasien Anonim";
            if (item.name && item.name.length > 2) {
                maskedName = item.name.charAt(0) + '*'.repeat(item.name.length - 2) + item.name.slice(-1);
            } else if (item.name) {
                maskedName = item.name.charAt(0) + '*';
            }

            appHTML += `
                <div style="background: var(--white); padding: 25px; border-radius: var(--radius-md); border: 1px solid var(--border); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 0.7rem; font-weight: 700; padding: 4px 10px; background: #e6fffa; color: #319795; border-radius: 999px;">${item.type}</span>
                            <small style="color: var(--text-light); font-size: 0.72rem;">${item.date}</small>
                        </div>
                        <p style="font-weight: 700; color: var(--blue-accent); font-size: 0.82rem; margin-bottom: 8px;">Kategori: ${item.category}</p>
                        <p style="font-size: 0.9rem; color: var(--text); font-style: italic; line-height: 1.5; margin-bottom: 16px;">"${item.detail}"</p>
                    </div>
                    <div style="border-top: 1px solid var(--border); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <strong style="font-size: 0.8rem; color: var(--navy);">${maskedName}</strong>
                        <span style="font-size: 0.7rem; color: var(--text-light);">Verified Patient</span>
                    </div>
                </div>
            `;
        });
        appreciationGrid.innerHTML = appHTML;
    }

    // 6. ANIMASI SCROLL REVEAL ELEGANT
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(reveal => {
            if (reveal.getBoundingClientRect().top < windowHeight - 100) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});
