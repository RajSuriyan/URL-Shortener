const express = require("express")
const router = express.Router();
const urlShortner = require("../models/urlShortner")

const URL = "http://localhost:3000/url/"

router.post("/short",async (req,res)=>{
    const {url} = req.body
    try{
    const result = await urlShortner.create({originalUrl:url});
    if(!result){
        res.status(400).json({msg:"Didn't Create the Url"})
    }
}catch(error){
    // res.status(400).json({msg:"Didn't Create the Url"})
    const result = await urlShortner.findOne({originalUrl:url});
    if(!result){
        res.status(400).json({msg:"Didn't Create the Url"})
    }
    res.json({shortUrl:URL + result._id})
    return

}
    res.json({shortUrl:URL + result._id})
})

router.get("/:id",async (req,res) => {
    const id = req.params.id;
    const result = await urlShortner.findById(id)
    if(!result){
        res.status(400).json({msg:"Didn't Create the Url"})
    }
    res.status(307).redirect(result.originalUrl)
})

module.exports = router;