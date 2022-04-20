import app from "../../server/_globalRoutes";

describe("sound routes tester", () => {

    const request = require("supertest")(app);

    it("/POST Create new sound", async () => {

        let res = await request
            .post(`/sound`)
            .send({})
            .expect("Content-Type", /json/)
            .expect(201)

    });

    it("/GET get all sound", async () => {
        let res = await request
            .get(`/sound`)
            .expect("Content-Type", /json/)

        expect(res.status).not.toBe(500);
    });

    it("/GET/id Show specify sound", async () => {
        let res = await request
            .get(`/sound/1`)
            .expect("Content-Type", /json/)

        expect(res.status).not.toBe(500);
    });

    it("/PUT/id Modify specify sound", async () => {
        let res = await request
            .put(`/sound/1`)
            .send({})
            .expect("Content-Type", /json/)

        expect(res.status).not.toBe(500);
    });

    it("/DELETE/id Delete specify sound", async () => {
        let res = await request
            .del(`/sound/1`)
            .expect("Content-Type", /json/)

        expect(res.status).not.toBe(500);
    });

});