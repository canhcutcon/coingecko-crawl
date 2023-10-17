import AppConfig from '@/core/config'
import { CronJob } from 'cron'
import CoinGeckoService from '../CoinGecko/service'

export const updatePriceMarketCoins = new CronJob(
    AppConfig.cronTime.insertNewToken,
    async () => {
        await updatePriceMarketCoinsCron();
    },
    null,
    true
)

export const updatePriceMarketCoinsCron = async () => {
    try {
        console.info(`Start fetch data market price coingecko: ${new Date().toISOString()}`);
        console.info('Fetch data market price  coingecko result: ', !!(await CoinGeckoService.updateDataCoinGecko()));
    } catch (error) {
        console.error('Fetch data market price coingecko error: ', error);
    }
}
