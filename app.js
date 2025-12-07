document.addEventListener('DOMContentLoaded', function() {
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
    pairSearch: document.getElementById('pair-search'),
    chartWrap: document.getElementById('chart-wrap'),
    balanceInput: document.getElementById('balance-input'),
    calcBtn: document.getElementById('calc-btn'),
    stakeOutput: document.getElementById('stake-output'),
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
    populatePairs();
}

const allPairs = [
    // Major forex pairs
    'EUR/USD','USD/JPY','GBP/USD','USD/CHF','USD/CAD','AUD/USD','NZD/USD',
    // Common crosses and exotics
    'EUR/GBP','EUR/JPY','GBP/JPY','AUD/JPY','CHF/JPY','USD/SGD','USD/HKD','USD/TRY',
    'EUR/AUD','CAD/JPY','NZD/JPY','AUD/NZD','EUR/CAD','GBP/CAD','AUD/CAD','NZD/CAD',
    'GBP/AUD','EUR/CHF','GBP/CHF','AUD/CHF','NZD/CHF','EUR/NZD','GBP/NZD',
    'USD/ZAR','USD/MXN','USD/PLN','USD/DKK','USD/NOK','USD/SEK','EUR/PLN','EUR/TRY','EUR/SEK',
    'GBP/SEK','AUD/SGD','CAD/CHF','CHF/PLN','NZD/CHF',
    // Pocket Option OTC and branded names (common)
    'EUR/USD OTC','GBP/USD OTC','USD/JPY OTC','AUD/USD OTC','USD/CAD OTC','USD/CHF OTC',
    'NZD/USD OTC','GBP/JPY OTC','EUR/JPY OTC',
    // Crypto and CFDs (popular)
    'BTC/USD','ETH/USD','XAU/USD','XAG/USD'
];

function populatePairs(filter='') {
    if (!els.pairSelect) return;
    const analysisOption = (lang === 'ru') ? 'Анализ по фото' : 'Photo analysis';
    let html = `<option value="${analysisOption}">${analysisOption}</option>`;
    // Filter and group
    const filtered = allPairs.filter(p => p.toLowerCase().includes(filter.toLowerCase()));
    let lastGroup = '';
    filtered.forEach(p => {
        html += `<option value="${p}">${p}</option>`;
    });
    els.pairSelect.innerHTML = html;
}

// Search input to filter pair list live
if (els.pairSearch) {
    els.pairSearch.addEventListener('input', (e) => {
        populatePairs(e.target.value);
    });
}

// Show chart: using TradingView widget if available
function showChartForPair(pair, timeframe='1m') {
    if (!els.chartWrap) return;
    // Remove existing widget if any
    els.chartWrap.innerHTML = '';
    const placeholder = document.createElement('div');
    placeholder.id = 'tv_chart_container';
    placeholder.style.width = '100%';
    placeholder.style.height = '100%';
    els.chartWrap.appendChild(placeholder);

    // Map pair to TradingView symbol (basic heuristics)
    // If pair contains space or '/', replace with ''
    let symbol = pair.replace(/\s+/g,'').replace('/','');
    // Prefer FX: prefix for forex pairs, otherwise use BINANCE: for crypto or OANDA for CFDs
    let tvSymbol = 'OANDA:' + symbol;
    if (/BTC|ETH|XAU|XAG/.test(symbol)) {
        tvSymbol = 'BINANCE:' + symbol;
    } else if (pair.toUpperCase().includes('OTC')) {
        // keep OTC as generic FX symbol without OTC suffix for charting
        tvSymbol = 'OANDA:' + symbol.replace('OTC','');
    }

    try {
        new TradingView.widget({
            "container_id": "tv_chart_container",
            "width": "100%",
            "height": "100%",
            "autosize": true,
            "symbol": tvSymbol,
            "interval": "1",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "hide_side_toolbar": false,
            "details": true,
            "hotlist": true,
            "calendar": true,
            "studies": []
        });
    } catch (e) {
        // Fallback: just show text
        els.chartWrap.textContent = pair + ' — chart not available';
    }
}

function showSelectedChart() {
    const pair = (els.pairSelect && els.pairSelect.value) ? els.pairSelect.value : '';
    const cleaned = pair && pair.indexOf(' ')>-1 ? pair.split(' ')[0] : pair;
    if (pair && pair !== ((lang==='ru')? 'Анализ по фото' : 'Photo analysis')) {
        showChartForPair(cleaned);
    } else {
        if (els.chartWrap) els.chartWrap.innerHTML = '<div id="chart-placeholder">Выберите валютную пару или введите в поиск...</div>';
    }
}

function showPreview(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    els.previewImg.src = url;
    els.preview.classList.remove('hidden');
    els.preview.setAttribute('aria-hidden','false');
    els.previewImg.onload = () => { URL.revokeObjectURL(url); };
}

els.cameraBtn.addEventListener('click', () => {
    if (els.photoInput) els.photoInput.click();
});

els.photoInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) showPreview(file);
});

els.removePhoto.addEventListener('click', (e) => {
    e.stopPropagation();
    if (els.photoInput) els.photoInput.value = '';
    if (els.previewImg) els.previewImg.src = '';
    if (els.preview) {
        els.preview.classList.add('hidden');
        els.preview.setAttribute('aria-hidden','true');
    }
});

els.analyzeBtn.addEventListener('click', async () => {
    if (!els.loading || !els.result) return;
    els.loading.classList.remove('hidden');
    els.result.textContent = '';
    els.result.dataset.custom = '';
    els.analyzeBtn.disabled = true;
    els.result.style.color = '';
    try {
        await new Promise(res=>setTimeout(res, 900));
        const pair = (els.pairSelect && els.pairSelect.value) ? els.pairSelect.value : 'EUR/USD';
        const fakeScore = (Math.random()*2-1).toFixed(2);
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
});

// language toggle
if (els.langToggle) {
    els.langToggle.addEventListener('click', () => {
        lang = lang === 'en' ? 'ru' : 'en';
        applyLang();
    });
}

// ripple effect
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
        setTimeout(()=>{ circle.remove(); }, 700);
    });
});

// Init population and language
populatePairs();
applyLang();

// Show chart when pair changes
if (els.pairSelect) {
    els.pairSelect.addEventListener('change', () => {
        showSelectedChart();
    });
}

// Timeframe buttons handling
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
    });
});
updateActiveTime();

// Calculator logic: divides balance by 11
if (els.calcBtn && els.balanceInput && els.stakeOutput) {
    els.calcBtn.addEventListener('click', () => {
        const val = parseFloat(els.balanceInput.value || '0');
        if (isNaN(val) || val <= 0) {
            els.stakeOutput.textContent = 'Stake per trade: —';
            return;
        }
        const stake = val / 11;
        // format: if cents exist show two decimals
        const out = (Math.round(stake*100)/100).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2});
        els.stakeOutput.textContent = 'Stake per trade: ' + out;
    });
}

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(()=>{});
}

// Initial chart placeholder
showSelectedChart();
});