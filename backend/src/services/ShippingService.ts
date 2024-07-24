import Shipping from "../models/Shipping";
import { IShipping } from "../interfaces/IShipping";
import { FakeApiLaPosteService } from "./FakeApiLaPosteService";

export class ShippingService {
  private fakeApiLaPosteService: FakeApiLaPosteService = new FakeApiLaPosteService();

  async createShipping(shippingInfo: IShipping): Promise<IShipping> {
    return Shipping.create(shippingInfo);
  }

  async getTrackingInfo(trackingNumber: string): Promise<any> {
    return this.fakeApiLaPosteService.getTrackingInfo(trackingNumber);
  }

  async updateTrackingNumber(shippingId: string, trackingNumber: string): Promise<IShipping | null> {
    const shipping = await Shipping.findByPk(shippingId);
    if (shipping) {
      shipping.trackingNumber = trackingNumber;
      shipping.status = 'Shipped';
      await shipping.save();
      return shipping;
    }
    return null;
  }
}