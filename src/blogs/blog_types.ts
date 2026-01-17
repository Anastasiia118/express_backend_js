import { ObjectId } from "mongodb";
import { PaginationAndSorting } from "../types/common_types";

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
export enum BlogSortField {
  Name = 'name',
  CreatedAt = 'createdAt',
  WebsiteUrl = 'websiteUrl',
}

export type BlogQueryInput = PaginationAndSorting<BlogSortField> & 
 Partial<{
    searchNameTerm: string;
    // searchBlogEmailTerm: string;
    // searchBlogWebsiteUrlTerm: string;
  }>;