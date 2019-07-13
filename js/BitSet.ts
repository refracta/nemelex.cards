import { popCount, unifInt } from "./utils.js";

class BitSet32Iterator<T> implements Iterator<T> {
    private set: number;
    private i: number;

    public constructor(set: number) {
        this.set = set;
        this.i = 0;
    }

    public next(): IteratorResult<T> {
        let b = this.set & (1 << this.i);
        while (b === 0 && this.i < 31) {
            ++this.i;
            b = this.set & (1 << this.i);
        }

        if (b === 0) {
            return {
                done:  true,
                value: (undefined as any) as T, // Due to Typescript bug
            };
        } else {
            return {
                done:  false,
                value: ((this.i++) as any) as T, // yikes lol
            };
        }
    }
}

class BitSet32EntriesIterator<T> implements Iterator<[T, T]> {
    private set: number;
    private i: number;

    public constructor(set: number) {
        this.set = set;
        this.i = 0;
    }

    public next(): IteratorResult<[T, T]> {
        let b = this.set & (1 << this.i);
        while (b === 0 && this.i < 31) {
            ++this.i;
            b = this.set & (1 << this.i);
        }

        if (b === 0) {
            return {
                done:  true,
                value: (undefined as any) as [T, T], // Due to Typescript bug
            };
        } else {
            const v = ((this.i++) as any) as T; // yikes lol
            return {
                done:  false,
                value: [v, v],
            };
        }
    }
}

/**
 * **NOTE:** The type `T` must be a type with a numeric representation at
 * runtime, e.g. `number` or any `enum` with numeric values.
 *
 * **ALSO NOTE:** The "`32`" in `BitSet32` means that only values `v` such that
 * `v < 32` can be stored.
 */
export class BitSet32<T> implements Iterable<T> {
    public size: number;
    private bits: number;

    public constructor(iter?: Iterable<T>) {
        this.bits = 0;
        this.size = 0;

        if (iter !== undefined) {
            for (const t of iter) {
                this.add(t);
            }
        }
    }

    public add(t: T): BitSet32<T> {
        const mask = 1 << ((t as any) as number); // yikes lol
        if ((this.bits & mask) === 0) {
            this.bits |= mask;
            ++this.size;
        }

        return this;
    }

    public clear(): void {
        this.bits = 0;
        this.size = 0;
    }

    public delete(t: T): boolean {
        const oldBits = this.bits;
        this.bits &= ~(1 << ((t as any) as number)); // yikes lol

        if (this.bits === oldBits) {
            return false;
        } else {
            --this.size;

            return true;
        }
    }

    public entries(): Iterator<[T, T]> {
        return new BitSet32EntriesIterator(this.bits);
    }

    public forEach(
        callback: (currentValue: T, currentKey: T, set: BitSet32<T>) => void,
        thisArg?: BitSet32<T>,
    ): void {
        const thiz = thisArg === undefined ? this : thisArg;

        for (let bs = this.bits, i = 0; bs !== 0; bs >>>= 1, ++i) {
            if ((bs & 1) !== 0) {
                const t = (i as any) as T; // yikes lol
                callback(t, t, thiz);
            }
        }
    }

    public has(value: T): boolean {
        // yikes lol
        return (this.bits & (1 << ((value as any) as number))) !== 0;
    }

    public values(): Iterator<T> {
        return new BitSet32Iterator(this.bits);
    }

    [Symbol.iterator] = this.values;

    public intersect(other: BitSet32<T>): BitSet32<T> {
        const intersection = new BitSet32<T>();
        intersection.bits = this.bits & other.bits;
        intersection.size = popCount(intersection.bits);

        return intersection;
    }

    public disjoint(other: BitSet32<T>): boolean {
        return (this.bits & other.bits) === 0;
    }

    public empty(): boolean {
        return this.size === 0;
    }

    public unifSelect(): T | undefined {
        if (this.empty()) {
            return;
        }

        const getIndex = unifInt(0, this.size);

        for (let bs = this.bits, i = 0, index = 0; bs !== 0; bs >>>= 1, ++i) {
            if ((bs & 1) !== 0) {
                if (index === getIndex) {
                    return (i as any) as T; // yikes lol
                }

                ++index;
            }
        }

        return;
    }
}
