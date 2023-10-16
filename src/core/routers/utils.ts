import fs from "fs";
import Path from "path";
import { fileURLToPath } from "url";
export const getAllFileInModules = () => {
	let allFile: string[] = [];

	const files = fs.readdirSync(Path.join(Path.dirname(fileURLToPath(import.meta.url)), "../../modules"));
	for (const element of files) {
		const file = element;
		if (!file.includes(".ts") && !file.includes("deleted")) {
			allFile = [...allFile, ...getAllFileInDirectory(`${Path.join(Path.dirname(fileURLToPath(import.meta.url)), "../../modules/" + file)}`)];
		}
	}
	return allFile;
};

export const getAllFileInDirectory = (path: string) => {
	let result: string[] = [];
	fs.readdirSync(path).forEach((file) => {
		const filePath = Path.join(path, file);
		if (fs.statSync(filePath).isDirectory()) {
			result = [...result, ...getAllFileInDirectory(filePath)];
		} else {
			result.push(filePath);
		}
	});
	return result;
};


export const compareSimilarString = (s1: string, s2: string) => {
	const matrix = Array(s1.length + 1)
		.fill(null)
		.map(() => Array(s2.length + 1).fill(null));

	for (let i = 0; i <= s1.length; i++) {
		matrix[i][0] = i;
	}

	for (let j = 0; j <= s2.length; j++)
		matrix[0][j] = j;

	for (let j = 1; j < s2.length; j++) {
		for (let i = 1; i < s1.length; i++) {
			const substitutionCost = s1[i] === s2[j] ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1,
				matrix[i][j - 1] + 1, // Insertion 1
				matrix[i - 1][j - 1] + substitutionCost // Substitution 0
			)
		}
	}

	return matrix[s1.length][s2.length];
}

