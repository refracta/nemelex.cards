import { fisherYates, isReal, unifInt } from "./utils.js";
import { BitSet32 } from "./BitSet.js";

window.addEventListener("load", () => {

enum Race {
    DWARF = 0,
    ELF,
    HALFLING,
    HUMAN,
    DROW_ELF,
    WARFORGED,
    HALF_ORC,
    HALF_ELF,
    AASIMAR,
    DRAGONBORN,
    GNOME,
    WOOD_ELF,
    TIEFLING,
}

enum PlayerClass {
    BARBARIAN = 0,
    BARD,
    CLERIC,
    FIGHTER,
    PALADIN,
    RANGER,
    ROGUE,
    SORCERER,
    WIZARD,
    MONK,
    FAVORED_SOUL,
    ARTIFICER,
    WARLOCK,
    DRUID,
}

enum Alignment {
    LAWFUL_GOOD = 0,
    NEUTRAL_GOOD,
    CHAOTIC_GOOD,
    LAWFUL_NEUTRAL,
    TRUE_NEUTRAL,
    CHAOTIC_NEUTRAL,
}

enum Skill {
    BALANCE          = 0x00,
    BLUFF            = 0x01,
    CONCENTRATION    = 0x02,
    DIPLOMACY        = 0x03,
    HAGGLE           = 0x04,
    HEAL             = 0x05,
    HIDE             = 0x06,
    INTIMIDATE       = 0x07,
    JUMP             = 0x08,
    LISTEN           = 0x09,
    MOVE_SILENTLY    = 0x0a,
    PERFORM          = 0x0b,
    REPAIR           = 0x0c,
    SEARCH           = 0x0d,
    SPELLCRAFT       = 0x0e,
    SPOT             = 0x0f,
    SWIM             = 0x10,
    TUMBLE           = 0x11,
    USE_MAGIC_DEVICE = 0x12,
    DISABLE_DEVICE   = 0x13,
    OPEN_LOCK        = 0x14,
}
const SKILL_COUNT    = 0x15;

class Feat {
    public readonly name: string;
    public readonly canBeTakenBy: (c: Character) => boolean;

    public constructor(name: string, canBeTakenBy: (c: Character) => boolean) {
        this.name = name;
        this.canBeTakenBy = canBeTakenBy;
    }
}

class Character {
    public race: Race | undefined;
    public abilities: Uint8Array | undefined;
    public class1: PlayerClass | undefined;
    public class2: PlayerClass | undefined;
    public class3: PlayerClass | undefined;
    public skillPoints: number | undefined;
    public bab: number;
    /**
     * Ranks, counted in terms of half-ranks, such that a single rank is
     * represented as `2` in this array
     */
    private readonly skills: Uint8Array;
    private readonly levels: PlayerClass[];
    private readonly feats: Map<string, Feat>;

    public constructor() {
        this.bab = 0;
        this.skills = new Uint8Array(SKILL_COUNT);
        this.levels = [];
        this.feats = new Map();
    }

    public reset(): void {
        this.race = undefined;
        this.abilities = undefined;
        this.class1 = undefined;
        this.class2 = undefined;
        this.class3 = undefined;
        this.skillPoints = undefined;
        this.bab = 0;
        this.skills.fill(0x00);
        this.levels.length = 0;
        this.feats.clear();
    }

    public hasBab(bab: number): boolean {
        return this.bab >= bab;
    }

    public setRanks(skill: Skill, halfRanks: number): void {
        this.skills[skill as number] = halfRanks;
    }

    public addLevel(pc: PlayerClass): void {
        this.levels.push(pc);
    }

    public level(): number {
        return this.levels.length;
    }

    public levelsIn(pclass: PlayerClass): number {
        return this.levels.reduce(
            (accu, pc) => pc === pclass ? accu + 1 : accu,
            0,
        );
    }

    public hasFeat(featName: string): boolean {
        return this.feats.has(featName);
    }
}

const POINT_COSTS = Uint8Array.from([1, 2, 3, 4, 5, 6, 8, 10, 13, 16]);
const RACE_STRINGS = new Map([
    [Race.DWARF,      "Dwarf"     ],
    [Race.ELF,        "Elf"       ],
    [Race.HALFLING,   "Halfling"  ],
    [Race.HUMAN,      "Human"     ],
    [Race.DROW_ELF,   "Drow Elf"  ],
    [Race.WARFORGED,  "Warforged" ],
    [Race.HALF_ORC,   "Half-Orc"  ],
    [Race.HALF_ELF,   "Half-Elf"  ],
    [Race.AASIMAR,    "Aasimar"   ],
    [Race.DRAGONBORN, "Dragonborn"],
    [Race.GNOME,      "Gnome"     ],
    [Race.WOOD_ELF,   "Wood Elf"  ],
    [Race.TIEFLING,   "Tiefling"  ],
]);
const CLASS_STRINGS = new Map([
    [PlayerClass.BARBARIAN,    "Barbarian"   ],
    [PlayerClass.BARD,         "Bard"        ],
    [PlayerClass.CLERIC,       "Cleric"      ],
    [PlayerClass.FIGHTER,      "Fighter"     ],
    [PlayerClass.PALADIN,      "Paladin"     ],
    [PlayerClass.RANGER,       "Ranger"      ],
    [PlayerClass.ROGUE,        "Rogue"       ],
    [PlayerClass.SORCERER,     "Sorcerer"    ],
    [PlayerClass.WIZARD,       "Wizard"      ],
    [PlayerClass.MONK,         "Monk"        ],
    [PlayerClass.FAVORED_SOUL, "Favored Soul"],
    [PlayerClass.ARTIFICER,    "Artificer"   ],
    [PlayerClass.WARLOCK,      "Warlock"     ],
    [PlayerClass.DRUID,        "Druid"       ],
]);
const CLASSES = [
    PlayerClass.BARBARIAN,
    PlayerClass.BARD,
    PlayerClass.CLERIC,
    PlayerClass.FIGHTER,
    PlayerClass.PALADIN,
    PlayerClass.RANGER,
    PlayerClass.ROGUE,
    PlayerClass.SORCERER,
    PlayerClass.WIZARD,
    PlayerClass.MONK,
    PlayerClass.FAVORED_SOUL,
    PlayerClass.ARTIFICER,
    PlayerClass.WARLOCK,
    PlayerClass.DRUID,
];
const F2P_CLASSES = [
    PlayerClass.BARBARIAN,
    PlayerClass.BARD,
    PlayerClass.CLERIC,
    PlayerClass.FIGHTER,
    PlayerClass.PALADIN,
    PlayerClass.RANGER,
    PlayerClass.ROGUE,
    PlayerClass.SORCERER,
    PlayerClass.WIZARD,
];
const ROLL_ABILITIES_AND_RACE =
    document.getElementById("roll-abilities-and-race") as HTMLButtonElement;
const BUILD_POINTS = document.getElementById("build-points") as
    HTMLSelectElement;
const DROW_ELF: [HTMLInputElement, Race] =
    [document.getElementById("drow-elf") as HTMLInputElement, Race.DROW_ELF];
const WARFORGED: [HTMLInputElement, Race] =
    [document.getElementById("warforged") as HTMLInputElement, Race.WARFORGED];
const HALF_ORC: [HTMLInputElement, Race] =
    [document.getElementById("half-orc") as HTMLInputElement, Race.HALF_ORC];
const HALF_ELF: [HTMLInputElement, Race] =
    [document.getElementById("half-elf") as HTMLInputElement, Race.HALF_ELF];
const AASIMAR: [HTMLInputElement, Race] =
    [document.getElementById("aasimar") as HTMLInputElement, Race.AASIMAR];
const DRAGONBORN: [HTMLInputElement, Race] =
    [document.getElementById("dragonborn") as HTMLInputElement,
     Race.DRAGONBORN];
const GNOME: [HTMLInputElement, Race] =
    [document.getElementById("gnome") as HTMLInputElement, Race.GNOME];
const WOOD_ELF: [HTMLInputElement, Race] =
    [document.getElementById("wood-elf") as HTMLInputElement, Race.WOOD_ELF];
const TIEFLING: [HTMLInputElement, Race] =
    [document.getElementById("tiefling") as HTMLInputElement, Race.TIEFLING];
const RACE_INPUTS = [
    DROW_ELF,
    WARFORGED,
    HALF_ORC,
    HALF_ELF,
    AASIMAR,
    DRAGONBORN,
    GNOME,
    WOOD_ELF,
    TIEFLING,
];
const ARTIFICER: [HTMLInputElement, PlayerClass] = [
    document.getElementById("artificer") as HTMLInputElement,
    PlayerClass.ARTIFICER,
];
const DRUID: [HTMLInputElement, PlayerClass] = [
    document.getElementById("druid") as HTMLInputElement,
    PlayerClass.DRUID,
];
const FAVORED_SOUL: [HTMLInputElement, PlayerClass] = [
    document.getElementById("favored-soul") as HTMLInputElement,
    PlayerClass.FAVORED_SOUL,
];
const MONK: [HTMLInputElement, PlayerClass] = [
    document.getElementById("monk") as HTMLInputElement,
    PlayerClass.MONK,
];
const WARLOCK: [HTMLInputElement, PlayerClass] = [
    document.getElementById("warlock") as HTMLInputElement,
    PlayerClass.WARLOCK,
];
const CLASS_INPUTS = [
    ARTIFICER,
    DRUID,
    FAVORED_SOUL,
    MONK,
    WARLOCK,
];
const RACE_ABILITY_BONUSES = new Map([
                                  /* STR DEX CON INT WIS CHA */
    [Race.DWARF,      new Int8Array([0,  0,  2,  0,  0,  -2])],
    [Race.ELF,        new Int8Array([0,  2,  -2, 0,  0,  0 ])],
    [Race.HALFLING,   new Int8Array([-2, 2,  0,  0,  0,  0 ])],
    [Race.HUMAN,      new Int8Array([0,  0,  0,  0,  0,  0 ])],
    [Race.DROW_ELF,   new Int8Array([0,  2,  -2, 2,  0,  2 ])],
    [Race.WARFORGED,  new Int8Array([0,  0,  2,  0,  -2, -2])],
    [Race.HALF_ORC,   new Int8Array([2,  0,  0,  -2, 0,  -2])],
    [Race.HALF_ELF,   new Int8Array([0,  0,  0,  0,  0,  0 ])],
    [Race.AASIMAR,    new Int8Array([0,  0,  0,  0,  2,  0 ])],
    [Race.DRAGONBORN, new Int8Array([2,  -2, 0,  0,  0,  2 ])],
    [Race.GNOME,      new Int8Array([-2, 0,  0,  2,  0,  0 ])],
    [Race.WOOD_ELF,   new Int8Array([0,  2,  0,  -2, 0,  0 ])],
    [Race.TIEFLING,   new Int8Array([0,  0,  0,  0,  0,  2 ])],
]);
const RACE = document.getElementById("race") as HTMLSpanElement;
const STR     = document.getElementById("str")     as HTMLTableDataCellElement;
const STR_MOD = document.getElementById("str-mod") as HTMLTableDataCellElement;
const DEX     = document.getElementById("dex")     as HTMLTableDataCellElement;
const DEX_MOD = document.getElementById("dex-mod") as HTMLTableDataCellElement;
const CON     = document.getElementById("con")     as HTMLTableDataCellElement;
const CON_MOD = document.getElementById("con-mod") as HTMLTableDataCellElement;
const INT     = document.getElementById("int")     as HTMLTableDataCellElement;
const INT_MOD = document.getElementById("int-mod") as HTMLTableDataCellElement;
const WIS     = document.getElementById("wis")     as HTMLTableDataCellElement;
const WIS_MOD = document.getElementById("wis-mod") as HTMLTableDataCellElement;
const CHA     = document.getElementById("cha")     as HTMLTableDataCellElement;
const CHA_MOD = document.getElementById("cha-mod") as HTMLTableDataCellElement;
const ABILITIES: [HTMLTableDataCellElement, HTMLTableDataCellElement][] = [
    [STR, STR_MOD], [DEX, DEX_MOD], [CON, CON_MOD],
    [INT, INT_MOD], [WIS, WIS_MOD], [CHA, CHA_MOD],
];
const CHOSEN_CLASS = document.getElementById("chosen-class") as
    HTMLSelectElement;
const LOCK_IN_CLASS = document.getElementById("lock-in-class") as
    HTMLButtonElement;
const ROLL_CLASS = document.getElementById("roll-class") as HTMLButtonElement;
const SECOND_CLASS = document.getElementById("second-class") as
    HTMLSpanElement;
const THIRD_CLASS = document.getElementById("third-class") as HTMLSpanElement;
const CLASS_QUALIFICATIONS = new Map([
                                          /* STR DEX CON INT WIS CHA */
    [PlayerClass.BARBARIAN, Uint8Array.from([14,  0, 14,  0,  0,  0])],
    [PlayerClass.BARD,      Uint8Array.from([ 0,  0,  0,  0,  0, 15])],
    [PlayerClass.CLERIC,    Uint8Array.from([ 0,  0,  0,  0, 14, 10])],
    [PlayerClass.FIGHTER,   Uint8Array.from([14, 10, 11,  0,  0,  0])],
    [PlayerClass.PALADIN,   Uint8Array.from([12,  0,  0,  0, 10, 13])],
    [PlayerClass.RANGER,    Uint8Array.from([ 0, 14,  0,  0, 10,  0])],
    [PlayerClass.ROGUE,     Uint8Array.from([ 0, 12,  0, 14,  0,  0])],
    [PlayerClass.SORCERER,  Uint8Array.from([ 0,  0,  0,  0,  0, 16])],
    [PlayerClass.WIZARD,    Uint8Array.from([ 0,  0,  0, 16,  0,  0])],
    [PlayerClass.MONK,      Uint8Array.from([ 0, 11,  0,  0, 14,  0])],
    [PlayerClass.ARTIFICER, Uint8Array.from([ 0, 10,  0, 15,  0,  0])],
    [PlayerClass.WARLOCK,   Uint8Array.from([ 0,  0, 13,  0,  0, 14])],
    [PlayerClass.DRUID,     Uint8Array.from([ 0,  0,  0,  0, 14,  0])],
]);
const CLASS_ALIGNMENTS = new Map([
    [PlayerClass.BARBARIAN,    new BitSet32([Alignment.NEUTRAL_GOOD,
                                             Alignment.CHAOTIC_GOOD,
                                             Alignment.TRUE_NEUTRAL,
                                             Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.BARD,         new BitSet32([Alignment.NEUTRAL_GOOD,
                                             Alignment.CHAOTIC_GOOD,
                                             Alignment.TRUE_NEUTRAL,
                                             Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.CLERIC,       new BitSet32([Alignment.LAWFUL_GOOD,
                                             Alignment.NEUTRAL_GOOD,
                                             Alignment.CHAOTIC_GOOD,
                                             Alignment.LAWFUL_NEUTRAL,
                                             Alignment.TRUE_NEUTRAL,
                                             Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.FIGHTER,      new BitSet32([Alignment.LAWFUL_GOOD,
                                             Alignment.NEUTRAL_GOOD,
                                             Alignment.CHAOTIC_GOOD,
                                             Alignment.LAWFUL_NEUTRAL,
                                             Alignment.TRUE_NEUTRAL,
                                             Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.PALADIN,      new BitSet32([Alignment.LAWFUL_GOOD])],
    [PlayerClass.RANGER,       new BitSet32([Alignment.LAWFUL_GOOD,
                                             Alignment.NEUTRAL_GOOD,
                                             Alignment.CHAOTIC_GOOD,
                                             Alignment.LAWFUL_NEUTRAL,
                                             Alignment.TRUE_NEUTRAL,
                                             Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.ROGUE,        new BitSet32([Alignment.LAWFUL_GOOD,
                                             Alignment.NEUTRAL_GOOD,
                                             Alignment.CHAOTIC_GOOD,
                                             Alignment.LAWFUL_NEUTRAL,
                                             Alignment.TRUE_NEUTRAL,
                                             Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.SORCERER,     new BitSet32([Alignment.LAWFUL_GOOD,
                                             Alignment.NEUTRAL_GOOD,
                                             Alignment.CHAOTIC_GOOD,
                                             Alignment.LAWFUL_NEUTRAL,
                                             Alignment.TRUE_NEUTRAL,
                                             Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.WIZARD,       new BitSet32([Alignment.LAWFUL_GOOD,
                                             Alignment.NEUTRAL_GOOD,
                                             Alignment.CHAOTIC_GOOD,
                                             Alignment.LAWFUL_NEUTRAL,
                                             Alignment.TRUE_NEUTRAL,
                                             Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.MONK,         new BitSet32([Alignment.LAWFUL_GOOD,
                                             Alignment.LAWFUL_NEUTRAL])],
    [PlayerClass.FAVORED_SOUL, new BitSet32([Alignment.LAWFUL_GOOD,
                                             Alignment.NEUTRAL_GOOD,
                                             Alignment.CHAOTIC_GOOD,
                                             Alignment.LAWFUL_NEUTRAL,
                                             Alignment.TRUE_NEUTRAL,
                                             Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.ARTIFICER,    new BitSet32([Alignment.LAWFUL_GOOD,
                                             Alignment.NEUTRAL_GOOD,
                                             Alignment.CHAOTIC_GOOD,
                                             Alignment.LAWFUL_NEUTRAL,
                                             Alignment.TRUE_NEUTRAL,
                                             Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.WARLOCK,      new BitSet32([Alignment.LAWFUL_GOOD,
                                             Alignment.NEUTRAL_GOOD,
                                             Alignment.CHAOTIC_GOOD,
                                             Alignment.LAWFUL_NEUTRAL,
                                             Alignment.TRUE_NEUTRAL,
                                             Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.DRUID,        new BitSet32([Alignment.NEUTRAL_GOOD,
                                             Alignment.LAWFUL_NEUTRAL,
                                             Alignment.TRUE_NEUTRAL,
                                             Alignment.CHAOTIC_NEUTRAL])],
]);
const CLASS_SKILL_POINTS = new Map([
    [PlayerClass.BARBARIAN,    4],
    [PlayerClass.BARD,         6],
    [PlayerClass.CLERIC,       2],
    [PlayerClass.FIGHTER,      2],
    [PlayerClass.PALADIN,      2],
    [PlayerClass.RANGER,       6],
    [PlayerClass.ROGUE,        8],
    [PlayerClass.SORCERER,     2],
    [PlayerClass.WIZARD,       2],
    [PlayerClass.MONK,         4],
    [PlayerClass.FAVORED_SOUL, 2],
    [PlayerClass.ARTIFICER,    4],
    [PlayerClass.WARLOCK,      2],
    [PlayerClass.DRUID,        4],
]);
const CLASS_SKILLS = new Map([
    [PlayerClass.BARBARIAN,    new BitSet32([Skill.INTIMIDATE,
                                             Skill.JUMP,
                                             Skill.LISTEN,
                                             Skill.SWIM])],
    [PlayerClass.BARD,         new BitSet32([Skill.BALANCE,
                                             Skill.BLUFF,
                                             Skill.CONCENTRATION,
                                             Skill.DIPLOMACY,
                                             Skill.HAGGLE,
                                             Skill.HIDE,
                                             Skill.JUMP,
                                             Skill.LISTEN,
                                             Skill.MOVE_SILENTLY,
                                             Skill.PERFORM,
                                             Skill.SPELLCRAFT,
                                             Skill.SWIM,
                                             Skill.TUMBLE,
                                             Skill.USE_MAGIC_DEVICE])],
    [PlayerClass.CLERIC,       new BitSet32([Skill.CONCENTRATION,
                                             Skill.DIPLOMACY,
                                             Skill.HEAL,
                                             Skill.SPELLCRAFT])],
    [PlayerClass.FIGHTER,      new BitSet32([Skill.REPAIR,
                                             Skill.SWIM,
                                             Skill.INTIMIDATE,
                                             Skill.JUMP])],
    [PlayerClass.PALADIN,      new BitSet32([Skill.CONCENTRATION,
                                             Skill.DIPLOMACY,
                                             Skill.INTIMIDATE,
                                             Skill.HEAL])],
    [PlayerClass.RANGER,       new BitSet32([Skill.CONCENTRATION,
                                             Skill.HEAL,
                                             Skill.HIDE,
                                             Skill.JUMP,
                                             Skill.LISTEN,
                                             Skill.MOVE_SILENTLY,
                                             Skill.SEARCH,
                                             Skill.SPOT,
                                             Skill.SWIM])],
    [PlayerClass.ROGUE,        new BitSet32([Skill.BALANCE,
                                             Skill.BLUFF,
                                             Skill.DIPLOMACY,
                                             Skill.DISABLE_DEVICE,
                                             Skill.HAGGLE,
                                             Skill.HIDE,
                                             Skill.INTIMIDATE,
                                             Skill.JUMP,
                                             Skill.LISTEN,
                                             Skill.MOVE_SILENTLY,
                                             Skill.OPEN_LOCK,
                                             Skill.REPAIR,
                                             Skill.SEARCH,
                                             Skill.SPOT,
                                             Skill.SWIM,
                                             Skill.TUMBLE,
                                             Skill.USE_MAGIC_DEVICE])],
    [PlayerClass.SORCERER,     new BitSet32([Skill.BLUFF,
                                             Skill.CONCENTRATION,
                                             Skill.SPELLCRAFT])],
    [PlayerClass.WIZARD,       new BitSet32([Skill.REPAIR,
                                             Skill.CONCENTRATION,
                                             Skill.SPELLCRAFT])],
    [PlayerClass.MONK,         new BitSet32([Skill.BALANCE,
                                             Skill.CONCENTRATION,
                                             Skill.DIPLOMACY,
                                             Skill.HIDE,
                                             Skill.JUMP,
                                             Skill.LISTEN,
                                             Skill.MOVE_SILENTLY,
                                             Skill.SPOT,
                                             Skill.SWIM,
                                             Skill.TUMBLE])],
    [PlayerClass.FAVORED_SOUL, new BitSet32([Skill.CONCENTRATION,
                                             Skill.DIPLOMACY,
                                             Skill.HEAL,
                                             Skill.JUMP,
                                             Skill.SPELLCRAFT])],
    [PlayerClass.ARTIFICER,    new BitSet32([Skill.CONCENTRATION,
                                             Skill.DISABLE_DEVICE,
                                             Skill.HAGGLE,
                                             Skill.OPEN_LOCK,
                                             Skill.REPAIR,
                                             Skill.SEARCH,
                                             Skill.SPELLCRAFT,
                                             Skill.SPOT,
                                             Skill.USE_MAGIC_DEVICE])],
    [PlayerClass.WARLOCK,      new BitSet32([Skill.BLUFF,
                                             Skill.CONCENTRATION,
                                             Skill.INTIMIDATE,
                                             Skill.JUMP,
                                             Skill.SPELLCRAFT,
                                             Skill.USE_MAGIC_DEVICE])],
    [PlayerClass.DRUID,        new BitSet32([Skill.CONCENTRATION,
                                             Skill.DIPLOMACY,
                                             Skill.HEAL,
                                             Skill.INTIMIDATE,
                                             Skill.LISTEN,
                                             Skill.SPELLCRAFT,
                                             Skill.SPOT,
                                             Skill.SWIM])],
]);
const SKILL_POINTS_REMAINING =
    document.getElementById("skill-points-remaining") as HTMLSpanElement;
const SKILL_POINT_INPUTS = [
    document.getElementById("balance")          as HTMLInputElement,
    document.getElementById("bluff")            as HTMLInputElement,
    document.getElementById("concentration")    as HTMLInputElement,
    document.getElementById("diplomacy")        as HTMLInputElement,
    document.getElementById("haggle")           as HTMLInputElement,
    document.getElementById("heal")             as HTMLInputElement,
    document.getElementById("hide")             as HTMLInputElement,
    document.getElementById("intimidate")       as HTMLInputElement,
    document.getElementById("jump")             as HTMLInputElement,
    document.getElementById("listen")           as HTMLInputElement,
    document.getElementById("move-silently")    as HTMLInputElement,
    document.getElementById("perform")          as HTMLInputElement,
    document.getElementById("repair")           as HTMLInputElement,
    document.getElementById("search")           as HTMLInputElement,
    document.getElementById("spellcraft")       as HTMLInputElement,
    document.getElementById("spot")             as HTMLInputElement,
    document.getElementById("swim")             as HTMLInputElement,
    document.getElementById("tumble")           as HTMLInputElement,
    document.getElementById("use-magic-device") as HTMLInputElement,
    document.getElementById("disable-device")   as HTMLInputElement,
    document.getElementById("open-lock")        as HTMLInputElement,
];
const SKILL_RANK_SPANS = [
    document.getElementById("balance-ranks")          as HTMLSpanElement,
    document.getElementById("bluff-ranks")            as HTMLSpanElement,
    document.getElementById("concentration-ranks")    as HTMLSpanElement,
    document.getElementById("diplomacy-ranks")        as HTMLSpanElement,
    document.getElementById("haggle-ranks")           as HTMLSpanElement,
    document.getElementById("heal-ranks")             as HTMLSpanElement,
    document.getElementById("hide-ranks")             as HTMLSpanElement,
    document.getElementById("intimidate-ranks")       as HTMLSpanElement,
    document.getElementById("jump-ranks")             as HTMLSpanElement,
    document.getElementById("listen-ranks")           as HTMLSpanElement,
    document.getElementById("move-silently-ranks")    as HTMLSpanElement,
    document.getElementById("perform-ranks")          as HTMLSpanElement,
    document.getElementById("repair-ranks")           as HTMLSpanElement,
    document.getElementById("search-ranks")           as HTMLSpanElement,
    document.getElementById("spellcraft-ranks")       as HTMLSpanElement,
    document.getElementById("spot-ranks")             as HTMLSpanElement,
    document.getElementById("swim-ranks")             as HTMLSpanElement,
    document.getElementById("tumble-ranks")           as HTMLSpanElement,
    document.getElementById("use-magic-device-ranks") as HTMLSpanElement,
    document.getElementById("disable-device-ranks")   as HTMLSpanElement,
    document.getElementById("open-lock-ranks")        as HTMLSpanElement,
];
const GENERAL_FEATS = [
    new Feat("Cleave", c => c.hasFeat("Power Attack")),
    new Feat("Great Cleave", c => c.hasFeat("Cleave") && c.hasBab(4)),
    new Feat("Hamstring", c => c.levelsIn(PlayerClass.ROGUE) > 0),
];

const character: Character = new Character();

ROLL_ABILITIES_AND_RACE.addEventListener("click", () => {
    // Starting over, remove persistent state
    character.reset();
    SECOND_CLASS.textContent = "_";
    THIRD_CLASS.textContent = "_";
    SKILL_POINTS_REMAINING.textContent = "_";
    SKILL_RANK_SPANS.forEach(srs => srs.textContent = "0");
    SKILL_POINT_INPUTS.forEach(spi => {
        spi.value = "0";
        spi.disabled = true;
    });

    // Get an array of races that the user has access to, and then pick one
    // randomly
    const races = [Race.DWARF, Race.ELF, Race.HALFLING, Race.HUMAN];
    RACE_INPUTS.forEach(
        ([checkbox, r]) => checkbox.checked ? races.push(r) : 0);
    const race = races[unifInt(0, races.length)];
    character.race = race;

    // Get how many effective build points the user has, taking Drow Elf into
    // consideration
    const buildPoints = +BUILD_POINTS.value;
    const realBuildPoints =
        race === Race.DROW_ELF ? Math.max(28, buildPoints - 4) : buildPoints;

    // Roll ability scores and then adjust them due to racial modifiers
    const abilities = rollAbilities(realBuildPoints);
    RACE_ABILITY_BONUSES.get(race)!.forEach((b, i) => abilities[i] += b);
    character.abilities = abilities;

    // Display race & ability scores to the user
    RACE.textContent = raceString(race);
    ABILITIES.forEach(([ab, abMod], i) => {
        const score = abilities[i];
        ab.textContent = `${score}`;
        const abilityMod_ = abilityMod(score);
        const sign =
            abilityMod_ < 0 ? "" : abilityMod_ > 0 ? "+" : "\u{00b1}";
        abMod.textContent = `${sign}${abilityMod_}`;
    });

    // Use the final ability score values to get a set of all class(es) that
    // the user can possibly manually choose from as their first ("chosen")
    // class
    const classesQualified = new BitSet32<PlayerClass>();
    CLASS_QUALIFICATIONS.forEach((qualif, pclass) =>
        abilities.every((a, i) => a >= qualif[i])
            ? classesQualified.add(pclass)
            : 0
    );
    if (abilities[4] >= 16 || abilities[5] >= 16) {
        classesQualified.add(PlayerClass.FAVORED_SOUL);
    }

    // Get rid of any classes that the user doesn't have access to
    CLASS_INPUTS.forEach(([checkbox, pc]) =>
        checkbox.checked ? 0 : classesQualified.delete(pc));

    // Get rid of any old options in the "chosen class" dropdown menu, and then
    // fill the options back up with the blank option ("_"), followed by the
    // set of classes that we just obtained previously
    const classOptions =
        Array.from(CHOSEN_CLASS.getElementsByTagName("option"));
    for (const classOption of classOptions) {
        CHOSEN_CLASS.removeChild(classOption);
    }
    const blankOption = document.createElement("option");
    blankOption.value = "";
    blankOption.textContent = "_";
    CHOSEN_CLASS.appendChild(blankOption);
    classesQualified.forEach(pclass => {
        const newClassOption = document.createElement("option");
        newClassOption.value = `${pclass}`;
        newClassOption.textContent = classString(pclass);
        CHOSEN_CLASS.appendChild(newClassOption);
    });

    // Set the "chosen class" to none
    CHOSEN_CLASS.value = "";
});

LOCK_IN_CLASS.addEventListener("click", () => {
    // If the first part hasn't been done, or the user has already locked in a
    // class, or if the user has only selected the blank ("_") option, then do
    // nothing
    if (
        character.race === undefined   ||
        character.class1 !== undefined ||
        CHOSEN_CLASS.value === ""
    ) {
        return;
    }

    // Get which class the user picked and set persistent state accordingly
    const lockedInClass = (+CHOSEN_CLASS.value) as PlayerClass;
    character.class1 = lockedInClass;

    // Remove other options, if any, since we're locking in the currently
    // selected one
    for (const o of Array.from(CHOSEN_CLASS.getElementsByTagName("option"))) {
        if (o.value !== CHOSEN_CLASS.value) {
            CHOSEN_CLASS.removeChild(o);
        }
    }

    rollSecondaryClasses();

    setUpSkillInputs();
});

ROLL_CLASS.addEventListener("click", () => {
    // If the user hasn't done the first part, or has already got a first class
    // locked in, then do nothing
    if (character.race === undefined || character.class1 !== undefined) {
        return;
    }

    // Roll a random class from the set of all available classes
    const possibleClasses = F2P_CLASSES.slice();
    CLASS_INPUTS.forEach(
        ([checkbox, pc]) => checkbox.checked ? possibleClasses.push(pc) : 0);
    character.class1 = possibleClasses[unifInt(0, possibleClasses.length)];
    character.addLevel(character.class1);

    // Get rid of any old options in the """chosen class""" dropdown menu
    const classOptions =
        Array.from(CHOSEN_CLASS.getElementsByTagName("option"));
    for (const classOption of classOptions) {
        CHOSEN_CLASS.removeChild(classOption);
    }

    // Add a new option in the """chosen class""" dropdown menu for the class
    // that we rolled, and set that as selected
    const newClassOption = document.createElement("option");
    const v = `${character.class1}`;
    newClassOption.value = v;
    newClassOption.textContent = classString(character.class1);
    CHOSEN_CLASS.appendChild(newClassOption);
    CHOSEN_CLASS.value = v;

    rollSecondaryClasses();

    setUpSkillInputs();
});

SKILL_POINT_INPUTS.forEach((spi, i) => {
    const skill = i as Skill;

    spi.addEventListener("input", () => {
        // Validate input
        const userVal = +spi.value;
        if (!isReal(userVal)) {
            spi.value = "0";
        } else if (userVal > 4) {
            spi.value = "4";
        } else if (userVal < 0) {
            spi.value = "0";
        }
        spi.value = `${Math.round(+spi.value)}`;

        // Determine how many skill points we have left by iterating over all
        // skill point inputs and checking their values
        let remainingSkillPoints =
            SKILL_POINT_INPUTS.reduce(
                (accu, inp) => accu - +inp.value, character.skillPoints!);

        // If the user spent too many points, subtract from the points spent on
        // this skill until that's fixed
        if (remainingSkillPoints < 0) {
            spi.value = `${+spi.value + remainingSkillPoints}`;
            remainingSkillPoints = 0;
        }

        // Display skill poinst remaining to the user
        SKILL_POINTS_REMAINING.textContent = `${remainingSkillPoints}`;

        // Update rank count for this skill
        const newVal = +spi.value;
        const halfRanks =
            CLASS_SKILLS.get(character.class1!)!.has(skill) ?
                2 * newVal :
                newVal;
        character.setRanks(skill, halfRanks);

        // Display rank count to user
        SKILL_RANK_SPANS[i].textContent = `${halfRanks / 2}`;
    });
});

/**
 * Roll ability scores for a given number of build points; returns an array of
 * 6 integers, one for each ability.
 */
function rollAbilities(buildPoints_: number): Uint8Array {
    let buildPoints = buildPoints_;
    const abilityScores = new Uint8Array(6);

    for (let iteration = 0; buildPoints > 0 && iteration < 5; ++iteration) {
        let i = 1;
        for (; i < POINT_COSTS.length; ++i) {
            if (POINT_COSTS[i] > buildPoints) {
                break;
            }
        }

        const scoreBump = unifInt(buildPoints >= 16 ? 5 : 0, i);
        abilityScores[iteration] = scoreBump + 9;
        buildPoints -= POINT_COSTS[scoreBump];
    }

    if (buildPoints > 0) {
        let i = 1;
        for (; i < POINT_COSTS.length; ++i) {
            if (POINT_COSTS[i] > buildPoints) {
                break;
            }
        }

        abilityScores[5] = i + 8;
        buildPoints -= POINT_COSTS[i - 1];

        if (buildPoints > 0) {
            let lowestAbility = 18;
            let lowestIx = 0;
            for (let j = 0; j < abilityScores.length; ++j) {
                const ability = abilityScores[j];
                if (ability < lowestAbility) {
                    lowestAbility = ability;
                    lowestIx = j;
                }
            }

            buildPoints += POINT_COSTS[lowestAbility - 9];
            abilityScores[lowestIx] = POINT_COSTS.indexOf(buildPoints) + 9;
        }
    }

    for (let i = 2; i < abilityScores.length; ++i) {
        if (abilityScores[i] === 0) {
            abilityScores[i] = 8;
        }
    }

    return fisherYates(abilityScores);
}

/**
 * Rolls for the second & third player classes, and then displays them to the
 * user. **NOTE:** the first class (`character.class1`) *must* be locked in
 * before calling this function.
 */
function rollSecondaryClasses(): void {
    // Get a set of possible classes for our second and third(?) classes
    const possibleClasses = new BitSet32(CLASSES);
    possibleClasses.delete(character.class1!);
    const class1Alignments = CLASS_ALIGNMENTS.get(character.class1!)!;
    for (const pc of possibleClasses) {
        const pcAlignments = CLASS_ALIGNMENTS.get(pc)!;
        if (class1Alignments.disjoint(pcAlignments)) {
            possibleClasses.delete(pc);
        }
    }

    // Get rid of any classes that the user doesn't have access to
    CLASS_INPUTS.forEach(([checkbox, pc]) =>
        checkbox.checked ? 0 : possibleClasses.delete(pc));

    // Roll for the second & third classes
    character.class2 = possibleClasses.unifSelect();
    if (Math.random() < 0.5) {
        possibleClasses.delete(character.class2!);
        character.class3 = possibleClasses.unifSelect();
    }

    // Display the newly rolled classes to the user
    SECOND_CLASS.textContent = classString(character.class2!);
    THIRD_CLASS.textContent =
        character.class3 === undefined ?
            "[only two classes]" :
            classString(character.class3);
}

/**
 * Sets up skill inputs so that the player can choose their skills. **NOTE:**
 * `rollSecondaryClasses()` *must* be called before calling this function.
 */
function setUpSkillInputs(): void {
    if (character.class1 === undefined || character.abilities === undefined) {
        throw new Error("setUpSkillInputs() needs class and abilities rolled");
    }

    // Determine how many skill points the character has to spend at character
    // creation, and display that to the user
    character.skillPoints = 4 * Math.max(
        CLASS_SKILL_POINTS.get(character.class1)! +
            abilityMod(character.abilities[3]),
        1,
    );
    SKILL_POINTS_REMAINING.textContent = `${character.skillPoints}`;

    // Enable skill inputs
    SKILL_POINT_INPUTS.forEach((spi, i) => {
        const isTrapperSkill = i as Skill === Skill.OPEN_LOCK ||
                               i as Skill === Skill.DISABLE_DEVICE;
        const isNotFirstLvlTrapper =
            character.class1 !== PlayerClass.ROGUE &&
            character.class1 !== PlayerClass.ARTIFICER;
        spi.disabled = isTrapperSkill && isNotFirstLvlTrapper;
    });
}

/** Gets the corresponding ability mod to a given ability score */
function abilityMod(abilityScore: number): number {
    return abilityScore - 10 >> 1;
}

/**
 * Gets a human-readable textual representation of a value of the `Race` enum.
 */
function raceString(r: Race): string {
    const s = RACE_STRINGS.get(r);

    return s !== undefined ? s : "[unknown race]";
}

/**
 * Gets a human-readable textual representation of a value of the `PlayerClass`
 * enum.
 */
function classString(pc: PlayerClass): string {
    const s = CLASS_STRINGS.get(pc);

    return s !== undefined ? s : "[unknown class]";
}

/**
 * For testing the empirical average ability score spreads for a given number
 * of build points.
 */
function testAverage(buildPoints: number): Float64Array {
    const avg = Float64Array.from(rollAbilities(buildPoints).sort());

    for (let i = 1; i < 1000000; ++i) {
        const newRoll = rollAbilities(buildPoints).sort();
        for (let j = 0; j < 6; ++j) {
            avg[j] = (newRoll[j] + i * avg[j]) / (i + 1);
        }
    }

    return avg;
}

});
