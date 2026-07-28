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

