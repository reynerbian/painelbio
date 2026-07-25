// ===============================================================================
// PAINELBIO - MÓDULO DE INTERFACE E UI (UI.JS)
// ===============================================================================

// 1. SISTEMA DE GAVETAS (DRAWERS)
function openDrawer(drawer) {
    if (!drawer) return;
    drawer.classList.add('active');
    const overlay = document.getElementById('drawer-overlay');
    if (overlay) overlay.classList.add('active');
}

function closeAll() {
    const leftDrawer = document.getElementById('left-drawer');
    const rightDrawer = document.getElementById('right-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (leftDrawer) leftDrawer.classList.remove('active');
    if (rightDrawer) rightDrawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// 2. PRESETS DE DEGRADÊS E CORES DO TEMA
const GRADIENT_PRESETS = {
    'gray': { color1: '#e2e8f0', color2: '#475569', border: 'rgba(226, 232, 240, 0.28)', glow: 'rgba(71, 85, 105, 0.45)' },
    'sunset': { color1: '#ff0844', color2: '#ffb199', border: 'rgba(255, 8, 68, 0.35)', glow: 'rgba(255, 177, 153, 0.55)' },
    'neon-blue': { color1: '#00c6ff', color2: '#0072ff', border: 'rgba(0, 198, 255, 0.35)', glow: 'rgba(0, 114, 255, 0.55)' },
    'synthwave': { color1: '#f107a3', color2: '#7b2ff7', border: 'rgba(241, 7, 163, 0.35)', glow: 'rgba(123, 47, 247, 0.55)' },
    'fire': { color1: '#f857a6', color2: '#ff5858', border: 'rgba(248, 87, 166, 0.35)', glow: 'rgba(255, 88, 88, 0.55)' },
    'aurora': { color1: '#00ff87', color2: '#60e3fa', border: 'rgba(0, 255, 135, 0.35)', glow: 'rgba(96, 227, 250, 0.55)' },
    'indigo': { color1: '#4f46e5', color2: '#06b6d4', border: 'rgba(79, 70, 229, 0.35)', glow: 'rgba(6, 182, 212, 0.55)' },
    'cyber-lime': { color1: '#a8ff78', color2: '#78ffd6', border: 'rgba(168, 255, 120, 0.35)', glow: 'rgba(120, 255, 214, 0.55)' },
    'rose-gold': { color1: '#f6d365', color2: '#fda085', border: 'rgba(246, 211, 101, 0.35)', glow: 'rgba(253, 160, 133, 0.55)' },
    'golden': { color1: '#f5af19', color2: '#f12711', border: 'rgba(245, 175, 25, 0.35)', glow: 'rgba(241, 39, 17, 0.55)' },
    'deep-purple': { color1: '#8a2387', color2: '#e94057', border: 'rgba(138, 35, 135, 0.35)', glow: 'rgba(233, 64, 87, 0.55)' },
    'platinum': { color1: '#ffffff', color2: '#616161', border: 'rgba(255, 255, 255, 0.35)', glow: 'rgba(97, 97, 97, 0.45)' }
};

function applyThemePreset(presetName) {
    const preset = GRADIENT_PRESETS[presetName] || GRADIENT_PRESETS['gray'];
    
    document.documentElement.style.setProperty('--theme-color-1', preset.color1);
    document.documentElement.style.setProperty('--theme-color-2', preset.color2);
    document.documentElement.style.setProperty('--theme-border', preset.border);
    document.documentElement.style.setProperty('--theme-glow', preset.glow);
    
    localStorage.setItem('selected-theme-preset', presetName);

    const optionToSelect = document.querySelector(`.color-option[data-preset="${presetName}"]`);
    if (optionToSelect) {
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('is-selected'));
        optionToSelect.classList.add('is-selected');
    }

    if (typeof updatePreviewFromForm === 'function') {
        updatePreviewFromForm();
    }
}

function toggleColorPicker() {
    const colorBalloon = document.getElementById('color-balloon');
    if (colorBalloon) {
        const isActive = colorBalloon.classList.contains('active');
        if (isActive) {
            closeColorPicker();
        } else {
            openColorPicker();
        }
    }
}

function openColorPicker() {
    const colorBalloon = document.getElementById('color-balloon');
    if (colorBalloon) colorBalloon.classList.add('active');
}

function closeColorPicker() {
    const colorBalloon = document.getElementById('color-balloon');
    if (colorBalloon) {
        colorBalloon.classList.remove('active');
        colorBalloon.classList.remove('low-opacity');
    }
}

// 3. SISTEMA DE TOASTS E ALERTAS CUSTOMIZADOS
function showCustomAlert(message, type = 'error') {
    let container = document.getElementById('custom-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'custom-toast-container';
        container.className = 'custom-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'error') icon = '⚠️';
    else if (type === 'success') icon = '✅';

    toast.innerHTML = `
        <div class="custom-toast-icon">${icon}</div>
        <div class="custom-toast-message">${message}</div>
    `;

    container.appendChild(toast);
    toast.offsetHeight; // Reflow
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}

// 4. SISTEMA DE LOGS DE SCRAPER (SININHO)
function addScraperLog(message, type = 'info') {
    const scraperNotificationList = document.getElementById('scraper-notification-list');
    if (!scraperNotificationList) return;
    const time = new Date().toLocaleTimeString('pt-BR');
    const item = document.createElement('div');
    item.className = `notification-item ${type}`;
    item.innerHTML = `
        <div>${message}</div>
        <div class="notification-item-time">${time}</div>
    `;
    
    const placeholder = scraperNotificationList.querySelector('p');
    if (placeholder && placeholder.textContent.includes('Nenhuma busca')) {
        scraperNotificationList.innerHTML = '';
    }
    
    scraperNotificationList.appendChild(item);
    scraperNotificationList.scrollTop = scraperNotificationList.scrollHeight;
}

// 5. SCREEN WAKE LOCK API
let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock ativado com sucesso! Tela travada acesa.');
        }
    } catch (err) {
        console.warn('Erro ao solicitar Wake Lock:', err.message);
    }
}

// Reativa Wake Lock ao mudar visibilidade
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
        requestWakeLock();
    }
});

// Tenta ativar ao carregar o script
requestWakeLock();
