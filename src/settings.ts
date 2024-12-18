import {config} from 'dotenv'
config() // Load .env file
 
export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing/all-data',
    },
    AUTHORIZATION: 'admin:qwerty',
}