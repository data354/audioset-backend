import app from "../../server";

describe("Home routes tester", () => {

    const supertest = require("supertest")(app);

    it("/GET get test", async () => {

        let res = await supertest
            .get("/")
            .expect("Content-Type", /json/)
            .expect(200)

        expect(res.status).not.toBe(500);

    });
});