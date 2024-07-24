"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RGPDService_1 = require("../services/RGPDService");
const RGPDModule_1 = __importDefault(require("../models/RGPDModule"));
const uuid_1 = require("uuid");
jest.mock("../models/RGPDModule");
jest.mock("uuid");
describe("RGPDService", () => {
    let rgpdService;
    beforeEach(() => {
        rgpdService = new RGPDService_1.RGPDService();
        jest.clearAllMocks();
        uuid_1.v4.mockReturnValue("mocked-uuid");
    });
    describe("createModule", () => {
        it("should create a new RGPD module", async () => {
            const mockModuleData = {
                name: "Test Module",
                content: "Test Content",
                type: "popup",
                requiresAcceptance: true,
            };
            const mockCreatedModule = {
                ...mockModuleData,
                id: "mocked-uuid",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            RGPDModule_1.default.create.mockResolvedValue({
                toJSON: jest.fn().mockReturnValue(mockCreatedModule),
            });
            const result = await rgpdService.createModule(mockModuleData);
            expect(RGPDModule_1.default.create).toHaveBeenCalledWith({
                ...mockModuleData,
                id: "mocked-uuid",
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
            expect(result).toEqual(mockCreatedModule);
        });
    });
    describe("getModule", () => {
        it("should return a module by id", async () => {
            const mockModule = {
                id: "mocked-uuid",
                name: "Test Module",
                content: "Test Content",
                type: "text_block",
                requiresAcceptance: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            RGPDModule_1.default.findByPk.mockResolvedValue({
                toJSON: jest.fn().mockReturnValue(mockModule),
            });
            const result = await rgpdService.getModule("mocked-uuid");
            expect(RGPDModule_1.default.findByPk).toHaveBeenCalledWith("mocked-uuid");
            expect(result).toEqual(mockModule);
        });
        it("should return null if module is not found", async () => {
            RGPDModule_1.default.findByPk.mockResolvedValue(null);
            const result = await rgpdService.getModule("non-existent-id");
            expect(RGPDModule_1.default.findByPk).toHaveBeenCalledWith("non-existent-id");
            expect(result).toBeNull();
        });
    });
    describe("getAllModules", () => {
        it("should return all RGPD modules", async () => {
            const mockModules = [
                {
                    id: "mocked-uuid-1",
                    name: "Module 1",
                    content: "Content 1",
                    type: "popup",
                    requiresAcceptance: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: "mocked-uuid-2",
                    name: "Module 2",
                    content: "Content 2",
                    type: "text_block",
                    requiresAcceptance: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            RGPDModule_1.default.findAll.mockResolvedValue(mockModules.map((module) => ({
                toJSON: jest.fn().mockReturnValue(module),
            })));
            const result = await rgpdService.getAllModules();
            expect(RGPDModule_1.default.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockModules);
        });
    });
    describe("updateModule", () => {
        it("should update an existing module", async () => {
            const mockUpdateData = {
                name: "Updated Module",
                type: "text_block",
            };
            const mockUpdatedModule = {
                id: "mocked-uuid",
                name: "Updated Module",
                content: "Original Content",
                type: "text_block",
                requiresAcceptance: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockModule = {
                update: jest.fn().mockResolvedValue({
                    toJSON: jest.fn().mockReturnValue(mockUpdatedModule),
                }),
            };
            RGPDModule_1.default.findByPk.mockResolvedValue(mockModule);
            const result = await rgpdService.updateModule("mocked-uuid", mockUpdateData);
            expect(RGPDModule_1.default.findByPk).toHaveBeenCalledWith("mocked-uuid");
            expect(mockModule.update).toHaveBeenCalledWith(mockUpdateData);
            expect(result).toEqual(mockUpdatedModule);
        });
        it("should return null if module to update is not found", async () => {
            RGPDModule_1.default.findByPk.mockResolvedValue(null);
            const result = await rgpdService.updateModule("non-existent-id", {
                name: "Updated Module",
            });
            expect(RGPDModule_1.default.findByPk).toHaveBeenCalledWith("non-existent-id");
            expect(result).toBeNull();
        });
    });
    describe("deleteModule", () => {
        it("should delete an existing module", async () => {
            const mockModule = {
                destroy: jest.fn().mockResolvedValue(undefined),
            };
            RGPDModule_1.default.findByPk.mockResolvedValue(mockModule);
            const result = await rgpdService.deleteModule("mocked-uuid");
            expect(RGPDModule_1.default.findByPk).toHaveBeenCalledWith("mocked-uuid");
            expect(mockModule.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });
        it("should return false if module to delete is not found", async () => {
            RGPDModule_1.default.findByPk.mockResolvedValue(null);
            const result = await rgpdService.deleteModule("non-existent-id");
            expect(RGPDModule_1.default.findByPk).toHaveBeenCalledWith("non-existent-id");
            expect(result).toBe(false);
        });
    });
    describe("exportModules", () => {
        it("should export all RGPD modules", async () => {
            const mockModules = [
                {
                    id: "mocked-uuid-1",
                    name: "Module 1",
                    content: "Content 1",
                    type: "popup",
                    requiresAcceptance: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: "mocked-uuid-2",
                    name: "Module 2",
                    content: "Content 2",
                    type: "text_block",
                    requiresAcceptance: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            RGPDModule_1.default.findAll.mockResolvedValue(mockModules.map((module) => ({
                toJSON: jest.fn().mockReturnValue(module),
            })));
            const result = await rgpdService.exportModules();
            expect(RGPDModule_1.default.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockModules);
        });
    });
});
