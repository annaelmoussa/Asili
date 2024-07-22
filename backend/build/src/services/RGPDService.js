"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RGPDService = void 0;
const RGPDModule_1 = __importDefault(require("../models/RGPDModule"));
const uuid_1 = require("uuid");
class RGPDService {
    async createModule(moduleData) {
        const newModule = await RGPDModule_1.default.create({
            ...moduleData,
            id: (0, uuid_1.v4)(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return newModule.toJSON();
    }
    async getModule(id) {
        const module = await RGPDModule_1.default.findByPk(id);
        return module ? module.toJSON() : null;
    }
    async getAllModules() {
        const modules = await RGPDModule_1.default.findAll();
        return modules.map((module) => module.toJSON());
    }
    async updateModule(id, moduleData) {
        const module = await RGPDModule_1.default.findByPk(id);
        if (module) {
            const updatedModule = await module.update(moduleData);
            return updatedModule.toJSON();
        }
        return null;
    }
    async deleteModule(id) {
        const module = await RGPDModule_1.default.findByPk(id);
        if (module) {
            await module.destroy();
            return true;
        }
        return false;
    }
    async exportModules() {
        const modules = await RGPDModule_1.default.findAll();
        return modules.map((module) => module.toJSON());
    }
}
exports.RGPDService = RGPDService;
