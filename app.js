function renderList() {
  const list = document.getElementById('list');

  data.forEach(d => {
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
          ${d.building !== "不明" ? `<div class="card-building">${d.building}</div>` : ''}
        </div>
        <span class="card-price">${d.price}</span>
      </div>

      <div class="info-grid">
        ${infoRow("最寄駅", d.station)}
        ${infoRow("徒歩", d.walk)}
        ${infoRow("築年月", d.built, d.built !== "不明")}
        ${infoRow("リノベ", d.reno, d.reno !== "不明")}
        ${infoRow("間取り", d.layout)}
        ${infoRow("面積", d.area_size)}
        ${infoRow("所在階", d.floor)}
        ${infoRow("月額計", d.monthly, d.monthly !== "不明")}
      </div>

      ${d.monthly !== "不明" ? '<div class="monthly-note">※ローン目安＋管理費＋修繕積立金の合計</div>' : ''}

      <div class="access-box">
        <div class="access-title">🚇 アクセス</div>
        ${infoRow("神谷町駅", d.toKamiyacho)}
        ${infoRow("明治神宮前駅", d.toMeiji)}
      </div>

      <a class="card-link" href="${d.link}" target="_blank" rel="noopener noreferrer">
        🔗 ${d.source === "suumo" ? "SUUMO" : "cowcamo"} で見る →
      </a>
    `;

    list.appendChild(card);
  });
}

function infoRow(label, value, highlight = false) {
  const valueClass = value === "不明"
    ? "info-value unknown"
    : highlight
      ? "info-value highlight"
      : "info-value";

  return `
    <div class="info-row">
      <span class="info-label">${label}</span>
      <span class="${valueClass}">${value}</span>
    </div>
  `;
}

renderList();
