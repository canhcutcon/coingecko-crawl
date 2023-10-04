import AppConfig from "../config";
import { ethers } from "ethers";

export function trimslash(s: string) {
	return s[s.length - 1] === "/" ? s.slice(0, s.length - 1) : s;
}

export const randomString = (numberCharacter: number) => {
	return `${ethers.hexlify(ethers.randomBytes(numberCharacter)).toUpperCase()}`
}