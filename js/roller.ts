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
    DWARF,
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

const POINT_COSTS = Uint8Array.from([1, 2, 3, 4, 5, 6, 8, 10, 13, 16]);
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

ROLL_ABILITIES_AND_RACE.addEventListener("click", () => {
    const races = [Race.DWARF, Race.ELF, Race.HALFLING, Race.HUMAN];
    RACE_INPUTS.forEach(
        ([checkbox, r]) => checkbox.checked ? races.push(r) : 0);
    const race = races[unifInt(0, races.length)];

    const buildPoints = +BUILD_POINTS.value;
    const realBuildPoints =
        race === Race.DROW_ELF ? Math.max(28, buildPoints - 4) : buildPoints;

    const abilities = rollAbilities(realBuildPoints);
    (RACE_ABILITY_BONUSES.get(race) as Int8Array)
        .forEach((b, i) => abilities[i] += b);

    RACE.textContent = raceString(race);
    ABILITIES.forEach(([ab, abMod], i) => {
        const score = abilities[i];
        ab.textContent = `${score}`;
        const abilityMod_ = abilityMod(score);
        const sign =
            abilityMod_ < 0 ? "" : abilityMod_ > 0 ? "+" : "\u{00b1}";
        abMod.textContent = `${sign}${abilityMod_}`;
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
    switch (r) {
        case Race.DWARF:      return "Dwarf";
        case Race.ELF:        return "Elf";
        case Race.HALFLING:   return "Halfling";
        case Race.HUMAN:      return "Human";
        case Race.DROW_ELF:   return "Drow Elf";
        case Race.WARFORGED:  return "Warforged";
        case Race.HALF_ORC:   return "Half-Orc";
        case Race.HALF_ELF:   return "Half-Elf";
        case Race.AASIMAR:    return "Aasimar";
        case Race.DRAGONBORN: return "Dragonborn";
        case Race.GNOME:      return "Gnome";
        case Race.WOOD_ELF:   return "Wood Elf";
        case Race.TIEFLING:   return "Tiefling";
        default:              return "[unknown race]";
    }
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
