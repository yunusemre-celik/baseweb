import '../css/style.css'

// 1. Verileri Çekme Fonksiyonu
async function loadContent() {
  try {
    const response = await fetch('/src/data/content.json');
    const data = await response.json();

    renderPage(data);
  } catch (error) {
    console.error('Veri yüklenirken hata oluştu:', error);
  }
}

// 2. Verileri Ekrana Basma Fonksiyonu
function renderPage(data) {
  // --- Genel Ayarlar ---
  document.title = data.meta.title;
  document.querySelector('meta[name="description"]').setAttribute("content", data.meta.description);
  
  // Marka İsmi (Navbar)
  updateElement('brand-name', data.general.brandName);

  // --- Hero Bölümü ---
  updateElement('hero-title', data.hero.title, true); // true = HTML render et (br tagleri için)
  updateElement('hero-subtitle', data.hero.subtitle);
  
  const heroCta = document.getElementById('hero-cta');
  if(heroCta) {
    heroCta.innerText = data.hero.ctaText;
    heroCta.href = data.hero.ctaLink;
  }

  // --- WhatsApp Butonu (Level 1 Özellik) ---
  // Sağ alt köşeye sabit WhatsApp butonu ekleyelim
  addWhatsAppButton(data.general.whatsappNumber);
}

// Yardımcı: Element bul ve içeriğini güncelle
function updateElement(id, content, isHTML = false) {
  const element = document.getElementById(id);
  if (element) {
    if (isHTML) element.innerHTML = content;
    else element.innerText = content;
  }
}

// LEVEL 1: WhatsApp Entegrasyonu
function addWhatsAppButton(number) {
  const whatsappLink = `https://wa.me/${number}`;
  const btn = document.createElement('a');
  btn.href = whatsappLink;
  btn.target = "_blank";
  btn.className = "fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-50 flex items-center justify-center animate-bounce";
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
    </svg>
  `;
  document.body.appendChild(btn);
}

// Uygulamayı Başlat
loadContent();