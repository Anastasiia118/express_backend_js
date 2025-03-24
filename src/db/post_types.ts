import { ObjectId } from "mongodb";

export interface PostDBType {
  _id?: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string; 
}

export interface PostOutputType {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export interface CreatePostType {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}