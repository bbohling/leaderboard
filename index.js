const express = require("express");
const Promise = require("bluebird");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
var session = require("express-session");
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc.js");
const { PrismaClient } = require("@prisma/client");
const _ = require("lodash");

const app = express();

// middeware
app.use(express.json());
// app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("tiny"));
// app.use(
//   session({
//     secret: process.env.EXPRESS_SESSION_SECRET,
//     resave: true,
//     saveUninitialized: false,
//     cookie: {
//       secure: false, // set this to true on production
//     },
//   })
// );

const prisma = new PrismaClient();
dayjs.extend(utc);

app.get("/leaderboards", async (req, res, next) => {
  try {
    const leaderboards = await prisma.leaderboard.findMany();
    const results = {
      results: leaderboards?.length,
      data: leaderboards
    }
    res.json(results);
  } catch (error) {
    next(error);
  }
});

app.post("/leaderboards", async (req, res, next) => {
  console.log(req.body);
  try {
    const newEntry = await prisma.leaderboard.create({ data: JSON.stringify(req.body) });
    res.json(newEntry);
  } catch (error) {
    next(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`)
);
