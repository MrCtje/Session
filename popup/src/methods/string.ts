export function markString(stringToMark: string, s1: string, s2: string, indices: number[][]): string {
    let offset = 0;
    let temp = stringToMark.split("");
    indices.forEach(s => {
        const m1 = s1;
        const m2 = s2;
        temp.splice(s[0] + offset, 0, m1);
        // +2 because we inserted 1 above and it needs to be at the end
        temp.splice(s[1] + 2 + offset, 0, m2);
        offset += 2;
    });

    return temp.join("");
}
