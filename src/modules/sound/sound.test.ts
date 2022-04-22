import app from "../../server/_globalRoutes";
process.env.PORT = "4004"
import index_server from "../../server/";
import { User, Sound } from "@prisma/client"
import { join } from "path";

describe("sound routes tester", () => {

    const request = require("supertest")(app);
    const index = require("supertest")(index_server);
    let user: User
    let sound: Sound
    let token: string

    describe("User", () => {
        test("Create user and get token", async () => {
            let data = (await request
                .post(`/user`)
                .send({
                    name: "edy",
                    year: 23,
                    genre: "M"
                })
                .expect(201)
                .expect("Content-Type", /json/)
            )._body.data

            user = data
            token = data.token
        });

        test("User try to get new audio", async () => {
            sound = (await request
                .get(`/sound/begin/${user.id_}`)
                .set("X-Access-Token", token)
                .expect(200)
                .expect("Content-Type", /json/)
                )._body

        })

        test("User try to get new audio again", async () => {
            sound = (await request
                .get(`/sound/begin/${user.id_}`)
                .set("X-Access-Token", token)
                .expect(200)
                .expect("Content-Type", /json/)
                )._body
        })

        test("User try to get new audio with not exist user", async () => {
            await request
                .get(`/sound/begin/0`)
                .set("X-Access-Token", token)
                .expect(500)
                .expect("Content-Type", /json/)
        })

        test("Count user recorded sound", async () => {
            await request
                .get(`/sound/count/recorded/${user.id_}`)
                .set("X-Access-Token", token)
                .expect(200)
                .expect("Content-Type", /json/)
        })

        test("Count user recorded sound with unexpected userID", async () => {
            await request
                .get(`/sound/count/recorded/zero`)
                .set("X-Access-Token", token)
                .expect("Content-Type", /json/)
                .expect(500)
        })
    })

    describe("/ Try to get all audios", () => {
        test("Should return all audios with 200 code status", async () => {
            await request
                .get(`/sound/`)
                .set("X-Access-Token", token)
                .expect(200)
                .expect("Content-Type", /json/)
        })

    })


    describe("Send sound", () => {
        test("/POST Send recorded audio", async () => {

            await request
                .post(`/sound/send`)
                .set("X-Access-Token", token)
                .set("Content-type", "multipart/form-data")
                .attach("audio", join(__dirname, "sound.dto.ts"), {filename: "audio"})
                .field("soundId", String(sound.id_))
                .field("userId", String(user.id_))
                .expect(201)
                .expect("Content-Type", /json/)

        });

        test("/POST without file", async () => {

            await request
                .post(`/sound/send`)
                .set("X-Access-Token", token)
                .set("Content-type", "multipart/form-data")
                .field("soundId", String(sound.id_))
                .field("userId", String(user.id_))
                .expect(400)

        });

        test("/POST with unexpected soundID", async () => {

            await request
                .post(`/sound/send`)
                .set("X-Access-Token", token)
                .attach("audio", join(__dirname, "sound.docs.json"), {filename: "testaudio"})
                .set("Content-type", "multipart/form-data")
                .field("soundId", "zero")
                .field("userId", String(user.id_))
                .expect(500)

        });

        test("/POST with missing soundID", async () => {

            await request
                .post(`/sound/send`)
                .set("X-Access-Token", token)
                .attach("audio", join(__dirname, "sound.docs.json"), {filename: "testaudio"})
                .set("Content-type", "multipart/form-data")
                .field("userId", String(user.id_))
                .expect(400)

        });

    })

    describe("Sound counter", () => {
        test("Count all unrecorded audios", async () => {

            await request
                .get(`/sound/count/unrecorded`)
                .set("X-Access-Token", token)
                .expect(200)
                .expect("Content-Type", /json/)

        });
        test("Get all recorded audios", async () => {

            await request
                .get(`/sound/recorded`)
                .set("X-Access-Token", token)
                .expect(200)
                .expect("Content-Type", /json/)

        });
        test("/GET/id get specify sound", async () => {

            await request
                .get(`/sound/${sound.id_}`)
                .set("X-Access-Token", token)
                .expect(200)
                .expect("Content-Type", /json/)

        });

        test("/GET/id get specify sound with unexpected id", async () => {

            await request
                .get(`/sound/zero`)
                .set("X-Access-Token", token)
                .expect(500)
                .expect("Content-Type", /json/)

        });

        test("/GET/id get specify sound with id wich not exist", async () => {

            await request
                .get(`/sound/0`)
                .set("X-Access-Token", token)
                .expect(404)
                .expect("Content-Type", /json/)

        });
    })

});