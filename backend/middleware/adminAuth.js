import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const {token} = req.headers
        if(!token){
            return res.json({ success: false, message: "Not authorized, please login again" });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const isValid = (typeof token_decode === 'object' && token_decode.role === 'admin' && token_decode.email === process.env.ADMIN_EMAIL) || (token_decode === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD);
        if(!isValid){
            return res.json({ success: false, message: "Not authorized, please login again" });
        }
        next()
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export default adminAuth