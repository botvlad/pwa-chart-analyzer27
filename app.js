
const allPairs = [
 'EUR/USD','GBP/USD','USD/JPY','USD/CHF','USD/CAD','AUD/USD','NZD/USD',
 'EUR/GBP','EUR/JPY','GBP/JPY','AUD/JPY','CHF/JPY','EUR/AUD','EUR/CAD',
 'GBP/CHF','BTC/USD','ETH/USD','XAU/USD','XAG/USD',
 'EUR/USD OTC','GBP/USD OTC','USD/JPY OTC','AUD/USD OTC'
];

const pairList = document.getElementById("pair-list");
const search = document.getElementById("pair-search");

function loadPairs(filter=""){
    pairList.innerHTML="";
    allPairs.filter(p=>p.toLowerCase().includes(filter.toLowerCase())).forEach(p=>{
        const o=document.createElement("option");
        o.value=p; o.textContent=p;
        pairList.appendChild(o);
    });
}
loadPairs();

search.addEventListener("input",e=>loadPairs(e.target.value));

pairList.addEventListener("change",()=>{
    const symbol = pairList.value.replace("/","");
    document.getElementById("chart").innerHTML = "";
    new TradingView.widget({
        "container_id": "chart",
        "autosize": true,
        "symbol": "OANDA:" + symbol,
        "interval": "1",
        "theme": "dark",
        "style": "1",
        "locale": "en"
    });
});

document.getElementById("calc-btn").addEventListener("click",()=>{
    const bal = parseFloat(document.getElementById("balance").value);
    document.getElementById("stake").textContent =
        isNaN(bal) ? "Ставка: —" : "Ставка: " + (bal/11).toFixed(2);
});
