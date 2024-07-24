import { WidgetsService } from "../services/WidgetsService";
import { WidgetDataService } from "../services/WidgetDataService";
import Widget from "../models/Widget";
import { IWidget, WidgetCreationParams } from "../interfaces/IWidget";

jest.mock("../models/Widget");
jest.mock("../services/WidgetDataService");

describe("WidgetsService", () => {
  let widgetsService: WidgetsService;
  let mockWidgetDataService: jest.Mocked<WidgetDataService>;

  beforeEach(() => {
    mockWidgetDataService =
      new WidgetDataService() as jest.Mocked<WidgetDataService>;
    widgetsService = new WidgetsService();
    (widgetsService as any).widgetDataService = mockWidgetDataService;
    jest.clearAllMocks();
  });

  describe("getAllByUser", () => {
    it("should return all widgets for a user", async () => {
      const mockWidgets = [
        { id: "1", name: "Widget 1" },
        { id: "2", name: "Widget 2" },
      ];
      (Widget.findAll as jest.Mock).mockResolvedValue(mockWidgets);

      const result = await widgetsService.getAllByUser("user1");

      expect(Widget.findAll).toHaveBeenCalledWith({
        where: { userId: "user1" },
      });
      expect(result).toEqual(mockWidgets);
    });
  });

  describe("create", () => {
    it("should create a new widget", async () => {
      const mockWidgetData: WidgetCreationParams = {
        name: "New Widget",
        modelType: "Products",
        type: "",
        settings: undefined,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        userId: "",
      };
      const mockCreatedWidget = { id: "1", ...mockWidgetData, userId: "user1" };
      (Widget.create as jest.Mock).mockResolvedValue(mockCreatedWidget);

      const result = await widgetsService.create("user1", mockWidgetData);

      expect(Widget.create).toHaveBeenCalledWith({
        ...mockWidgetData,
        userId: "user1",
      });
      expect(result).toEqual(mockCreatedWidget);
    });
  });

  describe("update", () => {
    it("should update an existing widget", async () => {
      const mockWidgetData: WidgetCreationParams = {
        name: "Updated Widget",
        type: "",
        settings: undefined,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        userId: "",
        modelType: "",
      };
      const mockWidget = {
        id: "1",
        update: jest.fn().mockResolvedValue({ id: "1", ...mockWidgetData }),
      };
      (Widget.findByPk as jest.Mock).mockResolvedValue(mockWidget);

      const result = await widgetsService.update("1", mockWidgetData);

      expect(Widget.findByPk).toHaveBeenCalledWith("1");
      expect(mockWidget.update).toHaveBeenCalledWith(mockWidgetData);
      expect(result).toEqual({ id: "1", ...mockWidgetData });
    });

    it("should return null if widget is not found", async () => {
      (Widget.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await widgetsService.update("1", {
        name: "Updated Widget",
        type: "",
        settings: undefined,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        userId: "",
        modelType: "",
      });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an existing widget", async () => {
      const mockWidget = { id: "1", destroy: jest.fn() };
      (Widget.findByPk as jest.Mock).mockResolvedValue(mockWidget);

      await widgetsService.delete("1");

      expect(Widget.findByPk).toHaveBeenCalledWith("1");
      expect(mockWidget.destroy).toHaveBeenCalled();
    });

    it("should not throw if widget is not found", async () => {
      (Widget.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(widgetsService.delete("1")).resolves.not.toThrow();
    });
  });

  describe("getWidgetWithData", () => {
    it("should return widget with data", async () => {
      const mockWidget = {
        id: "1",
        name: "Widget 1",
        modelType: "Products",
        toJSON: jest.fn().mockReturnValue({
          id: "1",
          name: "Widget 1",
          modelType: "Products",
        }),
      };
      const mockData = { someData: "data" };
      (Widget.findByPk as jest.Mock).mockResolvedValue(mockWidget);
      mockWidgetDataService.getDataForWidget.mockResolvedValue(mockData);

      const result = await widgetsService.getWidgetWithData("1");

      expect(Widget.findByPk).toHaveBeenCalledWith("1");
      expect(mockWidgetDataService.getDataForWidget).toHaveBeenCalledWith(
        mockWidget
      );
      expect(result).toEqual({
        id: "1",
        name: "Widget 1",
        modelType: "Products",
        data: mockData,
      });
    });

    it("should return null if widget is not found", async () => {
      (Widget.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await widgetsService.getWidgetWithData("1");

      expect(result).toBeNull();
    });
  });

  describe("getWidgetData", () => {
    it("should return data for a model type", async () => {
      const mockData = { someData: "data" };
      mockWidgetDataService.getDataForModelType.mockResolvedValue(mockData);

      const result = await widgetsService.getWidgetData("Products");

      expect(mockWidgetDataService.getDataForModelType).toHaveBeenCalledWith(
        "Products"
      );
      expect(result).toEqual(mockData);
    });
  });
});
