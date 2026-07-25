// ===============================================================================
// PAINELBIO - MÓDULO DE ADD-ONS VISUAIS (ADDONS.JS)
// ===============================================================================

// 1. ADD-ON: RODOPIO 3D DO AVATAR
function getAvatarImgEl(activeModel) {
    if (activeModel === 'vitrine') {
        return document.querySelector('#v-view-avatar-inner img') || document.getElementById('v-view-avatar-inner');
    }
    return document.querySelector('#view-avatar-inner img') || document.getElementById('view-avatar-inner');
}

function applyAvatarSpinAnimation(duration, spins, activeModel) {
    const totalDeg = spins * 360;
    const kfName = `pb-spin-${totalDeg}`;

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

    const parentEl = imgEl.parentElement;
    if (parentEl) {
        parentEl.style.perspective = '500px';
        parentEl.style.overflow = 'visible';
    }

    imgEl.style.borderRadius = '50%';
    imgEl.style.display = 'block';
    imgEl.style.animation = 'none';
    void imgEl.offsetHeight; // Reflow
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
    const spins = parseInt(document.getElementById('input-addon-as-spins')?.value || '4', 10);
    applyAvatarSpinAnimation(duration, spins, activeModel);
    window.phoneAsConfigKey = null;
}
