import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient()
const port = process.env.PORT;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.post('/api/v1/users/login',async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
    },
  })
  res.json(user);
});

app.listen(port, () => {
  console.log(`El servidor se ejecuta en http://localhost:${port}`);
})