import { UserOutputType, UserDBType, UsersQueryFieldsType } from "../user_types";
import { usersCollection } from "../../db/mongoDb";
import { ObjectId, WithId } from "mongodb";
import { PaginationAndSorting, IPagination } from "../../types/common_types";

export const usersQwRepository = {
  async findAllUsers(
    sortQueryDto: UsersQueryFieldsType,
  ): Promise<IPagination<UserOutputType[]>> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    }  = sortQueryDto;

    const loginAndEmailFilter: any = {};
    if (searchLoginTerm || searchEmailTerm) {
        const orConditions = [];
        
        if (searchLoginTerm) {
            orConditions.push({ 
            login: { $regex: searchLoginTerm, $options: 'i' } 
            });
        }
        
        if (searchEmailTerm) {
            orConditions.push({ 
            email: { $regex: searchEmailTerm, $options: 'i' } 
            });
        }
        
        loginAndEmailFilter.$or = orConditions;
    }

    const totalCount = await usersCollection.countDocuments(loginAndEmailFilter);

    const users = await usersCollection.find(loginAndEmailFilter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: users.map((u) => this._getInView(u)),
    };
  },
  async findById(id: string): Promise<UserOutputType | null> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    return user ? this._getInView(user) : null;
  },
  _getInView(user: WithId<UserDBType>): UserOutputType {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  },
  _checkObjectId(id: string): boolean {
    return ObjectId.isValid(id);
  },
};
