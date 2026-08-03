// --- ADDONS MODULE ---

function updateAddonFields() {
                        if (containerPause) containerPause.style.display = (['fade', 'slide', 'bounce', 'flip', 'shutter'].includes(effectSelect.value)) ? 'block' : 'none';
                        if (containerMarquee) containerMarquee.style.display = (effectSelect.value === 'marquee') ? 'block' : 'none';
                    }

function updateAddonCatalogButtonStates() {
            const addons = [
                { btnId: 'btn-enable-topbanner-addon', cardId: 'card-addon-topbanner' },
                { btnId: 'btn-enable-emojirain-addon', cardId: 'card-addon-emojirain' },
                { btnId: 'btn-enable-avatarspin-addon', cardId: 'card-addon-avatarspin' },
                { btnId: 'btn-enable-audioplayer-addon', cardId: 'card-addon-audioplayer' },
                { btnId: 'btn-enable-livechat-addon', cardId: 'card-addon-livechat' },
                { btnId: 'btn-enable-bgdots-addon', cardId: 'card-addon-bgdots' },
                { btnId: 'btn-enable-matrix-addon', cardId: 'card-addon-matrix' },
                { btnId: 'btn-enable-glitch-addon', cardId: 'card-addon-glitch' },
                { btnId: 'btn-enable-aurora-addon', cardId: 'card-addon-aurora' }
            ];

            addons.forEach(({ btnId, cardId }) => {
                const btn = document.getElementById(btnId);
                const card = document.getElementById(cardId);
                if (btn) {
                    const isEnabled = card && card.style.display !== 'none';
                    if (isEnabled) {
                        btn.style.background = '#3b82f6';
                        btn.style.color = '#ffffff';
                        btn.style.border = '1px solid #60a5fa';
                        btn.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.4)';
                        btn.textContent = '✓ Habilitado';
                    } else {
                        btn.style.background = '#334155';
                        btn.style.color = '#cbd5e1';
                        btn.style.border = '1px solid rgba(255,255,255,0.1)';
                        btn.style.boxShadow = 'none';
                        btn.textContent = '+ Habilitar';
                    }
                }
            });
            updateCartSummary();
        }

function updateCartSummary() {
    const listEl = document.getElementById('cart-addons-list');
    const totalEl = document.getElementById('cart-total-price');
    const modelNameEl = document.getElementById('cart-model-name');
    const modelPriceEl = document.getElementById('cart-model-price');
    if (!listEl || !totalEl || !modelNameEl || !modelPriceEl) return;

    const settings = (typeof getPixSettings === 'function') ? getPixSettings() : {};

    let basePrice = parseFloat(settings.classicPrice || 9.99);
    let modelName = 'Modelo Classic';
    
    const activeModelBadge = document.querySelector('.template-card.is-selected');
    if (activeModelBadge) {
        const template = activeModelBadge.getAttribute('data-template');
        if (template === 'classic') { basePrice = parseFloat(settings.classicPrice || 9.99); modelName = 'Modelo Classic'; }
        if (template === 'vitrine') { basePrice = parseFloat(settings.vitrinePrice || 12.99); modelName = 'Modelo Vitrine'; }
        if (template === 'carousel' || template === 'carrossel') { basePrice = parseFloat(settings.carouselPrice || 14.99); modelName = 'Modelo Carrossel'; }
        if (template === 'shop') { basePrice = parseFloat(settings.shopPrice || 19.99); modelName = 'Modelo Shop'; }
        if (template === 'ebook') { basePrice = parseFloat(settings.ebookPrice || 14.99); modelName = 'Modelo E-book'; }
    }
    
    // Obtém arroba atual para checar se o site já existe
    const arrobaInput = document.getElementById('input-arroba');
    const currentArroba = arrobaInput ? arrobaInput.value.trim() : '';
    
    // Verifica existência e pagamento anterior no LocalStorage
    const leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
    const siteExists = leads.some(l => l.arroba && l.arroba.toLowerCase() === currentArroba.toLowerCase() && l.lastPaidAt);

    if (siteExists) {
        modelNameEl.innerHTML = `<span style="text-decoration: line-through; color: #6e7681;">${modelName}</span> <span style="color: #34d399; font-weight: 700; font-size: 0.75rem; margin-left: 4px;">✓ Já Pago</span>`;
        modelPriceEl.textContent = 'Grátis';
        modelPriceEl.style.color = '#34d399';
        basePrice = 0; // zera no total
    } else {
        modelNameEl.textContent = modelName;
        modelPriceEl.textContent = `R$ ${basePrice.toFixed(2).replace('.', ',')}`;
        modelPriceEl.style.color = '';
    }

    const purchased = (typeof getPurchasedAddons === 'function') ? getPurchasedAddons(currentArroba) : [];

    let total = basePrice;
    let addonsHtml = '';

    const addonsList = [
        { slug: 'topbanner',    cardId: 'card-addon-topbanner',   name: 'Anúncio Flutuante', price: parseFloat(settings.bannerPrice || 2.99) },
        { slug: 'emojirain',    cardId: 'card-addon-emojirain',   name: 'Chuva de Emoji',      price: parseFloat(settings.emojiPrice || 2.50) },
        { slug: 'avatarspin',   cardId: 'card-addon-avatarspin',  name: 'Rodopio do Avatar',   price: parseFloat(settings.avatarSpinPrice || 2.50) },
        { slug: 'audioplayer',  cardId: 'card-addon-audioplayer', name: 'Player de Áudio',     price: parseFloat(settings.audioPrice || 2.99) },
        { slug: 'livechat',     cardId: 'card-addon-livechat',     name: 'Balão Online / Chat', price: parseFloat(settings.chatPrice || 2.99) },
        { slug: 'bgdots',       cardId: 'card-addon-bgdots',       name: 'Bolinhas no Background', price: parseFloat(settings.bgdotsPrice || 2.50) },
        { slug: 'matrix',       cardId: 'card-addon-matrix',       name: 'Matrix Code Rain', price: parseFloat(settings.matrixPrice || 3.00) },
        { slug: 'glitch',       cardId: 'card-addon-glitch',       name: 'Cyberpunk Text Glitch', price: parseFloat(settings.glitchPrice || 2.50) },
        { slug: 'aurora',       cardId: 'card-addon-aurora',       name: 'Aurora Boreal Fluida', price: parseFloat(settings.auroraPrice || 3.50) }
    ];

    addonsList.forEach(({ slug, cardId, name, price }) => {
        const card = document.getElementById(cardId);
        if (card && card.style.display !== 'none') {
            const isAlreadyPaid = purchased.includes(slug);
            if (isAlreadyPaid) {
                addonsHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #6e7681; margin-bottom: 4px;">
                    <span style="text-decoration: line-through;">+ ${name}</span>
                    <span style="color: #34d399; font-weight: 700;">✓ Incluso</span>
                </div>`;
            } else {
                total += price;
                addonsHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #94a3b8; margin-bottom: 4px;">
                    <span>+ ${name}</span>
                    <span>R$ ${price.toFixed(2).replace('.', ',')}</span>
                </div>`;
            }
        }
    });

    // Soma taxa de serviço manual se o campo estiver ativo e preenchido
    let serviceFee = 0;
    const feeInput = document.getElementById('cart-service-fee');
    const feeRow = document.getElementById('cart-service-fee-row');
    if (feeInput && feeRow && feeRow.style.display !== 'none') {
        serviceFee = parseFloat(feeInput.value) || 0;
        total += serviceFee;
    }

    listEl.innerHTML = addonsHtml;
    totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getAvatarOuterWrapperEl(activeModel) {
    if (activeModel === 'vitrine')
        return document.getElementById('v-view-avatar-wrapper');
    if (activeModel === 'carousel' || activeModel === 'carrossel')
        return document.getElementById('c-view-avatar-wrapper');
    if (activeModel === 'shop')
        return document.getElementById('s-view-avatar-wrapper');
    if (activeModel === 'ebook')
        return document.getElementById('eb-view-avatar-wrapper');
    return document.getElementById('view-avatar-container'); // Classic
}

function getAvatarImgEl(activeModel) {
    const wrap = getAvatarOuterWrapperEl(activeModel);
    return wrap ? wrap.querySelector('img') : null;
}

// ── Mapa de curvas de aceleração ─────────────────────────────────────────────
function _getEasingCss(easing) {
    if (easing === 'elastic') return 'cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    if (easing === 'spring')  return 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    return 'cubic-bezier(0.0, 0.0, 0.2, 1)'; // easeout (padrão)
}

// ── Aplica animação de ENTRADA no avatar ─────────────────────────────────────
function applyAvatarSpinAnimation(duration, spins, activeModel, axis, easing, entrance) {
    axis     = axis     || 'Y';
    easing   = easing   || 'easeout';
    entrance = entrance || 'spin';

    let styleEl = document.getElementById('pb-avatarspin-style');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'pb-avatarspin-style';
        document.head.appendChild(styleEl);
    }

    const easingCss = _getEasingCss(easing);
    let kfName = '';
    let kfCss  = '';
    let animCss = '';

    if (entrance === 'zoomin') {
        kfName  = 'pb-av-zoomin';
        kfCss   = `@keyframes ${kfName} { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }`;
        animCss = `${kfName} ${duration}s ${easingCss} forwards`;
    } else if (entrance === 'fall') {
        kfName  = 'pb-av-fall';
        kfCss   = `@keyframes ${kfName} { 0% { transform: translateY(-120px); opacity: 0; } 60% { transform: translateY(14px); opacity: 1; } 80% { transform: translateY(-8px); } 100% { transform: translateY(0); opacity: 1; } }`;
        animCss = `${kfName} ${duration}s ${easingCss} forwards`;
    } else if (entrance === 'fadespin') {
        const totalDeg = spins * 360;
        kfName  = `pb-av-fadespin-${totalDeg}${axis}`;
        kfCss   = `@keyframes ${kfName} { from { transform: rotate${axis}(0deg); opacity: 0; } to { transform: rotate${axis}(${totalDeg}deg); opacity: 1; } }`;
        animCss = `${kfName} ${duration}s ${easingCss} forwards`;
    } else {
        // spin (padrão)
        const totalDeg = spins * 360;
        kfName  = `pb-av-spin-${totalDeg}${axis}`;
        kfCss   = `@keyframes ${kfName} { from { transform: rotate${axis}(0deg); } to { transform: rotate${axis}(${totalDeg}deg); } }`;
        animCss = `${kfName} ${duration}s ${easingCss} forwards`;
    }

    styleEl.textContent = kfCss;

    const wrapperEl = getAvatarOuterWrapperEl(activeModel);
    if (!wrapperEl) return;

    const parentEl = wrapperEl.parentElement;
    if (parentEl) {
        parentEl.style.perspective = '600px';
        parentEl.style.overflow = 'visible';
    }

    wrapperEl.style.borderRadius = '50%';
    wrapperEl.style.animation = 'none';
    void wrapperEl.offsetHeight;
    wrapperEl.style.animation = animCss;
}

// ── Remove animação de entrada ────────────────────────────────────────────────
function removeAvatarSpinAnimation() {
    const models = ['classic', 'vitrine', 'carousel', 'carrossel', 'shop', 'ebook'];
    models.forEach(m => {
        const wrapperEl = getAvatarOuterWrapperEl(m);
        if (wrapperEl) {
            wrapperEl.style.animation = '';
            const parentEl = wrapperEl.parentElement;
            if (parentEl) {
                parentEl.style.perspective = '';
                parentEl.style.overflow = '';
            }
        }
    });
}

// ── Aplica efeitos CONTÍNUOS no wrapper do avatar ────────────────────────────
function applyAvatarContinuousEffects(config, activeModel) {
    // config = { float, pulse, glow, glowColor, border, borderColor }
    let styleEl = document.getElementById('pb-avatar-continuous-style');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'pb-avatar-continuous-style';
        document.head.appendChild(styleEl);
    }

    let kfCss = '';
    const wrapperEl = getAvatarOuterWrapperEl(activeModel);
    if (!wrapperEl) return;
    const wrapId = wrapperEl.id;

    // keyframes
    kfCss += `@keyframes pb-av-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }`;
    kfCss += `@keyframes pb-av-pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }`;
    kfCss += `@keyframes pb-av-glow   { 0%,100%{box-shadow:0 0 10px 4px ${config.glowColor||'#f59e0b'}88} 50%{box-shadow:0 0 26px 10px ${config.glowColor||'#f59e0b'}cc} }`;
    kfCss += `@keyframes pb-av-border { 0%{--border-angle:0turn} 100%{--border-angle:1turn} }`;

    let anims = [];
    if (config.float)  anims.push('pb-av-float  3.2s ease-in-out infinite');
    if (config.pulse)  anims.push('pb-av-pulse  1.6s ease-in-out infinite');
    if (config.glow)   anims.push('pb-av-glow   2.0s ease-in-out infinite');

    // borda giratória usa ::before pseudo-element via wrapper
    let borderCss = '';
    if (config.border) {
        const bc = config.borderColor || '#a855f7';
        borderCss = `
            #${wrapId} {
                position: relative !important;
                isolation: isolate !important;
                background: transparent !important;
                border-color: transparent !important;
                box-shadow: none !important;
            }
            #${wrapId}::before {
                content: '';
                position: absolute;
                inset: 0px;
                border-radius: 50%;
                background: conic-gradient(from var(--border-angle, 0turn), ${bc}, #ffffff44, ${bc});
                animation: pb-av-border 2s linear infinite;
                z-index: -1;
            }
            @property --border-angle {
                syntax: '<angle>';
                initial-value: 0turn;
                inherits: false;
            }
        `;
    }

    const animVal = anims.length ? anims.join(', ') : 'none';

    kfCss += `#${wrapId} { ${anims.length ? 'animation: ' + animVal + ';' : ''} }`;
    kfCss += borderCss;

    styleEl.textContent = kfCss;
}

// ── Remove efeitos contínuos ─────────────────────────────────────────────────
function removeAvatarContinuousEffects() {
    const styleEl = document.getElementById('pb-avatar-continuous-style');
    if (styleEl) styleEl.textContent = '';
    const models = ['classic', 'vitrine', 'carousel', 'carrossel', 'shop', 'ebook'];
    models.forEach(m => {
        const wrapperEl = getAvatarOuterWrapperEl(m);
        if (wrapperEl) {
            wrapperEl.style.animation = '';
            wrapperEl.style.background = '';
            wrapperEl.style.borderColor = '';
            wrapperEl.style.boxShadow = '';
        }
    });
}

// ── Setup de gatilho de clique/hover no avatar do preview ───────────────────
function setupAvatarTrigger(trigger, duration, spins, activeModel, axis, easing, entrance) {
    const wrapperEl = getAvatarOuterWrapperEl(activeModel);
    if (!wrapperEl) return;

    if (wrapperEl._pbClickHandler) wrapperEl.removeEventListener('click', wrapperEl._pbClickHandler);
    if (wrapperEl._pbMouseoverHandler) wrapperEl.removeEventListener('mouseover', wrapperEl._pbMouseoverHandler);

    if (trigger === 'click') {
        wrapperEl._pbClickHandler = () => applyAvatarSpinAnimation(duration, spins, activeModel, axis, easing, entrance);
        wrapperEl.addEventListener('click', wrapperEl._pbClickHandler);
        wrapperEl.style.cursor = 'pointer';
    } else if (trigger === 'hover') {
        wrapperEl._pbMouseoverHandler = () => applyAvatarSpinAnimation(duration, spins, activeModel, axis, easing, entrance);
        wrapperEl.addEventListener('mouseover', wrapperEl._pbMouseoverHandler);
        wrapperEl.style.cursor = 'pointer';
    } else {
        wrapperEl.style.cursor = '';
    }
}

// ── Botão "Testar Agora" ─────────────────────────────────────────────────────
function triggerAvatarSpinPreview() {
    const activeModel = window.currentActiveModel || 'classic';
    const duration  = parseFloat(document.getElementById('input-addon-as-duration')?.value || '3');
    const spins     = parseInt(document.getElementById('input-addon-as-spins')?.value || '4', 10);
    const axis      = document.getElementById('input-addon-as-axis')?.value     || 'Y';
    const easing    = document.getElementById('input-addon-as-easing')?.value   || 'easeout';
    const entrance  = document.getElementById('input-addon-as-entrance')?.value || 'spin';
    applyAvatarSpinAnimation(duration, spins, activeModel, axis, easing, entrance);
    window.phoneAsConfigKey = null;
}

function tryAutoplay() {
                            var promise = audio.play();
                            if (promise !== undefined) {
                                promise.then(function() {
                                    updateUI(true);
                                }).catch(function() {
                                    // Se o navegador bloqueou o som sem toque, toca no primeiro clique/toque em qualquer parte do site
                                    updateUI(false);
                                    function playOnFirstInteraction() {
                                        if (audio.paused) {
                                            audio.play().then(function() { updateUI(true); }).catch(function(){});
                                        }
                                        window.removeEventListener('pointerdown', playOnFirstInteraction);
                                        window.removeEventListener('touchstart', playOnFirstInteraction);
                                        window.removeEventListener('click', playOnFirstInteraction);
                                    }
                                    window.addEventListener('pointerdown', playOnFirstInteraction, { once: true });
                                    window.addEventListener('touchstart', playOnFirstInteraction, { once: true });
                                    window.addEventListener('click', playOnFirstInteraction, { once: true });
                                });
                            }
                        }

function playOnFirstInteraction() {
                                        if (audio.paused) {
                                            audio.play().then(function() { updateUI(true); }).catch(function(){});
                                        }
                                        window.removeEventListener('pointerdown', playOnFirstInteraction);
                                        window.removeEventListener('touchstart', playOnFirstInteraction);
                                        window.removeEventListener('click', playOnFirstInteraction);
                                    }

