import DatabaseService from "./core/database";
import fs from 'fs'
const dataArray = JSON.parse(fs.readFileSync('src/dadaToken.json', 'utf-8'))

export const bootstrap = async () => {
  try {
    await DatabaseService.connect();

    DatabaseService.listenEvent();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
bootstrap();

