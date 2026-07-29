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
    classicPrice: 9.99,
    vitrinePrice: 12.99,
    carouselPrice: 14.99,
    shopPrice: 19.99,
    bannerPrice: 2.99,
    emojiPrice: 2.50,
    avatarSpinPrice: 2.50,
    audioPrice: 2.99,
    chatPrice: 2.99,
    whatsappNumber: ''
};

function getPixSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem('painelbio-pix-settings'));
        const merged = Object.assign({}, DEFAULT_PIX_SETTINGS, saved || {});
        // Se as configurações antigas ainda tinham 59.90 para o shop, corrige para o padrão do usuário (19.99)
        if (merged.shopPrice === 59.90 || merged.shopPrice === 59.9) {
            merged.shopPrice = 19.99;
            merged.classicPrice = 9.99;
            merged.vitrinePrice = 12.99;
            merged.carouselPrice = 14.99;
        }
        return merged;
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
    const modelKey = (siteData.model || 'classic').toLowerCase().trim();

    const modelMap = {
        'classic': { name: 'Classic', price: parseFloat(settings.classicPrice || 9.99) },
        'vitrine': { name: 'Vitrine', price: parseFloat(settings.vitrinePrice || 12.99) },
        'carousel': { name: 'Carrossel', price: parseFloat(settings.carouselPrice || 14.99) },
        'carrossel': { name: 'Carrossel', price: parseFloat(settings.carouselPrice || 14.99) },
        'shop': { name: 'Shop', price: parseFloat(settings.shopPrice || 19.99) }
    };
    
    const selectedModel = modelMap[modelKey] || modelMap['classic'];
    const basePrice = selectedModel.price;
    const modelName = selectedModel.name;
    
    // Lista de add-ons ativos com preços individuais
    const activeAddons = [];
    if (siteData.bannerConfig && siteData.bannerConfig.enabled) {
        activeAddons.push({ name: 'Anúncio Flutuante', price: parseFloat(settings.bannerPrice || 2.99) });
    }
    if (siteData.rainConfig && siteData.rainConfig.enabled) {
        activeAddons.push({ name: 'Chuva de Emoji', price: parseFloat(settings.emojiPrice || 2.50) });
    }
    if (siteData.avatarSpinConfig && siteData.avatarSpinConfig.enabled) {
        activeAddons.push({ name: 'Rodopio do Avatar', price: parseFloat(settings.avatarSpinPrice || 2.50) });
    }
    if (siteData.audioPlayerConfig && siteData.audioPlayerConfig.enabled) {
        activeAddons.push({ name: 'Player de Áudio', price: parseFloat(settings.audioPrice || 2.99) });
    }
    if (siteData.chatWidgetConfig && siteData.chatWidgetConfig.enabled) {
        activeAddons.push({ name: 'Balão Online / Chat', price: parseFloat(settings.chatPrice || 2.99) });
    }

    const addonCount = activeAddons.length;
    const addonTotal = activeAddons.reduce((sum, item) => sum + item.price, 0);
    const subtotal = basePrice + addonTotal;

    return {
        modelName,
        basePrice,
        activeAddons,
        addonCount,
        addonTotal,
        subtotal,
        finalPrice: subtotal
    };
}
