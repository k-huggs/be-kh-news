const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
const obj = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("status 200: returns an array of topics objects with the properties of slug and description", async () => {
    const res = await request(app).get("/api/topics").expect(200);
    expect(res.body.topics).toBeInstanceOf(Array);
    expect(res.body.topics).toHaveLength(3);
    res.body.topics.forEach((res) => {
      expect(res).toEqual(
        expect.objectContaining({
          description: expect.any(String),
          slug: expect.any(String),
        })
      );
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status 200: article object specified by the article id returned, with additional comment_count included", async () => {
    const res = await request(app).get("/api/articles/1").expect(200);
    expect(res.body.article).toBeInstanceOf(Object);
    expect(res.body.article).toEqual(
      expect.objectContaining({
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 100,
        comment_count: expect.any(Number),
      })
    );
  });

  test("status 404: error handler responds with a message when article id entered is not in the system", async () => {
    const res = await request(app).get("/api/articles/123456").expect(404);
    expect(res.body.msg).toBe("Article Id Not Found");
  });

  test("status 400: error handler responds with a message when non-official article id entered", async () => {
    const res = await request(app).get("/api/articles/borat").expect(400);
    expect(res.body.msg).toBe(
      "Invalid Server Request Made, Expected Number Not String"
    );
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status 200: Request body accepts an object with update to votes, the updated article is returned", async () => {
    const body = { inc_votes: 1 };
    const res = await request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(200);
    expect(res.body.article).toBeInstanceOf(Object);
    expect(res.body.article).toEqual(
      expect.objectContaining({
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 101,
      })
    );
  });

  test("status 200: Request body accepts an empty object and returns the original article unchanged", async () => {
    const body = {};
    const res = await request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(200);
    expect(res.body.article).toBeInstanceOf(Object);
    expect(res.body.article).toEqual(
      expect.objectContaining({
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 100,
      })
    );
  });

  test("status 200: Request body accepts an object with update to votes, the updated article is returned", async () => {
    const body = { inc_votes: -100 };
    const res = await request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(200);
    expect(res.body.article).toBeInstanceOf(Object);
    expect(res.body.article).toEqual(
      expect.objectContaining({
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 0,
      })
    );
  });

  test("status 404: error handler responds with a message when article id entered is not in the system", async () => {
    const body = { inc_votes: 1 };
    const res = await request(app)
      .patch("/api/articles/123456")
      .send(body)
      .expect(404);
    expect(res.body.msg).toBe("Article Id Not Found");
  });

  test("status 400: error handler responds with a message when non-official article id entered", async () => {
    const body = { inc_votes: 1 };
    const res = await request(app)
      .patch("/api/articles/borat")
      .send(body)
      .expect(400);
    expect(res.body.msg).toBe(
      "Invalid Server Request Made, Expected Number Not String"
    );
  });

  test("status 400: error handler responds with a message when non-official votes property entered", async () => {
    const body = { inc_votes: "foxnews" };
    const res = await request(app)
      .patch("/api/articles/borat")
      .send(body)
      .expect(400);
    expect(res.body.msg).toBe(
      "Invalid Server Request Made, Expected Number Not String"
    );
  });
});

describe.only("GET /api/articles", () => {
  test("status 200: responds with an array of article objects, which can be sorted by column but defaults to date", async () => {
    const res = await request(app).get("/api/articles").expect(200);
    console.log(res.body.articles);
    expect(res.body.articles).toBeSorted();
    expect(Array.isArray(res.body.articles)).toBe(true);
    res.body.articles.forEach((articles) => {
      expect(articles).toEqual(
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        })
      );
    });
  });

  test("status 200: responds with an array of article objects, all with the topic of mitch", async () => {
    const res = await request(app).get("/api/articles?topic=mitch").expect(200);
    expect(res.body.articles).toBeSortedBy("topic");
    expect(Array.isArray(res.body.articles)).toBe(true);
    res.body.articles.forEach((articles) => {
      expect(articles).toEqual(
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: "mitch",
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        })
      );
    });
  });

  test("status 200: responds with an array of article objects, ordered in ascending order ", async () => {
    const res = await request(app).get("/api/articles?order=ASC").expect(200);
    expect(res.body.articles).toBeSorted();
    expect(Array.isArray(res.body.articles)).toBe(true);
    res.body.articles.forEach((articles) => {
      expect(articles).toEqual(
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        })
      );
    });
  });

  test("status 200: responds with an array of article objects, sorted by author, defaulted to descending order ", async () => {
    const res = await request(app)
      .get("/api/articles?sort_by=author")
      .expect(200);
    expect(res.body.articles).toBeSorted({ descending: true });
    expect(Array.isArray(res.body.articles)).toBe(true);
    expect(res.body.articles[0]).toEqual(
      expect.objectContaining({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: "rogersop",
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      })
    );
  });

  test("status 400: return Invalid Sort Query, when sort value is not a column in the table", () => {
    return request(app)
      .get("/api/articles?sort_by=Luiz")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid Sort Query");
      });
  });

  test("status 400: returns Invalid Order Query, when order isn't ASC or DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=Mbappe")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid Order Query");
      });
  });

  test("status 404: returns Topic Not Found when an invalid topic is passed", () => {
    return request(app)
      .get("/api/articles?topic=Chri52v^£2sNolan")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Topic Not Found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200, responds with an array of comments for a given article_id", async () => {
    const res = await request(app).get("/api/articles/1/comments").expect(200);
    expect(Array.isArray(res.body.comments)).toBe(true);
    expect(res.body.comments).toHaveLength(11);
    res.body.comments.forEach((comment) => {
      expect(comment).toEqual(
        expect.objectContaining({
          article_id: 1,
        })
      );
    });
  });

  test("status 200, responds with an empty object when given a valid article_id with no comments", async () => {
    const res = await request(app).get("/api/articles/2/comments").expect(200);
    expect(res.body.comments).toEqual([]);
  });

  test("status 404, responds with Article Id Not Found when a string is passed in instead of article id", async () => {
    const res = await request(app)
      .get("/api/articles/2000/comments")
      .expect(404);
    expect(res.body.msg).toBe("Article Id Not Found");
  });

  test("status 400, responds with Invalid Server Request when string passed instead of article_id", async () => {
    const res = await request(app)
      .get("/api/articles/aisha/comments")
      .expect(400);
    expect(res.body.msg).toBe(
      "Invalid Server Request Made, Expected Number Not String"
    );
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status 201, accepts an object with the username and comment body and responds with the posted comment", async () => {
    const body = { username: "lurker", body: "it's lit y'all" };
    const res = await request(app)
      .post("/api/articles/2/comments")
      .send(body)
      .expect(201);
    const { newComment } = res.body;
    console.log(newComment);
    expect(newComment.body).toBe("it's lit y'all");
  });
  test("status 201, accepts an object with unnecessary properties and returns the posted comment", async () => {
    const body = { username: "lurker", body: "it's lit y'all", id: 2 };
    const res = await request(app)
      .post("/api/articles/2/comments")
      .send(body)
      .expect(201);
    const { newComment } = res.body;
    expect(newComment.body).toBe("it's lit y'all");
  });
  test("status 400, invalid ID, e.g. string of 'not and ID'", async () => {
    const body = { username: "lurker", body: "new fit just dropped" };
    const res = await request(app)
      .post("/api/articles/notanID/comments")
      .send(body)
      .expect(400);
    expect(res.body.msg).toBe(
      "Invalid Server Request Made, Expected Number Not String"
    );
  });
  test("status 404, non existant ID, i.e. 0 or 90000", async () => {
    const body = { username: "lurker", body: "new fit just dropped" };
    const res = await request(app)
      .post("/api/articles/9000/comments")
      .send(body)
      .expect(404);
    expect(res.body.msg).toBe("Not Found");
  });

  test("status 400, missing required fields e.g. no username or body", async () => {
    const body = { username: "lurker" };
    const res = await request(app)
      .post("/api/articles/2/comments")
      .send(body)
      .expect(400);
    expect(res.body.msg).toBe("Missing Required Field, Body or Username");
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status 204, deletes comment from database", async () => {
    const res = await request(app).delete("/api/comments/2").expect(204);
  });

  test("status 404, non existent ID", async () => {
    const res = await request(app).delete("/api/comments/99999").expect(404);
    expect(res.body.msg).toBe("Comment Not Found");
  });

  test("status 400, invalid ID", async () => {
    const res = await request(app).delete("/api/comments/notanid").expect(400);
    expect(res.body.msg).toBe(
      "Invalid Server Request Made, Expected Number Not String"
    );
  });
});

describe.only("GET /api", () => {
  test("status 200: returns JSON describing all endpoints", async () => {
    const res = await request(app).get("/api").expect(200);
    console.log(obj);
    expect(res.body.endpoints).toBeInstanceOf(Object);
    expect(res.body.endpoints).toEqual(
      expect.objectContaining({
        "GET /api": expect.any(Object),
        "GET /api/topics": expect.any(Object),
        "GET /api/articles": expect.any(Object),
        "PATCH /api/articles/:article_id": expect.any(Object),
        "GET /api/articles/:article_id/comments": expect.any(Object),
        "POST /api/articles/:article_id/comments": expect.any(Object),
        "DELETE /api/comments/:comment_id": expect.any(Object),
      })
    );
  });
});

describe("GET /api/users", () => {
  test("status 200, responds with array of user objects", async () => {
    const res = await request(app).get("/api/users").expect(200);
    const { users } = res.body;
    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(4);
    users.forEach((user) => {
      expect(user).toEqual(
        expect.objectContaining({
          avatar_url: expect.any(String),
          name: expect.any(String),
          username: expect.any(String),
        })
      );
    });
  });

  test("status 404: responds with 404 when passed an incorrect path", async () => {
    const res = await request(app).get("/api/abusers").expect(404);
    console.log(res.body.msg);
    expect;
  });
});
