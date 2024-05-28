import { ICrud } from "../interfaces/ICrud";
import { IProduct } from "../interfaces/IProduct";
import ProductPostgres from "../models/productModelPostgres";

class ProductService implements ICrud<IProduct> {
  async findAll(): Promise<IProduct[]> {
    return await ProductPostgres.findAll();
  }

  async findById(id: string): Promise<IProduct | null> {
    return await ProductPostgres.findByPk(id);
  }

  async create(item: Partial<IProduct>): Promise<IProduct> {
    if (
      !item.name ||
      !item.description ||
      item.price === undefined ||
      !item.category ||
      item.stock === undefined
    ) {
      throw new Error("Missing required fields");
    }
    return await ProductPostgres.create(item as Omit<IProduct, "id">);
  }

  async update(id: string, item: Partial<IProduct>): Promise<IProduct | null> {
    const [_, [updatedItem]] = await ProductPostgres.update(item, {
      where: { id },
      returning: true,
    });
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    await ProductPostgres.destroy({ where: { id } });
  }
}

export default new ProductService();
