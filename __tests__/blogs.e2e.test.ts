import { setDB, db } from '../src/db/db'
import { BlogDBType, CreateBlogType } from '../src/types/blog_types'
import { req } from './test-helpers'
import {dataset1} from './datasets'
import { SETTINGS } from '../src/settings'
import { runDb } from '../src/db/mongoDb'

import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from "mongodb";
import { info } from 'console'

let mongoServer: MongoMemoryServer;
let clientMongo:  MongoClient;
 
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  clientMongo = (await runDb(uri)) as MongoClient
  if(!clientMongo) {
    throw new Error("Error connecting to database")
  }
 })
afterAll(async () => {
  await clientMongo.close()
  await mongoServer.stop()

})

describe(SETTINGS.PATH.BLOGS + '/', () => {
    let blogs: any[];

    beforeEach(async () => { 
      await clientMongo.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.BLOGS).deleteMany({})
      const info = await clientMongo.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.BLOGS).insertMany([
          { name: 'Blog 1', description: 'Description 1', websiteUrl: 'http://blog1.com' },
          { name: 'Blog 2', description: 'Description 2', websiteUrl: 'http://blog2.com' },
          { name: 'Blog 3', description: 'Description 3', websiteUrl: 'http://blog3.com' }
      ])
      blogs = await clientMongo.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.BLOGS).find().toArray()
    })
    const buff2 = Buffer.from(SETTINGS.AUTHORIZATION, 'utf8')
    const auth = `Basic ${buff2.toString('base64')}`

    it('should get empty array', async () => {
      await clientMongo.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.BLOGS).deleteMany({})

      const res = await req
          .get(SETTINGS.PATH.BLOGS + '/')
          .expect(404) 
    })
    it('should get not empty array', async () => {
      const res = await req
          .get(SETTINGS.PATH.BLOGS + '/')
          .expect(200)

      expect(res.body.length).toBe(3)
    })

    it('should return blog by id', async () => {
      const response = await req.get(`${SETTINGS.PATH.BLOGS}/${blogs[0]._id.toString()}`)
      expect(response.status).toBe(200)
      expect(response.body.name).toEqual(blogs[0].name)
    })

    it('should return 404 if blog not found', async () => {
        const response = await req.get(`${SETTINGS.PATH.BLOGS}/100000000000000000000000`)
        expect(response.status).toBe(404)
    })

    it('should create blog', async () => {
        const newBlog:  CreateBlogType = {
            name: 'Blog 4',
            description: 'Description 4',
            websiteUrl: 'https://blog4.com',
        }

        const response = await req.post(SETTINGS.PATH.BLOGS)
        .send(newBlog)
        .set({'Authorization': auth})
        expect(response.status).toBe(201)
        expect(response.body).toEqual(expect.objectContaining(newBlog))
    })

    it('should update blog', async () => {
      const updatedBlog: Partial<BlogDBType> = {
          name: 'Blog 1 Updated',
          description: 'Description 1 Updated',
          websiteUrl: 'https://blog1.com'
      }
      const response = await req.put(`${SETTINGS.PATH.BLOGS}/${blogs[0]._id.toString()}`).send(updatedBlog)
      .set({'Authorization': auth})
      expect(response.status).toBe(204)
    })

    it('should delete blog', async () => {
      const blogId = blogs[0]._id.toString()
      const response = await req.delete(`${SETTINGS.PATH.BLOGS}/${blogId}`)
      .set({'Authorization': auth})
      expect(response.status).toBe(204)
      expect(response.body).toEqual({})
    })
})