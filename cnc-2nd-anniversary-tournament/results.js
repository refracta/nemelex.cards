import {scoreAnalysis} from '../goonkemon/score-rules.js';

const speedrunRecords = [
    {
        player: 'Sapher',
        title: 'Archmage',
        combo: 'BaEE',
        score: 67444198,
        turns: 21601,
        runes: 15,
        gems: {ko: '7', en: '7'},
        morgue: 'https://archive.nemelex.cards/morgue/Sapher/morgue-Sapher-20260626-184638.txt'
    },
    {
        player: 'Wong',
        title: 'Flawless',
        combo: 'OpMo',
        score: 51131902,
        turns: 29005,
        runes: 15,
        gems: {ko: '11 (all intact)', en: '11 (all intact)'},
        morgue: 'https://archive.nemelex.cards/morgue/Wong/morgue-Wong-20260624-133254.txt'
    },
    {
        player: 'Tanach',
        title: 'Intangible',
        combo: 'BaMo',
        score: 41660204,
        turns: 36011,
        runes: 15,
        gems: {ko: '11 (온전 10)', en: '11 (10 intact)'},
        morgue: 'https://archive.nemelex.cards/morgue/Tanach/morgue-Tanach-20260619-234000.txt',
        screenshot: 'images/results/speedrun/tanach.png'
    },
    {
        player: 'opking',
        title: 'Flawless',
        combo: 'OpSh',
        score: 39206878,
        turns: 38411,
        runes: 15,
        gems: {ko: '11 (all intact)', en: '11 (all intact)'},
        morgue: 'https://archive.nemelex.cards/morgue/opking/morgue-opking-20260619-054433.txt',
        screenshot: 'images/results/speedrun/opking.png'
    },
    {
        player: 'vayu',
        title: 'Invulnerable',
        combo: 'MiFi',
        score: 17969370,
        turns: 86235,
        runes: 15,
        gems: {ko: '1 (온전 0)', en: '1 (0 intact)'},
        morgue: 'https://archive.nemelex.cards/morgue/vayu/morgue-vayu-20260622-103321.txt',
        screenshot: 'images/results/speedrun/vayu.png'
    },
    {
        player: 'Huckle',
        title: 'Imperceptible',
        combo: 'SpEn',
        score: 11588391,
        turns: 76307,
        runes: 11,
        gems: {ko: '5', en: '5'},
        morgue: 'https://archive.nemelex.cards/morgue/Huckle/morgue-Huckle-20260624-004113.txt'
    },
    {
        player: 'fbynet',
        title: 'Forbidden One',
        combo: 'MuMo',
        score: 1600788,
        turns: 78733,
        runes: 3,
        gems: {ko: '0', en: '0'},
        morgue: 'https://archive.nemelex.cards/morgue/fbynet/morgue-fbynet-20260627-103021.txt'
    }
];

const speedrunRoot = document.getElementById('speedrun-results');
const goonkemonRoot = document.getElementById('goonkemon-results');
const weakestRoot = document.getElementById('weakest-goonkemon');

renderSpeedrun();
installScreenshotDialog();
renderGoonkemon();

function renderSpeedrun() {
    const ranked = [...speedrunRecords].sort((a, b) => b.score - a.score);
    speedrunRoot.innerHTML = ranked.map((record, index) => renderSpeedrunRow(record, index + 1)).join('');
}

function renderSpeedrunRow(record, rank) {
    const screenshot = record.screenshot
        ? `<span class="player-crop" title="${escapeAttribute(record.player)} player tile">
                <img src="${escapeAttribute(record.screenshot)}" alt="" aria-hidden="true">
           </span>`
        : `<span class="player-crop-empty" title="No submitted screenshot" aria-hidden="true">-</span>`;
    const screenshotAction = record.screenshot
        ? `<button class="result-link" type="button" data-screenshot="${escapeAttribute(record.screenshot)}" data-player="${escapeAttribute(record.player)}">
                <span class="ko">제출 이미지</span><span class="en">Screenshot</span>
           </button>`
        : '';

    return `<article class="standing-row speedrun-row rank-${rank}" aria-label="Rank ${rank}: ${escapeAttribute(record.player)}">
        <div class="rank-number">${rank}</div>
        ${screenshot}
        <div class="result-identity">
            <strong>${escapeHtml(record.player)} the ${escapeHtml(record.title)}</strong>
            <span>${escapeHtml(record.combo)}</span>
        </div>
        <dl class="run-metrics">
            <div>
                <dt><span class="ko">턴</span><span class="en">Turns</span></dt>
                <dd>${formatNumber(record.turns)}</dd>
            </div>
            <div>
                <dt><span class="ko">룬</span><span class="en">Runes</span></dt>
                <dd>${record.runes}</dd>
            </div>
            <div>
                <dt><span class="ko">젬</span><span class="en">Gems</span></dt>
                <dd><span class="ko">${escapeHtml(record.gems.ko)}</span><span class="en">${escapeHtml(record.gems.en)}</span></dd>
            </div>
        </dl>
        <div class="result-score">
            ${formatNumber(record.score)}
            <small><span class="ko">최종 점수</span><span class="en">final score</span></small>
        </div>
        <div class="result-actions">
            <a class="result-link" href="${escapeAttribute(record.morgue)}" target="_blank" rel="noopener">Morgue</a>
            ${screenshotAction}
        </div>
    </article>`;
}

async function renderGoonkemon() {
    try {
        const dataUrl = new URL('../goonkemon/data/captures.json', import.meta.url);
        const response = await fetch(dataUrl, {cache: 'no-store'});
        if (!response.ok) {
            throw new Error(`Could not load Goonkemon captures: ${response.status}`);
        }
        const payload = await response.json();
        const captures = Array.isArray(payload.captures) ? payload.captures : [];
        const allRanked = captures
            .map((capture) => ({capture, score: safeScore(capture)}))
            .filter((item) => item.score)
            .sort(compareRankedCaptures);
        const bestRanked = selectBestPerParticipant(allRanked);
        const weakest = allRanked[allRanked.length - 1];
        const detailById = await loadCaptureDetails([...bestRanked, weakest].filter(Boolean));

        document.querySelector('[data-goonkemon-participants]').textContent = String(bestRanked.length);
        document.querySelector('[data-goonkemon-captures]').textContent = String(allRanked.length);
        goonkemonRoot.innerHTML = bestRanked.length
            ? bestRanked.map((item, index) => renderGoonkemonRow(item, index + 1, detailById.get(item.capture.id))).join('')
            : emptyResultMessage();
        weakestRoot.innerHTML = weakest
            ? renderWeakestAward(weakest, detailById.get(weakest.capture.id))
            : emptyResultMessage();
    } catch (error) {
        const message = escapeHtml(error.message || error);
        goonkemonRoot.innerHTML = `<p class="results-error" role="alert">${message}</p>`;
        weakestRoot.innerHTML = `<p class="results-error" role="alert">${message}</p>`;
    }
}

function renderGoonkemonRow({capture, score}, rank, detail) {
    const title = score.title || capture.analysis?.title || capture.id;
    const detailUrl = goonkemonDetailUrl(capture.id);
    const tileUrl = goonkemonTileUrl(capture.id);
    const multiplier = formatMultiplier(score.statusMultiplier);
    const capturedAt = formatCaptureTime(capture.capturedAt);

    return `<article class="standing-row goonkemon-row rank-${rank}" aria-label="Rank ${rank}: ${escapeAttribute(title)}">
        <div class="rank-number">${rank}</div>
        <img class="goonkemon-tile" src="${escapeAttribute(tileUrl)}" width="48" height="72" alt="${escapeAttribute(title)} tile">
        <div class="result-identity">
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(capture.username || '')} · <time datetime="${escapeAttribute(capture.capturedAt || '')}" title="${escapeAttribute(capture.capturedAt || '')}">${escapeHtml(capturedAt)}</time></span>
        </div>
        <div class="result-status">
            <span class="ko">상태 배율 ×${multiplier}</span>
            <span class="en">Status ×${multiplier}</span>
        </div>
        <div class="result-score">
            ${formatNumber(score.total)} pts
            <small><span class="ko">군켓몬 점수</span><span class="en">Goonkemon score</span></small>
        </div>
        <div class="result-actions">
            <a class="result-link" href="${escapeAttribute(detailUrl)}">
                <span class="ko">상세 보기</span><span class="en">Details</span>
            </a>
        </div>
        ${renderGoonkemonDetails(capture, detail)}
    </article>`;
}

function renderWeakestAward({capture, score}, detail) {
    const title = score.title || capture.analysis?.title || capture.id;
    return `<div class="award-result-card">
        <img class="goonkemon-tile" src="${escapeAttribute(goonkemonTileUrl(capture.id))}" width="56" height="84" alt="${escapeAttribute(title)} tile">
        <div class="result-identity">
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(capture.username || '')}</span>
            <a class="result-link" href="${escapeAttribute(goonkemonDetailUrl(capture.id))}">
                <span class="ko">상세 보기</span><span class="en">Details</span>
            </a>
        </div>
        <div class="result-score">${formatNumber(score.total)} pts</div>
        ${renderGoonkemonDetails(capture, detail)}
    </div>`;
}

async function loadCaptureDetails(items) {
    const details = new Map();
    await Promise.all(items.map(async ({capture}) => {
        try {
            const response = await fetch(goonkemonDataUrl(capture.id), {cache: 'no-store'});
            if (response.ok) {
                details.set(capture.id, await response.json());
            }
        } catch (error) {
            // The ranking remains usable if an individual lore file is unavailable.
        }
    }));
    return details;
}

function renderGoonkemonDetails(capture, detail) {
    const analysis = capture.analysis || {};
    const lore = extractLore(detail?.monster?.body);
    return `<div class="goonkemon-details">
        ${lore ? `<p class="lord-description">${escapeHtml(lore)}</p>` : ''}
        ${renderLordStats(analysis.stats || {})}
        ${renderSpellset(capture.id, analysis.spells || [])}
    </div>`;
}

function renderLordStats(stats) {
    const values = [
        ['HP', stats.hp?.value ?? stats.hp?.raw],
        ['Will', stats.will?.pips],
        ['AC', stats.ac?.pips],
        ['EV', stats.ev?.pips],
        ['rF', displayResist(stats.resists?.rF)],
        ['rC', displayResist(stats.resists?.rC)],
        ['rElec', displayResist(stats.resists?.rElec)],
        ['Speed', Number.isFinite(Number(stats.speed?.percent)) ? `${Number(stats.speed.percent)}%` : '']
    ].filter(([, value]) => value !== undefined && value !== null && value !== '');
    const attacks = (stats.attacks?.items || [])
        .map((attack) => `${attack.name || 'Hit'} ${attack.damageText || attack.damageTotal || ''}`.trim())
        .filter(Boolean)
        .join(', ');

    return `<dl class="lord-stats">
        ${values.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}
        ${attacks ? `<div class="lord-stat-wide"><dt><span class="ko">공격</span><span class="en">Attack</span></dt><dd>${escapeHtml(attacks)}</dd></div>` : ''}
    </dl>`;
}

function renderSpellset(captureId, spells) {
    if (!spells.length) {
        return `<div class="lord-spellset lord-spellset-empty">
            <span class="spellset-label">Spellset</span>
            <span><span class="ko">주문 없음</span><span class="en">No spells</span></span>
        </div>`;
    }
    return `<div class="lord-spellset">
        <span class="spellset-label">Spellset</span>
        <ul>
            ${spells.map((spell, index) => renderSpell(captureId, spell, index)).join('')}
        </ul>
    </div>`;
}

function renderSpell(captureId, spell, index) {
    const level = Number.isFinite(Number(spell.level)) ? Number(spell.level) : 9;
    const metadata = [`L${level}`, spell.schools].filter(Boolean).join(' · ');
    const title = [spell.title, spell.effect, spell.range, spell.schools].filter(Boolean).join(' · ');
    return `<li title="${escapeAttribute(title)}">
        <img src="${escapeAttribute(goonkemonSpellIconUrl(captureId, index))}" width="32" height="32" alt="" aria-hidden="true">
        <span>
            <strong>${escapeHtml(spell.title || `Spell ${index + 1}`)}</strong>
            <small>${escapeHtml(metadata)}</small>
        </span>
    </li>`;
}

function extractLore(body) {
    return String(body || '')
        .split(/\n\s*\n/, 1)[0]
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function displayResist(resist) {
    if (!resist) {
        return '';
    }
    if (String(resist.raw || '').includes('∞')) {
        return '∞';
    }
    return Number.isFinite(Number(resist.value)) ? Number(resist.value) : resist.raw;
}

function safeScore(capture) {
    try {
        return scoreAnalysis(capture.analysis || {});
    } catch (error) {
        return null;
    }
}

function compareRankedCaptures(a, b) {
    if (b.score.total !== a.score.total) {
        return b.score.total - a.score.total;
    }
    const dateOrder = dateValue(a.capture.capturedAt) - dateValue(b.capture.capturedAt);
    return dateOrder || String(a.capture.id || '').localeCompare(String(b.capture.id || ''));
}

function selectBestPerParticipant(ranked) {
    const seen = new Set();
    return ranked.filter(({capture}) => {
        const username = String(capture.username || '').trim().toLowerCase();
        const key = username || `\u0000${capture.id || ''}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function installScreenshotDialog() {
    const dialog = document.getElementById('screenshot-dialog');
    const image = document.getElementById('screenshot-image');
    const caption = document.getElementById('screenshot-caption');

    speedrunRoot.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-screenshot]');
        if (!trigger) {
            return;
        }
        image.src = trigger.dataset.screenshot;
        caption.textContent = `${trigger.dataset.player} · submitted tile screenshot`;
        if (typeof dialog.showModal === 'function') {
            dialog.showModal();
        } else {
            window.open(image.src, '_blank', 'noopener');
        }
    });

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    dialog.addEventListener('close', () => {
        image.removeAttribute('src');
    });
}

function goonkemonDetailUrl(id) {
    return new URL(`../goonkemon/${encodeURIComponent(id)}/`, import.meta.url).href;
}

function goonkemonDataUrl(id) {
    return new URL(`../goonkemon/data/${encodeURIComponent(id)}.json`, import.meta.url).href;
}

function goonkemonTileUrl(id) {
    return new URL(`images/results/goonkemon/${encodeURIComponent(id)}.png`, import.meta.url).href;
}

function goonkemonSpellIconUrl(id, index) {
    return new URL(`images/results/spells/${encodeURIComponent(id)}-${index}.png`, import.meta.url).href;
}

function formatCaptureTime(value) {
    const date = new Date(value || '');
    if (Number.isNaN(date.valueOf())) {
        return String(value || '');
    }
    try {
        return new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        }).format(date);
    } catch (error) {
        return date.toLocaleString();
    }
}

function dateValue(value) {
    const parsed = Date.parse(value || '');
    return Number.isFinite(parsed) ? parsed : 0;
}

function formatMultiplier(value) {
    const number = Number(value);
    return Number.isFinite(number) ? String(Math.round(number * 100) / 100) : '1';
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString('en-US');
}

function emptyResultMessage() {
    return '<p class="results-error"><span class="ko">표시할 결과가 없습니다.</span><span class="en">No results to display.</span></p>';
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
}
