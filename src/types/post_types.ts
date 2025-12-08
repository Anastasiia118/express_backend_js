import { ObjectId, WithId } from "mongodb";
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
export type PostsOutputType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostOutputType[];
};


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

export type PostQueryInput = PaginationAndSorting<PostSortField>

export function mapToPostsListPaginatedOutput(
  posts: PostOutputType[],
  meta: { totalCount: number; pageSize: number; pageNumber: number }
) {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: posts
  };
}
export const getPostViewModel = (post: WithId<PostDBType>): PostOutputType => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  }
}
export const PostSortFields = {
  title: 'title',
  createdAt: 'createdAt',
  blogName: 'blogName'
}