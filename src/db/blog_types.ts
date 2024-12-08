export interface BlogDBType {
  id: string;
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
  id: string;
  name: string;
}
