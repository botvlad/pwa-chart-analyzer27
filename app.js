const otc = ["Gold OTC", "Brent Oil OTC", "WTI Crude Oil OTC", "Silver OTC", "Natural Gas OTC", "Platinum spot OTC", "Palladium spot OTC", "NVIDIA OTC", "Apple OTC", "Microsoft OTC", "Tesla OTC", "Facebook Inc OTC", "Amazon OTC", "McDonald's OTC", "Intel OTC", "Pfizer Inc OTC", "Johnson & Johnson OTC", "Citigroup Inc OTC", "ExxonMobil OTC", "FedEx OTC", "Coinbase Global OTC", "BNB OTC", "Solana OTC", "VIX Index OTC", "Palantir Technologies (PLTR) OTC", "GameStop Corp. (GME) OTC", "AMD OTC", "COIN OTC", "Marathon Digital (MARA) OTC", "UAH/USD OTC", "KES/USD OTC", "ZAR/USD OTC", "NGN/USD OTC", "AED/CNY OTC", "BHD/CNY OTC", "USD/THB OTC", "USD/TRY OTC", "USD/ZAR OTC", "USD/MXN OTC", "USD/PLN OTC", "EUR/TRY OTC", "EUR/PLN OTC", "EUR/SEK OTC", "GBP/SEK OTC"];
const normal = ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "USD/CAD", "AUD/USD", "NZD/USD", "EUR/GBP", "EUR/JPY", "GBP/JPY", "AUD/JPY", "CHF/JPY", "EUR/AUD", "EUR/CAD"];


const otcList = document.getElementById('otc-list');
const normalList = document.getElementById('normal-list');
const search = document.getElementById('pair-search');
const chart = document.getElementById('chart');

function populate(listEl, items){
  listEl.innerHTML = '';
  items.forEach(it=>{
    const opt = document.createElement('option');
    opt.value = it; opt.textContent = it;
    listEl.appendChild(opt);
  });
}

populate(otcList, otc);
populate(normalList, normal);

// colorful search: highlight matching part (visual aid)
// when user types, filter both lists
search.addEventListener('input', ()=>{
  const q = search.value.trim().toLowerCase();
  const f1 = otc.filter(i=>i.toLowerCase().includes(q));
  const f2 = normal.filter(i=>i.toLowerCase().includes(q));
  populate(otcList, f1);
  populate(normalList, f2);
  // visually tint search border when active
  search.style.borderColor = q? '#34d399' : '';
});

// function to create a minimal TradingView chart with most UI hidden
function showTV(symbol){
  chart.innerHTML = '';
  const cont = document.createElement('div');
  cont.id = 'tvcontainer'; cont.style.width='100%'; cont.style.height='100%';
  chart.appendChild(cont);

  // choose symbol mapping
  let s = symbol.replace(/\s+/g,'').replace('/','');
  if(/BTC|ETH|BNB|SOL|COIN|GME|PLTR|AMD/i.test(s)) s = 'BINANCE:' + s.replace(/\W/g,'');
  else if(/Gold|Silver|Brent|WTI|NaturalGas|Platinum|Palladium|VIX|Index/i.test(s)) s = 'OANDA:' + s;
  else if(s.toUpperCase().includes('OTC')) s = 'OANDA:' + s.replace(/OTC/gi,'');
  else s = 'OANDA:' + s;

  try{
    new TradingView.widget({
      container_id: 'tvcontainer',
      autosize: true,
      symbol: s,
      interval: '60',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'ru',
      toolbar_bg: '#0b1220',
      hide_side_toolbar: true,
      allow_symbol_change: false,
      withdateranges: false,
      hide_top_toolbar: true,
      save_image: false,
      studies: []
    });
  }catch(e){
    chart.textContent = 'График недоступен для ' + symbol;
  }
}

// show chart when selecting
[otcList, normalList].forEach(el => {
  el.addEventListener('change', ()=>{
    const val = el.value;
    if(!val) return;
    showTV(val);
  });
});

// calculator
document.getElementById('calc-btn').addEventListener('click', ()=>{
  const bal = parseFloat(document.getElementById('balance').value || '0');
  const stake = !isNaN(bal) && bal>0 ? (bal/11) : null;
  document.getElementById('stake').textContent = stake ? 'Ставка: ' + stake.toFixed(2) : 'Ставка: —';
});
