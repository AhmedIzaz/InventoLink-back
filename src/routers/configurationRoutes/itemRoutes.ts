import express from "express"
const router = express.Router()

router.get("/", (req, res, next)=>{
    res.send("got it").end();
})

export default router