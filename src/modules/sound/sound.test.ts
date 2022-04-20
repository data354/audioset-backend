import app from "../../server/_globalRoutes";

describe("sound routes tester", () => {

    const request = require("supertest")(app);

    it("/POST Create new sound", async () => {

        await request
            .post(`/sound`)
            .send({})
            .expect("Content-Type", /json/)
            .expect(201)

    });

    it("/GET get all sound", async () => {

        await request
            .get(`/sound`)
            .expect("Content-Type", /json/)
            .expect(200)
    });

    it("/GET/id Show specify sound", async () => {

        await request
            .get(`/sound/1`)
            .expect("Content-Type", /json/)
            .expect(200)

    });

    it("/PUT/id Modify specify sound", async () => {

        await request
            .put(`/sound/1`)
            .send({})
            .expect("Content-Type", /json/)
            .expect(201)
    });

    it("/DELETE/id Delete specify sound", async () => {

        await request
            .del(`/sound/1`)
            .expect("Content-Type", /json/)
            .expect(200)
    })

});