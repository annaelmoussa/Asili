import { ICrud } from "../interfaces/ICrud";
import StockMongo, { IStockMongo } from "../models/stockModelMongo";

class StockService implements ICrud<IStockMongo> {
  async findAll(): Promise<IStockMongo[]> {
    return await StockMongo.find();
  }

  async findById(id: string): Promise<IStockMongo | null> {
    return await StockMongo.findById(id);
  }

  async create(item: Partial<IStockMongo>): Promise<IStockMongo> {
    const newStock = new StockMongo(item);
    return await newStock.save();
  }

  async update(
    id: string,
    item: Partial<IStockMongo>
  ): Promise<IStockMongo | null> {
    return await StockMongo.findByIdAndUpdate(id, item, { new: true });
  }

  async delete(id: string): Promise<void> {
    await StockMongo.findByIdAndDelete(id);
  }
}

export default new StockService();
