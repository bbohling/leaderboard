/*
  Warnings:

  - You are about to drop the `LeaderboardEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `description` on the `Leaderboard` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Leaderboard` table. All the data in the column will be lost.
  - Added the required column `damage` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kills` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wave` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LeaderboardEntry";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Leaderboard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "wave" INTEGER NOT NULL,
    "damage" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "kills" INTEGER NOT NULL,
    "version" TEXT NOT NULL
);
INSERT INTO "new_Leaderboard" ("id", "version") SELECT "id", "version" FROM "Leaderboard";
DROP TABLE "Leaderboard";
ALTER TABLE "new_Leaderboard" RENAME TO "Leaderboard";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
