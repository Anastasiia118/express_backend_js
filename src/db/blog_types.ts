import { ObjectId } from "mongodb";

export interface BlogDBType {
  _id?: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface BlogOutputType {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface CreateBlogType {
  name: string;
  description: string;
  websiteUrl: string;
}
