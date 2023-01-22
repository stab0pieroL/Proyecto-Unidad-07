import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const jwt = require("jsonwebtoken");

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient()
const port = process.env.PORT;
app.use(express.json());


app.get('/', (req, res) => {
  res.send('');
});


app.post('/api/v1/users/',async (req, res) => {
  const { name, email, password, date_born } = req.body;

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
      date_born: new Date(date_born),
    },
  })
  res.json(user);
});


app.post('api/v1/users/login', (req, res)=>{





});

app.listen(port, () => {
  console.log(`El servidor se ejecuta en http://localhost:${port}`);
})