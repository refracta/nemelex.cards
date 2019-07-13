import { BitSet32 } from "./BitSet.js";

type TypedArray = Uint8Array
                | Uint8ClampedArray
                | Int8Array
                | Uint16Array
                | Int16Array
                | Uint32Array
                | Int32Array
                | Float32Array
                | Float64Array;
type Arr<T> = TypedArray | T[];

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

class Character {
    public race: Race | undefined;
    public abilities: Uint8Array | undefined;
    public class1: PlayerClass | undefined;
    public class2: PlayerClass | undefined;
    public class3: PlayerClass | undefined;

    public reset(): void {
        this.race = undefined;
        this.abilities = undefined;
        this.class1 = undefined;
        this.class2 = undefined;
        this.class3 = undefined;
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
const STRING_CLASSES = new Map([
    ["Barbarian",    PlayerClass.BARBARIAN   ],
    ["Bard",         PlayerClass.BARD        ],
    ["Cleric",       PlayerClass.CLERIC      ],
    ["Fighter",      PlayerClass.FIGHTER     ],
    ["Paladin",      PlayerClass.PALADIN     ],
    ["Ranger",       PlayerClass.RANGER      ],
    ["Rogue",        PlayerClass.ROGUE       ],
    ["Sorcerer",     PlayerClass.SORCERER    ],
    ["Wizard",       PlayerClass.WIZARD      ],
    ["Monk",         PlayerClass.MONK        ],
    ["Favored Soul", PlayerClass.FAVORED_SOUL],
    ["Artificer",    PlayerClass.ARTIFICER   ],
    ["Warlock",      PlayerClass.WARLOCK     ],
    ["Druid",        PlayerClass.DRUID       ],
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
    [PlayerClass.BARBARIAN, new BitSet32([Alignment.NEUTRAL_GOOD,
                                          Alignment.CHAOTIC_GOOD,
                                          Alignment.TRUE_NEUTRAL,
                                          Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.BARD,      new BitSet32([Alignment.NEUTRAL_GOOD,
                                          Alignment.CHAOTIC_GOOD,
                                          Alignment.TRUE_NEUTRAL,
                                          Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.CLERIC,    new BitSet32([Alignment.LAWFUL_GOOD,
                                          Alignment.NEUTRAL_GOOD,
                                          Alignment.CHAOTIC_GOOD,
                                          Alignment.LAWFUL_NEUTRAL,
                                          Alignment.TRUE_NEUTRAL,
                                          Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.FIGHTER,   new BitSet32([Alignment.LAWFUL_GOOD,
                                          Alignment.NEUTRAL_GOOD,
                                          Alignment.CHAOTIC_GOOD,
                                          Alignment.LAWFUL_NEUTRAL,
                                          Alignment.TRUE_NEUTRAL,
                                          Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.PALADIN,   new BitSet32([Alignment.LAWFUL_GOOD])],
    [PlayerClass.RANGER,    new BitSet32([Alignment.LAWFUL_GOOD,
                                          Alignment.NEUTRAL_GOOD,
                                          Alignment.CHAOTIC_GOOD,
                                          Alignment.LAWFUL_NEUTRAL,
                                          Alignment.TRUE_NEUTRAL,
                                          Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.ROGUE,     new BitSet32([Alignment.LAWFUL_GOOD,
                                          Alignment.NEUTRAL_GOOD,
                                          Alignment.CHAOTIC_GOOD,
                                          Alignment.LAWFUL_NEUTRAL,
                                          Alignment.TRUE_NEUTRAL,
                                          Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.SORCERER,  new BitSet32([Alignment.LAWFUL_GOOD,
                                          Alignment.NEUTRAL_GOOD,
                                          Alignment.CHAOTIC_GOOD,
                                          Alignment.LAWFUL_NEUTRAL,
                                          Alignment.TRUE_NEUTRAL,
                                          Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.WIZARD,    new BitSet32([Alignment.LAWFUL_GOOD,
                                          Alignment.NEUTRAL_GOOD,
                                          Alignment.CHAOTIC_GOOD,
                                          Alignment.LAWFUL_NEUTRAL,
                                          Alignment.TRUE_NEUTRAL,
                                          Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.MONK,      new BitSet32([Alignment.LAWFUL_GOOD,
                                          Alignment.LAWFUL_NEUTRAL])],
    [PlayerClass.ARTIFICER, new BitSet32([Alignment.LAWFUL_GOOD,
                                          Alignment.NEUTRAL_GOOD,
                                          Alignment.CHAOTIC_GOOD,
                                          Alignment.LAWFUL_NEUTRAL,
                                          Alignment.TRUE_NEUTRAL,
                                          Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.WARLOCK,   new BitSet32([Alignment.LAWFUL_GOOD,
                                          Alignment.NEUTRAL_GOOD,
                                          Alignment.CHAOTIC_GOOD,
                                          Alignment.LAWFUL_NEUTRAL,
                                          Alignment.TRUE_NEUTRAL,
                                          Alignment.CHAOTIC_NEUTRAL])],
    [PlayerClass.DRUID,     new BitSet32([Alignment.NEUTRAL_GOOD,
                                          Alignment.LAWFUL_NEUTRAL,
                                          Alignment.TRUE_NEUTRAL,
                                          Alignment.CHAOTIC_NEUTRAL])],
]);

const character: Character = new Character();

ROLL_ABILITIES_AND_RACE.addEventListener("click", () => {
    // Starting over, remove persistent state
    character.reset();

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

    // Get rid of any old options in the "chosen class" dropdown menu, except
    // for the blank ("_") option, and then fill the options back up with the
    // set of classes that we just obtained previously
    CHOSEN_CLASS.value = "";
    const classOptions =
        Array.from(CHOSEN_CLASS.getElementsByTagName("option"));
    for (let i = classOptions.length - 1; i > 0; --i) {
        CHOSEN_CLASS.removeChild(classOptions[i]);
    }
    classesQualified.forEach(pclass => {
        const newClassOption = document.createElement("option");
        newClassOption.value = `${pclass}`;
        newClassOption.textContent = classString(pclass);
        CHOSEN_CLASS.appendChild(newClassOption);
    });

    // Reset the displayed values for the second & third classes
    SECOND_CLASS.textContent = "_";
    THIRD_CLASS.textContent = "_";
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

    // Figure out how many more class(es) in addition to the first (chosen)
    // class we'll roll for
    const additionalClassCount = unifInt(1, 3);

    // Get a set of possible classes for our second and third(?) classes
    const possibleClasses = new BitSet32(CLASSES);
    possibleClasses.delete(lockedInClass);
    const class1Alignments = CLASS_ALIGNMENTS.get(lockedInClass)!;
    for (const pc of possibleClasses) {
        const pcAlignments = CLASS_ALIGNMENTS.get(pc)!;
        if (class1Alignments.disjoint(pcAlignments)) {
            possibleClasses.delete(pc);
        }
    }
});

ROLL_CLASS.addEventListener("click", () => {
    // If the user hasn't done the first part, or has already got a first class
    // locked in, then do nothing
    if (character.race === undefined || character.class1 !== undefined) {
        return;
    }

    // Freely roll a random one of all classes
    const rolledClass = CLASSES[unifInt(0, CLASSES.length)];
    character.class1 = rolledClass;

    // Get rid of any old options in the """chosen class""" dropdown menu
    CHOSEN_CLASS.value = "";
    const classOptions =
        Array.from(CHOSEN_CLASS.getElementsByTagName("option"));
    for (const classOption of classOptions) {
        CHOSEN_CLASS.removeChild(classOption);
    }

    // Add a new option in the """chosen class""" dropdown menu for the class
    // that we rolled, and set that as selected
    const newClassOption = document.createElement("option");
    const v = `${rolledClass}`;
    newClassOption.value = v;
    newClassOption.textContent = classString(rolledClass);
    CHOSEN_CLASS.appendChild(newClassOption);
    CHOSEN_CLASS.value = v;
});

/**
 * Roll ability scores for a given number of build points; returns an array of
 * 6 integers, one for each ability.
 */
function rollAbilities(buildPoints_: number): Uint8Array {
    let buildPoints = buildPoints_;
    const abilityScores = new Uint8Array(6);

    for (let iteration = 0; buildPoints > 0 && iteration < 5; ++iteration) {
        let ix = 1;
        for (; ix < POINT_COSTS.length; ++ix) {
            if (POINT_COSTS[ix] > buildPoints) {
                break;
            }
        }

        const scoreBump = unifInt(buildPoints >= 16 ? 5 : 0, ix);
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

    for (let ix = 2; ix < abilityScores.length; ++ix) {
        if (abilityScores[ix] === 0) {
            abilityScores[ix] = 8;
        }
    }

    return fisherYates(abilityScores);
}

/**
 * Samples discrete uniform distribution on the integer interval
 * `[min, upper)`.
 */
function unifInt(min: number, upper: number): number {
    return Math.floor(Math.random() * (upper - min)) + min;
}

/**
 * Shuffles an array in-place and returns a reference to the array.
 */
function fisherYates<T, A extends Arr<T>>(a: A): A {
    for (let i = a.length - 1; i > 0; --i) {
        const swapIndex = Math.floor(Math.random() * (i + 1));
        const temp = a[swapIndex];
        a[swapIndex] = a[i];
        a[i] = temp;
    }

    return a;
}

/** Gets the corresponding ability mod to a given ability score */
function abilityMod(abilityScore: number): number {
    return (abilityScore - 10) >> 1;
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
