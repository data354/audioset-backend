import prisma from "./src/configs";

(async function name() {
    await prisma.sound.deleteMany({})   
})()