"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const FakeApiLaPosteService_1 = require("../services/FakeApiLaPosteService");
jest.mock("axios");
const mockedAxios = axios_1.default;
describe("FakeApiLaPosteService", () => {
    let fakeApiLaPosteService;
    beforeEach(() => {
        fakeApiLaPosteService = new FakeApiLaPosteService_1.FakeApiLaPosteService();
        jest.clearAllMocks();
    });
    describe("generateTrackingNumber", () => {
        it("should return a tracking number", async () => {
            const mockTrackingCode = "ABC123456789";
            mockedAxios.get.mockResolvedValueOnce({
                data: { trackingCode: mockTrackingCode },
            });
            const result = await fakeApiLaPosteService.generateTrackingNumber();
            expect(mockedAxios.get).toHaveBeenCalledWith("http://fakeapilaposte:3000/generate-tracking");
            expect(result).toBe(mockTrackingCode);
        });
        it("should throw an error if the API call fails", async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error("API error"));
            await expect(fakeApiLaPosteService.generateTrackingNumber()).rejects.toThrow("API error");
        });
    });
    describe("getTrackingInfo", () => {
        it("should return tracking information", async () => {
            const mockTrackingCode = "ABC123456789";
            const mockTrackingInfo = {
                trackingCode: mockTrackingCode,
                status: "In Transit",
                location: "Paris",
                timestamp: new Date(),
                history: [
                    {
                        status: "Shipped",
                        location: "Lyon",
                        timestamp: new Date(Date.now() - 86400000), // 1 day ago
                    },
                ],
            };
            mockedAxios.get.mockResolvedValueOnce({ data: mockTrackingInfo });
            const result = await fakeApiLaPosteService.getTrackingInfo(mockTrackingCode);
            expect(mockedAxios.get).toHaveBeenCalledWith(`http://fakeapilaposte:3000/tracking/${mockTrackingCode}`);
            expect(result).toEqual(mockTrackingInfo);
        });
        it("should throw an error if the API call fails", async () => {
            const mockTrackingCode = "ABC123456789";
            mockedAxios.get.mockRejectedValueOnce(new Error("API error"));
            await expect(fakeApiLaPosteService.getTrackingInfo(mockTrackingCode)).rejects.toThrow("API error");
        });
    });
});