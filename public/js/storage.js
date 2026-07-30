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
    ebookPrice: 14.99,
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

// ── ADD-ONS COMPRADOS (ONE-TIME POR @) ──

// Mapa de slugs internos para as chaves de config e nomes legíveis
const ADDON_DEFINITIONS = [
    { slug: 'topbanner',    configKey: 'bannerConfig',      priceKey: 'bannerPrice',     defaultPrice: 2.99, name: 'Anúncio Flutuante' },
    { slug: 'emojirain',    configKey: 'rainConfig',        priceKey: 'emojiPrice',      defaultPrice: 2.50, name: 'Chuva de Emoji' },
    { slug: 'avatarspin',   configKey: 'avatarSpinConfig',  priceKey: 'avatarSpinPrice', defaultPrice: 2.50, name: 'Rodopio do Avatar' },
    { slug: 'audioplayer',  configKey: 'audioPlayerConfig', priceKey: 'audioPrice',      defaultPrice: 2.99, name: 'Player de Áudio' },
    { slug: 'livechat',     configKey: 'chatWidgetConfig',  priceKey: 'chatPrice',       defaultPrice: 2.99, name: 'Balão Online / Chat' }
];

/**
 * Retorna o array de slugs de add-ons já comprados para um @ específico.
 * Exemplo: ['topbanner', 'emojirain']
 */
function getPurchasedAddons(arroba) {
    if (!arroba) return [];
    try {
        const leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
        const lead = leads.find(l => l.arroba && l.arroba.toLowerCase() === arroba.toLowerCase());
        return Array.isArray(lead?.purchasedAddons) ? lead.purchasedAddons : [];
    } catch (e) {
        return [];
    }
}

/**
 * Salva/atualiza o array de slugs de add-ons comprados para um @ específico.
 * Faz merge com os já existentes (nunca remove).
 */
function savePurchasedAddons(arroba, newAddons) {
    if (!arroba) return;
    try {
        const leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
        const idx = leads.findIndex(l => l.arroba && l.arroba.toLowerCase() === arroba.toLowerCase());
        if (idx === -1) return;
        const existing = Array.isArray(leads[idx].purchasedAddons) ? leads[idx].purchasedAddons : [];
        // Merge sem duplicatas
        const merged = [...new Set([...existing, ...newAddons])];
        leads[idx].purchasedAddons = merged;
        localStorage.setItem('painelbio-insta-leads', JSON.stringify(leads));
    } catch (e) {
        console.error('[Storage] Erro ao salvar purchasedAddons:', e);
    }
}

/**
 * Retorna os add-ons ativos no site que NÃO foram pagos ainda.
 * Usado no gate de upload e no checkout parcial.
 */
function calculateNewAddonsCost(siteData, purchasedAddons) {
    const settings = getPixSettings();
    const paid = Array.isArray(purchasedAddons) ? purchasedAddons : [];
    const newAddons = [];

    ADDON_DEFINITIONS.forEach(def => {
        const isActive = siteData[def.configKey] && siteData[def.configKey].enabled;
        const alreadyPaid = paid.includes(def.slug);
        if (isActive && !alreadyPaid) {
            newAddons.push({
                slug: def.slug,
                name: def.name,
                price: parseFloat(settings[def.priceKey] || def.defaultPrice)
            });
        }
    });

    const total = newAddons.reduce((sum, a) => sum + a.price, 0);
    return { newAddons, total };
}

function calculateSitePrice(siteData, purchasedAddons) {
    const settings = getPixSettings();
    const modelKey = (siteData.model || 'classic').toLowerCase().trim();

    const modelMap = {
        'classic':  { name: 'Classic',   price: parseFloat(settings.classicPrice  || 9.99)  },
        'vitrine':  { name: 'Vitrine',   price: parseFloat(settings.vitrinePrice  || 12.99) },
        'carousel': { name: 'Carrossel', price: parseFloat(settings.carouselPrice || 14.99) },
        'carrossel':{ name: 'Carrossel', price: parseFloat(settings.carouselPrice || 14.99) },
        'shop':     { name: 'Shop',      price: parseFloat(settings.shopPrice     || 19.99) },
        'ebook':    { name: 'E-book',    price: parseFloat(settings.ebookPrice    || 14.99) }
    };

    const selectedModel = modelMap[modelKey] || modelMap['classic'];
    const basePrice = selectedModel.price;
    const modelName = selectedModel.name;

    // Add-ons já comprados passados como parâmetro (ou busca do lead)
    const paid = Array.isArray(purchasedAddons)
        ? purchasedAddons
        : getPurchasedAddons(siteData.arroba || '');

    const activeAddons   = []; // todos os add-ons ativos no site
    const includedAddons = []; // já pagos (inclusos, sem custo)
    const chargedAddons  = []; // novos, a cobrar

    ADDON_DEFINITIONS.forEach(def => {
        const isActive = siteData[def.configKey] && siteData[def.configKey].enabled;
        if (!isActive) return;
        const price = parseFloat(settings[def.priceKey] || def.defaultPrice);
        const addon = { slug: def.slug, name: def.name, price };
        activeAddons.push(addon);
        if (paid.includes(def.slug)) {
            includedAddons.push(addon);
        } else {
            chargedAddons.push(addon);
        }
    });

    const addonCount = chargedAddons.length;
    const addonTotal = chargedAddons.reduce((sum, a) => sum + a.price, 0);
    const subtotal   = basePrice + addonTotal;

    return {
        modelName,
        basePrice,
        activeAddons,
        includedAddons,
        chargedAddons,
        addonCount,
        addonTotal,
        subtotal,
        finalPrice: subtotal
    };
}
