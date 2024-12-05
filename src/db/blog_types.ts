export interface BlogDBType {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
}

export interface CreateBlogType {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface BlogOutputType {
  id: number;
  name: string;
}
