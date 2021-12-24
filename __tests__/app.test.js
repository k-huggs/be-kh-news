const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

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

describe("GET /api/articles", () => {
  test("status 200: responds with an array of article objects, which can be sorted by column but defaults to date", async () => {
    const res = await request(app).get("/api/articles").expect(200);
    expect(res.body.articles).toBeSorted();
    expect(Array.isArray(res.body.articles)).toBe(true);
    res.body.articles.forEach((articles) => {
      expect(articles).toEqual(
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        })
      );
    });
  });
});
