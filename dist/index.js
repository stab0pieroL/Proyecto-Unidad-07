"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const middleware_js_1 = require("./middleware.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.get("/", middleware_js_1.validateAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    return res.json(users);
}));
//creacion de usuario
app.post('/api/v1/users/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.name;
    const token = jsonwebtoken_1.default.sign({ name: username }, "0d166abf5c9cdf6eb17c2b225c0f4100f40f1df1766c17d817434a1283edd8d705a4135f7a429391e7ec54fffe4bcd86541dfaf5674e734bfb702ca68908507a", {
        expiresIn: "1800s",
    });
    res.status(201).json({ token: token });
}));
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, "0d166abf5c9cdf6eb17c2b225c0f4100f40f1df1766c17d817434a1283edd8d705a4135f7a429391e7ec54fffe4bcd86541dfaf5674e734bfb702ca68908507a", (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
}
//Login de usuarios
app.post('api/v1/users/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        return res.status(401).send('Credenciales inválidas');
    }
    const valid = yield bcrypt_1.default.compare(req.body.password, user.password);
    if (!valid) {
        return res.status(401).send('Credenciales inválidas');
    }
}));
//Crear canciones
app.post("/api/v1/songs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const song = yield prisma.song.create({
            data
        });
        return res.json({ message: 'Musica creada', song });
    }
    catch (e) {
        return res.status(500).json({ message: 'Error al crear la canción', e });
    }
}));
//Obtener lista de  las canciones agregadas
app.get("/songs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield prisma.song.findMany();
    res.json(songs);
}));
//Obtener canción por id
app.get("/api/v1/songs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const song = yield prisma.song.findUnique({
        where: {
            id
        },
    });
    if (!song) {
        return res.status(404).json({ error: "Canción no encontrada" });
    }
    res.json(song);
}));
//Creación de playlists
app.post("/api/v1/playlists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, user_id } = req.body;
    const playlist = yield prisma.playlist.create({
        data: {
            name,
            user: { connect: { id: user_id } },
        },
    });
    return res.json({ message: 'Playlist created successfully', playlist });
}));
//Agregar canción a la playlist deseada
app.post("api/v1/playlists/:id/songs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { songId } = req.body;
        const playlist = yield prisma.playlist.findUnique({
            where: {
                id
            },
        });
        if (!playlist) {
            return res.status(404).json({ error: "Playlist no encontrada" });
        }
        const song = yield prisma.song.findOne({
            where: {
                id: songId
            },
        });
        if (!song) {
            return res.status(404).json({ error: "Canción no encontrada" });
        }
        const playlistSong = yield prisma.playlistSong.create({
            data: {
                song: {
                    connect: {
                        id: songId
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
    }
    catch (error) {
        return res.status(500).json({ error: "Error" });
    }
}));
app.listen(PORT, () => {
    console.log(`El servidor se ejecuta en http://localhost:${PORT}`);
});
