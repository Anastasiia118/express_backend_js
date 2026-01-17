import { BlogDBType, BlogQueryInput, CreateBlogType, BlogOutputType } from '../../types/blog_types';
import { blogRepository } from "../infrastructure/blogRepository";
import { PostQueryInput, PostOutputType, CreatePostType } from '../../types/post_types';

export const blogsService = {
    async createBlog(input: CreateBlogType): Promise<{ error?: string; id?: string; }> {
        return await blogRepository.create(input);
    },
    async getBlogById(id: string): Promise<{ error?: string; blog?: BlogOutputType; }> {
        const result = await blogRepository.findForOutput(id);
        if ('error' in result) {
            return { error: result.error };
        }
        return { blog: result };
    },
    async getAllBlogs(query: BlogQueryInput): Promise<{ blogs: BlogOutputType[]; totalCount: number }> {
        return await blogRepository.getBlogs(query); 
    },
    async getPostsByBlogId(query: PostQueryInput, blogId: string): Promise< | { posts: PostOutputType[]; totalCount: number;} | { error: string}> {
        const blog = await blogRepository.find(blogId);
        if (!blog) {
            return { error: 'Blog not found' };
        }
        return await blogRepository.getPostsByBlogId(query, blogId);
    },
    async createPostForBlog(postData: Omit<CreatePostType, 'blogId'> & { blogId: string }): Promise< PostOutputType | { error: string }> {
        const blog = await blogRepository.find(postData.blogId);
        if (!blog) {
            return { error: 'Blog not found' };
        }
        return await blogRepository.createPostForBlog({...postData}, blog.name);
    },
    async updateBlog(updateData: Partial<BlogDBType>,id: string): Promise<{ error?: string; id?: string; }> {
        return await blogRepository.update(updateData, id);
    },
    async deleteBlog(id: string): Promise<{ error?: string; id?: string; }> {
        return await blogRepository.delete(id);
    }
}