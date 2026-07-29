// --- STORAGE MODULE ---

function getProfileCache(arroba) {
    if (!arroba) return null;
    const clean = arroba.toLowerCase().replace(/^@/, '');
    try {
        const cache = JSON.parse(localStorage.getItem('painelbio-profile-cache')) || {};
        return cache[clean] || null;
    } catch (e) {
        return null;
    }
}

function saveProfileCache(arroba, data) {
    if (!arroba || !data) return;
    const clean = arroba.toLowerCase().replace(/^@/, '');
    try {
        const cache = JSON.parse(localStorage.getItem('painelbio-profile-cache')) || {};
        cache[clean] = {
            name: data.name || '',
            bio: data.bio || '',
            avatar: data.avatar || '',
            highlight1Img: data.highlight1Img || '',
            highlight2Img: data.highlight2Img || '',
            highlight3Img: data.highlight3Img || '',
            cachedAt: Date.now()
        };
        localStorage.setItem('painelbio-profile-cache', JSON.stringify(cache));
        console.log(`[PainelBio Cache] 💾 Perfil @${clean} salvo com sucesso no banco de dados local.`);
    } catch (e) {
        console.error('[PainelBio Cache] Erro ao salvar cache de perfil:', e);
    }
}

function getLeads() {
    return JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
}

function getSearchHistory() {
    return JSON.parse(localStorage.getItem('painelbio-search-history')) || [];
}

function saveSearchHistory(searchItem) {
    if (!searchItem || !searchItem.arroba) return;
    let history = getSearchHistory();
    history = history.filter(h => h.arroba.toLowerCase() !== searchItem.arroba.toLowerCase());
    history.unshift({
        arroba: searchItem.arroba,
        name: searchItem.name || searchItem.arroba,
        avatar: searchItem.avatar || ''
    });
    history = history.slice(0, 5); // Guarda apenas as 5 buscas mais recentes
    localStorage.setItem('painelbio-search-history', JSON.stringify(history));
}

// ── PIX & PREÇOS CONFIGURABLE STORAGE ──

const DEFAULT_PIX_SETTINGS = {
    chavePix: '',
    nomeRecebedor: 'PainelBio',
    cidade: 'Sao Paulo',
    classicPrice: 29.90,
    vitrinePrice: 39.90,
    carouselPrice: 49.90,
    shopPrice: 59.90,
    addonPrice: 10.00,
    whatsappNumber: ''
};

function getPixSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem('painelbio-pix-settings'));
        return Object.assign({}, DEFAULT_PIX_SETTINGS, saved || {});
    } catch (e) {
        return DEFAULT_PIX_SETTINGS;
    }
}

function savePixSettings(settings) {
    try {
        const current = getPixSettings();
        const updated = Object.assign({}, current, settings);
        localStorage.setItem('painelbio-pix-settings', JSON.stringify(updated));
        return true;
    } catch (e) {
        console.error('[Storage] Erro ao salvar configurações de PIX:', e);
        return false;
    }
}

const DEFAULT_CUPONS = [
    { code: 'PRIMEIRO10', type: 'fixed', value: 10 },
    { code: 'PROMO20', type: 'percent', value: 20 },
    { code: 'PAINELBIO', type: 'fixed', value: 15 }
];

function getCoupons() {
    try {
        const saved = JSON.parse(localStorage.getItem('painelbio-coupons'));
        return saved || DEFAULT_CUPONS;
    } catch (e) {
        return DEFAULT_CUPONS;
    }
}

function saveCoupons(couponsArray) {
    try {
        localStorage.setItem('painelbio-coupons', JSON.stringify(couponsArray));
    } catch (e) {
        console.error('[Storage] Erro ao salvar cupons:', e);
    }
}

function calculateSitePrice(siteData) {
    const settings = getPixSettings();
    const modelMap = {
        'classic': parseFloat(settings.classicPrice || 29.90),
        'vitrine': parseFloat(settings.vitrinePrice || 39.90),
        'carousel': parseFloat(settings.carouselPrice || 49.90),
        'shop': parseFloat(settings.shopPrice || 59.90)
    };
    
    let basePrice = modelMap[siteData.model] || modelMap['classic'];
    
    // Contar add-ons ativos
    let addonCount = 0;
    if (siteData.bannerConfig && siteData.bannerConfig.enabled) addonCount++;
    if (siteData.audioPlayerConfig && siteData.audioPlayerConfig.enabled) addonCount++;
    if (siteData.chatWidgetConfig && siteData.chatWidgetConfig.enabled) addonCount++;
    if (siteData.rainConfig && siteData.rainConfig.enabled) addonCount++;

    let addonTotal = addonCount * parseFloat(settings.addonPrice || 10.00);
    let subtotal = basePrice + addonTotal;

    return {
        basePrice,
        addonCount,
        addonTotal,
        subtotal,
        finalPrice: subtotal
    };
}
