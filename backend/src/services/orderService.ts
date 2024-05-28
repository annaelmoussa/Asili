import { ICrud } from "../interfaces/ICrud";
import { IOrder } from "../interfaces/IOrder";
import OrderPostgres from "../models/orderModelPostgres";

class OrderService implements ICrud<IOrder> {
  async findAll(): Promise<IOrder[]> {
    return await OrderPostgres.findAll();
  }

  async findById(id: string): Promise<IOrder | null> {
    return await OrderPostgres.findByPk(id);
  }

  async create(item: Partial<IOrder>): Promise<IOrder> {
    if (
      !item.userId ||
      !item.productId ||
      item.quantity === undefined ||
      !item.status
    ) {
      throw new Error("Missing required fields");
    }
    return await OrderPostgres.create(item as Omit<IOrder, "id">);
  }

  async update(id: string, item: Partial<IOrder>): Promise<IOrder | null> {
    const [_, [updatedItem]] = await OrderPostgres.update(item, {
      where: { id },
      returning: true,
    });
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    await OrderPostgres.destroy({ where: { id } });
  }
}

export default new OrderService();
