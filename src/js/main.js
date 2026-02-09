import '../css/style.css'

async function loadContent() {
  try {
    const response = await fetch('/src/data/content.json');
    const data = await response.json();
    renderPage(data);
  } catch (error) {
    console.error(error);
  }
}

function renderPage(data) {
  document.title = data.meta.title;
  document.querySelector('meta[name="description"]').setAttribute("content", data.meta.description);

  updateElement('brand-name', data.general.brandName);

  updateElement('hero-title', data.hero.title, true);
  updateElement('hero-subtitle', data.hero.subtitle);

  const heroCta = document.getElementById('hero-cta');
  if(heroCta) {
    heroCta.innerText = data.hero.ctaText;
    heroCta.href = data.hero.ctaLink;
  }

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

  updateElement('contact-title', data.contact.title);
  updateElement('contact-subtitle', data.contact.subtitle);
  
  updateElement('contact-address', data.general.address);
  updateElement('contact-phone', data.general.phone);
  updateElement('contact-email', data.general.email);

  const mapFrame = document.getElementById('google-map');
  if (mapFrame) {
    mapFrame.src = data.general.mapEmbed;
  }

  updateElement('footer-brand', data.general.brandName);
  updateElement('current-year', new Date().getFullYear());

  addWhatsAppButton(data.general.whatsappNumber);
}

function updateElement(id, content, isHTML = false) {
  const element = document.getElementById(id);
  if (element) {
    if (isHTML) element.innerHTML = content;
    else element.innerText = content;
  }
}

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

loadContent();