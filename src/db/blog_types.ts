export interface BlogDBType {
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
