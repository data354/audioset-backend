import express from "express";
import multer from "multer";
import soundService from "./sound.service"
import { Storage } from "@google-cloud/storage"
import { cwd } from "process";
import { join } from "path";
import { format } from "util";
import { checkToken } from "cqx-secure";
import checkDTO from "../../middlewares/checkDTO";
import { createSoundDTO } from "./sound.dto";
const router: express.Router = require("express").Router();
const sound = new soundService();
import env from "../../configs/env"

let storage = new Storage({ projectId: "audiosetrecorder-2022", apiEndpoint: env.STORAGE_API_ENDPOINT, keyFilename: join(cwd(), ".cqx/keys/gs.json") })
let bucket = storage.bucket(env.STORAGE_BUCKET)

let upload = multer({
    storage: multer.memoryStorage()
})

router

    /**
     * @descr Create new sound
     * @route POST /sound
     * @access public
     */

    .use(checkToken("user"))

    .post("/send", upload.single("audio"))
    .post("/send", checkDTO(createSoundDTO))
    .post("/send", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        //Return 400 error if no file has been uploaded
        if (!req.file) {
            res.status(400).send('No file uploaded.');
            return;
        }

        let filename = `${req.file.originalname}.mp3`

        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', err => {
            console.error(err);
            res.status(500).json({ file: err.name, message: err.message })
        });

        blobStream.on('finish', async () => {
            // The public URL can be used to directly access the file via HTTP.
            const publicUrl = format(
                `https://${env.STORAGE_API_ENDPOINT}/${bucket.name}/${blob.name}`
            );

            await bucket.file(filename).makePublic()

            sound.saveSound(Number(req.body.soundId), publicUrl, Number(req.body.userId))
                .then((data) => { res.status(201).json(data); })
                .catch((error: Error) => {
                    console.error(error);
                    res.status(500).json({ error: "InternalError", message: "Something wrong" });
                });
        });

        blobStream.end(req.file.buffer);
    })

    /**
    * @descr get all sound
    * @route GET /sound
    * @access public
    */

    .get("/", async (req: express.Request, res: express.Response) => {

        sound.getAll({ where: req.query, take: 1000, orderBy: { id_: "asc" }, select: { id_: true, ref: true, fr: true, bci: true, isRecording: true } })
            .then((data) => { res.status(200).json(data); })
            // .catch((error: Error) => {
            //     console.error(error);
            //     res.status(500).json({ error: "InternalError", message: "Something wrong" });
            // });

    })


    .get("/begin/:userId", async (req: express.Request, res: express.Response) => {

        sound.getNewAudio(Number(req.params.userId))
            .then((data) => { res.status(200).json(data); })
            .catch((error: Error) => {
                console.error(error);
                res.status(500).json({ error: "InternalError", message: "Something wrong" });
            });

    })

    /**
    * @descr get all sound which are recorded by one user
    * @route GET /sound/notrecorded/count
    * @access public
    */

    .get("/count/recorded/:userId", async (req: express.Request, res: express.Response) => {

        sound.count({ recorded: true, UserId_: Number(req.params.userId) })
            .then((data) => { res.status(200).json(data); })
            .catch((error: Error) => {
                console.error(error);
                res.status(500).json({ error: "InternalError", message: "Something wrong" });
            });

    })

    /**
  * @descr get all sound which are not recorded
  * @route GET /sound/notrecorded/count
  * @access public
  */

    .get("/count/unrecorded", async (req: express.Request, res: express.Response) => {

        sound.count({ recorded: false })
            .then((data) => { res.status(200).json(data); })
            // .catch((error: Error) => {
            //     console.error(error);
            //     res.status(500).json({ error: "InternalError", message: "Something wrong" });
            // });
    })

    .get("/recorded", async (req: express.Request, res: express.Response) => {

        sound.getAll({ where: { recorded: true }, include: { User_: true } })
            .then((data) => { res.json(data); })
            // .catch((error: Error) => {
            //     console.error(error);
            //     res.status(500).json({ error: "InternalError", message: "Something wrong" });
            // });
    })


    /**
    * @descr Show specify sound identified by id
    * @route GET /sound/id
    * @access public
    */

    .get("/:id", async (req: express.Request, res: express.Response) => {

        sound.getById(Number(req.params.id))
            .then((data) => {
                res.status(data === null ? 404 : 200).json(data);
            })
            .catch((error: Error) => {
                console.error(error);
                res.status(500).json({ error: "InternalError", message: "Something wrong" });
            });

    })

export = router;
