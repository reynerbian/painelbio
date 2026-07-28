// --- ADDONS MODULE ---

function updateAddonFields() {
                        if (containerPause) containerPause.style.display = (['slide', 'bounce', 'flip', 'shutter'].includes(effectSelect.value)) ? 'block' : 'none';
                        if (containerMarquee) containerMarquee.style.display = (effectSelect.value === 'marquee') ? 'block' : 'none';
                    }

function updateAddonCatalogButtonStates() {
            const addons = [
                { btnId: 'btn-enable-topbanner-addon', cardId: 'card-addon-topbanner' },
                { btnId: 'btn-enable-emojirain-addon', cardId: 'card-addon-emojirain' },
                { btnId: 'btn-enable-avatarspin-addon', cardId: 'card-addon-avatarspin' },
                { btnId: 'btn-enable-audioplayer-addon', cardId: 'card-addon-audioplayer' },
                { btnId: 'btn-enable-livechat-addon', cardId: 'card-addon-livechat' }
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

    let basePrice = 9.99;
    let modelName = 'Modelo Classic';
    
    const activeModelBadge = document.querySelector('.template-card.is-selected');
    if (activeModelBadge) {
        const template = activeModelBadge.getAttribute('data-template');
        if (template === 'classic') { basePrice = 9.99; modelName = 'Modelo Classic'; }
        if (template === 'vitrine') { basePrice = 12.99; modelName = 'Modelo Vitrine'; }
        if (template === 'carrossel') { basePrice = 14.99; modelName = 'Modelo Carrossel'; }
        if (template === 'shop') { basePrice = 19.99; modelName = 'Modelo Shop'; }
    }
    
    modelNameEl.textContent = modelName;
    modelPriceEl.textContent = `R$ ${basePrice.toFixed(2).replace('.', ',')}`;

    let total = basePrice;
    let addonsHtml = '';

    const addonsList = [
        { cardId: 'card-addon-topbanner', name: 'Anúncio Flutuante', price: 2.99 },
        { cardId: 'card-addon-emojirain', name: 'Chuva de Emoji', price: 2.50 },
        { cardId: 'card-addon-avatarspin', name: 'Rodopio do Avatar', price: 2.50 },
        { cardId: 'card-addon-audioplayer', name: 'Player de Áudio', price: 2.99 },
        { cardId: 'card-addon-livechat', name: 'Balão Online', price: 2.99 }
    ];

    addonsList.forEach(({ cardId, name, price }) => {
        const card = document.getElementById(cardId);
        if (card && card.style.display !== 'none') {
            total += price;
            addonsHtml += `<div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #94a3b8; margin-bottom: 4px;">
                <span>+ ${name}</span>
                <span>R$ ${price.toFixed(2).replace('.', ',')}</span>
            </div>`;
        }
    });

    listEl.innerHTML = addonsHtml;
    totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function applyAvatarSpinAnimation(duration, spins, activeModel) {
    const totalDeg = spins * 360;
    const kfName = `pb-spin-${totalDeg}`;

    // Gera keyframes SOMENTE com from e to.
    // O cubic-bezier faz toda a desaceleração numa curva única e contínua,
    // sem nenhuma "quebra" de velocidade no meio da animação.
    let styleEl = document.getElementById('pb-avatarspin-style');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'pb-avatarspin-style';
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
        @keyframes ${kfName} {
            from { transform: rotateY(0deg); }
            to   { transform: rotateY(${totalDeg}deg); }
        }
    `;

    const imgEl = getAvatarImgEl(activeModel);
    if (!imgEl) return;

    // Perspective no PAI direto da imagem para o efeito 3D funcionar
    const parentEl = imgEl.parentElement;
    if (parentEl) {
        parentEl.style.perspective = '500px';
        parentEl.style.overflow = 'visible';
    }

    imgEl.style.borderRadius = '50%';
    imgEl.style.display = 'block';
    imgEl.style.animation = 'none';
    void imgEl.offsetHeight; // reflow: garante que o browser reseta a animação
    // cubic-bezier(0.0, 0.0, 0.2, 1) = ease-out forte:
    // começa na velocidade máxima e desacelera progressivamente até parar.
    imgEl.style.animation = `${kfName} ${duration}s cubic-bezier(0.0, 0.0, 0.2, 1) forwards`;
}

function removeAvatarSpinAnimation() {
    const models = ['classic', 'vitrine'];
    models.forEach(m => {
        const imgEl = getAvatarImgEl(m);
        if (imgEl) {
            imgEl.style.animation = '';
            const parentEl = imgEl.parentElement;
            if (parentEl) {
                parentEl.style.perspective = '';
                parentEl.style.overflow = '';
            }
        }
    });
}

function triggerAvatarSpinPreview() {
    const activeModel = window.currentActiveModel || 'classic';
    const duration = parseFloat(document.getElementById('input-addon-as-duration')?.value || '3');
    const spins    = parseInt(document.getElementById('input-addon-as-spins')?.value || '4', 10);
    applyAvatarSpinAnimation(duration, spins, activeModel);
    window.phoneAsConfigKey = null; // reseta para próxima mudança de config
}

function getAvatarImgEl(activeModel) {
    if (activeModel === 'vitrine') {
        // Vitrine: v-view-avatar-inner > img
        return document.querySelector('#v-view-avatar-inner img') || document.getElementById('v-view-avatar-inner');
    }
    // Classic: view-avatar-inner > img
    return document.querySelector('#view-avatar-inner img') || document.getElementById('view-avatar-inner');
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

