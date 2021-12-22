const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("status 200: returns an array of topics objects with the properties of slug and description", () => {
    return request(app).get("api/topics").expect(200).then(( { body })=> 
        console.log(result.rows);

    })
  });
});
