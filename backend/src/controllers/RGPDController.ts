import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Route,
  Tags,
  Delete,
  Security,
  OperationId,
} from "tsoa";
import { RGPDService } from "../services/RGPDService";
import {
  IRGPDModule,
  CreateRGPDModuleDTO,
  UpdateRGPDModuleDTO,
} from "../interfaces/IRGPDModule";

@Route("rgpd")
@Tags("RGPD")
export class RGPDController extends Controller {
  private rgpdService: RGPDService = new RGPDService();

  @Security("jwt", ["ROLE_ADMIN"])
  @Post()
  @OperationId("createRGPDModule")
  public async createModule(
    @Body() moduleData: CreateRGPDModuleDTO
  ): Promise<IRGPDModule> {
    return this.rgpdService.createModule(moduleData);
  }

  @Get("{id}")
  @OperationId("getRGPDModule")
  public async getModule(@Path() id: string): Promise<IRGPDModule | null> {
    return this.rgpdService.getModule(id);
  }

  @Get()
  @OperationId("getAllRGPDModules")
  public async getAllModules(): Promise<IRGPDModule[]> {
    return this.rgpdService.getAllModules();
  }

  @Security("jwt", ["ROLE_ADMIN"])
  @Put("{id}")
  @OperationId("updateRGPDModule")
  public async updateModule(
    @Path() id: string,
    @Body() moduleData: UpdateRGPDModuleDTO
  ): Promise<IRGPDModule | null> {
    return this.rgpdService.updateModule(id, moduleData);
  }

  @Security("jwt", ["ROLE_ADMIN"])
  @Delete("{id}")
  @OperationId("deleteRGPDModule")
  public async deleteModule(@Path() id: string): Promise<boolean> {
    return this.rgpdService.deleteModule(id);
  }

  @Security("jwt", ["ROLE_ADMIN"])
  @Get("export")
  @OperationId("exportRGPDModules")
  public async exportModules(): Promise<IRGPDModule[]> {
    return this.rgpdService.exportModules();
  }
}
