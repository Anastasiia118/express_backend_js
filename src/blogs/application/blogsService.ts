import { BlogDBType, CreateBlogType, BlogOutputType } from '../../types/blog_types';
import { blogRepository } from "../blogRepository";
import { BlogQueryInput } from '../../types/blog_types';

export const blogsService = {
    async createBlog(input: CreateBlogType): Promise<{ error?: string; id?: string; }> {
        return await blogRepository.create(input);
    },
    async getBlogById(id: string): Promise<{ error?: string; id?: string; }> {
        return await blogRepository.findForOutput(id);
    },
    async getAllBlogs(query: BlogQueryInput): Promise<{ blogs: BlogOutputType[]; totalCount: number }> {
        return await blogRepository.getBlogs(query); 
    },
    async updateBlog(id: string, input: Partial<BlogDBType>): Promise<{ error?: string; id?: string; }> {
        return await blogRepository.update(input, id);
    },
    async deleteBlog(id: string): Promise<{ error?: string; id?: string; }> {
        return await blogRepository.delete(id);
    }
}