import { serve } from 'bun'
import index from './index.html'
import './styles.css'

import { Client } from 'pg'
const client = new Client({
  user: 'postgres',
  password: 'password',
  host: process.env.DB_HOST ?? 'localhost',
  database: 'postgres',
})
await client.connect()

await client.query(`
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    secret VARCHAR(255) NOT NULL
);`)

await client.query(`
INSERT INTO users (username, password, secret)
VALUES
  ('A', 'Apple', 'Apple Pie'),
  ('B', 'Banana', 'Banana Smoothie'),
  ('C', 'Cantaloupe', 'Cantaloupe Salad'),
  ('D', 'Dragon Fruit', 'Dragon Fruit Smoothie'),
  ('E', 'Elderberry', 'Elder Berry Syrup'),
  ('F', 'Fig', 'Fig Jam')
ON CONFLICT (username) DO NOTHING;`)

const server = serve({
  routes: {
    '/': index,

    // The route where the user can login
    '/api/login': {
      async POST(req) {
        const json = await req.json()
        const username = json.username ?? ''
        const password = json.password ?? ''
        console.log('username: ', username)
        console.log('password: ', password)

        const query = `SELECT * FROM users WHERE username = $1 AND password = $2;`
        console.log('query:', query)

        const res = await client.query(query, [username, password])
        const user = res.rows.at(0)

        if (user == null) {
          return Response.json('Invalid username or password')
        }

        return Response.json(user)
      },
    },
  },
})

console.log(`Bun server listening on port localhost:${server.port}`)
