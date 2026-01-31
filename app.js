let currentSort = 'no';

function parseNumber(str) {
  if (!str) return Infinity;
  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? Infinity : num;
}

function sortData(sortKey) {
  const sorted = [...data];

  // 基準（no: 0）は常に最初に
  const base = sorted.find(d => d.no === 0);
  const rest = sorted.filter(d => d.no !== 0);

  rest.sort((a, b) => {
    if (sortKey === 'no') {
      return a.no - b.no;
    } else if (sortKey === 'monthly') {
      return parseNumber(a.monthly) - parseNumber(b.monthly);
    } else if (sortKey === 'toKamiyacho') {
      return parseNumber(a.toKamiyacho) - parseNumber(b.toKamiyacho);
    } else if (sortKey === 'toMeiji') {
      return parseNumber(a.toMeiji) - parseNumber(b.toMeiji);
    } else if (sortKey === 'area') {
      return parseNumber(b.area_size) - parseNumber(a.area_size); // 大きい順
    }
    return 0;
  });

  return base ? [base, ...rest] : rest;
}

function renderList() {
  const list = document.getElementById('list');
  list.innerHTML = '';

  const sortedData = sortData(currentSort);

  sortedData.forEach(d => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <div class="card-header">
        <span class="card-no">${d.no}</span>
        <div class="card-title">
          <div class="card-area">
            ${d.area}
            ${d.comment ? `<span class="card-comment">💬 ${d.comment}</span>` : ''}
          </div>
          ${d.building ? `<div class="card-building">${d.building}</div>` : ''}
        </div>
        <div class="card-price-wrap">
          <span class="card-price">${d.price || '-'}</span>
          ${d.total ? `<span class="card-total">総額${d.total}</span>` : ''}
        </div>
      </div>

      <div class="info-grid">
        ${infoRow("最寄駅", d.station)}
        ${infoRow("徒歩", d.walk)}
        ${infoRow("築年月", d.built, d.built && d.built !== "不明")}
        ${infoRow("リノベ", d.reno, d.reno && d.reno !== "不明")}
        ${infoRow("間取り", d.layout)}
        ${infoRow("面積", d.area_size)}
        ${infoRow("所在階", d.floor)}
        ${infoRow("月額計", d.monthly, d.monthly && d.monthly !== "不明")}
      </div>

      ${d.monthly && d.monthly !== "不明" && d.no !== 0 ? '<div class="monthly-note">※ローン目安＋管理費＋修繕積立金の合計</div>' : ''}

      <div class="access-box">
        <div class="access-title">🚇 アクセス</div>
        ${infoRow("神谷町駅", d.toKamiyacho)}
        ${infoRow("明治神宮前駅", d.toMeiji)}
      </div>

      <div class="check-box">
        ${checkItem("EV", d.elevator)}
        ${checkItem("風呂", d.bath)}
        ${checkItem("非タイル", d.notTile)}
      </div>

      ${d.link ? `<a class="card-link" href="${d.link}" target="_blank" rel="noopener noreferrer">
        🔗 ${d.source === "suumo" ? "SUUMO" : "cowcamo"} で見る →
      </a>` : ''}
    `;

    list.appendChild(card);
  });
}

function checkItem(label, value) {
  if (!value) return `<span class="check-item check-unknown">${label}: -</span>`;
  const cls = value === "OK" ? "check-ok" : value === "NG" ? "check-ng" : "check-unknown";
  return `<span class="check-item ${cls}">${label}: ${value}</span>`;
}

function infoRow(label, value, highlight = false) {
  const displayValue = value || '-';
  const valueClass = !value || value === "不明"
    ? "info-value unknown"
    : highlight
      ? "info-value highlight"
      : "info-value";

  return `
    <div class="info-row">
      <span class="info-label">${label}</span>
      <span class="${valueClass}">${displayValue}</span>
    </div>
  `;
}

// フィルターボタンのイベント
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSort = btn.dataset.sort;
    renderList();
  });
});

renderList();
