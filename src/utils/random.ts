/**
 * Generates a random integer of a specified length or within a specified range.
 *
 * @param len - The length of the random number
 * @param removeIfZero - If the generated number starts with 0, remove it. Defaults to false.
 * @param minValue - The minimum value of the random number (optional)
 * @param maxValue - The maximum value of the random number (optional)
 * @returns A random number of the given length or within the specified range
 * @throws If the length is not greater than 0
 */
export function getRandomInteger(
    len: number,
    removeIfZero: boolean = false,
    minValue?: number,
    maxValue?: number
): number {
    if (len <= 0) throw new Error("Length must be greater than 0");

    let randomNumber: number;

    // Use range if minValue and maxValue are provided
    if (minValue !== undefined && maxValue !== undefined)
        randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    else {
        // Fallback to generating random number based on length
        randomNumber = Math.floor(Math.random() * Math.pow(10, len));
    }

    // Remove leading zero if removeIfZero is true
    if (randomNumber.toString().startsWith("0") && removeIfZero)
        randomNumber = parseInt(randomNumber.toString().substring(1), 10);

    return randomNumber;
}

/**
 * Randomly selects one element from a given array of values.
 *
 * @example
 * const color = chooseFrom("red", "green", "blue");
 * console.log(color); // a random color
 *
 * @throws If no values are provided
 * @template T
 * @param v - The values to choose from
 * @returns The randomly chosen value
 */
export function chooseFrom<T>(...v: Array<T>): T {
    if (v.length === 0) throw new Error("No values provided");

    if (v.length === 1) return v[0];
    const randomIndex = Math.floor(Math.random() * v.length);
    return v[randomIndex];
}
