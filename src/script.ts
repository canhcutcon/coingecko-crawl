import DatabaseService from "./core/database";
import fs from 'fs'
import ChainSeed from "./modules/Chain/seed";
import CoinGeckoSeed from "./modules/CoinGecko/seed";
// const dataArray = JSON.parse(fs.readFileSync('src/dadaToken.json', 'utf-8'))

export const bootstrap = async () => {
  try {
    await DatabaseService.connect();
    DatabaseService.listenEvent();
    // await ChainSeed.seedData();

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
bootstrap();

