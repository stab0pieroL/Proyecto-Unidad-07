/*
  Warnings:

  - You are about to drop the `Playlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Playlist";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PlaylistS" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "PlaylistS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genre" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "playlistId" INTEGER NOT NULL,
    "privacy" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Song_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "PlaylistS" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Song" ("album", "artist", "duration", "genre", "id", "name", "playlistId", "privacy", "year") SELECT "album", "artist", "duration", "genre", "id", "name", "playlistId", "privacy", "year" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
CREATE TABLE "new_PlaylistSong" (
    "id_songs" INTEGER NOT NULL,
    "id_playlist" INTEGER NOT NULL,
    "song_id" INTEGER NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    CONSTRAINT "PlaylistSong_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlaylistSong_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "PlaylistS" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlaylistSong" ("id_playlist", "id_songs", "playlist_id", "song_id") SELECT "id_playlist", "id_songs", "playlist_id", "song_id" FROM "PlaylistSong";
DROP TABLE "PlaylistSong";
ALTER TABLE "new_PlaylistSong" RENAME TO "PlaylistSong";
CREATE UNIQUE INDEX "PlaylistSong_id_songs_key" ON "PlaylistSong"("id_songs");
CREATE UNIQUE INDEX "PlaylistSong_id_playlist_key" ON "PlaylistSong"("id_playlist");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
