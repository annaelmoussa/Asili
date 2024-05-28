import { IAuth } from "../interfaces/IAuth";
import AuthMongo from "../models/authModelMongo";

class AuthService {
  async register(auth: IAuth): Promise<IAuth> {
    const newUser = new AuthMongo(auth);
    return await newUser.save();
  }

  async findByEmail(email: string): Promise<IAuth | null> {
    return await AuthMongo.findOne({ email });
  }


}

export default new AuthService();
