-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "last_session" DATETIME NOT NULL,
    "update_at" DATETIME NOT NULL,
    "date_born" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genre" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "playlistId" INTEGER NOT NULL,
    "privacy" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Song_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlaylistSong" (
    "id_songs" INTEGER NOT NULL,
    "id_playlist" INTEGER NOT NULL,
    "song_id" INTEGER NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    CONSTRAINT "PlaylistSong_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlaylistSong_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistSong_id_songs_key" ON "PlaylistSong"("id_songs");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistSong_id_playlist_key" ON "PlaylistSong"("id_playlist");
