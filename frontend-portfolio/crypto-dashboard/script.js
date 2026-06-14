// === DARK / LIGHT MODE ===
const modeToggle = document.getElementById("modeToggle");
modeToggle.onclick = () => {
    document.body.classList.toggle("light");
    modeToggle.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";
};

// === LIVE CRYPTO DATA ===
async function loadCryptoData() {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
    const data = await fetch(url).then(res => res.json());

    // CARDS
    const statsContainer = document.getElementById("statsCards");
    statsContainer.innerHTML = data.slice(0, 4).map(coin => `
        <div class="card">
            <h3>${coin.name}</h3>
            <p class="price">$${coin.current_price.toLocaleString()}</p>
            <span class="${coin.price_change_percentage_24h >= 0 ? "green" : "red"}">
                ${coin.price_change_percentage_24h.toFixed(2)}%
            </span>
        </div>
    `).join("");

    // TABLE
    const table = document.getElementById("marketTable");
    data.slice(0, 10).forEach(coin => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${coin.name} (${coin.symbol.toUpperCase()})</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td class="${coin.price_change_percentage_24h >= 0 ? "green" : "red"}">
                ${coin.price_change_percentage_24h.toFixed(2)}%
            </td>
            <td>$${coin.market_cap.toLocaleString()}</td>
        `;
        table.appendChild(row);
    });

    // CHART DATA FOR BTC
    loadBTCChart();
}

// === BITCOIN CHART ===
async function loadBTCChart() {
    const url = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1";
    const data = await fetch(url).then(res => res.json());
    const prices = data.prices.map(p => p[1]);

    new Chart(document.getElementById("btcChart"), {
        type: "line",
        data: {
            labels: Array(prices.length).fill(""),
            datasets: [{
                data: prices,
                borderColor: "#4c8fff",
                tension: 0.2
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}

// === NEWS SECTION ===
async function loadNews() {
    const url = "https://api.coingecko.com/api/v3/news";
    const newsData = await fetch(url).then(res => res.json());

    const container = document.getElementById("newsFeed");
    container.innerHTML = newsData.data.slice(0, 4).map(news => `
        <div class="news-card">
            <h3>${news.title}</h3>
            <p>${news.description.substring(0, 100)}...</p>
        </div>
    `).join("");
}

// Load everything
loadCryptoData();
loadNews();
