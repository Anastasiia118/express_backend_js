export interface PostDBType {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  blogName: string;
}

export interface PostOutputType {
  id: string;
  title: string;
}

export interface CreatePostType {
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
}