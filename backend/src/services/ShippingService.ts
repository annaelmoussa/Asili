import Shipping from "../models/Shipping";
import { IShipping } from "../interfaces/IShipping";

export class ShippingService {
  async createShipping(shippingInfo: IShipping): Promise<IShipping> {
    return Shipping.create(shippingInfo);
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