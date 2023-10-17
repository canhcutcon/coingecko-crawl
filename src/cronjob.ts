import 'reflect-metadata'
import DatabaseService from './core/database'
import mongoose from 'mongoose'
import { insertNewCoins } from './modules/Cronjob/insertNewCoin'
import { updatePriceMarketCoins } from './modules/Cronjob/updatePriceMartket'

export async function bootstrap() {
	try {
		await DatabaseService.connect()
		DatabaseService.listenEvent()
		// insertNewCoins.start();
		updatePriceMarketCoins.start();
		// TODO here
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

process.on('SIGINT', function () {
	mongoose.connection.close()
	process.exit(1)
})

bootstrap()
