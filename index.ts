import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
const SECRET_KEY = "mysecretkey";

dotenv.config();
const app: Express = express();
const prisma = new PrismaClient()
const port = process.env.PORT;



app.use(express.json());


//creacion de usuario

app.post('/api/v1/users/', async (req, res) => {

  const { name, email, password, date_born, last_session, update_at } = req.body;
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
      date_born: new Date(date_born),
      last_session: new Date(last_session),
      update_at:new Date(update_at)
    },
  })
  res.json(user);
});

//Login de usuarios

app.post('api/v1/users/login', async (req, res) => {

  const user = await prisma.user.findOne({
    where: {
      username: req.body.name
    }
  });
  const valid = await bcrypt.compare(req.body.password, user.password);

  if (!valid) {
    return res.status(401).send('Credenciales inválidas');
  }
});

//Creación de playlists

app.post("/api/v1/playlists", async (req, res) => {
  const { title, user_id } = req.body;
  const playlist = await prisma.playlist.create({
    data: {
      title,
      user: {
        connect: {
          id: user_id,
        },
      },
    },
  });
  res.json(playlist);
});

//Agregar canción a la playlist deseada

app.post("api/v1/playlists/:id/songs", async (req, res) => {
  try {
    const { id } = req.params;
    const {songId} = req.body;
    const playlist = await prisma.playlist.findOne({
      where: {
        id,
      },
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const song = await prisma.song.findOne({
      where: {
        id:songId
      },
    });

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
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

//Crear canciones

app.post("/api/v1/songs", async (req, res) => {
  try {
    const { name, artist, album, year, genre, duration, privacy } = req.body;

    const song = await prisma.song.create({
      data: {
        name,
        artist,
        album,
        year,
        genre,
        duration,
        privacy
      },
    });

    return res.json(song);
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
});

//Obtener lista de  las canciones agregadas

app.get("/songs", async (req, res) => {
  const songs = await prisma.song.findMany();
  res.json(songs);
});

//Obtener canción por id

app.get("/songs/:id", async (req, res) => {
  const { id } = req.params;
  const song = await prisma.song.findOne({
    where: {
      id,
    },
  });
  if (!song) {
    return res.status(404).json({ error: "Song not found" });
  }
  res.json(song);
});

app.listen(port, () => {
  console.log(`El servidor se ejecuta en http://localhost:${port}`);
})