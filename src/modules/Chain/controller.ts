import { Controller, Get, Params, ParamsValidation } from "@/core/decorators";
import ChainService from "./service";
import { IdParams } from '../../core/utils/request-type/index';

@Controller('/chains', 'Chain')
export default class ChainController {
    @Get('/', 'Get all chain')
    async getAll() {
        const chains = await ChainService.getAll();
        return chains;
    }

    @Get('/{chainId}', 'Get chain detail')
    @ParamsValidation(IdParams)
    async getDetail(@Params('id') chainId: number) {
        const res = await ChainService.getDetail(chainId);
        return res;
    }
}
