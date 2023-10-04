import ApiResponse from "@/core/api-response";
import { Controller, Get } from "@/core/decorators";

@Controller('/app', "App")
export default class AppController {

    @Get('/', 'Hi')
    getApp() {
        return ApiResponse.Success('Hello')
    }
}