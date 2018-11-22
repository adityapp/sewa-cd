const midleware = (req, res, next)=>{
    if(req.user.type === "admin"){
        next()
    }else{
        res.status(401).json({
            status: "Unautorized"
        })
    }
}

module.exports = midleware