import RGPDModule from "../models/RGPDModule";
import { v4 as uuidv4 } from "uuid";
import {
  IRGPDModule,
  CreateRGPDModuleDTO,
  UpdateRGPDModuleDTO,
} from "../interfaces/IRGPDModule";

export class RGPDService {
  public async createModule(
    moduleData: CreateRGPDModuleDTO
  ): Promise<IRGPDModule> {
    const newModule = await RGPDModule.create({
      ...moduleData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IRGPDModule);
    return newModule.toJSON() as IRGPDModule;
  }

  public async getModule(id: string): Promise<IRGPDModule | null> {
    const module = await RGPDModule.findByPk(id);
    return module ? (module.toJSON() as IRGPDModule) : null;
  }

  public async getAllModules(): Promise<IRGPDModule[]> {
    const modules = await RGPDModule.findAll();
    return modules.map((module) => module.toJSON() as IRGPDModule);
  }

  public async updateModule(
    id: string,
    moduleData: UpdateRGPDModuleDTO
  ): Promise<IRGPDModule | null> {
    const module = await RGPDModule.findByPk(id);
    if (module) {
      const updatedModule = await module.update(moduleData);
      return updatedModule.toJSON() as IRGPDModule;
    }
    return null;
  }

  public async deleteModule(id: string): Promise<boolean> {
    const module = await RGPDModule.findByPk(id);
    if (module) {
      await module.destroy();
      return true;
    }
    return false;
  }

  public async exportModules(): Promise<IRGPDModule[]> {
    const modules = await RGPDModule.findAll();
    return modules.map((module) => module.toJSON() as IRGPDModule);
  }
}
