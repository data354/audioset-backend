import { giveToken } from "cqx-secure";
import express from "express";
import PTypes from "../../configs/db/types"
import userService from "./user.service"

const router: express.Router = require("express").Router();
const user = new userService();

type PError = PTypes.PrismaClientKnownRequestError | Error

router

    /**
     * @descr Create new user
     * @route POST /user
     * @access public
     */

    .post("/", async (req: express.Request, res: express.Response) => {

        user.addOne({ ...req.body, year: Number(req.body.year) })
            .then(async (data) => {
                let token = await giveToken(user, "user", "30d")
                res.status(201).json({ data: { ...data, token }, message: "object user created successfully" });
            })
            .catch((error: Error) => {
                console.error(error);
                res.status(500).json({ error: "InternalError", message: "Something wrong" });
            });

    })

    /**
    * @descr get all user
    * @route GET /user
    * @access public
    */

    .get("/", async (req: express.Request, res: express.Response) => {

        user.getAll({ where: req.query, orderBy: { id_: "asc" } })
            .then((data) => { res.status(200).json(data); })
            .catch((error: Error) => {
                console.error(error);
                res.status(500).json({ error: "InternalError", message: "Something wrong" });
            });

    })

    /**
    * @descr Show specify user identified by id
    * @route GET /user/id
    * @access public
    */

    .get("/:id", async (req: express.Request, res: express.Response) => {

        user.getById(Number(req.params.id))
            .then((data) => {
                res.status(data === null ? 404 : 200).json(data);
            })
            .catch((error: Error) => {
                console.error(error);
                res.status(500).json({ error: "InternalError", message: "Something wrong" });
            });

    })

export = router;
