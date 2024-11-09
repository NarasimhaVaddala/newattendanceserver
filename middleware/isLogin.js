const jwt = require('jsonwebtoken')
const SECRET = "@Inteli59400F@Amdr53600"


const isLogin = async(req,res,next) =>{
    try {
        const token = req.header('token');
        console.log(token, "from middleware");
        
        const {_id} = jwt.verify(token , SECRET);       
        req.user = _id;      
        next();

    } catch (error) {
        console.log("from middleware",error.message );
        
    }
}

module.exports = isLogin;