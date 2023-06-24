const express = require("express");
const Promise = require("bluebird");
const morgan = require("morgan");
const cors = require("cors");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc.js");
const { PrismaClient } = require("@prisma/client");
const _ = require("lodash");
const app = express();

// middeware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("tiny"));


const prisma = new PrismaClient();
dayjs.extend(utc);

app.get("/leaderboards", async (req, res, next) => {
  const limit = req.query.limit && Number(req.query.limit);
  const version = req.query.version;

  try {
    const leaderboards = await prisma.leaderboard.findMany({where: { version }, take: limit});
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
  try {
    const newEntry = await prisma.leaderboard.create({ data: req.body });
    res.json(newEntry);
  } catch (error) {
    next(error);
  }
});

app.delete('/leaderboards/:id', async (req, res, next) => {
  const token = req.query.lbToken;
  console.log(token);
  console.log(process.env.LB_TOKEN);
  if (process.env.LB_TOKEN && token === process.env.LB_TOKEN) {
    try {
      const id = Number(req.params.id);
      const leader = await prisma.leaderboard.delete({ where: { id } });
      res.json(leader);
    } catch (error) {
      next(error);
    }
  } else {
    res.sendStatus(404);
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`)
);
