import app from "../../server/_globalRoutes";
import { User } from "@prisma/client"

describe("user routes tester", () => {

    const request = require("supertest")(app);
    let user: User

    describe("/POST Create new user", () => {
        it("Try with expected data", async () => {
            user = (await request
                .post(`/user`)
                .send({
                    name: "edy",
                    year: 23,
                    genre: "M"
                })
                .expect("Content-Type", /json/)
                .expect(201)
            )._body.data
        });
        it("Send false data", async () => {
            await request
                .post(`/user`)
                .send({
                    name: "edy",
                })
                .expect("Content-Type", /json/)
                .expect(500)
        });
    })


    describe("/GET User", () => {
        it("Try to get all user", async () => {
            await request
                .get(`/user`)
                .expect("Content-Type", /json/)
                .expect(200)

        });

        it("/GET/id Show specify user", async () => {
            await request
                .get(`/user/${user.id_}`)
                .expect("Content-Type", /json/)
                .expect(200)
        });

        it("/GET/id Try to get user xho not exist", async () => {
            await request
                .get(`/user/0`)
                .expect("Content-Type", /json/)
                .expect(404)
        });

        it("/GET/id Try with unexpected id", async () => {
            await request
                .get(`/user/un`)
                .expect("Content-Type", /json/)
                .expect(500)
        });
    })
})