import app from "../../server";

describe("user routes tester", () => {

    const request = require("supertest")(app);

    it("/POST Create new user", async () => {

        let res = await request
            .post(`/user`)
            .send({
                name: "edy",
                year: 23,
                genre: "M"
            })
            .expect("Content-Type", /json/)

        expect(res.status).not.toBe(500);
    });

    it("/GET get all user", async () => {

        let res = await request
            .get(`/user`)
            .expect("Content-Type", /json/)

        expect(res.status).not.toBe(500);
    });

    it("/GET/id Show specify user", async () => {

        let res = await request
            .get(`/user/1`)
            .expect("Content-Type", /json/)

        expect(res.status).not.toBe(500);
    });

    it("/PUT/id Modify specify user", async () => {

        let res = await request
            .put(`/user/1`)
            .send({})
            .expect("Content-Type", /json/)

        expect(res.status).not.toBe(500);
    });

    it("/DELETE/id Delete specify user", async () => {

        let res = await request
            .del(`/user/1`)
            .expect("Content-Type", /json/)

        expect(res.status).not.toBe(500);
    });

});