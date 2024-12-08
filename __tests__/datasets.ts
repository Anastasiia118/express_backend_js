import { BlogDBType } from "../src/db/blog_types";
import { PostDBType } from "../src/db/post_types";
import { DBType } from "../src/db/db";

export const blogDataset: BlogDBType[] = [
  {
    id: "1",
    name: "Blog 1",
    description: "Description 1",
    websiteUrl: "https://blog1.com",
  },
  {
    id: "2",
    name: "Blog 2",
    description: "Description 2",
    websiteUrl: "https://blog2.com",
  },
  {
    id: "3",
    name: "Blog 3",
    description: "Description 3",
    websiteUrl: "https://blog3.com",
  },
];

export const postDataset: PostDBType[] = [
  {
    id: "1",
    title: "Post 1",
    shortDescription: "Short description 1",
    content: "Content 1",
    blogId: "1",
    blogName: "Blog 1",
  },
  {
    id: "2",
    title: "Post 2",
    shortDescription: "Short description 2",
    content: "Content 2",
    blogId: "2",
    blogName: "Blog 2",
  },
  {
    id: "3",
    title: "Post 3",
    shortDescription: "Short description 3",
    content: "Content 3",
    blogId: "3",
    blogName: "Blog 3",
  },
];

export const dataset1: DBType = {
  posts: postDataset,
  blogs: blogDataset,
};
