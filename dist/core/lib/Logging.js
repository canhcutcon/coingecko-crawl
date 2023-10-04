var _a;
import chalk from "chalk";
class Logging {
}
_a = Logging;
Logging.log = (args) => _a.info(args);
Logging.info = (args) => console.log(chalk.blue(`[${new Date().toLocaleDateString()}][INFO]`), typeof args === 'string' ? chalk.blueBright(args) : args);
Logging.warn = (args) => console.log(chalk.yellow(`[${new Date().toLocaleDateString()}][INFO]`), typeof args === 'string' ? chalk.yellowBright(args) : args);
Logging.error = (args) => console.log(chalk.red(`[${new Date().toLocaleDateString()}][INFO]`), typeof args === 'string' ? chalk.redBright(args) : args);
export default Logging;