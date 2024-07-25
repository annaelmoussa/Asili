import { v4 as uuidv4 } from "uuid";
import { WidgetsService } from "../services/WidgetsService";
import { IWidget, WidgetCreationParams } from "../interfaces/IWidget";
import Widget from "../models/Widget";

jest.mock("../models/Widget");

describe("WidgetsService", () => {
  let widgetsService: WidgetsService;
  let mockSequelize: any;
  const userId = uuidv4();

  beforeEach(() => {
    jest.resetAllMocks();
    mockSequelize = {
      transaction: jest.fn(() => ({
        commit: jest.fn(),
        rollback: jest.fn(),
      })),
    };
    widgetsService = new WidgetsService(mockSequelize);
  });

  describe("create", () => {
    it("should create a widget", async () => {
      const widgetCreationParams: WidgetCreationParams = {
        name: "Test Widget",
        type: "Chart",
        settings: { dataSource: "API" },
        x: 0,
        y: 0,
        w: 2,
        h: 2,
        userId,
      };

      const mockCreatedWidget: IWidget = {
        id: uuidv4(),
        ...widgetCreationParams,
      };

      (Widget.create as jest.Mock).mockResolvedValue(mockCreatedWidget);

      const result = await widgetsService.create(userId, widgetCreationParams);

      expect(Widget.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...widgetCreationParams,
          userId,
        })
      );
      expect(result).toEqual(mockCreatedWidget);
    });
  });

  describe("getAllByUser", () => {
    it("should get all widgets by user", async () => {
      const mockWidgets: IWidget[] = [
        {
          id: uuidv4(),
          name: "Widget 1",
          type: "Chart",
          settings: { dataSource: "API" },
          x: 0,
          y: 0,
          w: 2,
          h: 2,
          userId,
        },
        {
          id: uuidv4(),
          name: "Widget 2",
          type: "Table",
          settings: { columns: ["A", "B", "C"] },
          x: 2,
          y: 0,
          w: 3,
          h: 3,
          userId,
        },
      ];

      (Widget.findAll as jest.Mock).mockResolvedValue(mockWidgets);

      const result = await widgetsService.getAllByUser(userId);

      expect(Widget.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
        })
      );
      expect(result).toEqual(mockWidgets);
    });
  });

  describe("update", () => {
    it("should update a widget", async () => {
      const widgetId = uuidv4();
      const updateParams: WidgetCreationParams = {
        name: "Updated Widget",
        type: "Pie Chart",
        settings: { dataSource: "Database" },
        x: 1,
        y: 1,
        w: 3,
        h: 3,
        userId,
      };

      const mockUpdatedWidget: IWidget = {
        id: widgetId,
        ...updateParams,
      };

      const mockWidget = {
        update: jest.fn().mockResolvedValue(mockUpdatedWidget),
      };

      (Widget.findByPk as jest.Mock).mockResolvedValue(mockWidget);

      const result = await widgetsService.update(widgetId, updateParams);

      expect(Widget.findByPk).toHaveBeenCalledWith(widgetId, expect.objectContaining({}));
      expect(mockWidget.update).toHaveBeenCalledWith(updateParams, expect.any(Object));
      expect(result).toEqual(mockUpdatedWidget);
    });

    it("should return null when updating a non-existing widget", async () => {
      const nonExistingId = uuidv4();
      const updateParams: WidgetCreationParams = {
        name: "Non-existing Widget",
        type: "Unknown",
        settings: {},
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        userId,
      };

      (Widget.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await widgetsService.update(nonExistingId, updateParams);

      expect(Widget.findByPk).toHaveBeenCalledWith(nonExistingId, expect.any(Object));
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete a widget", async () => {
      const widgetId = uuidv4();
      
      // Mock de la méthode destroy de Widget
      (Widget.destroy as jest.Mock).mockResolvedValue(1);
  
      const result = await widgetsService.delete(widgetId);
  
      expect(Widget.destroy).toHaveBeenCalledWith(expect.objectContaining);
      expect(result).toBe(true);
    });
  });
});