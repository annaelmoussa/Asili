"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WidgetsService_1 = require("../services/WidgetsService");
const WidgetDataService_1 = require("../services/WidgetDataService");
const Widget_1 = __importDefault(require("../models/Widget"));
jest.mock("../models/Widget");
jest.mock("../services/WidgetDataService");
describe("WidgetsService", () => {
    let widgetsService;
    let mockWidgetDataService;
    beforeEach(() => {
        mockWidgetDataService =
            new WidgetDataService_1.WidgetDataService();
        widgetsService = new WidgetsService_1.WidgetsService();
        widgetsService.widgetDataService = mockWidgetDataService;
        jest.clearAllMocks();
    });
    describe("getAllByUser", () => {
        it("should return all widgets for a user", async () => {
            const mockWidgets = [
                { id: "1", name: "Widget 1" },
                { id: "2", name: "Widget 2" },
            ];
            Widget_1.default.findAll.mockResolvedValue(mockWidgets);
            const result = await widgetsService.getAllByUser("user1");
            expect(Widget_1.default.findAll).toHaveBeenCalledWith({
                where: { userId: "user1" },
            });
            expect(result).toEqual(mockWidgets);
        });
    });
    describe("create", () => {
        it("should create a new widget", async () => {
            const mockWidgetData = {
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
            Widget_1.default.create.mockResolvedValue(mockCreatedWidget);
            const result = await widgetsService.create("user1", mockWidgetData);
            expect(Widget_1.default.create).toHaveBeenCalledWith({
                ...mockWidgetData,
                userId: "user1",
            });
            expect(result).toEqual(mockCreatedWidget);
        });
    });
    describe("update", () => {
        it("should update an existing widget", async () => {
            const mockWidgetData = {
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
            Widget_1.default.findByPk.mockResolvedValue(mockWidget);
            const result = await widgetsService.update("1", mockWidgetData);
            expect(Widget_1.default.findByPk).toHaveBeenCalledWith("1");
            expect(mockWidget.update).toHaveBeenCalledWith(mockWidgetData);
            expect(result).toEqual({ id: "1", ...mockWidgetData });
        });
        it("should return null if widget is not found", async () => {
            Widget_1.default.findByPk.mockResolvedValue(null);
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
            Widget_1.default.findByPk.mockResolvedValue(mockWidget);
            await widgetsService.delete("1");
            expect(Widget_1.default.findByPk).toHaveBeenCalledWith("1");
            expect(mockWidget.destroy).toHaveBeenCalled();
        });
        it("should not throw if widget is not found", async () => {
            Widget_1.default.findByPk.mockResolvedValue(null);
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
            Widget_1.default.findByPk.mockResolvedValue(mockWidget);
            mockWidgetDataService.getDataForWidget.mockResolvedValue(mockData);
            const result = await widgetsService.getWidgetWithData("1");
            expect(Widget_1.default.findByPk).toHaveBeenCalledWith("1");
            expect(mockWidgetDataService.getDataForWidget).toHaveBeenCalledWith(mockWidget);
            expect(result).toEqual({
                id: "1",
                name: "Widget 1",
                modelType: "Products",
                data: mockData,
            });
        });
        it("should return null if widget is not found", async () => {
            Widget_1.default.findByPk.mockResolvedValue(null);
            const result = await widgetsService.getWidgetWithData("1");
            expect(result).toBeNull();
        });
    });
    describe("getWidgetData", () => {
        it("should return data for a model type", async () => {
            const mockData = { someData: "data" };
            mockWidgetDataService.getDataForModelType.mockResolvedValue(mockData);
            const result = await widgetsService.getWidgetData("Products");
            expect(mockWidgetDataService.getDataForModelType).toHaveBeenCalledWith("Products");
            expect(result).toEqual(mockData);
        });
    });
});
