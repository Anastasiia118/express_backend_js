import { ObjectId, WithId } from "mongodb";
import { UserDBType } from "../user_types";
import { usersCollection } from "../../db/mongoDb";

export const usersRepository = {
  async create(user: UserDBType): Promise<string> {
    const newUser = await usersCollection.insertOne({ ...user });
    return newUser.insertedId.toString();
  },
  async delete(id: string): Promise<boolean> {
    const isDel = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return isDel.deletedCount === 1;
  },
  async findById(id: string): Promise<WithId<UserDBType> | null> {
    return usersCollection.findOne({ _id: new ObjectId(id) });
  },
  async findByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<UserDBType> | null> {
    return await usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  },
};
