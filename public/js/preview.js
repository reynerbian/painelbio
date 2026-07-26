// ===============================================================================
// PAINELBIO - MÓDULO DE PRÉ-VISUALIZAÇÃO E MODELOS (PREVIEW.JS)
// ===============================================================================

let CLASSIC_FORM_HTML = "";

async function loadClassicModel() {
    try {
        const response = await fetch('/models/classic/inspector.html?v=' + Date.now());
        if (response.ok) {
            CLASSIC_FORM_HTML = await response.text();
        }
    } catch (e) {
        console.error("Erro ao carregar o modelo Classic:", e);
    }
}
loadClassicModel();

function populateFakeDataForModel(activeModel) {
    const avatarInput = document.getElementById('input-avatar');
    const nameInput = document.getElementById('input-name');
    const arrobaInput = document.getElementById('input-arroba');
    const bioInput = document.getElementById('input-bio');
    
    const btn1TitleInput = document.getElementById('input-btn1-title');
    const btn1UrlInput = document.getElementById('input-btn1-url');
    const btn2TitleInput = document.getElementById('input-btn2-title');
    const btn2UrlInput = document.getElementById('input-btn2-url');
    const btn3TitleInput = document.getElementById('input-btn3-title');
    const btn3UrlInput = document.getElementById('input-btn3-url');
    const btn4TitleInput = document.getElementById('input-btn4-title');
    const btn4UrlInput = document.getElementById('input-btn4-url');

    const h1ImgInput = document.getElementById('input-highlight1-img');
    const h1TitleInput = document.getElementById('input-highlight1-title');
    const h2ImgInput = document.getElementById('input-highlight2-img');
    const h2TitleInput = document.getElementById('input-highlight2-title');
    const h3ImgInput = document.getElementById('input-highlight3-img');
    const h3TitleInput = document.getElementById('input-highlight3-title');

    if (activeModel === 'vitrine') {
        if (h1ImgInput) h1ImgInput.value = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";
        if (h1TitleInput) h1TitleInput.value = "🔥 Coleção de Verão 2026";
        if (h2ImgInput) h2ImgInput.value = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
        if (h2TitleInput) h2TitleInput.value = "✨ Novidades";
        if (h3ImgInput) h3ImgInput.value = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500";
        if (h3TitleInput) h3TitleInput.value = "💥 Mais Vendido";
        
        if (avatarInput) avatarInput.value = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";
        if (nameInput) nameInput.value = "Boutique Elegance | Moda Feminina";
        if (arrobaInput) arrobaInput.value = "boutique.elegance";
        if (bioInput) bioInput.value = `Moda feminina premium & peças exclusivas.\nEnviamos para todo o Brasil com Frete Grátis! 🛍️`;
        
        if (btn1TitleInput) btn1TitleInput.value = "💬 Atendimento no WhatsApp";
        if (btn1UrlInput) btn1UrlInput.value = "https://wa.me/5511999999999";
        if (btn2TitleInput) btn2TitleInput.value = "🛍️ Ver Coleção Completa";
        if (btn2UrlInput) btn2UrlInput.value = "https://instagram.com/boutique.elegance";
        if (btn3TitleInput) btn3TitleInput.value = "📍 Endereço da Loja Física";
        if (btn3UrlInput) btn3UrlInput.value = "https://maps.google.com";
        if (btn4TitleInput) btn4TitleInput.value = "💳 Pagamento via PIX";
        if (btn4UrlInput) btn4UrlInput.value = "https://wa.me/5511999999999";
    } else {
        if (avatarInput) avatarInput.value = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200";
        if (nameInput) nameInput.value = "Ana Carolina | Semijoias de Luxo";
        if (arrobaInput) arrobaInput.value = "anacarolina.semijoias";
        if (bioInput) bioInput.value = `Peças exclusivas banhadas a ouro 18k.\nFrete grátis para todo o Brasil. ✨\nEnviamos com amor.`;
        
        if (btn1TitleInput) btn1TitleInput.value = "🛍️ Ver Catálogo no WhatsApp";
        if (btn1UrlInput) btn1UrlInput.value = "https://wa.me/5511999999999";
        if (btn2TitleInput) btn2TitleInput.value = "✨ Seguir no Instagram";
        if (btn2UrlInput) btn2UrlInput.value = "https://instagram.com/anacarolina.semijoias";
        if (btn3TitleInput) btn3TitleInput.value = "📍 Como Chegar (Localização)";
        if (btn3UrlInput) btn3UrlInput.value = "https://maps.google.com";
    }
}

async function loadTemplatePreview(templateId, dataToFill = null) {
    const previewScreen = document.getElementById('phone-preview-screen');
    const inspectorContent = document.getElementById('inspector-content');
    const inspectorActions = document.getElementById('inspector-actions');
    const fakeDataToggle = document.getElementById('fake-data-toggle');
    const rightDrawer = document.getElementById('right-drawer');
    
    const activeModel = templateId || 'classic';
    window.currentActiveModel = activeModel;

    document.querySelectorAll('.template-card').forEach(card => {
        if (card.getAttribute('data-template') === activeModel) {
            card.classList.add('is-selected');
        } else {
            card.classList.remove('is-selected');
        }
    });

    if (activeModel === 'vitrine') {
        previewScreen.style.background = '#0e110d';
        previewScreen.innerHTML = `
            <div class="v-live-page" style="width: 100%; min-height: 100%; padding: 14px 12px 30px 12px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center;">
                <div id="v-view-hero-grid" style="width: 100%; position: relative; margin-bottom: 45px; display: none;">
                    <div style="width: 100%; height: 260px; border-radius: 22px; overflow: hidden; background: #1a1a1a; margin-bottom: 8px;">
                        <img id="v-view-h1" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'" />
                    </div>
                    <div style="display: flex; gap: 8px; width: 100%;">
                        <div style="flex: 1; height: 130px; border-radius: 18px; overflow: hidden; background: #1a1a1a;">
                            <img id="v-view-h2" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400'" />
                        </div>
                        <div style="flex: 1; height: 130px; border-radius: 18px; overflow: hidden; background: #1a1a1a;">
                            <img id="v-view-h3" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400'" />
                        </div>
                    </div>
                    <div id="v-view-avatar-wrapper" style="position: absolute; bottom: -38px; left: 50%; transform: translateX(-50%); width: 84px; height: 84px; border-radius: 50%; background: #fdf6df; border: 4px solid #0e110d; display: none; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.5); z-index: 10;">
                        <div id="v-view-avatar-inner" style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden;"></div>
                    </div>
                </div>
                <div id="v-view-info" style="width: 100%; display: none; flex-direction: column; align-items: center; text-align: center;">
                    <h1 id="v-view-name" style="font-family: Georgia, serif; font-size: 1.45rem; font-weight: 700; color: #ffffff; margin: 0 0 6px 0; text-align: center;"></h1>
                    <a id="v-view-arroba" href="#" target="_blank" style="font-size: 0.9rem; color: var(--theme-color-1, #a3d959); text-decoration: none; font-weight: 600; margin-bottom: 12px; display: inline-block;"></a>
                    <p id="v-view-bio" style="font-size: 0.85rem; color: rgba(255,255,255,0.7); line-height: 1.5; margin: 0 0 24px 0; text-align: center; white-space: pre-wrap; width: 90%;"></p>
                    <div id="v-view-buttons" style="width: 100%; display: flex; flex-direction: column; gap: 12px;"></div>
                    <div id="v-view-footer" style="margin-top: 30px; font-size: 0.72rem; color: rgba(255,255,255,0.35); display: flex; align-items: center; gap: 6px;">
                        CRIADO COM <a href="#" style="color: rgba(255,255,255,0.6); text-decoration: none; font-weight: 700;">PAINELBIO</a>
                    </div>
                </div>
            </div>
        `;
    } else {
        previewScreen.style.background = 'radial-gradient(circle at 50% 10%, #1e293b 0%, #0f172a 70%)';
        previewScreen.innerHTML = `
            <div class="preview-bio-page">
                <div class="bg-glow bg-glow-top"></div>
                <div class="bg-glow bg-glow-bottom"></div>
                <div class="preview-card" id="view-card" style="display: none;">
                    <div class="preview-avatar-glow" id="view-avatar-container">
                        <div class="preview-avatar-inner" id="view-avatar-inner"></div>
                    </div>
                    <h2 class="preview-name" id="view-name"></h2>
                    <a href="#" target="_blank" class="preview-arroba" id="view-arroba"></a>
                    <p class="preview-bio" id="view-bio"></p>
                    <div class="preview-links" id="view-links"></div>
                    <div class="preview-footer" id="view-footer" style="display: none;">
                        <span>🔗 Criado com</span>
                        <a href="#">PainelBio</a>
                    </div>
                </div>
            </div>
        `;
    }

    try {
        const res = await fetch(`/models/${activeModel}/inspector.html?v=${Date.now()}`);
        let modelHtml = '';
        if (res.ok) {
            modelHtml = await res.text();
        } else {
            const fallbackRes = await fetch('/models/classic/inspector.html?v=' + Date.now());
            modelHtml = await fallbackRes.text();
        }
        
        let addonsActiveHtml = '';
        let addonsCatalogHtml = '';
        try {
            const activeRes = await fetch('/partials/addons-active.html?v=' + Date.now());
            const catalogRes = await fetch('/partials/addons-catalog.html?v=' + Date.now());
            if (activeRes.ok) addonsActiveHtml = await activeRes.text();
            if (catalogRes.ok) addonsCatalogHtml = await catalogRes.text();
        } catch(e) { console.error("Erro ao carregar add-ons", e); }
        
        inspectorContent.innerHTML = modelHtml;
        
        const activeContainer = inspectorContent.querySelector('#active-addons-list');
        const catalogContainer = inspectorContent.querySelector('#panel-addons');
        if (activeContainer && addonsActiveHtml) activeContainer.innerHTML = addonsActiveHtml;
        if (catalogContainer && addonsCatalogHtml) catalogContainer.innerHTML = addonsCatalogHtml;
        
    } catch (e) {
        console.error("Erro ao carregar modelo:", e);
    }
    
    if (inspectorActions) inspectorActions.style.display = 'flex';
    bindInspectorFormEvents();

    const topBtn = document.querySelector('.top-action-btn');
    if (topBtn) topBtn.classList.remove('disabled');

    const payload = dataToFill || window.tempFormBackup;
    if (payload && (payload.arroba || payload.name)) {
        const backup = payload;
        const fieldsToRestore = {
            'input-avatar': backup.avatar || '',
            'input-name': backup.name || '',
            'input-arroba': backup.arroba || '',
            'input-bio': backup.bio || '',
            'input-btn1-title': backup.btn1Title || '',
            'input-btn1-url': backup.btn1Url || '',
            'input-btn2-title': backup.btn2Title || '',
            'input-btn2-url': backup.btn2Url || '',
            'input-btn3-title': backup.btn3Title || '',
            'input-btn3-url': backup.btn3Url || '',
            'input-btn4-title': backup.btn4Title || '',
            'input-btn4-url': backup.btn4Url || '',
            'input-highlight1-img': backup.highlight1Img || '',
            'input-highlight1-title': backup.highlight1Title || '',
            'input-highlight2-img': backup.highlight2Img || '',
            'input-highlight2-title': backup.highlight2Title || '',
            'input-highlight3-img': backup.highlight3Img || '',
            'input-highlight3-title': backup.highlight3Title || '',
            'input-addon-tb-text1': backup.addonTopbannerText1 || '',
            'input-addon-tb-text2': backup.addonTopbannerText2 || '',
            'input-addon-tb-text3': backup.addonTopbannerText3 || '',
            'input-addon-tb-bg': backup.addonTopbannerBg || '#0f172a',
            'input-addon-tb-color': backup.addonTopbannerColor || '#38bdf8',
            'input-addon-tb-pause': backup.addonTopbannerPause || 2,
            'input-addon-er-emoji': backup.addonEmojiRainEmoji || '',
            'input-addon-er-count': backup.addonEmojiRainCount || 8,
            'input-addon-er-coverage': backup.addonEmojiRainCoverage || 80
        };
        for (const [id, val] of Object.entries(fieldsToRestore)) {
            const el = document.getElementById(id);
            if (el) el.value = val;
        }

        const effectSelect = document.getElementById('select-addon-tb-effect');
        if (effectSelect) {
            effectSelect.value = backup.addonTopbannerEffect || 'fade';
            const containerPause = document.getElementById('container-addon-tb-pause');
            const containerMarquee = document.getElementById('container-addon-tb-marquee-settings');
            const mqSpeedInput = document.getElementById('input-addon-tb-marquee-speed');
            const mqPauseInput = document.getElementById('input-addon-tb-marquee-pause');
            
            if (mqSpeedInput) mqSpeedInput.value = backup.addonTopbannerMarqueeSpeed || '5';
            if (mqPauseInput) mqPauseInput.value = backup.addonTopbannerMarqueePause || '3';
            
            function updateAddonFields() {
                if (containerPause) containerPause.style.display = (['slide', 'bounce', 'flip', 'shutter'].includes(effectSelect.value)) ? 'block' : 'none';
                if (containerMarquee) containerMarquee.style.display = (effectSelect.value === 'marquee') ? 'block' : 'none';
            }
            updateAddonFields();
            effectSelect.addEventListener('change', updateAddonFields);
        }

        if (backup.addonTopbannerActive) {
            const cardTb = document.getElementById('card-addon-topbanner');
            if (cardTb) cardTb.style.display = 'block';
        }

        if (backup.addonEmojiRainActive) {
            const cardEr = document.getElementById('card-addon-emojirain');
            if (cardEr) cardEr.style.display = 'block';
        }

        const erSpeedEl = document.getElementById('select-addon-er-speed');
        if (erSpeedEl && backup.addonEmojiRainSpeed) erSpeedEl.value = backup.addonEmojiRainSpeed;
        
        const erRotateEl = document.getElementById('input-addon-er-rotate');
        if (erRotateEl && backup.addonEmojiRainRotate !== undefined) erRotateEl.checked = Boolean(backup.addonEmojiRainRotate);
        
        const erCoverLabelEl = document.getElementById('label-addon-er-coverage');
        const erCoverInputEl = document.getElementById('input-addon-er-coverage');
        if (erCoverLabelEl && erCoverInputEl) {
            erCoverLabelEl.textContent = (backup.addonEmojiRainCoverage || 80) + '%';
            erCoverInputEl.value = backup.addonEmojiRainCoverage || 80;
        }
        
        if (backup.bioAlign) {
            const alignBtn = document.querySelector(`.align-btn[data-align="${backup.bioAlign}"]`);
            if (alignBtn) alignBtn.click();
        }
        if (backup.preset) {
            const colorOption = document.querySelector(`.color-option[data-preset="${backup.preset}"]`);
            if (colorOption) colorOption.click();
        }
        updatePreviewFromForm();
    } else if (fakeDataToggle && fakeDataToggle.checked) {
        populateFakeDataForModel(activeModel);
        updatePreviewFromForm();
    } else {
        updatePreviewFromForm();
    }
}

function updatePreviewFromForm() {
    const activeModel = window.currentActiveModel || 'classic';

    // ADD-ON 1: ANÚNCIO FLUTUANTE DE TOPO
    const cardTopbanner = document.getElementById('card-addon-topbanner');
    const isTopbannerActive = cardTopbanner && cardTopbanner.style.display !== 'none';
    const phoneScreen = document.getElementById('phone-preview-screen');
    let phoneTopBanner = document.getElementById('phone-live-top-banner');

    if (isTopbannerActive) {
        const tbText1 = document.getElementById('input-addon-tb-text1')?.value.trim() || '';
        const tbText2 = document.getElementById('input-addon-tb-text2')?.value.trim() || '';
        const tbText3 = document.getElementById('input-addon-tb-text3')?.value.trim() || '';
        const tbBg = document.getElementById('input-addon-tb-bg')?.value || '#0f172a';
        const tbColor = document.getElementById('input-addon-tb-color')?.value || '#38bdf8';
        const effect = document.getElementById('select-addon-tb-effect')?.value || 'fade';
        const pauseSec = parseInt(document.getElementById('input-addon-tb-pause')?.value || '2', 10);
        const pauseBetweenSec = parseInt(document.getElementById('input-addon-tb-pause-between')?.value || '1', 10);
        const mqSpeed = parseInt(document.getElementById('input-addon-tb-marquee-speed')?.value || '5', 10);
        const mqPause = parseInt(document.getElementById('input-addon-tb-marquee-pause')?.value || '3', 10);

        const texts = [tbText1, tbText2, tbText3].filter(Boolean);

        if (phoneScreen && texts.length > 0) {
            if (!phoneTopBanner) {
                phoneTopBanner = document.createElement('div');
                phoneTopBanner.id = 'phone-live-top-banner';
                phoneScreen.prepend(phoneTopBanner);
            }
            
            phoneTopBanner.style.cssText = `position: absolute; top: 46px; left: 0; width: 100%; padding: 8px 10px; font-size: 0.72rem; font-weight: 700; text-align: center; z-index: 999; box-shadow: 0 4px 12px rgba(0,0,0,0.5); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.1); box-sizing: border-box; background: ${tbBg}; color: ${tbColor}; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;`;
            phoneTopBanner.style.display = 'flex';

            const currentConfigKey = `${texts.join('|')}_${effect}_${pauseSec}_${pauseBetweenSec}_${mqSpeed}_${mqPause}_${tbBg}_${tbColor}`;
            if (window.phoneTbConfigKey !== currentConfigKey) {
                window.phoneTbConfigKey = currentConfigKey;
                if (window.phoneTbTimers) { window.phoneTbTimers.forEach(clearTimeout); }
                window.phoneTbTimers = [];
                if (window.phoneTbIntervals) { window.phoneTbIntervals.forEach(clearInterval); }
                window.phoneTbIntervals = [];
                
                const safeSetTimeout = (fn, ms) => {
                    const id = setTimeout(fn, ms);
                    window.phoneTbTimers.push(id);
                    return id;
                };
                const safeSetInterval = (fn, ms) => {
                    const id = setInterval(fn, ms);
                    window.phoneTbIntervals.push(id);
                    return id;
                };

                window.phoneTbTexts = texts;
                window.phoneTbIdx = 0;
                phoneTopBanner.innerHTML = `<span id="phone-tb-live-text" style="transition: opacity 0.3s;">${texts[0]}</span>`;

                phoneTopBanner.style.transform = 'none';
                phoneTopBanner.style.opacity = '1';
                
                function runLiveEffectCycle() {
                    const txtEl = document.getElementById('phone-tb-live-text');
                    if (!txtEl) return;
                    
                    if (effect === 'slide') {
                        phoneTopBanner.style.transform = 'translateY(-100%)';
                        phoneTopBanner.style.opacity = '0';
                        safeSetTimeout(() => {
                            phoneTopBanner.style.transform = 'translateY(0)';
                            phoneTopBanner.style.opacity = '1';
                            window.phoneTbTimer1 = safeSetTimeout(() => {
                                phoneTopBanner.style.transform = 'translateY(-100%)';
                                phoneTopBanner.style.opacity = '0';
                                window.phoneTbTimer2 = safeSetTimeout(() => {
                                    window.phoneTbIdx = (window.phoneTbIdx + 1) % window.phoneTbTexts.length;
                                    txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                    runLiveEffectCycle();
                                }, pauseSec * 1000);
                            }, pauseBetweenSec * 1000);
                        }, 100);
                    } else if (effect === 'fade') {
                        txtEl.style.transition = 'opacity 0.3s';
                        if (texts.length > 1) {
                            window.phoneTbInterval = safeSetTimeout(() => {
                                txtEl.style.opacity = '0';
                                safeSetTimeout(() => {
                                    window.phoneTbIdx = (window.phoneTbIdx + 1) % window.phoneTbTexts.length;
                                    txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                    txtEl.style.opacity = '1';
                                    runLiveEffectCycle();
                                }, 300);
                            }, pauseBetweenSec * 1000);
                        }
                    } else if (effect === 'marquee') {
                        txtEl.style.whiteSpace = 'nowrap';
                        txtEl.innerHTML = window.phoneTbTexts.join(' &nbsp;&nbsp;&nbsp;⭐&nbsp;&nbsp;&nbsp; ');
                        phoneTopBanner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                        phoneTopBanner.style.height = '0px';
                        phoneTopBanner.style.padding = '0px';
                        phoneTopBanner.style.overflow = 'hidden';
                        
                        safeSetTimeout(() => {
                            phoneTopBanner.style.height = 'auto';
                            phoneTopBanner.style.padding = '8px 10px';
                            let pos = 100;
                            txtEl.style.transform = 'translateX(100%)';
                            const step = mqSpeed * 0.4; 
                            window.phoneTbInterval = safeSetInterval(() => {
                                pos -= step;
                                txtEl.style.transform = 'translateX(' + pos + '%)';
                                if (pos < -150) {
                                    clearInterval(window.phoneTbInterval);
                                    phoneTopBanner.style.height = '0px';
                                    phoneTopBanner.style.padding = '0px';
                                    safeSetTimeout(() => { runLiveEffectCycle(); }, mqPause * 1000);
                                }
                            }, 20);
                        }, 500);
                    } else if (effect === 'bounce') {
                        phoneTopBanner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                        txtEl.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s';
                        phoneTopBanner.style.height = '0px';
                        phoneTopBanner.style.padding = '0px';
                        safeSetTimeout(() => {
                            phoneTopBanner.style.height = 'auto';
                            phoneTopBanner.style.padding = '8px 10px';
                            txtEl.style.transform = 'scale(1)';
                            let currentIdx = 0;
                            function playNext() {
                                if (currentIdx >= texts.length - 1) {
                                    safeSetTimeout(() => {
                                        phoneTopBanner.style.height = '0px';
                                        phoneTopBanner.style.padding = '0px';
                                        safeSetTimeout(() => { runLiveEffectCycle(); }, pauseSec * 1000);
                                    }, pauseBetweenSec * 1000);
                                    return;
                                }
                                safeSetTimeout(() => {
                                    txtEl.style.transform = 'scale(0)';
                                    setTimeout(() => {
                                        currentIdx++;
                                        window.phoneTbIdx = currentIdx;
                                        txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                        txtEl.style.transform = 'scale(1)';
                                        playNext();
                                    }, 500);
                                }, pauseBetweenSec * 1000);
                            }
                            playNext();
                        }, 100);
                    } else if (effect === 'flip') {
                        phoneTopBanner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                        txtEl.style.transition = 'transform 0.4s ease-in, opacity 0.3s';
                        phoneTopBanner.style.height = '0px';
                        phoneTopBanner.style.padding = '0px';
                        setTimeout(() => {
                            phoneTopBanner.style.height = 'auto';
                            phoneTopBanner.style.padding = '8px 10px';
                            txtEl.style.transform = 'rotateX(0deg)';
                            let currentIdx = 0;
                            function playNext() {
                                if (currentIdx >= texts.length - 1) {
                                    setTimeout(() => {
                                        phoneTopBanner.style.height = '0px';
                                        phoneTopBanner.style.padding = '0px';
                                        setTimeout(() => { runLiveEffectCycle(); }, pauseSec * 1000);
                                    }, pauseBetweenSec * 1000);
                                    return;
                                }
                                setTimeout(() => {
                                    txtEl.style.transform = 'rotateX(90deg)';
                                    setTimeout(() => {
                                        currentIdx++;
                                        window.phoneTbIdx = currentIdx;
                                        txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                        txtEl.style.transform = 'rotateX(0deg)';
                                        playNext();
                                    }, 400);
                                }, pauseBetweenSec * 1000);
                            }
                            playNext();
                        }, 100);
                    } else if (effect === 'shutter') {
                        phoneTopBanner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                        phoneTopBanner.style.height = '0px';
                        phoneTopBanner.style.padding = '0px';
                        setTimeout(() => {
                            phoneTopBanner.style.height = 'auto';
                            phoneTopBanner.style.padding = '8px 10px';
                            let currentIdx = 0;
                            function playNext() {
                                if (currentIdx >= texts.length - 1) {
                                    setTimeout(() => {
                                        phoneTopBanner.style.height = '0px';
                                        phoneTopBanner.style.padding = '0px';
                                        setTimeout(() => { runLiveEffectCycle(); }, pauseSec * 1000);
                                    }, pauseBetweenSec * 1000);
                                    return;
                                }
                                setTimeout(() => {
                                    phoneTopBanner.style.height = '0px';
                                    phoneTopBanner.style.padding = '0px';
                                    setTimeout(() => {
                                        currentIdx++;
                                        window.phoneTbIdx = currentIdx;
                                        txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                        phoneTopBanner.style.height = 'auto';
                                        phoneTopBanner.style.padding = '8px 10px';
                                        playNext();
                                    }, 400);
                                }, pauseBetweenSec * 1000);
                            }
                            playNext();
                        }, 100);
                    }
                }
                runLiveEffectCycle();
            }
        } else if (phoneTopBanner) {
            phoneTopBanner.style.display = 'none';
            if (window.phoneTbTimers) window.phoneTbTimers.forEach(clearTimeout);
            window.phoneTbTimers = [];
            if (window.phoneTbInterval) clearInterval(window.phoneTbInterval);
        }
    } else if (phoneTopBanner) {
        phoneTopBanner.style.display = 'none';
        if (window.phoneTbTimers) window.phoneTbTimers.forEach(clearTimeout);
        window.phoneTbTimers = [];
        if (window.phoneTbInterval) clearInterval(window.phoneTbInterval);
    }

    // ADD-ON 2: CHUVA DE EMOJI
    const cardEmojiRain = document.getElementById('card-addon-emojirain');
    const isEmojiRainActive = cardEmojiRain && cardEmojiRain.style.display !== 'none';
    let phoneEmojiRain = document.getElementById('phone-live-emoji-rain');

    if (isEmojiRainActive) {
        const erEmoji = document.getElementById('input-addon-er-emoji')?.value.trim() || '🌸';
        const erCount = parseInt(document.getElementById('input-addon-er-count')?.value || '8', 10);
        const erSpeed = document.getElementById('select-addon-er-speed')?.value || 'normal';
        const erCoverage = parseInt(document.getElementById('input-addon-er-coverage')?.value || '80', 10);
        const erRotate = document.getElementById('input-addon-er-rotate')?.checked || false;
        const durationMap = { slow: 6, normal: 5, fast: 3 };
        const baseDuration = durationMap[erSpeed] || 3.5;

        const configKey = `${erEmoji}_${erCount}_${erSpeed}_${erCoverage}_${erRotate}`;
        if (window.phoneErConfigKey !== configKey) {
            window.phoneErConfigKey = configKey;

            let targetContainer = phoneScreen.querySelector('.v-live-page') || phoneScreen.querySelector('.preview-bio-page') || phoneScreen;
            
            if (!phoneEmojiRain || phoneEmojiRain.parentNode !== targetContainer) {
                if (phoneEmojiRain && phoneEmojiRain.parentNode) {
                    phoneEmojiRain.parentNode.removeChild(phoneEmojiRain);
                }
                phoneEmojiRain = document.createElement('div');
                phoneEmojiRain.id = 'phone-live-emoji-rain';
                targetContainer.prepend(phoneEmojiRain);
            } else {
                phoneEmojiRain.innerHTML = '';
                phoneEmojiRain.style.display = '';
            }
            phoneEmojiRain.style.cssText = `position: absolute; top: 0; left: 0; right: 0; height: ${erCoverage}%; overflow: hidden; pointer-events: none; z-index: 0;`;

            const styleId = 'phone-emoji-rain-style';
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = styleId;
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = `
                @keyframes pb-emojifall    { 0%{top:-80px;opacity:0} 10%{opacity:.38} 90%{opacity:.38} 100%{top:100%;opacity:0} }
                @keyframes pb-emojifall-cw { 0%{top:-80px;transform:rotate(0deg);opacity:0} 10%{opacity:.38} 90%{opacity:.38} 100%{top:100%;transform:rotate(540deg);opacity:0} }
                @keyframes pb-emojifall-ccw{ 0%{top:-80px;transform:rotate(0deg);opacity:0} 10%{opacity:.38} 90%{opacity:.38} 100%{top:100%;transform:rotate(-540deg);opacity:0} }
            `;

            const count = Math.min(Math.max(erCount, 1), 20);
            const emojiArray = Array.from(erEmoji);
            for (let i = 0; i < count; i++) {
                const span = document.createElement('span');
                const emoji = emojiArray[i % emojiArray.length] || '🌸';
                const size = (1.2 + Math.random() * 1.2).toFixed(2);
                const left = (Math.random() * 90).toFixed(1);
                const duration = (baseDuration * (0.7 + Math.random() * 0.7)).toFixed(2);
                const delay = -(Math.random() * baseDuration * 2).toFixed(2);
                let animName = 'pb-emojifall';
                if (erRotate) {
                    animName = Math.random() > 0.5 ? 'pb-emojifall-cw' : 'pb-emojifall-ccw';
                }
                span.textContent = emoji;
                span.style.cssText = `position:absolute;top:0;left:${left}%;font-size:${size}rem;filter:blur(2px);pointer-events:none;animation:${animName} ${duration}s linear ${delay}s infinite;`;
                phoneEmojiRain.appendChild(span);
            }
        }
    } else if (phoneEmojiRain) {
        phoneEmojiRain.style.display = 'none';
        window.phoneErConfigKey = null;
    }

    // ADD-ON 3: RODOPIO DO AVATAR
    const cardAvatarSpinCheck = document.getElementById('card-addon-avatarspin');
    const isAvatarSpinActive = cardAvatarSpinCheck && cardAvatarSpinCheck.style.display !== 'none';

    if (isAvatarSpinActive) {
        const asDuration = parseFloat(document.getElementById('input-addon-as-duration')?.value || '3');
        const asSpins   = parseInt(document.getElementById('input-addon-as-spins')?.value || '4', 10);
        const asRepeat  = document.getElementById('input-addon-as-repeat')?.checked || false;
        const asInterval = parseInt(document.getElementById('input-addon-as-interval')?.value || '5', 10);
        const configKey  = `${asDuration}_${asSpins}_${asRepeat}_${asInterval}`;

        if (window.phoneAsConfigKey !== configKey) {
            window.phoneAsConfigKey = configKey;
            if (window.phoneAsRepeatTimer) { clearInterval(window.phoneAsRepeatTimer); window.phoneAsRepeatTimer = null; }
            if (typeof applyAvatarSpinAnimation === 'function') {
                applyAvatarSpinAnimation(asDuration, asSpins, activeModel);
            }
            if (asRepeat) {
                window.phoneAsRepeatTimer = setInterval(() => {
                    if (typeof applyAvatarSpinAnimation === 'function') {
                        applyAvatarSpinAnimation(asDuration, asSpins, activeModel);
                    }
                }, (asDuration + asInterval) * 1000);
            }
        }
    } else {
        if (typeof removeAvatarSpinAnimation === 'function') {
            removeAvatarSpinAnimation();
        }
        if (window.phoneAsRepeatTimer) { clearInterval(window.phoneAsRepeatTimer); window.phoneAsRepeatTimer = null; }
        window.phoneAsConfigKey = null;
    }

    // MODELO 2: VITRINE
    if (activeModel === 'vitrine') {
        const heroGrid = document.getElementById('v-view-hero-grid');
        const infoSection = document.getElementById('v-view-info');
        const img1 = document.getElementById('v-view-h1');
        const img2 = document.getElementById('v-view-h2');
        const img3 = document.getElementById('v-view-h3');
        const avatarWrapper = document.getElementById('v-view-avatar-wrapper');
        const avatarInner = document.getElementById('v-view-avatar-inner');
        const viewName = document.getElementById('v-view-name');
        const viewArroba = document.getElementById('v-view-arroba');
        const viewBio = document.getElementById('v-view-bio');
        const viewButtons = document.getElementById('v-view-buttons');

        if (!heroGrid || !infoSection) return;

        const avatarUrl = document.getElementById('input-avatar')?.value.trim() || '';
        const name = document.getElementById('input-name')?.value.trim() || '';
        const arroba = document.getElementById('input-arroba')?.value.trim() || '';
        const bio = document.getElementById('input-bio')?.value.trim() || '';
        
        const btn1Title = document.getElementById('input-btn1-title')?.value.trim() || '';
        const btn1Url = document.getElementById('input-btn1-url')?.value.trim() || '';
        const btn2Title = document.getElementById('input-btn2-title')?.value.trim() || '';
        const btn2Url = document.getElementById('input-btn2-url')?.value.trim() || '';
        const btn3Title = document.getElementById('input-btn3-title')?.value.trim() || '';
        const btn3Url = document.getElementById('input-btn3-url')?.value.trim() || '';
        const btn4Title = document.getElementById('input-btn4-title')?.value.trim() || '';
        const btn4Url = document.getElementById('input-btn4-url')?.value.trim() || '';

        const h1Img = document.getElementById('input-highlight1-img')?.value.trim() || '';
        const h2Img = document.getElementById('input-highlight2-img')?.value.trim() || '';
        const h3Img = document.getElementById('input-highlight3-img')?.value.trim() || '';

        if (isTopbannerActive) {
            heroGrid.style.marginTop = '36px';
        } else {
            heroGrid.style.marginTop = '0px';
        }

        const hasAnyPhoto = Boolean(h1Img || h2Img || h3Img);

        if (hasAnyPhoto) {
            heroGrid.style.display = 'block';
            if (img1) {
                img1.src = h1Img || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%231a1a1a"/>';
                img1.style.display = h1Img ? 'block' : 'none';
            }
            if (img2) {
                img2.src = h2Img || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%231a1a1a"/>';
                img2.style.display = h2Img ? 'block' : 'none';
            }
            if (img3) {
                img3.src = h3Img || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%231a1a1a"/>';
                img3.style.display = h3Img ? 'block' : 'none';
            }
            if (avatarWrapper && avatarWrapper.parentNode !== heroGrid) {
                heroGrid.appendChild(avatarWrapper);
            }
            if (avatarWrapper) {
                avatarWrapper.style.position = 'absolute';
                avatarWrapper.style.bottom = '-38px';
                avatarWrapper.style.left = '50%';
                avatarWrapper.style.transform = 'translateX(-50%)';
                avatarWrapper.style.margin = '0';
            }
        } else {
            heroGrid.style.display = 'none';
            if (avatarWrapper && avatarWrapper.parentNode !== infoSection) {
                infoSection.prepend(avatarWrapper);
            }
            if (avatarWrapper) {
                avatarWrapper.style.position = 'relative';
                avatarWrapper.style.bottom = '0';
                avatarWrapper.style.left = '0';
                avatarWrapper.style.transform = 'none';
                avatarWrapper.style.margin = '0 auto 20px auto';
            }
        }

        const activePreset = localStorage.getItem('selected-theme-preset') || 'gray';
        const presetThemeMap = {
            'gray': '#a3d959',
            'sunset': '#ff0844',
            'neon-blue': '#00c6ff',
            'synthwave': '#f107a3',
            'fire': '#ff5858',
            'aurora': '#00ff87',
            'indigo': '#06b6d4',
            'cyber-lime': '#a8ff78',
            'rose-gold': '#fda085',
            'golden': '#f5af19',
            'deep-purple': '#e94057',
            'platinum': '#e2e8f0'
        };
        const themeBorderColor = presetThemeMap[activePreset] || '#a3d959';

        if (avatarUrl) {
            if (avatarWrapper) {
                avatarWrapper.style.background = themeBorderColor;
                avatarWrapper.style.padding = '3px';
                avatarWrapper.style.border = '4px solid #0e110d';
                avatarWrapper.style.boxShadow = `0 0 20px ${themeBorderColor}66`;
            }
            if (avatarInner) avatarInner.innerHTML = `<img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            if (avatarWrapper) avatarWrapper.style.display = 'flex';
        } else {
            if (avatarInner) avatarInner.innerHTML = '';
            if (avatarWrapper) avatarWrapper.style.display = 'none';
        }

        infoSection.style.display = 'flex';
        if (viewName) viewName.textContent = name || '';
        
        if (viewArroba) {
            if (arroba) {
                const displayArroba = arroba.startsWith('@') ? arroba : `@${arroba}`;
                const cleanUser = arroba.startsWith('@') ? arroba.substring(1) : arroba;
                viewArroba.textContent = displayArroba;
                viewArroba.href = `https://instagram.com/${cleanUser}`;
                viewArroba.style.color = themeBorderColor;
                viewArroba.style.display = 'inline-block';
            } else {
                viewArroba.style.display = 'none';
            }
        }

        if (viewBio) {
            viewBio.textContent = bio || '';
            viewBio.style.display = bio ? 'block' : 'none';
            const activeAlignBtn = document.querySelector('.align-btn.active');
            viewBio.style.textAlign = activeAlignBtn ? activeAlignBtn.getAttribute('data-align') : 'center';
        }

        let btnsHtml = '';
        const createVBtn = (title, url) => `
            <div style="width: 100%; background: rgba(255, 255, 255, 0.05); color: #ffffff; border: 1.5px solid ${themeBorderColor}; padding: 15px 18px; border-radius: 16px; font-weight: 700; font-size: 0.88rem; text-transform: uppercase; letter-spacing: 0.4px; text-align: center; box-shadow: 0 4px 14px rgba(0,0,0,0.3); backdrop-filter: blur(8px); cursor: pointer;" onclick="${url ? `window.open('${url}', '_blank')` : ''}">
                ${title}
            </div>
        `;

        if (btn1Title) btnsHtml += createVBtn(btn1Title, btn1Url);
        if (btn2Title) btnsHtml += createVBtn(btn2Title, btn2Url);
        if (btn3Title) btnsHtml += createVBtn(btn3Title, btn3Url);
        if (btn4Title) btnsHtml += createVBtn(btn4Title, btn4Url);

        if (viewButtons) viewButtons.innerHTML = btnsHtml;
        return;
    }

    // MODELO 1: CLASSIC
    const viewCard = document.getElementById('view-card');
    const viewAvatarContainer = document.getElementById('view-avatar-container');
    const viewAvatarInner = document.getElementById('view-avatar-inner');
    const viewName = document.getElementById('view-name');
    const viewArroba = document.getElementById('view-arroba');
    const viewBio = document.getElementById('view-bio');
    const viewLinks = document.getElementById('view-links');
    const viewFooter = document.getElementById('view-footer');

    if (!viewCard) return;

    if (isTopbannerActive) {
        viewCard.style.marginTop = '36px';
    } else {
        viewCard.style.marginTop = '0px';
    }

    const avatarUrlInput = document.getElementById('input-avatar');
    const nameInput = document.getElementById('input-name');
    const arrobaInput = document.getElementById('input-arroba');
    const bioInput = document.getElementById('input-bio');
    
    const btn1TitleInput = document.getElementById('input-btn1-title');
    const btn1UrlInput = document.getElementById('input-btn1-url');
    const btn2TitleInput = document.getElementById('input-btn2-title');
    const btn2UrlInput = document.getElementById('input-btn2-url');
    const btn3TitleInput = document.getElementById('input-btn3-title');
    const btn3UrlInput = document.getElementById('input-btn3-url');

    const avatarUrl = avatarUrlInput ? avatarUrlInput.value.trim() : '';
    const name = nameInput ? nameInput.value.trim() : '';
    const arroba = arrobaInput ? arrobaInput.value.trim() : '';
    const bio = bioInput ? bioInput.value.trim() : '';
    
    const btn1Title = btn1TitleInput ? btn1TitleInput.value.trim() : '';
    const btn1Url = btn1UrlInput ? btn1UrlInput.value.trim() : '';
    const btn2Title = btn2TitleInput ? btn2TitleInput.value.trim() : '';
    const btn2Url = btn2UrlInput ? btn2UrlInput.value.trim() : '';
    const btn3Title = btn3TitleInput ? btn3TitleInput.value.trim() : '';
    const btn3Url = btn3UrlInput ? btn3UrlInput.value.trim() : '';

    const hasAnyContent = avatarUrl || name || arroba || bio || btn1Title || btn2Title || btn3Title;

    if (!hasAnyContent) {
        viewCard.style.display = "none";
        viewFooter.style.display = "none";
        return;
    }

    viewCard.style.display = "flex";

    if (avatarUrl) {
        viewAvatarInner.innerHTML = `<img src="${avatarUrl}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;">`;
        viewAvatarContainer.style.display = "flex";
    } else {
        viewAvatarInner.innerHTML = "";
        viewAvatarContainer.style.display = "none";
    }

    if (name) {
        viewName.textContent = name;
        viewName.style.display = "block";
    } else {
        viewName.textContent = "";
        viewName.style.display = "none";
    }

    if (arroba) {
        const displayArroba = arroba.startsWith('@') ? arroba : `@${arroba}`;
        const cleanUser = arroba.startsWith('@') ? arroba.substring(1) : arroba;
        viewArroba.textContent = displayArroba;
        viewArroba.href = `https://instagram.com/${cleanUser}`;
        viewArroba.style.display = "inline-block";
    } else {
        viewArroba.textContent = "";
        viewArroba.href = "#";
        viewArroba.style.display = "none";
    }

    if (bio) {
        viewBio.textContent = bio;
        viewBio.style.display = "block";
        const activeAlignBtn = document.querySelector('.align-btn.active');
        viewBio.style.textAlign = activeAlignBtn ? activeAlignBtn.getAttribute('data-align') : 'center';
    } else {
        viewBio.textContent = "";
        viewBio.style.display = "none";
    }

    let buttonsHtml = "";
    if (btn1Title) {
        buttonsHtml += `<div class="preview-btn" onclick="${btn1Url ? `window.open('${btn1Url}', '_blank')` : ''}">${btn1Title}</div>`;
    }
    if (btn2Title) {
        buttonsHtml += `<div class="preview-btn" onclick="${btn2Url ? `window.open('${btn2Url}', '_blank')` : ''}">${btn2Title}</div>`;
    }
    if (btn3Title) {
        buttonsHtml += `<div class="preview-btn" onclick="${btn3Url ? `window.open('${btn3Url}', '_blank')` : ''}">${btn3Title}</div>`;
    }
    viewLinks.innerHTML = buttonsHtml;
    viewFooter.style.display = "flex";
}

function bindInspectorFormEvents() {
    const formInputs = document.querySelectorAll('#inspector-form input, #inspector-form textarea, #inspector-form select');
    formInputs.forEach(input => {
        input.addEventListener('input', updatePreviewFromForm);
        input.addEventListener('change', updatePreviewFromForm);
    });

    const fakeDataToggle = document.getElementById('fake-data-toggle');
    if (fakeDataToggle) {
        fakeDataToggle.addEventListener('change', () => {
            const activeModel = window.currentActiveModel || 'classic';
            if (fakeDataToggle.checked) {
                populateFakeDataForModel(activeModel);
            } else {
                const form = document.getElementById('inspector-form');
                if (form) form.reset();
            }
            updatePreviewFromForm();
        });
    }

    const effectSelect = document.getElementById('select-addon-tb-effect');
    const containerPause = document.getElementById('container-addon-tb-pause');
    const containerMarquee = document.getElementById('container-addon-tb-marquee-settings');
    if (effectSelect) {
        function updateAddonFields() {
            if (containerPause) containerPause.style.display = (['slide', 'bounce', 'flip', 'shutter'].includes(effectSelect.value)) ? 'block' : 'none';
            if (containerMarquee) containerMarquee.style.display = (effectSelect.value === 'marquee') ? 'block' : 'none';
        }
        updateAddonFields();
        effectSelect.addEventListener('change', () => {
            updateAddonFields();
            updatePreviewFromForm();
        });
    }

    const tabBtns = document.querySelectorAll('.inspector-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'transparent';
                b.style.color = '#94a3b8';
            });
            btn.classList.add('active');
            btn.style.background = '#3b82f6';
            btn.style.color = '#ffffff';

            const panelContent = document.getElementById('panel-content');
            const panelAddons = document.getElementById('panel-addons');
            if (targetTab === 'content') {
                if (panelContent) panelContent.style.display = 'block';
                if (panelAddons) panelAddons.style.display = 'none';
            } else {
                if (panelContent) panelContent.style.display = 'none';
                if (panelAddons) panelAddons.style.display = 'block';
            }
        });
    });

    const btnEnableTopbanner = document.getElementById('btn-enable-topbanner-addon');
    const cardTopbanner = document.getElementById('card-addon-topbanner');
    const btnRemoveTopbanner = document.getElementById('btn-remove-topbanner-addon');

    if (btnEnableTopbanner && cardTopbanner) {
        btnEnableTopbanner.addEventListener('click', () => {
            cardTopbanner.style.display = 'block';
            const text1 = document.getElementById('input-addon-tb-text1');
            if (text1 && !text1.value) text1.value = "🔥 Frete Grátis em compras acima de R$ 199";
            const text2 = document.getElementById('input-addon-tb-text2');
            if (text2 && !text2.value) text2.value = "💳 Em até 10x sem juros no cartão";
            const text3 = document.getElementById('input-addon-tb-text3');
            if (text3 && !text3.value) text3.value = "🛍️ Cupom 10% OFF: BEMVINDO10";
            
            const contentTabBtn = document.querySelector('.inspector-tab-btn[data-tab="content"]');
            if (contentTabBtn) contentTabBtn.click();
            updatePreviewFromForm();

            setTimeout(() => {
                cardTopbanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    }

    if (btnRemoveTopbanner && cardTopbanner) {
        btnRemoveTopbanner.addEventListener('click', () => {
            cardTopbanner.style.display = 'none';
            const text1 = document.getElementById('input-addon-tb-text1');
            if (text1) text1.value = "";
            const text2 = document.getElementById('input-addon-tb-text2');
            if (text2) text2.value = "";
            const text3 = document.getElementById('input-addon-tb-text3');
            if (text3) text3.value = "";
            updatePreviewFromForm();
        });
    }

    const btnEnableEmojiRain = document.getElementById('btn-enable-emojirain-addon');
    const cardEmojiRainInspector = document.getElementById('card-addon-emojirain');
    const btnRemoveEmojiRain = document.getElementById('btn-remove-emojirain-addon');

    if (btnEnableEmojiRain && cardEmojiRainInspector) {
        btnEnableEmojiRain.addEventListener('click', () => {
            cardEmojiRainInspector.style.display = 'block';
            const emojiInput = document.getElementById('input-addon-er-emoji');
            if (emojiInput && !emojiInput.value) emojiInput.value = '🌸';
            const contentTabBtn = document.querySelector('.inspector-tab-btn[data-tab="content"]');
            if (contentTabBtn) contentTabBtn.click();
            updatePreviewFromForm();
            setTimeout(() => {
                cardEmojiRainInspector.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    }

    if (btnRemoveEmojiRain && cardEmojiRainInspector) {
        btnRemoveEmojiRain.addEventListener('click', () => {
            cardEmojiRainInspector.style.display = 'none';
            const emojiInput = document.getElementById('input-addon-er-emoji');
            if (emojiInput) emojiInput.value = '';
            updatePreviewFromForm();
        });
    }

    const emojiCatalogBtns = document.querySelectorAll('.emoji-pick-btn');
    emojiCatalogBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const emojiInput = document.getElementById('input-addon-er-emoji');
            if (emojiInput) {
                emojiInput.value = btn.getAttribute('data-emoji');
                window.phoneErConfigKey = null;
                updatePreviewFromForm();
            }
        });
    });

    const coverageInput = document.getElementById('input-addon-er-coverage');
    const coverageLabel = document.getElementById('label-addon-er-coverage');
    if (coverageInput && coverageLabel) {
        coverageInput.addEventListener('input', () => {
            coverageLabel.textContent = coverageInput.value + '%';
            window.phoneErConfigKey = null;
            updatePreviewFromForm();
        });
    }

    const erRotateInput = document.getElementById('input-addon-er-rotate');
    if (erRotateInput) {
        erRotateInput.addEventListener('change', () => {
            window.phoneErConfigKey = null;
            updatePreviewFromForm();
        });
    }

    const btnEnableAvatarSpin = document.getElementById('btn-enable-avatarspin-addon');
    const cardAvatarSpin = document.getElementById('card-addon-avatarspin');
    const btnRemoveAvatarSpin = document.getElementById('btn-remove-avatarspin-addon');

    if (btnEnableAvatarSpin && cardAvatarSpin) {
        btnEnableAvatarSpin.addEventListener('click', () => {
            cardAvatarSpin.style.display = 'block';
            const contentTabBtn = document.querySelector('.inspector-tab-btn[data-tab="content"]');
            if (contentTabBtn) contentTabBtn.click();
            updatePreviewFromForm();
            setTimeout(() => {
                cardAvatarSpin.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    }

    if (btnRemoveAvatarSpin && cardAvatarSpin) {
        btnRemoveAvatarSpin.addEventListener('click', () => {
            cardAvatarSpin.style.display = 'none';
            const liveAvatar = document.getElementById('view-avatar-container') || document.getElementById('v-view-avatar-wrapper');
            if (liveAvatar) liveAvatar.style.animation = '';
            updatePreviewFromForm();
        });
    }

    const asRepeatChk = document.getElementById('input-addon-as-repeat');
    const asIntervalCont = document.getElementById('container-addon-as-interval');
    if (asRepeatChk && asIntervalCont) {
        asRepeatChk.addEventListener('change', () => {
            asIntervalCont.style.display = asRepeatChk.checked ? 'block' : 'none';
            updatePreviewFromForm();
        });
    }

    const btnPreviewSpin = document.getElementById('btn-preview-avatarspin');
    if (btnPreviewSpin) {
        btnPreviewSpin.addEventListener('click', () => {
            if (typeof triggerAvatarSpinPreview === 'function') triggerAvatarSpinPreview();
        });
    }

    const btnSearchAvatar = document.getElementById('btn-search-avatar');
    if (btnSearchAvatar) {
        btnSearchAvatar.addEventListener('click', () => {
            const url = prompt("Insira a URL da imagem de perfil:", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200");
            if (url) {
                const avatarInput = document.getElementById('input-avatar');
                if (avatarInput) avatarInput.value = url;
                updatePreviewFromForm();
            }
        });
    }

    const alignBtns = document.querySelectorAll('.align-btn');
    alignBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            alignBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updatePreviewFromForm();
        });
    });

    const inspectorForm = document.getElementById('inspector-form');
    if (inspectorForm) {
        inspectorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const arrobaInput = document.getElementById('input-arroba');
            if (!arrobaInput || !arrobaInput.value.trim()) return;

            let cleanArroba = arrobaInput.value.trim().toLowerCase();
            if (!cleanArroba.startsWith('@')) {
                cleanArroba = '@' + cleanArroba;
            }

            const selectedCard = document.querySelector('.template-card.is-selected');
            const activeModel = (selectedCard && selectedCard.getAttribute('data-template')) || window.currentActiveModel || 'classic';

            const updatedData = {
                model: activeModel,
                arroba: cleanArroba,
                name: document.getElementById('input-name')?.value.trim() || '',
                avatar: document.getElementById('input-avatar')?.value.trim() || '',
                bio: document.getElementById('input-bio')?.value.trim() || '',
                highlight1Img: document.getElementById('input-highlight1-img') ? document.getElementById('input-highlight1-img').value.trim() : (window.tempFormBackup?.highlight1Img || ''),
                highlight1Title: document.getElementById('input-highlight1-title') ? document.getElementById('input-highlight1-title').value.trim() : (window.tempFormBackup?.highlight1Title || ''),
                highlight2Img: document.getElementById('input-highlight2-img') ? document.getElementById('input-highlight2-img').value.trim() : (window.tempFormBackup?.highlight2Img || ''),
                highlight2Title: document.getElementById('input-highlight2-title') ? document.getElementById('input-highlight2-title').value.trim() : (window.tempFormBackup?.highlight2Title || ''),
                highlight3Img: document.getElementById('input-highlight3-img') ? document.getElementById('input-highlight3-img').value.trim() : (window.tempFormBackup?.highlight3Img || ''),
                highlight3Title: document.getElementById('input-highlight3-title') ? document.getElementById('input-highlight3-title').value.trim() : (window.tempFormBackup?.highlight3Title || ''),
                btn1Title: document.getElementById('input-btn1-title')?.value.trim() || '',
                btn1Url: document.getElementById('input-btn1-url')?.value.trim() || '',
                btn2Title: document.getElementById('input-btn2-title')?.value.trim() || '',
                btn2Url: document.getElementById('input-btn2-url')?.value.trim() || '',
                btn3Title: document.getElementById('input-btn3-title')?.value.trim() || '',
                btn3Url: document.getElementById('input-btn3-url')?.value.trim() || '',
                btn4Title: document.getElementById('input-btn4-title')?.value.trim() || '',
                btn4Url: document.getElementById('input-btn4-url')?.value.trim() || '',
                addonTopbannerActive: document.getElementById('card-addon-topbanner')?.style.display !== 'none',
                addonTopbannerText1: document.getElementById('input-addon-tb-text1')?.value.trim() || '',
                addonTopbannerText2: document.getElementById('input-addon-tb-text2')?.value.trim() || '',
                addonTopbannerText3: document.getElementById('input-addon-tb-text3')?.value.trim() || '',
                addonTopbannerBg: document.getElementById('input-addon-tb-bg')?.value || '#0f172a',
                addonTopbannerColor: document.getElementById('input-addon-tb-color')?.value || '#38bdf8',
                addonTopbannerEffect: document.getElementById('select-addon-tb-effect')?.value || 'fade',
                addonTopbannerPause: parseInt(document.getElementById('input-addon-tb-pause')?.value || '2', 10),
                addonEmojiRainActive: document.getElementById('card-addon-emojirain')?.style.display !== 'none',
                addonEmojiRainEmoji: document.getElementById('input-addon-er-emoji')?.value.trim() || '',
                addonEmojiRainCount: parseInt(document.getElementById('input-addon-er-count')?.value || '8', 10),
                addonEmojiRainSpeed: document.getElementById('select-addon-er-speed')?.value || 'normal',
                addonEmojiRainCoverage: parseInt(document.getElementById('input-addon-er-coverage')?.value || '80', 10),
                addonEmojiRainRotate: document.getElementById('input-addon-er-rotate')?.checked || false,
                addonAvatarSpinActive: document.getElementById('card-addon-avatarspin')?.style.display !== 'none',
                addonAvatarSpinDuration: parseFloat(document.getElementById('input-addon-as-duration')?.value || '3'),
                addonAvatarSpinSpins: parseInt(document.getElementById('input-addon-as-spins')?.value || '4', 10),
                addonAvatarSpinRepeat: document.getElementById('input-addon-as-repeat')?.checked || false,
                addonAvatarSpinInterval: parseInt(document.getElementById('input-addon-as-interval')?.value || '5', 10),
                preset: localStorage.getItem('selected-theme-preset') || 'gray',
                bioAlign: document.querySelector('.align-btn.active') ? document.querySelector('.align-btn.active').getAttribute('data-align') : 'center'
            };

            const btnSave = document.getElementById('btn-save-inspector');
            const originalText = btnSave ? btnSave.textContent : 'Salvar Site';
            if (btnSave) {
                btnSave.textContent = "Tirando print...";
                btnSave.style.opacity = '0.7';
            }

            try {
                const phoneMockup = document.querySelector('.phone-mockup');
                let previewBase64 = null;
                if (phoneMockup && typeof html2canvas !== 'undefined') {
                    const canvas = await html2canvas(phoneMockup, { 
                        scale: 1, 
                        useCORS: true,
                        backgroundColor: '#000000'
                    });
                    previewBase64 = canvas.toDataURL('image/jpeg', 0.6);
                    updatedData.previewBase64 = previewBase64;
                }

                if (btnSave) btnSave.textContent = "Salvando Localmente...";
                updatedData.createdAt = new Date().toISOString();

                let leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
                const existingLead = leads.find(l => l.arroba.toLowerCase() === cleanArroba.toLowerCase());

                if (existingLead && (existingLead.status === 'published' || existingLead.status === 'modified')) {
                    updatedData.status = 'modified';
                    updatedData.publishedAt = existingLead.publishedAt;
                } else {
                    updatedData.status = 'not_published';
                }
                
                leads = leads.filter(l => l.arroba.toLowerCase() !== cleanArroba.toLowerCase());
                leads.unshift(updatedData);
                localStorage.setItem('painelbio-insta-leads', JSON.stringify(leads));

                if (btnSave) {
                    btnSave.textContent = "Site Salvo! ✓";
                    btnSave.classList.add('saved-success');
                    btnSave.style.opacity = '1';
                    
                    window.loadedFromGallery = true;
                    const btnLoadSite = document.getElementById('btn-load-site');
                    if (btnLoadSite) btnLoadSite.classList.add('site-loaded-active');
                    
                    setTimeout(() => {
                        btnSave.textContent = originalText;
                        btnSave.classList.remove('saved-success');
                    }, 3500);
                }
            } catch (err) {
                console.error('Erro ao salvar:', err);
                if (btnSave) {
                    btnSave.textContent = "Erro ao salvar ❌";
                    btnSave.style.opacity = '1';
                    setTimeout(() => {
                        btnSave.textContent = originalText;
                    }, 3500);
                }
                showCustomAlert('Houve um erro ao publicar: ' + err.message, 'error');
            }
        });
    }
}

function generateStaticSite(data) {
    if (!data) return '';
    const isVitrine = Boolean(data.model === 'vitrine');
    const presetMap = {
        'gray': { c1: '#a3d959', c2: '#82b938', text: '#000000', bg: '#0e110d', cardBg: '#151914' },
        'sunset': { c1: '#ff0844', c2: '#ffb199', text: '#ffffff', bg: '#120508', cardBg: '#1c080d' },
        'neon-blue': { c1: '#00c6ff', c2: '#0072ff', text: '#000000', bg: '#050c17', cardBg: '#0a1628' },
        'synthwave': { c1: '#f107a3', c2: '#7b2ff7', text: '#ffffff', bg: '#130419', cardBg: '#1d0726' },
        'fire': { c1: '#ff5858', c2: '#f857a6', text: '#ffffff', bg: '#170606', cardBg: '#240a0a' },
        'aurora': { c1: '#00ff87', c2: '#60e3fa', text: '#000000', bg: '#041710', cardBg: '#09241a' },
        'indigo': { c1: '#06b6d4', c2: '#4f46e5', text: '#ffffff', bg: '#060a17', cardBg: '#0d1326' },
        'cyber-lime': { c1: '#a8ff78', c2: '#78ffd6', text: '#000000', bg: '#091409', cardBg: '#102110' },
        'rose-gold': { c1: '#fda085', c2: '#f6d365', text: '#000000', bg: '#170e0a', cardBg: '#241711' },
        'golden': { c1: '#f5af19', c2: '#f12711', text: '#000000', bg: '#171104', cardBg: '#241a07' },
        'deep-purple': { c1: '#e94057', c2: '#8a2387', text: '#ffffff', bg: '#120512', cardBg: '#1e091e' },
        'platinum': { c1: '#ffffff', c2: '#9e9e9e', text: '#000000', bg: '#111111', cardBg: '#1c1c1c' }
    };

    const theme = presetMap[data.preset] || presetMap['gray'];
    const cleanArroba = (data.arroba || '').replace('@', '').trim();
    const instaUrl = cleanArroba ? `https://instagram.com/${cleanArroba}` : '#';
    const bioAlign = data.bioAlign || 'center';
    const tbTexts = [data.addonTopbannerText1, data.addonTopbannerText2, data.addonTopbannerText3].filter(Boolean);
    const hasTopBanner = Boolean((data.addonTopbannerActive || tbTexts.length > 0) && tbTexts.length > 0);
    const tbBg = data.addonTopbannerBg || '#0f172a';
    const tbColor = data.addonTopbannerColor || '#38bdf8';

    const effect = data.addonTopbannerEffect || 'fade';
    const pauseSec = parseInt(data.addonTopbannerPause || 2, 10);
    const isSlide = effect === 'slide';

    const topBannerHtml = hasTopBanner ? `
    <div id="pb-top-banner" style="position: fixed; top: 0; left: 0; width: 100%; background: ${tbBg}; color: ${tbColor}; padding: 10px 14px; font-size: 0.8rem; font-weight: 700; text-align: center; z-index: 99999; box-shadow: 0 4px 15px rgba(0,0,0,0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; overflow: hidden; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s; ${isSlide ? 'transform: translateY(-100%); opacity: 0;' : 'transform: translateY(0); opacity: 1;'}">
        <span id="pb-tb-text" style="transition: opacity 0.3s ease-in-out;">${tbTexts[0]}</span>
    </div>
    <script>
        (function() {
            var texts = ${JSON.stringify(tbTexts)};
            var isSlide = ${isSlide};
            var pauseMs = ${pauseSec} * 1000;
            var idx = 0;
            var banner = document.getElementById('pb-top-banner');
            var textEl = document.getElementById('pb-tb-text');
            if (!banner || !textEl || texts.length === 0) return;

            if (isSlide) {
                function runSlideCycle() {
                    banner.style.transform = 'translateY(0)';
                    banner.style.opacity = '1';

                    setTimeout(function() {
                        banner.style.transform = 'translateY(-100%)';
                        banner.style.opacity = '0';

                        setTimeout(function() {
                            idx = (idx + 1) % texts.length;
                            textEl.textContent = texts[idx];
                            runSlideCycle();
                        }, pauseMs);
                    }, 2000);
                }
                setTimeout(runSlideCycle, 500);
            } else {
                if (texts.length > 1) {
                    setInterval(function() {
                        textEl.style.opacity = '0';
                        setTimeout(function() {
                            idx = (idx + 1) % texts.length;
                            textEl.textContent = texts[idx];
                            textEl.style.opacity = '1';
                        }, 300);
                    }, 2000);
                }
            }
        })();
    </script>
    ` : '';

    const hasEmojiRain = Boolean(data.addonEmojiRainActive && data.addonEmojiRainEmoji);
    const erEmoji = data.addonEmojiRainEmoji || '🌸';
    const erCount = Math.min(Math.max(parseInt(data.addonEmojiRainCount || 8, 10), 1), 20);
    const erSpeed = data.addonEmojiRainSpeed || 'normal';
    const erCoverage = Math.min(Math.max(parseInt(data.addonEmojiRainCoverage || 80, 10), 10), 100);
    const erRotate = Boolean(data.addonEmojiRainRotate);
    const erDurMap = { slow: 6, normal: 5, fast: 3 };
    const erBase = erDurMap[erSpeed] || 3.5;
    let emojiRainHtml = '';
    if (hasEmojiRain) {
        let particles = '';
        const emojiArray = Array.from(erEmoji);
        for (let i = 0; i < erCount; i++) {
            const emoji = emojiArray[i % emojiArray.length] || '🌸';
            const sz  = (1.2 + Math.random() * 1.5).toFixed(2);
            const lft = (Math.random() * 90).toFixed(1);
            const dur = (erBase * (0.7 + Math.random() * 0.7)).toFixed(2);
            const dly = -(Math.random() * erBase * 2).toFixed(2);
            let animName = 'pb-emojifall';
            if (erRotate) animName = Math.random() > 0.5 ? 'pb-emojifall-cw' : 'pb-emojifall-ccw';
            particles += `<span style="position:absolute;top:0;left:${lft}%;font-size:${sz}rem;filter:blur(2px);pointer-events:none;animation:${animName} ${dur}s linear ${dly}s infinite;">${emoji}</span>`;
        }
        emojiRainHtml = `<style>body { position: relative; } @keyframes pb-emojifall{0%{top:-80px;opacity:0}10%{opacity:.38}90%{opacity:.38}100%{top:100%;opacity:0}}@keyframes pb-emojifall-cw{0%{top:-80px;transform:rotate(0deg);opacity:0}10%{opacity:.38}90%{opacity:.38}100%{top:100%;transform:rotate(540deg);opacity:0}}@keyframes pb-emojifall-ccw{0%{top:-80px;transform:rotate(0deg);opacity:0}10%{opacity:.38}90%{opacity:.38}100%{top:100%;transform:rotate(-540deg);opacity:0}}</style><div id="pb-emoji-rain" style="position:absolute;top:0;left:0;right:0;height:${erCoverage}%;overflow:hidden;pointer-events:none;z-index:0;">${particles}</div>`;
    }

    if (isVitrine) {
        const h1 = data.highlight1Img || '';
        const h2 = data.highlight2Img || '';
        const h3 = data.highlight3Img || '';
        const hasHeroPhotos = Boolean(h1 || h2 || h3);

        const btn1Html = data.btn1Title ? `<a href="${data.btn1Url || '#'}" class="v-btn" target="_blank" rel="noopener">${data.btn1Title}</a>` : '';
        const btn2Html = data.btn2Title ? `<a href="${data.btn2Url || '#'}" class="v-btn" target="_blank" rel="noopener">${data.btn2Title}</a>` : '';
        const btn3Html = data.btn3Title ? `<a href="${data.btn3Url || '#'}" class="v-btn" target="_blank" rel="noopener">${data.btn3Title}</a>` : '';
        const btn4Html = data.btn4Title ? `<a href="${data.btn4Url || '#'}" class="v-btn" target="_blank" rel="noopener">${data.btn4Title}</a>` : '';

        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${data.name || data.arroba || 'Vitrine'}</title>
    <style>
        :root {
            --v-accent: ${theme.c1};
            --v-accent-2: ${theme.c2 || theme.c1};
            --v-bg: ${theme.bg};
        }
        html, body {
            margin: 0; padding: 0; width: 100%; min-height: 100%; background-color: var(--v-bg); color: #ffffff; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif; display: flex; justify-content: center;
        }
        .v-container { width: 100%; max-width: 440px; padding: 16px 14px 40px 14px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; }
        .v-grid-hero { width: 100%; position: relative; margin-bottom: 50px; }
        .v-main-pic { width: 100%; height: 320px; border-radius: 24px; overflow: hidden; background: #1a1a1a; margin-bottom: 10px; }
        .v-main-pic img { width: 100%; height: 100%; object-fit: cover; }
        .v-sub-row { display: flex; gap: 10px; width: 100%; }
        .v-sub-pic { flex: 1; height: 155px; border-radius: 20px; overflow: hidden; background: #1a1a1a; }
        .v-sub-pic img { width: 100%; height: 100%; object-fit: cover; }
        .v-avatar-overlap { position: absolute; bottom: -42px; left: 50%; transform: translateX(-50%); width: 94px; height: 94px; border-radius: 50%; background: linear-gradient(135deg, var(--v-accent), var(--v-accent-2)); padding: 3px; border: 4px solid var(--v-bg); display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 0 22px rgba(0,0,0,0.6); z-index: 20; box-sizing: border-box; }
        .v-avatar-overlap-inner { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: #111; }
        .v-avatar-overlap-inner img { width: 100%; height: 100%; object-fit: cover; }
        .v-info { width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; }
        .v-title { font-family: Georgia, "Times New Roman", serif; font-size: 1.55rem; font-weight: 700; color: #ffffff; margin: 0 0 6px 0; line-height: 1.25; text-align: center; }
        .v-arroba { font-size: 0.95rem; color: var(--v-accent); text-decoration: none; font-weight: 600; margin-bottom: 12px; display: inline-block; }
        .v-bio { font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); line-height: 1.5; margin: 0 0 28px 0; text-align: ${bioAlign}; white-space: pre-wrap; width: 90%; }
        .v-buttons { width: 100%; display: flex; flex-direction: column; gap: 14px; }
        .v-btn { width: 100%; background: rgba(255, 255, 255, 0.05); color: #ffffff; border: 1.5px solid var(--v-accent); padding: 16px 20px; border-radius: 18px; text-decoration: none; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; display: flex; align-items: center; justify-content: center; box-sizing: border-box; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 0 6px 18px rgba(0,0,0,0.3); transition: transform 0.2s, background 0.2s; }
        .v-btn:active { transform: scale(0.98); background: rgba(255, 255, 255, 0.12); }
        .v-footer { margin-top: 35px; font-size: 0.75rem; color: rgba(255, 255, 255, 0.35); display: flex; align-items: center; gap: 6px; }
        .v-footer a { color: rgba(255, 255, 255, 0.55); text-decoration: none; font-weight: 700; text-transform: uppercase; }
    </style>
</head>
<body>
    ${topBannerHtml}
    <div class="v-container">
        ${emojiRainHtml}
        ${hasHeroPhotos ? `
        <div class="v-grid-hero">
            ${h1 ? `<div class="v-main-pic"><img src="${h1}" alt="Destaque 1"></div>` : ''}
            <div class="v-sub-row">
                ${h2 ? `<div class="v-sub-pic"><img src="${h2}" alt="Destaque 2"></div>` : ''}
                ${h3 ? `<div class="v-sub-pic"><img src="${h3}" alt="Destaque 3"></div>` : ''}
            </div>
            ${data.avatar ? `<div class="v-avatar-overlap"><div class="v-avatar-overlap-inner"><img src="${data.avatar}" alt="${data.name || ''}"></div></div>` : ''}
        </div>` : data.avatar ? `
        <div style="position: relative; width: 100px; height: 100px; margin-bottom: 20px;">
            <div class="v-avatar-overlap" style="position: relative; bottom: 0; left: 0; transform: none; margin: 0 auto;">
                <div class="v-avatar-overlap-inner"><img src="${data.avatar}" alt="${data.name || ''}"></div>
            </div>
        </div>` : ''}
        <div class="v-info">
            <h1 class="v-title">${data.name || ''}</h1>
            <a href="${instaUrl}" target="_blank" rel="noopener" class="v-arroba">${data.arroba || ''}</a>
            ${data.bio ? `<p class="v-bio">${data.bio}</p>` : ''}
            <div class="v-buttons">
                ${btn1Html} ${btn2Html} ${btn3Html} ${btn4Html}
            </div>
            <div class="v-footer">CRIADO COM <a href="/">PAINELBIO</a></div>
        </div>
    </div>
</body>
</html>`;
    }

    const avatarHtml = data.avatar ? `<div class="preview-avatar-glow"><div class="preview-avatar-inner"><img src="${data.avatar}" alt="${data.name || ''}"></div></div>` : '';
    const bioHtml = data.bio ? `<p class="preview-bio">${data.bio}</p>` : '';
    const btn1Html = data.btn1Title ? `<a href="${data.btn1Url || '#'}" class="preview-link-btn" target="_blank" rel="noopener">${data.btn1Title}</a>` : '';
    const btn2Html = data.btn2Title ? `<a href="${data.btn2Url || '#'}" class="preview-link-btn" target="_blank" rel="noopener">${data.btn2Title}</a>` : '';
    const btn3Html = data.btn3Title ? `<a href="${data.btn3Url || '#'}" class="preview-link-btn" target="_blank" rel="noopener">${data.btn3Title}</a>` : '';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${data.name || data.arroba || 'Bio'}</title>
    <style>
        :root { --theme-c1: ${theme.c1}; --theme-c2: ${theme.c2}; --theme-b: rgba(255, 255, 255, 0.08); --theme-g: rgba(255, 255, 255, 0.15); }
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow-x: hidden; overscroll-behavior: none; background-color: #121214; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; }
        .preview-bio-page { width: 100%; min-height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 16px; box-sizing: border-box; position: relative; }
        .bg-glow { position: absolute; width: 280px; height: 280px; border-radius: 50%; filter: blur(60px); opacity: 0.58; z-index: 0; pointer-events: none; mix-blend-mode: screen; animation: glow-wave 12s infinite ease-in-out alternate; }
        .bg-glow-top { top: -50px; left: -50px; background: radial-gradient(circle, var(--theme-c1) 0%, transparent 70%); }
        .bg-glow-bottom { bottom: -50px; right: -50px; background: radial-gradient(circle, var(--theme-c2) 0%, transparent 70%); animation-delay: -6s; }
        @keyframes glow-wave { 0% { transform: translate(0, 0) scale(1) rotate(0deg); } 50% { transform: translate(15px, -15px) scale(1.15) rotate(45deg); } 100% { transform: translate(-10px, 15px) scale(0.9) rotate(90deg); } }
        .preview-card { width: 100%; max-width: 400px; background: rgba(18, 15, 27, 0.75); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid var(--theme-b); border-radius: 28px; padding: 24px 20px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6); position: relative; z-index: 10; box-sizing: border-box; }
        .preview-avatar-glow { width: 85px; height: 85px; border-radius: 50%; background: linear-gradient(135deg, var(--theme-c1), var(--theme-c2)); padding: 3px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
        .preview-avatar-inner { width: 100%; height: 100%; border-radius: 50%; background: #111111; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .preview-avatar-inner img { width: 100%; height: 100%; object-fit: cover; }
        .preview-name { font-size: 1.2rem; font-weight: 700; margin: 0 0 4px 0; color: #ffffff; text-align: center; }
        .preview-arroba { font-size: 0.85rem; color: var(--theme-c1); text-decoration: none; margin-bottom: 14px; text-align: center; display: inline-block; font-weight: 600; }
        .preview-bio { font-size: 0.88rem; color: rgba(255, 255, 255, 0.8); text-align: ${bioAlign}; line-height: 1.5; margin-bottom: 24px; width: 95%; word-break: break-word; }
        .preview-links { width: 100%; display: flex; flex-direction: column; gap: 12px; }
        .preview-link-btn { background: rgba(255, 255, 255, 0.04); border: 1px solid var(--theme-b); color: #ffffff; padding: 16px 20px; border-radius: 14px; text-decoration: none; font-size: 0.95rem; font-weight: 600; display: flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; }
        .footer { margin-top: 25px; font-size: 0.75rem; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 6px; }
        .footer a { color: rgba(255,255,255,0.6); text-decoration: none; font-weight: 600; text-transform: uppercase; }
    </style>
</head>
<body>
    ${topBannerHtml}
    <div class="preview-bio-page">
        ${emojiRainHtml}
        <div class="bg-glow bg-glow-top"></div>
        <div class="bg-glow bg-glow-bottom"></div>
        <div class="preview-card">
            ${avatarHtml}
            <h2 class="preview-name">${data.name || ''}</h2>
            <a href="${instaUrl}" target="_blank" rel="noopener" class="preview-arroba">${data.arroba || ''}</a>
            ${bioHtml}
            <div class="preview-links">
                ${btn1Html} ${btn2Html} ${btn3Html}
            </div>
            <div class="footer">CRIADO COM <a href="/">PAINELBIO</a></div>
        </div>
    </div>
</body>
</html>`;
}
