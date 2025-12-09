// app.js - Candlestick chart using Lightweight Charts + TwelveData quote polling and aggregation
// IMPORTANT: Replace API_KEY with your TwelveData API key before deploying (or proxy via serverless).
const API_KEY = "e0c4b5721837476ca345e6cdba568a72";

const pairs = [
  'EUR/USD','USD/JPY','GBP/USD','USD/CHF','USD/CAD','AUD/USD','NZD/USD',
  'EUR/GBP','EUR/JPY','GBP/JPY','AUD/JPY','CHF/JPY','USD/SGD','USD/HKD','USD/TRY',
  'EUR/AUD','CAD/JPY','NZD/JPY','AUD/NZD','EUR/CAD','GBP/CAD','AUD/CAD','NZD/CAD',
  'GBP/AUD','EUR/CHF','GBP/CHF','AUD/CHF','NZD/CHF','EUR/NZD','GBP/NZD',
  'USD/ZAR','USD/MXN','USD/PLN','USD/DKK','USD/NOK','USD/SEK'
];

// timeframe mapping: label -> seconds
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

let chart = null;
let candleSeries = null;
let pollTimer = null;
let aggregation = null; // for sub-minute candle building
let lastHistoryUnix = 0;

// DOM
const pairSelect = document.getElementById('pair');
const timeframeRow = document.getElementById('timeframe-row');
const analyzeBtn = document.getElementById('analyze');
const resultText = document.getElementById('result');

function populatePairs(){
  pairSelect.innerHTML = '';
  const main = pairs.slice(0,7);
  const other = pairs.slice(7);
  const ogMain = document.createElement('optgroup'); ogMain.label = 'Main Pairs';
  main.forEach(p=>{ const o=document.createElement('option'); o.value=p; o.textContent=p; if(p===currentPair) o.selected=true; ogMain.appendChild(o); });
  pairSelect.appendChild(ogMain);
  const ogOther = document.createElement('optgroup'); ogOther.label='Other Pairs';
  other.forEach(p=>{ const o=document.createElement('option'); o.value=p; o.textContent=p; if(p===currentPair) o.selected=true; ogOther.appendChild(o); });
  pairSelect.appendChild(ogOther);
}

function createTimeButtons(){
  timeframeRow.innerHTML='';
  Object.keys(timeframeMap).forEach(tf=>{
    const b=document.createElement('button');
    b.className='time-btn' + (tf===currentTF ? ' active' : '');
    b.textContent=tf;
    b.dataset.tf=tf;
    b.addEventListener('click', ()=>{
      if(currentTF===tf) return;
      currentTF=tf;
      localStorage.setItem('timeframe', currentTF);
      document.querySelectorAll('.time-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      restartStream();
    });
    timeframeRow.appendChild(b);
  });
}

function createChart(){
  const container = document.getElementById('chart');
  container.innerHTML='';
  chart = LightweightCharts.createChart(container, {
    width: container.clientWidth,
    height: container.clientHeight || 420,
    layout: { backgroundColor: '#0b0c0e', textColor: '#9aa6bb' },
    grid: { vertLines: { color: 'rgba(255,255,255,0.02)' }, horzLines: { color: 'rgba(255,255,255,0.02)' } },
    rightPriceScale: { borderColor: 'rgba(255,255,255,0.03)' },
    timeScale: { borderColor: 'rgba(255,255,255,0.03)', timeVisible: true, secondsVisible: true }
  });
  candleSeries = chart.addCandlestickSeries({
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderDownColor: '#ef5350',
    borderUpColor: '#26a69a',
    wickDownColor: '#ef5350',
    wickUpColor: '#26a69a'
  });

  window.addEventListener('resize', ()=>{ chart.applyOptions({ width: container.clientWidth }); });
}

// Helper: convert TwelveData datetime to unix seconds
function tdToUnix(dt){
  if(!dt) return Math.floor(Date.now()/1000);
  const iso = dt.replace(' ', 'T') + 'Z';
  const ms = Date.parse(iso);
  if(isNaN(ms)) return Math.floor(Date.now()/1000);
  return Math.floor(ms/1000);
}

// Load history candles from TwelveData. Use interval 1min for base (TwelveData free).
async function loadHistory(symbol, interval='1min', outputsize=200){
  try{
    const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${interval}&outputsize=${outputsize}&format=json&apikey=${API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    if(data.status === 'error'){ console.error('TD error', data); return []; }
    const vals = data.values || [];
    const points = vals.slice().reverse().map(v=>({
      time: tdToUnix(v.datetime||v.timestamp),
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close)
    }));
    return points;
  }catch(e){ console.error('loadHistory', e); return []; }
}

// Fetch quote (current price)
async function fetchQuote(symbol){
  try{
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
    const r = await fetch(url);
    const d = await r.json();
    if(d.status === 'error'){ console.error('quote err', d); return null; }
    const price = parseFloat(d.price || d.close || d.ask || d.bid);
    const ts = d.timestamp ? Number(d.timestamp) : Math.floor(Date.now()/1000);
    if(isNaN(price)) return null;
    return { time: ts, price };
  }catch(e){ console.error('fetchQuote', e); return null; }
}

// Aggregation: for sub-minute candles (e.g., 5s) we build candles from quotes
function startAggregation(intervalSec, initialLastTime){
  aggregation = {
    intervalSec,
    current: null,
    lastBucketUnix: initialLastTime - (initialLastTime % intervalSec)
  };
}

// process incoming quote into aggregation, and when a bucket completes, push candle
function processQuoteToAggregation(q){
  if(!aggregation) return null;
  const bucket = Math.floor(q.time / aggregation.intervalSec) * aggregation.intervalSec;
  if(aggregation.current && bucket === aggregation.current.time) {
    // update current candle
    aggregation.current.high = Math.max(aggregation.current.high, q.price);
    aggregation.current.low = Math.min(aggregation.current.low, q.price);
    aggregation.current.close = q.price;
    return null;
  }
  // new bucket => finalize previous and start new
  const finished = aggregation.current ? { ...aggregation.current } : null;
  aggregation.current = {
    time: bucket,
    open: q.price,
    high: q.price,
    low: q.price,
    close: q.price
  };
  return finished;
}

// Start polling: load history (1min) then start quote polling and aggregation for chosen timeframe
async function startPolling(){
  stopPolling();
  resultText.textContent = '';
  // load base history (use 1min) to provide context
  const hist = await loadHistory(currentPair, '1min', 200);
  if(hist.length){
    candleSeries.setData(hist);
    lastHistoryUnix = hist[hist.length-1].time;
  } else {
    candleSeries.setData([]);
    lastHistoryUnix = Math.floor(Date.now()/1000);
  }

  // prepare aggregation for TF that is sub-minute
  const intervalSec = timeframeMap[currentTF] || 5;
  startAggregation(intervalSec, lastHistoryUnix);

  // immediate quote fetch & maybe produce first aggregated candle
  const q0 = await fetchQuote(currentPair);
  if(q0){
    const finished = processQuoteToAggregation(q0);
    if(finished) candleSeries.update(finished);
    candleSeries.update(aggregation.current);
  }

  // polling
  const pollInterval = Math.max(1, intervalSec); // poll every intervalSec seconds
  pollTimer = setInterval(async ()=>{
    const q = await fetchQuote(currentPair);
    if(!q) return;
    const finished = processQuoteToAggregation(q);
    if(finished) candleSeries.update(finished);
    candleSeries.update(aggregation.current);
    // occasionally refresh 1min history to avoid drift (every 60 ticks)
  }, pollInterval * 1000);
}

// stop polling
function stopPolling(){
  if(pollTimer){ clearInterval(pollTimer); pollTimer=null; }
}

// restart
function restartStream(){ stopPolling(); startPolling(); }

// UI events
pairSelect.addEventListener('change', ()=>{
  currentPair = pairSelect.value;
  localStorage.setItem('pair', currentPair);
  restartStream();
});

analyzeBtn.addEventListener('click', async ()=>{
  analyzeBtn.disabled = true; analyzeBtn.textContent='Analyzing...';
  const q = await fetchQuote(currentPair);
  if(q){ resultText.textContent = `${currentPair} ${q.price.toFixed(5)}`; resultText.style.color = '#bfe9d7'; }
  else { resultText.textContent = 'No data'; resultText.style.color = '#f87171'; }
  analyzeBtn.textContent='Analyze'; analyzeBtn.disabled=false;
});

// init
function init(){
  populatePairs();
  createTimeButtons();
  createChart();
  startPolling();
}

init();