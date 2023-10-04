import DatabaseService from "./core/database";

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