
const PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "NZD/USD", "USD/CAD", "EUR/USD OTC", "GBP/USD OTC", "USD/JPY OTC", "AUD/USD OTC", "NZD/USD OTC"];

const search = document.getElementById("pair-search");
const list = document.getElementById("pair-list");
const chartBox = document.getElementById("chart");

function refreshList(filter="") {
    list.innerHTML = "";
    PAIRS.filter(p => p.toLowerCase().includes(filter.toLowerCase()))
         .forEach(p => {
            const o = document.createElement("option");
            o.value = p;
            o.textContent = p;
            list.appendChild(o);
         });
}

refreshList();

search.addEventListener("input", () => {
    refreshList(search.value);
});

let chart = null;
let candleSeries = null;

function drawChart(pair) {
    chartBox.innerHTML = "";

    chart = LightweightCharts.createChart(chartBox, {
        layout: {
            background: { color: '#000' },
            textColor: '#000' 
        },
        grid: {
            vertLines: { visible: false },
            horzLines: { visible: false }
        },
        width: chartBox.clientWidth,
        height: 240,
        timeScale: {
            visible: false
        },
        rightPriceScale: {
            visible: false
        }
    });

    candleSeries = chart.addCandlestickSeries();

    // Generate mock data
    const now = Math.floor(Date.now()/1000);
    let data = [];
    let price = 1;

    for(let i=120;i>0;i--) {
        let o = price + (Math.random()-0.5)*0.01;
        let c = o + (Math.random()-0.5)*0.01;
        let h = Math.max(o,c) + 0.005;
        let l = Math.min(o,c) - 0.005;
        data.push({ time: now - i*60, open:o, high:h, low:l, close:c });
        price = c;
    }

    candleSeries.setData(data);
}

list.addEventListener("change", () => {
    drawChart(list.value);
});

document.getElementById("calc-btn").addEventListener("click", () => {
    const bal = parseFloat(document.getElementById("balance").value || 0);
    const out = bal > 0 ? (bal/11).toFixed(2) : "—";
    document.getElementById("stake").textContent = "Ставка: " + out;
});
