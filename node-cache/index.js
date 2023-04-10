import express from "express";
import fetch from "node-fetch";
import NodeCache from "node-cache";

// stdTTL is the default time-to-live for each cache entry
const myCache = new NodeCache({ stdTTL: 600 });

// retrieve some data from an API
async function getPosts() {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

const app = express();
app.get("/posts", async (req, res) => {
  try {
    // try to get the posts from the cache
    let posts = myCache.get("allPosts");

    // if posts does not exist in the cache, retrieve it from the
    // original source and store it in the cache
    if (posts == null) {
      posts = await getPosts();
      // time-to-live is set to 300 seconds. After this period
      // the entry for `allPosts` will be removed from the cache
      // and the next request will hit the API again
      myCache.set("allPosts", posts, 300);
    }

    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
