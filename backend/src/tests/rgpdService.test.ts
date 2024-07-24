import { RGPDService } from "../services/RGPDService";
import RGPDModule from "../models/RGPDModule";
import {
  IRGPDModule,
  CreateRGPDModuleDTO,
  UpdateRGPDModuleDTO,
} from "../interfaces/IRGPDModule";
import { v4 as uuidv4 } from "uuid";


jest.mock("../models/RGPDModule");
jest.mock("uuid");

describe("RGPDService", () => {
  let rgpdService: RGPDService;

  beforeEach(() => {
    rgpdService = new RGPDService();
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue("mocked-uuid");
  });

  describe("createModule", () => {
    it("should create a new RGPD module", async () => {
      const mockModuleData: CreateRGPDModuleDTO = {
        name: "Test Module",
        content: "Test Content",
        type: "popup",
        requiresAcceptance: true,
      };
      const mockCreatedModule: IRGPDModule = {
        ...mockModuleData,
        id: "mocked-uuid",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (RGPDModule.create as jest.Mock).mockResolvedValue({
        toJSON: jest.fn().mockReturnValue(mockCreatedModule),
      });

      const result = await rgpdService.createModule(mockModuleData);

      expect(RGPDModule.create).toHaveBeenCalledWith({
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
      const mockModule: IRGPDModule = {
        id: "mocked-uuid",
        name: "Test Module",
        content: "Test Content",
        type: "text_block",
        requiresAcceptance: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (RGPDModule.findByPk as jest.Mock).mockResolvedValue({
        toJSON: jest.fn().mockReturnValue(mockModule),
      });

      const result = await rgpdService.getModule("mocked-uuid");

      expect(RGPDModule.findByPk).toHaveBeenCalledWith("mocked-uuid");
      expect(result).toEqual(mockModule);
    });

    it("should return null if module is not found", async () => {
      (RGPDModule.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await rgpdService.getModule("non-existent-id");

      expect(RGPDModule.findByPk).toHaveBeenCalledWith("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("getAllModules", () => {
    it("should return all RGPD modules", async () => {
      const mockModules: IRGPDModule[] = [
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
      (RGPDModule.findAll as jest.Mock).mockResolvedValue(
        mockModules.map((module) => ({
          toJSON: jest.fn().mockReturnValue(module),
        }))
      );

      const result = await rgpdService.getAllModules();

      expect(RGPDModule.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockModules);
    });
  });

  describe("updateModule", () => {
    it("should update an existing module", async () => {
      const mockUpdateData: UpdateRGPDModuleDTO = {
        name: "Updated Module",
        type: "text_block",
      };
      const mockUpdatedModule: IRGPDModule = {
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
      (RGPDModule.findByPk as jest.Mock).mockResolvedValue(mockModule);

      const result = await rgpdService.updateModule(
        "mocked-uuid",
        mockUpdateData
      );

      expect(RGPDModule.findByPk).toHaveBeenCalledWith("mocked-uuid");
      expect(mockModule.update).toHaveBeenCalledWith(mockUpdateData);
      expect(result).toEqual(mockUpdatedModule);
    });

    it("should return null if module to update is not found", async () => {
      (RGPDModule.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await rgpdService.updateModule("non-existent-id", {
        name: "Updated Module",
      });

      expect(RGPDModule.findByPk).toHaveBeenCalledWith("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("deleteModule", () => {
    it("should delete an existing module", async () => {
      const mockModule = {
        destroy: jest.fn().mockResolvedValue(undefined),
      };
      (RGPDModule.findByPk as jest.Mock).mockResolvedValue(mockModule);

      const result = await rgpdService.deleteModule("mocked-uuid");

      expect(RGPDModule.findByPk).toHaveBeenCalledWith("mocked-uuid");
      expect(mockModule.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should return false if module to delete is not found", async () => {
      (RGPDModule.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await rgpdService.deleteModule("non-existent-id");

      expect(RGPDModule.findByPk).toHaveBeenCalledWith("non-existent-id");
      expect(result).toBe(false);
    });
  });

  describe("exportModules", () => {
    it("should export all RGPD modules", async () => {
      const mockModules: IRGPDModule[] = [
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
      (RGPDModule.findAll as jest.Mock).mockResolvedValue(
        mockModules.map((module) => ({
          toJSON: jest.fn().mockReturnValue(module),
        }))
      );

      const result = await rgpdService.exportModules();

      expect(RGPDModule.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockModules);
    });
  });
});
