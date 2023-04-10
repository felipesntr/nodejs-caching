import express from "express";
import fetch from "node-fetch";
import { createClient } from "redis";
import { promisify } from "util";

const redisClient = createClient();
const redisGetAsync = promisify(redisClient.get).bind(redisClient);

async function getCovid19Stats() {
  const response = await fetch(`https://disease.sh/v3/covid-19/all`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

const app = express();
app.get("/covid", async (req, res) => {
  let stats = null;

  try {
    // try to get the data from the cache
    stats = await redisGetAsync("covidStats");
  } catch (err) {
    console.log(err);
  }

  // if data is in cache, send data to client
  if (stats != null) {
    res.status(200).send(JSON.parse(stats));
    return;
  }

  try {
    // otherwise, fetch data from API
    stats = await getCovid19Stats();

    // and store it in Redis. 3600 is the time to live in seconds
    redisClient.setex("covidStats", 3600, JSON.stringify(stats));
    res.status(200).send(stats);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
