import { ICrud } from "../interfaces/ICrud";
import UserMongo, { IUserMongo } from "../models/userModelMongo";

class UserService implements ICrud<IUserMongo> {
  async findAll(): Promise<IUserMongo[]> {
    return await UserMongo.find();
  }

  async findById(id: string): Promise<IUserMongo | null> {
    return await UserMongo.findById(id);
  }

  async create(item: Partial<IUserMongo>): Promise<IUserMongo> {
    const newUser = new UserMongo(item);
    return await newUser.save();
  }

  async update(
    id: string,
    item: Partial<IUserMongo>
  ): Promise<IUserMongo | null> {
    return await UserMongo.findByIdAndUpdate(id, item, { new: true });
  }

  async delete(id: string): Promise<void> {
    await UserMongo.findByIdAndDelete(id);
  }
}

export default new UserService();
