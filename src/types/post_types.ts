import { ObjectId } from "mongodb";
import { PaginationAndSorting } from "./common_types";

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
export enum PostSortField {
  Title = 'title',
  CreatedAt = 'createdAt',
  BlogName = 'blogName',
}

export type PostQueryInput = PaginationAndSorting<PostSortField> & 
 Partial<{
    searchTitleTerm: string;
    searchBlogNameTerm: string;
  }>;