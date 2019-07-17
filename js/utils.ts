type TypedArray = Uint8Array
                | Uint8ClampedArray
                | Int8Array
                | Uint16Array
                | Int16Array
                | Uint32Array
                | Int32Array
                | Float32Array
                | Float64Array;
type MaybeTypedArray<T> = TypedArray | T[];

/**
 * Shuffles an array in-place and returns a reference to the same array.
 */
export function fisherYates<T, A extends MaybeTypedArray<T>>(a: A): A {
    for (let i = a.length - 1; i > 0; --i) {
        const swapIndex = Math.floor(Math.random() * (i + 1));
        const temp = a[swapIndex];
        a[swapIndex] = a[i];
        a[i] = temp;
    }

    return a;
}

/**
 * Checks if `x` is a real number, i.e. it is not infinite and it is not `NaN`.
 */
export function isReal(x: number): boolean {
    return isFinite(x) && !isNaN(x);
}

/**
 * Credit for this function is due to Andrew Shaffer (@ashaffer on GitHub),
 * licensed under the MIT license and available here:
 * [https://github.com/micro-js/popcount](https://github.com/micro-js/popcount)
 */
export function popCount(x: number): number {
    x -= x >> 1 & 0x55555555;
    x = (x & 0x33333333) + (x >> 2 & 0x33333333);
    x = x + (x >> 4) & 0x0f0f0f0f;
    x += x >> 8;
    x += x >> 16;

    return x & 0x7f;
}

/**
 * Samples discrete uniform distribution on the integer interval
 * `[min, upper)`.
 */
export function unifInt(min: number, upper: number): number {
    return Math.floor(Math.random() * (upper - min)) + min;
}
