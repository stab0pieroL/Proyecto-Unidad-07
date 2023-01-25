import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { validateAuthorization } from "./middleware.js";


dotenv.config();
const app: Express = express();
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.get("/", validateAuthorization, async (req, res) => {
  const users = await prisma.user.findMany();

  return res.json(users);
});

//creacion de usuario

app.post('/api/v1/users/', async (req, res) => {

  const username = req.body.name;
  const token = jwt.sign({ name: username }, "0d166abf5c9cdf6eb17c2b225c0f4100f40f1df1766c17d817434a1283edd8d705a4135f7a429391e7ec54fffe4bcd86541dfaf5674e734bfb702ca68908507a"
  , {
    expiresIn: "1800s",
  });
  res.status(201).json({ token: token });
});


function authenticateToken(req: Request, res:Response, next:NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "0d166abf5c9cdf6eb17c2b225c0f4100f40f1df1766c17d817434a1283edd8d705a4135f7a429391e7ec54fffe4bcd86541dfaf5674e734bfb702ca68908507a"
  , (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

//Login de usuarios

app.post('api/v1/users/login', async (req, res) => {
  const { email, password} = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    return res.status(401).send('Credenciales inválidas');
  }

  const valid = await bcrypt.compare(req.body.password, user.password);

  if (!valid) {
    return res.status(401).send('Credenciales inválidas');
  }
});

//Crear canciones

app.post("/api/v1/songs", async (req: Request, res: Response) => {
  const data = req.body;
  try{
    const song = await prisma.song.create({
      data
    });
    return res.json({ message: 'Musica creada' ,song});  
  }catch (e) {
    return res.status(500).json({ message: 'Error al crear la canción', e });
  }
});

//Obtener lista de  las canciones agregadas

app.get("/songs", async (req, res) => {
  const songs = await prisma.song.findMany();
  res.json(songs);
});

//Obtener canción por id

app.get("/api/v1/songs/:id", async (req, res) => {
  const { id } = req.body;
  const song = await prisma.song.findUnique({
    where: {
      id
    },
  });
  if (!song) {
    return res.status(404).json({ error: "Canción no encontrada" });
  }
  res.json(song);
});


//Creación de playlists

app.post("/api/v1/playlists", async (req, res) => {
  const {  name, user_id} = req.body;
  const playlist = await prisma.playlist.create({
    data: {
     name,
     user: { connect: { id: user_id } },
    },
  });
  return res.json({ message: 'Playlist created successfully' ,playlist});  
});

//Agregar canción a la playlist deseada

app.post("api/v1/playlists/:id/songs", async (req, res) => {
  try {
    const { id } = req.params;
    const {songId} = req.body;
    const playlist = await prisma.playlist.findUnique({
      where: {
        id
      },
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist no encontrada" });
    }

    const song = await prisma.song.findUnique({
      where: {
        id: songId
      },
    });

    if (!song) {
      return res.status(404).json({ error: "Canción no encontrada" });
    }

    const playlistSong = await prisma.playlistSong.create({
      data: {
        song: {
          connect: {
            id:songId
          }
        },
        playlist: {
          connect: {
            id
          }
        },
      },
    });

    return res.json(playlistSong);
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
});


app.listen(PORT, () => {
  console.log(`El servidor se ejecuta en http://localhost:${PORT}`);
})