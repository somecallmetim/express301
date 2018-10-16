const express = require('express');

let router = express.Router();

router.get('/', (req, res, next)=>{
    res.json({
        msg: "Blitzcrank is fired up and ready to serve..."
    })
});

module.exports = router;