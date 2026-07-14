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

const statusKoreanCopy = {
    'Lightly drained': ['약한 드레인', '근접 공격 명중률과 주문·특수 공격의 위력이 낮아지고 여러 상태 이상에 조금 더 취약해집니다.'],
    'Fast': ['가속', '이동과 행동 속도가 50% 빨라집니다.'],
    'Strong': ['완력 강화', '근접 공격 피해가 50% 증가합니다.'],
    'Deflecting missiles': ['투사체 굴절', '원거리 공격과 투사체가 이 몬스터에게 명중하기 훨씬 어려워집니다.'],
    'Sheltered from injuries': ['부상 보호', '받는 피해의 절반을 이 몬스터를 보호하는 아군이 대신 받습니다.'],
    'Spells empowered': ['주문 강화', '주문의 위력이 강해지고 주문을 더 자주 시전합니다.'],
    'Ally target': ['아군의 표적', '플레이어의 아군 하나 이상이 이 몬스터를 공격 대상으로 삼고 있습니다.'],
    'Slightly transparent': ['희미하게 투명함', '원래 투명하지만 마법적 시야로 보이는 상태입니다. 플레이어의 아군은 이 몬스터를 보지 못할 수 있습니다.'],
    'Unusually resistant': ['저항 강화', '화염·냉기·독·전기·부식 저항이 각각 한 단계 증가합니다.'],
    'Surrounded by freezing clouds': ['냉기 구름을 두름', '주변에 냉기 구름의 고리를 계속 만들어 냅니다.'],
    'Weak': ['완력 약화', '근접 공격 피해가 33% 감소합니다.'],
    'Covering ground quickly': ['신속', '이동 속도가 조금 빨라집니다.'],
    'Doubled in vigour': ['활력 두 배', '현재 HP와 최대 HP가 일시적으로 두 배가 됩니다.'],
    'Slow': ['감속', '이동과 행동 속도가 평소의 66%로 감소합니다.'],
    'Surrounded by thunder': ['천둥 구름을 두름', '주변에 천둥 구름의 고리를 계속 만들어 냅니다.'],
    'Very poisoned': ['심한 중독', '매 턴 독 피해를 받습니다.'],
    'Surrounded by chaotic energy': ['혼돈 구름을 두름', '주변에 요동치는 혼돈 구름의 고리를 계속 만들어 냅니다.'],
    'Weak-willed': ['의지 약화', '의지력이 절반으로 감소합니다.'],
    'Blind': ['실명', '명중률이 크게 감소하고 기회 공격을 할 수 없으며 주문이 엉뚱한 곳을 향할 수 있습니다. 표적을 놓치거나 빈틈을 잡힐 가능성도 생깁니다.'],
    'Dazed': ['멍해짐', '일시적으로 행동할 수 없지만 적대적인 행동을 받으면 즉시 정신을 차립니다.'],
    'Diminished spells': ['주문 약화', '주문 피해와 의지력 돌파 능력을 비롯한 주문 위력이 감소합니다.'],
    'Encased in ice': ['얼음에 갇힘', '급속 냉동되어 짧은 시간 동안 이동 속도가 크게 감소합니다.'],
    'Exposed': ['노출', '독을 제외한 비공격 피해가 증가하고 비공격 투사체에 더 잘 맞으며 의지력이 조금 감소합니다.'],
    'Inner flame': ['내부의 불꽃', '피해를 받을 때 발밑에 불꽃 구름이 생기며, 죽으면 폭발해 주변에 화염 피해와 불꽃 구름을 남깁니다.'],
    'Misshapen and mutated': ['기형·변이', 'AC가 8 감소하고 명중률·주문 위력·브랜드 피해·의지력이 중간 정도 감소합니다.'],
    'Not watching you': ['주의 분산', '잠시 다른 곳에 정신이 팔렸습니다. 근접 공격으로 빈틈을 찔러 추가 피해를 줄 가능성이 생깁니다.'],
    'Poisoned': ['중독', '매 턴 독 피해를 받습니다.'],
    'Radiating silence': ['침묵장 방출', '주변에 소음을 없애고 두루마리·주문·신성 능력처럼 발성이 필요한 행동을 막는 침묵장을 만듭니다.'],
    'Retreating': ['후퇴 중', '지정된 방향으로 도망치라는 명령을 받아, 새 명령을 받거나 충분히 멀어질 때까지 공격하거나 복귀하지 않습니다.'],
    'Silenced': ['침묵', '소리를 낼 수 없으며 발성이 필요한 주문을 사용할 수 없습니다.'],
    'Strong-willed': ['의지 강화', '의지력이 2단계 증가합니다.'],
    'Surrounded by flames': ['화염 구름을 두름', '주변에 화염 구름의 고리를 계속 만들어 냅니다.'],
    'Surrounded by negative energy': ['음에너지 구름을 두름', '주변에 고통스러운 음에너지 구름의 고리를 계속 만들어 냅니다.'],
    'Unaffected by silence': ['침묵 무시', '마법에 발성이 필요하지 않아 침묵 상태의 영향을 받지 않습니다.'],
    'Friendly': ['아군', '플레이어 편에서 행동하는 동맹 상태입니다.'],
    'Summoned': ['소환됨', '일시적으로 소환되었습니다. 적대화되면 즉시 사라지고 경험치나 아이템을 남기지 않으며 계단을 이용할 수 없습니다.']
};

const statusNameByHeading = {
    'Lightly drained': 'DRAIN',
    'Fast': 'HASTED',
    'Strong': 'MIGHT',
    'Sheltered from injuries': 'INJURY_BOND',
    'Spells empowered': 'BRILLIANCE',
    'Unusually resistant': 'RESISTANCE',
    'Weak': 'WEAKENED',
    'Covering ground quickly': 'SWIFT',
    'Doubled in vigour': 'DOUBLED_VIGOUR',
    'Slow': 'SLOWED',
    'Very poisoned': 'MORE_POISON',
    'Weak-willed': 'WEAK_WILLED',
    'Blind': 'BLIND',
    'Dazed': 'DAZED',
    'Diminished spells': 'DIMMED',
    'Exposed': 'EXPOSED',
    'Inner flame': 'INNER_FLAME',
    'Misshapen and mutated': 'MALMUTATED',
    'Not watching you': 'UNAWARE',
    'Poisoned': 'POISON',
    'Retreating': 'RETREAT',
    'Strong-willed': 'STRONG_WILLED'
};

const supplementalStatuses = {
    UNAWARE: {
        title: 'Not watching you',
        description: 'This creature has been briefly distracted by something else. Melee attacks may catch it off-guard and deal increased damage.'
    },
    DEFLECT_MISSILES: {
        title: 'Deflecting missiles',
        description: 'This creature strongly deflects incoming missiles, making ranged attacks and other projectiles much less likely to hit.'
    },
    FRIENDLY: {
        title: 'Friendly',
        description: 'This creature is allied with the player.'
    },
    SUMMONED: {
        title: 'Summoned',
        description: 'This monster has been temporarily summoned. If angered it will immediately vanish, yielding no experience or items, and it cannot use stairs.'
    }
};

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
        ${renderMonsterStatuses(analysis.statuses || {}, detail?.monster?.status)}
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

function renderMonsterStatuses(statuses, rawStatus) {
    const categoryByName = collectStatusCategories(statuses);
    const entries = parseMonsterStatuses(rawStatus).map((entry) => ({
        ...entry,
        name: statusNameByHeading[entry.title] || '',
        category: categoryByName.get(statusNameByHeading[entry.title]) || ''
    }));
    const representedNames = new Set(entries.map((entry) => entry.name).filter(Boolean));

    Object.entries(supplementalStatuses).forEach(([name, entry]) => {
        const category = categoryByName.get(name);
        if (category && !representedNames.has(name)) {
            entries.push({...entry, name, category});
        }
    });

    const count = entries.length;
    const content = count
        ? `<ul>${entries.map(renderMonsterStatusItem).join('')}</ul>`
        : `<p class="lord-status-empty"><span class="ko">활성 상태 없음</span><span class="en">No active status effects</span></p>`;

    return `<section class="lord-statuses" aria-label="Monster status effects">
        <div class="lord-status-heading">
            <span class="status-section-label">Status</span>
            <small><span class="ko">${count}개 활성 효과</span><span class="en">${count} active effect${count === 1 ? '' : 's'}</span></small>
        </div>
        ${content}
    </section>`;
}

function renderMonsterStatusItem(entry) {
    const korean = statusKoreanCopy[entry.title] || [entry.title, entry.description];
    const category = entry.category || 'info';
    return `<li class="lord-status-item status-${escapeAttribute(category)}">
        <div class="lord-status-title">
            <strong><span class="ko">${escapeHtml(korean[0])}</span><span class="en">${escapeHtml(entry.title)}</span></strong>
            ${renderStatusCategory(entry.category)}
        </div>
        <p><span class="ko">${escapeHtml(korean[1])}</span><span class="en">${escapeHtml(entry.description)}</span></p>
    </li>`;
}

function renderStatusCategory(category) {
    const labels = {
        buff: ['강화', 'Buff'],
        debuff: ['약화', 'Debuff'],
        attitude: ['태도', 'Attitude'],
        special: ['특수', 'Special'],
        unknown: ['기타', 'Other']
    };
    const label = labels[category];
    return label
        ? `<span class="status-category"><span class="ko">${label[0]}</span><span class="en">${label[1]}</span></span>`
        : '';
}

function collectStatusCategories(statuses) {
    const categories = new Map();
    [
        ['buffs', 'buff'],
        ['debuffs', 'debuff'],
        ['attitude', 'attitude'],
        ['special', 'special'],
        ['unknown', 'unknown']
    ].forEach(([key, category]) => {
        (Array.isArray(statuses[key]) ? statuses[key] : []).forEach((status) => {
            if (status?.name) {
                categories.set(String(status.name), category);
            }
        });
    });
    return categories;
}

function parseMonsterStatuses(rawStatus) {
    const entries = [];
    const source = String(rawStatus || '');
    const pattern = /<white>([^<]+?):<lightgrey>\s*([\s\S]*?)(?=\n\s*\n\s*<white>|\s*$)/gi;
    let match;

    while ((match = pattern.exec(source))) {
        const title = cleanStatusText(match[1]);
        const description = cleanStatusText(match[2]);
        if (title && description) {
            entries.push({title, description});
        }
    }
    return entries;
}

function cleanStatusText(value) {
    return String(value || '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
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
