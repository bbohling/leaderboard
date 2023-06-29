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
    "version" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Leaderboard" ("damage", "difficulty", "id", "kills", "score", "user", "version", "wave") SELECT "damage", "difficulty", "id", "kills", "score", "user", "version", "wave" FROM "Leaderboard";
DROP TABLE "Leaderboard";
ALTER TABLE "new_Leaderboard" RENAME TO "Leaderboard";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
