"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ShippingService_1 = require("../services/ShippingService");
const Shipping_1 = __importDefault(require("../models/Shipping"));
const FakeApiLaPosteService_1 = require("../services/FakeApiLaPosteService");
jest.mock("../models/Shipping");
jest.mock("../services/FakeApiLaPosteService");
describe("ShippingService", () => {
    let shippingService;
    let mockFakeApiLaPosteService;
    beforeEach(() => {
        shippingService = new ShippingService_1.ShippingService();
        mockFakeApiLaPosteService =
            new FakeApiLaPosteService_1.FakeApiLaPosteService();
        shippingService.fakeApiLaPosteService = mockFakeApiLaPosteService;
        jest.clearAllMocks();
    });
    describe("createShipping", () => {
        it("should create a new shipping", async () => {
            const mockShippingInfo = {
                orderId: "order123",
                status: "Pending",
                address: "123 Test St, Test City, 12345",
                trackingNumber: "",
            };
            const mockCreatedShipping = { ...mockShippingInfo, id: "shipping123" };
            Shipping_1.default.create.mockResolvedValue(mockCreatedShipping);
            const result = await shippingService.createShipping(mockShippingInfo);
            expect(Shipping_1.default.create).toHaveBeenCalledWith(mockShippingInfo);
            expect(result).toEqual(mockCreatedShipping);
        });
    });
    describe("getTrackingInfo", () => {
        it("should return tracking info for a given tracking number", async () => {
            const mockTrackingNumber = "track123";
            const mockTrackingInfo = {
                trackingCode: mockTrackingNumber,
                status: "In Transit",
                location: "Test City",
                timestamp: new Date(),
                history: [
                    {
                        status: "Shipped",
                        location: "Origin City",
                        timestamp: new Date(Date.now() - 86400000),
                    },
                ],
            };
            mockFakeApiLaPosteService.getTrackingInfo.mockResolvedValue(mockTrackingInfo);
            const result = await shippingService.getTrackingInfo(mockTrackingNumber);
            expect(mockFakeApiLaPosteService.getTrackingInfo).toHaveBeenCalledWith(mockTrackingNumber);
            expect(result).toEqual(mockTrackingInfo);
        });
    });
    describe("updateTrackingNumber", () => {
        it("should update tracking number and status for an existing shipping", async () => {
            const mockShippingId = "shipping123";
            const mockTrackingNumber = "track123";
            const mockShipping = {
                id: mockShippingId,
                orderId: "order123",
                status: "Pending",
                address: "123 Test St, Test City, 12345",
                trackingNumber: "",
                save: jest.fn(),
            };
            Shipping_1.default.findByPk.mockResolvedValue(mockShipping);
            const result = await shippingService.updateTrackingNumber(mockShippingId, mockTrackingNumber);
            expect(Shipping_1.default.findByPk).toHaveBeenCalledWith(mockShippingId);
            expect(mockShipping.trackingNumber).toBe(mockTrackingNumber);
            expect(mockShipping.status).toBe("Shipped");
            expect(mockShipping.save).toHaveBeenCalled();
            expect(result).toEqual(mockShipping);
        });
        it("should return null if shipping is not found", async () => {
            const mockShippingId = "nonexistent123";
            const mockTrackingNumber = "track123";
            Shipping_1.default.findByPk.mockResolvedValue(null);
            const result = await shippingService.updateTrackingNumber(mockShippingId, mockTrackingNumber);
            expect(Shipping_1.default.findByPk).toHaveBeenCalledWith(mockShippingId);
            expect(result).toBeNull();
        });
    });
});
