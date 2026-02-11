import '../css/style.css';

// --- AYARLAR VE DEĞİŞKENLER ---
let currentLang = localStorage.getItem('siteLang') || 'tr';

// --- DİL DEĞİŞTİRME FONKSİYONU ---
window.changeLanguage = function(lang) {
  if (currentLang === lang) return;
  currentLang = lang;
  localStorage.setItem('siteLang', lang);

  // Statik Metin Çevirileri
  if (lang === 'en') {
    updateElement('nav-home', 'Home');
    updateElement('nav-services', 'Services');
    updateElement('nav-contact', 'Contact');
    updateElement('hero-contact-text', 'Contact Us');
    updateElement('footer-rights', 'All Rights Reserved.');
    updateElement('reviews-cta-text', 'Rate Us');
    updateElement('reviews-loading-text', 'Loading reviews...');
  } else if (lang === 'ru') {
    updateElement('nav-home', 'Главная');
    updateElement('nav-services', 'Услуги');
    updateElement('nav-contact', 'Контакты');
    updateElement('hero-contact-text', 'Связаться с нами');
    updateElement('footer-rights', 'Все права защищены.');
    updateElement('reviews-cta-text', 'Оцените нас');
    updateElement('reviews-loading-text', 'Загрузка отзывов...');
  } else {
    updateElement('nav-home', 'Ana Sayfa');
    updateElement('nav-services', 'Hizmetler');
    updateElement('nav-contact', 'İletişim');
    updateElement('hero-contact-text', 'Bize Ulaşın');
    updateElement('footer-rights', 'Tüm Hakları Saklıdır.');
    updateElement('reviews-cta-text', 'Bizi Değerlendirin');
    updateElement('reviews-loading-text', 'Yorumlar yükleniyor...');
  }

  // İçeriği Yeniden Yükle
  loadContent();
};

// --- İÇERİK YÜKLEME ---
async function loadContent() {
  try {
    const response = await fetch(`/src/data/content-${currentLang}.json`);
    const data = await response.json();
    renderPage(data);
  } catch (error) {
    console.error('Veri yüklenirken hata oluştu:', error);
  }
}

// --- SAYFAYI ÇİZME (RENDER) ---
function renderPage(data) {
  // 1. Meta Bilgileri
  document.title = data.meta.title;
  document.querySelector('meta[name="description"]').setAttribute("content", data.meta.description);

  // 2. Genel Bilgiler
  updateElement('brand-name', data.general.brandName);
  
  // 3. Hero Bölümü
  updateElement('hero-title', data.hero.title, true);
  updateElement('hero-subtitle', data.hero.subtitle);
  const heroCta = document.getElementById('hero-cta');
  if (heroCta) {
    heroCta.innerText = data.hero.ctaText;
    heroCta.href = data.hero.ctaLink;
  }

  // 4. Hizmetler Bölümü
  updateElement('services-title', data.services.title);
  updateElement('services-subtitle', data.services.subtitle);
  const servicesGrid = document.getElementById('services-grid');
  if (servicesGrid) {
    servicesGrid.innerHTML = '';
    data.services.items.forEach(item => {
      const card = document.createElement('div');
      card.className = "group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-primary/20";
      card.innerHTML = `
        <div class="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl text-4xl mb-6 group-hover:scale-110 transition-transform">
            ${item.icon}
        </div>
        <h3 class="text-xl font-semibold text-text-main mb-3 group-hover:text-primary transition-colors">
            ${item.title}
        </h3>
        <p class="text-text-muted leading-relaxed">
            ${item.desc}
        </p>
      `;
      servicesGrid.appendChild(card);
    });
  }

  // 5. Yorumlar Bölümü (Manuel JSON)
  if (data.reviews) {
    updateElement('reviews-title', data.reviews.title);
    updateElement('reviews-subtitle', data.reviews.subtitle);

    const reviewsGrid = document.getElementById('reviews-grid');
    if (reviewsGrid && data.reviews.items) {
      reviewsGrid.innerHTML = ''; // Loading temizle

      data.reviews.items.forEach(review => {
        // Yıldız Oluşturma
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
          if (i < review.stars) {
            starsHtml += `<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
          } else {
            starsHtml += `<svg class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
          }
        }

        // İsim Baş Harflerinden Avatar
        const initials = review.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        const card = document.createElement('div');
        card.className = "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full";
        card.innerHTML = `
            <div class="flex items-center mb-4 space-x-1">
                ${starsHtml}
            </div>
            <p class="text-text-muted italic mb-6 flex-grow">"${review.comment}"</p>
            <div class="flex items-center mt-auto">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    ${initials}
                </div>
                <div class="ml-3">
                    <p class="text-sm font-semibold text-text-main">${review.name}</p>
                    <div class="flex items-center text-xs text-text-muted">
                        <span class="mr-1">Google Review</span>
                    </div>
                </div>
            </div>
        `;
        reviewsGrid.appendChild(card);
      });
    }
  }

  // Yorum Yap Butonu Linki
  if (data.social && data.social.googleMaps) {
    const btn = document.getElementById('leave-review-btn');
    if (btn) btn.href = data.social.googleMaps;
  }

  // 6. İletişim Bölümü
  updateElement('contact-title', data.contact.title);
  updateElement('contact-subtitle', data.contact.subtitle);
  updateElement('contact-address', data.general.address);
  updateElement('contact-phone', data.general.phone);
  updateElement('contact-email', data.general.email);

  if (data.contact.workingHours) {
    updateElement('hours-title', data.contact.workingHours.title);
    let prefixWeekdays = (currentLang === 'ru') ? 'Будни: ' : (currentLang === 'tr' ? 'Hafta İçi: ' : '');
    let prefixWeekend = (currentLang === 'ru') ? 'Выходные: ' : (currentLang === 'tr' ? 'Hafta Sonu: ' : '');

    updateElement('hours-weekdays', `${prefixWeekdays}${data.contact.workingHours.weekdays}`);
    updateElement('hours-weekend', `${prefixWeekend}${data.contact.workingHours.weekend}`);
  }

  // 7. Harita
  const mapFrame = document.getElementById('google-map');
  if (mapFrame) {
    mapFrame.src = data.general.mapEmbed;
  }

  // 8. Sosyal Medya İkonları (Footer/Contact Bölümü)
  const socialContainer = document.getElementById('social-links-container');
  if (socialContainer && data.social) {
    socialContainer.innerHTML = '';
    
    // SVG Kodları - Hata önlemek için tırnak işaretlerine dikkat edilmiştir
    const iconInsta = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"/></svg>';
    const iconFb = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"/></svg>';
    const iconMaps = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';

    if (data.social.instagram) socialContainer.innerHTML += `<a href="${data.social.instagram}" target="_blank" class="text-text-muted hover:text-[#E1306C] transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md border border-gray-100">${iconInsta}</a>`;
    if (data.social.facebook) socialContainer.innerHTML += `<a href="${data.social.facebook}" target="_blank" class="text-text-muted hover:text-[#1877F2] transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md border border-gray-100">${iconFb}</a>`;
    if (data.social.googleMaps) socialContainer.innerHTML += `<a href="${data.social.googleMaps}" target="_blank" class="text-text-muted hover:text-[#EA4335] transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md border border-gray-100">${iconMaps}</a>`;
  }

  // 9. Footer ve Yüzen Butonlar
  updateElement('footer-brand', data.general.brandName);
  updateElement('current-year', new Date().getFullYear());
  addFloatingButtons(data.general.whatsappNumber, data.social.instagram);
}

// --- YARDIMCI FONKSİYONLAR ---
function updateElement(id, content, isHTML = false) {
  const element = document.getElementById(id);
  if (element) {
    if (isHTML) element.innerHTML = content;
    else element.innerText = content;
  }
}

function addFloatingButtons(waNumber, igLink) {
  let container = document.getElementById('floating-buttons-container');
  if (container) {
    container.remove();
  }

  container = document.createElement('div');
  container.id = 'floating-buttons-container';
  container.className = "fixed bottom-6 right-6 z-50 flex items-center gap-3";

  if (igLink) {
    const igBtn = document.createElement('a');
    igBtn.href = igLink;
    igBtn.target = "_blank";
    igBtn.className = "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white p-3.5 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center";
    igBtn.innerHTML = '<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.153 1.772c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"/></path></svg>';
    container.appendChild(igBtn);
  }

  const waLink = `https://wa.me/${waNumber}`;
  const waBtn = document.createElement('a');
  waBtn.href = waLink;
  waBtn.target = "_blank";
  waBtn.className = "bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center animate-bounce";
  waBtn.innerHTML = '<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></path></svg>';
  container.appendChild(waBtn);

  document.body.appendChild(container);
}

// --- MOBİL MENÜ ---
function initMobileMenu() {
  const menuBtn = document.querySelector('[data-collapse-toggle="navbar-default"]');
  const mobileMenu = document.getElementById('navbar-default');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// --- BAŞLAT ---
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();

  if (currentLang === 'en' || currentLang === 'ru') {
    changeLanguage(currentLang);
  } else {
    loadContent();
  }
});