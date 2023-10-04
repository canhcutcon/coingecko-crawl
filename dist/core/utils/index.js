import { ethers } from "ethers";
export function trimslash(s) {
    return s[s.length - 1] === "/" ? s.slice(0, s.length - 1) : s;
}
export const randomString = (numberCharacter) => {
    return `${ethers.hexlify(ethers.randomBytes(numberCharacter)).toUpperCase()}`;
};
