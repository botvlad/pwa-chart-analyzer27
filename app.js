// app.js — Lightweight Charts + TwelveData (time_series + quote polling)
// IMPORTANT: Replace API_KEY with your TwelveData API key before deploying.
// For security you can replace the string or configure a serverless function to proxy the key.
const API_KEY = "REPLACE_WITH_YOUR_KEY";

const pairs = [
  'EUR/USD','USD/JPY','GBP/USD','USD/CHF','USD/CAD','AUD/USD','NZD/USD',
  'EUR/GBP','EUR/JPY','GBP/JPY','AUD/JPY','CHF/JPY','USD/SGD','USD/HKD','USD/TRY',
  'EUR/AUD','CAD/JPY','NZD/JPY','AUD/NZD','EUR/CAD','GBP/CAD','AUD/CAD','NZD/CAD',
  'GBP/AUD','EUR/CHF','GBP/CHF','AUD/CHF','NZD/CHF','EUR/NZD','GBP/NZD',
  'USD/ZAR','USD/MXN','USD/PLN','USD/DKK','USD/NOK','USD/SEK'
];

const timeframeMap = {
  '5s': 5,
  '10s': 10,
  '15s': 15,
  '30s': 30,
  '1m': 60,
  '2m': 120,
  '4m': 240,
  '5m': 300,
  '10m': 600,
  '20m': 1200,
  '1h': 3600
};

let currentPair = localStorage.getItem('pair') || 'EUR/USD';
let currentTF = localStorage.getItem('timeframe') || '5s';
let pollTimer = null;
let chart = null;
let series = null;
let lastTimeAdded = 0;

// DOM
const pairSelect = document.getElementById('pair');
const timeframeRow = document.getElementById('timeframe-row');
const resultText = document.getElementById('result');
const analyzeBtn = document.getElementById('analyze');

// Populate select
function populatePairs() {
  const groups = [
    {label: 'Main Pairs', items: pairs.slice(0,7)},
    {label: 'Other Pairs', items: pairs.slice(7)}
  ];
  pairSelect.innerHTML = '';
  groups.forEach(g=>{
    const optgroup = document.createElement('optgroup');
    optgroup.label = g.label;
    g.items.forEach(sym=>{
      const opt = document.createElement('option');
      opt.value = sym;
      opt.textContent = sym;
      if (sym === currentPair) opt.selected = true;
      optgroup.appendChild(opt);
    });
    pairSelect.appendChild(optgroup);
  });
}

// Create timeframe buttons
function createTimeButtons() {
  timeframeRow.innerHTML = '';
  Object.keys(timeframeMap).forEach(tf=>{
    const btn = document.createElement('button');
    btn.className = 'time-btn' + (tf === currentTF ? ' active' : '');
    btn.textContent = tf;
    btn.dataset.tf = tf;
    btn.addEventListener('click', () => {
      if (currentTF === tf) return;
      currentTF = tf;
      localStorage.setItem('timeframe', currentTF);
      document.querySelectorAll('.time-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      restartDataStream();
    });
    timeframeRow.appendChild(btn);
  });
}

// Initialize chart
function createChart() {
  const chartContainer = document.getElementById('chart');
  chartContainer.innerHTML = '';
  chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 300,
    layout: { backgroundColor: '#0f1113', textColor: '#a6b0c3' },
    grid: { vertLines: { color: 'rgba(255,255,255,0.03)' }, horzLines: { color: 'rgba(255,255,255,0.03)' } },
    rightPriceScale: { visible: true, borderColor: 'rgba(255,255,255,0.03)' },
    timeScale: { borderColor: 'rgba(255,255,255,0.03)', timeVisible: true, secondsVisible: true }
  });
  series = chart.addLineSeries({
    color: '#3b82f6',
    lineWidth: 2,
    priceLineVisible: false
  });

  window.addEventListener('resize', () => {
    if (!chart) return;
    chart.applyOptions({ width: chartContainer.clientWidth });
  });
}

function tdDatetimeToUnix(dtStr) {
  const ms = Date.parse(dtStr.replace(' ', 'T') + 'Z');
  if (isNaN(ms)) return Math.floor(Date.now()/1000);
  return Math.floor(ms/1000);
}

async function loadHistory(pair, baseInterval='1min', outputsize=200) {
  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(pair)}&interval=${baseInterval}&outputsize=${outputsize}&format=json&apikey=${API_KEY}`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.status && data.status === 'error') {
      console.error('TwelveData error', data);
      return [];
    }
    const values = data.values || data;
    const points = values
      .slice()
      .reverse()
      .map(v => ({ time: tdDatetimeToUnix(v.datetime || v.timestamp), value: parseFloat(v.close) }));
    return points;
  } catch (e) {
    console.error('loadHistory error', e);
    return [];
  }
}

async function fetchQuote(pair) {
  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(pair)}&apikey=${API_KEY}`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.status && data.status === 'error') {
      console.error('Quote error', data);
      return null;
    }
    const price = parseFloat(data.price || data.close || data.ask || data.bid);
    const ts = data.timestamp ? Number(data.timestamp) : Math.floor(Date.now()/1000);
    if (isNaN(price)) return null;
    return { time: ts, value: price };
  } catch (e) {
    console.error('fetchQuote error', e);
    return null;
  }
}

function appendPoint(p) {
  if (!p) return;
  if (p.time <= lastTimeAdded) {
    series.update(p);
    lastTimeAdded = p.time;
  } else {
    series.update(p);
    lastTimeAdded = p.time;
  }
}

async function startPolling() {
  stopPolling();
  const pollInterval = timeframeMap[currentTF] || 5;
  const baseInterval = '1min';
  const hist = await loadHistory(currentPair, baseInterval, 200);
  if (hist.length) {
    series.setData(hist);
    lastTimeAdded = hist[hist.length-1].time;
  } else {
    series.setData([]);
    lastTimeAdded = 0;
  }

  const q = await fetchQuote(currentPair);
  if (q) appendPoint(q);

  pollTimer = setInterval(async () => {
    const q2 = await fetchQuote(currentPair);
    if (q2) appendPoint(q2);
  }, pollInterval * 1000);
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

function restartDataStream() {
  resultText.textContent = '';
  startPolling();
}

pairSelect.addEventListener('change', () => {
  currentPair = pairSelect.value;
  localStorage.setItem('pair', currentPair);
  restartDataStream();
});

analyzeBtn.addEventListener('click', async () => {
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing...';
  const q = await fetchQuote(currentPair);
  if (q) {
    resultText.textContent = `${currentPair} ${q.value.toFixed(5)}`;
    resultText.style.color = '#bfe9d7';
  } else {
    resultText.textContent = 'No data';
    resultText.style.color = '#f87171';
  }
  analyzeBtn.textContent = 'Analyze';
  analyzeBtn.disabled = false;
});

function init() {
  populatePairs();
  createTimeButtons();
  createChart();
  startPolling();
}

init();
