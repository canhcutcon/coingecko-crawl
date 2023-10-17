import AppConfig from '@/core/config'
import { CronJob } from 'cron'
import CoinGeckoService from '../CoinGecko/service'

export const insertNewCoins = new CronJob(
    AppConfig.cronTime.insertNewToken,
    async () => {
        await insertNewCoinsCron();
    },
    null,
    true
)

export const insertNewCoinsCron = async () => {
    try {
        console.info(`Start fetch new data coingecko: ${new Date().toISOString()}`);
        console.info('Fetch new data coingecko result: ', !!(await CoinGeckoService.fetchNewToken()));
    } catch (error) {
        console.error('Fetch new data coingecko error: ', error);
    }
}
