import { PostDBType } from '../posts/post_types'
import { BlogDBType } from '../blogs/blog_types'

export type DBType = { 
  posts: PostDBType[]
  blogs: BlogDBType[]
}

export const db: DBType = { // создаём базу данных (пока это просто переменная)
  posts: [],
  blogs: [],
}

// функция для быстрой очистки/заполнения базы данных для тестов
export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
      db.posts = []
      db.blogs = []
      return
  }

  // если что-то передано - то заменяем старые значения новыми
  db.posts = dataset.posts || []
  db.blogs = dataset.blogs || []
  // db.some = dataset.some || db.some
}