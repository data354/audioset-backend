import route from "../src/server/_globalRoutes"

describe("Global routes testing", () => {
    const request = require("supertest")(route);

    test("Prometheus metrics", async () => {
        await request
            .get("/metrics")
            .expect(200)
    })

    test("Not found route", async () => {
        await request
            .get("/notfound")
            .expect(404)
    })
})