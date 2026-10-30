import dotenv from 'dotenv'
dotenv.config()
const config = Object.freeze({  
    port: process.env.PORT || 5000,
    dbURI: process.env.MONGO_URI,
    nodeEnv: process.env.NODE_ENV || "development",
    accessTokenSecret: process.env.JWT_SECRET
})

export default config