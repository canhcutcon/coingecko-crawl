import fs from "fs";
import Path from "path";
import { fileURLToPath } from "url";
export const getAllFileInModules = () => {
    let allFile = [];
    const files = fs.readdirSync(Path.join(Path.dirname(fileURLToPath(import.meta.url)), "../../modules"));
    for (const element of files) {
        const file = element;
        if (!file.includes(".ts") && !file.includes("deleted")) {
            allFile = [...allFile, ...getAllFileInDirectory(`${Path.join(Path.dirname(fileURLToPath(import.meta.url)), "../../modules/" + file)}`)];
        }
    }
    return allFile;
};
export const getAllFileInDirectory = (path) => {
    let result = [];
    fs.readdirSync(path).forEach((file) => {
        const filePath = Path.join(path, file);
        if (fs.statSync(filePath).isDirectory()) {
            result = [...result, ...getAllFileInDirectory(filePath)];
        }
        else {
            result.push(filePath);
        }
    });
    return result;
};
