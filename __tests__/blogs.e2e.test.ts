import { setDB, db } from '../src/db/db'
import { BlogDBType, CreateBlogType } from '../src/db/blog_types'
import { req } from './test-helpers'
import {dataset1} from './datasets'
import { SETTINGS } from '../src/settings'

describe(SETTINGS.PATH.BLOGS + '/', () => {

    beforeEach(async () => { 
      setDB(dataset1)
    })

    it('should get empty array', async () => {
      setDB()

      const res = await req
          .get(SETTINGS.PATH.BLOGS + '/')
          .expect(404) 
    })
    it('should get not empty array', async () => {
      const res = await req
          .get(SETTINGS.PATH.BLOGS + '/')
          .expect(200)

      expect(res.body.length).toBe(3)
      expect(res.body[0]).toEqual(dataset1.blogs[0])
    })

    it('should return blog by id', async () => {
      const response = await req.get(`${SETTINGS.PATH.BLOGS}/1`)
      expect(response.status).toBe(200)
      expect(response.body.name).toEqual(db.blogs[0]['name'])
    })

    it('should return 404 if blog not found', async () => {
        const response = await req.get(`${SETTINGS.PATH.BLOGS}/100`)
        expect(response.status).toBe(404)
    })

    it('should create blog', async () => {
        const newBlog:  Omit<BlogDBType, 'id'> = {
            name: 'Blog 4',
            description: 'Description 4',
            websiteUrl: 'https://blog4.com'
        }

        const response = await req.post(SETTINGS.PATH.BLOGS).send(newBlog)
        expect(response.status).toBe(201)
        expect(db.blogs).toContainEqual(expect.objectContaining(newBlog))
    })

    it('should update blog', async () => {
        const updatedBlog: BlogDBType = {
            id: '1',
            name: 'Blog 1 Updated',
            description: 'Description 1 Updated',
            websiteUrl: 'https://blog1.com'
        }
        console.log('test blogs: ', db.blogs)
        const response = await req.put(`${SETTINGS.PATH.BLOGS}/1`).send(updatedBlog)
        expect(response.status).toBe(200)
        expect(db.blogs).toContainEqual(updatedBlog)
    })

    it('should delete blog', async () => {
        const response = await req.delete(`${SETTINGS.PATH.BLOGS}/1`)
        expect(response.status).toBe(204)
        expect(db.blogs).not.toContainEqual({ id: '1' })
    })
})