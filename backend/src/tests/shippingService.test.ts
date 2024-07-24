import { ShippingService } from "../services/ShippingService";
import Shipping from "../models/Shipping";
import { IShipping } from "../interfaces/IShipping";
import { FakeApiLaPosteService } from "../services/FakeApiLaPosteService";


jest.mock("../models/Shipping");
jest.mock("../services/FakeApiLaPosteService");

describe("ShippingService", () => {
  let shippingService: ShippingService;
  let mockFakeApiLaPosteService: jest.Mocked<FakeApiLaPosteService>;

  beforeEach(() => {
    shippingService = new ShippingService();
    mockFakeApiLaPosteService =
      new FakeApiLaPosteService() as jest.Mocked<FakeApiLaPosteService>;
    (shippingService as any).fakeApiLaPosteService = mockFakeApiLaPosteService;
    jest.clearAllMocks();
  });

  describe("createShipping", () => {
    it("should create a new shipping", async () => {
      const mockShippingInfo: IShipping = {
        orderId: "order123",
        status: "Pending",
        address: "123 Test St, Test City, 12345",
        trackingNumber: "",
      };
      const mockCreatedShipping = { ...mockShippingInfo, id: "shipping123" };
      (Shipping.create as jest.Mock).mockResolvedValue(mockCreatedShipping);

      const result = await shippingService.createShipping(mockShippingInfo);

      expect(Shipping.create).toHaveBeenCalledWith(mockShippingInfo);
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
      mockFakeApiLaPosteService.getTrackingInfo.mockResolvedValue(
        mockTrackingInfo
      );

      const result = await shippingService.getTrackingInfo(mockTrackingNumber);

      expect(mockFakeApiLaPosteService.getTrackingInfo).toHaveBeenCalledWith(
        mockTrackingNumber
      );
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
      (Shipping.findByPk as jest.Mock).mockResolvedValue(mockShipping);

      const result = await shippingService.updateTrackingNumber(
        mockShippingId,
        mockTrackingNumber
      );

      expect(Shipping.findByPk).toHaveBeenCalledWith(mockShippingId);
      expect(mockShipping.trackingNumber).toBe(mockTrackingNumber);
      expect(mockShipping.status).toBe("Shipped");
      expect(mockShipping.save).toHaveBeenCalled();
      expect(result).toEqual(mockShipping);
    });

    it("should return null if shipping is not found", async () => {
      const mockShippingId = "nonexistent123";
      const mockTrackingNumber = "track123";
      (Shipping.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await shippingService.updateTrackingNumber(
        mockShippingId,
        mockTrackingNumber
      );

      expect(Shipping.findByPk).toHaveBeenCalledWith(mockShippingId);
      expect(result).toBeNull();
    });
  });
});
