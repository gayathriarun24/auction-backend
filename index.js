import express from 'express'
import helmet from 'helmet'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './src/config/db.js'
import { errorHandler } from './src/middlewares/errorMiddleware.js'
import { apiLimiter } from './src/middlewares/rateLimitMiddleware.js'
import authRoute from './src/routes/authRoutes.js'
import productRoute from './src/routes/productRoutes.js'
import bidRoute from './src/routes/bidRoutes.js' 

dotenv.config()

const app = express()
app.use(express.json())
app.use(helmet())
// app.use(cors({
//     origin: "http://localhost:5173",
// }))
app.use(cors({
    origin: ["http://localhost:5173", "https://auction-platform24.netlify.app"],
}))
app.use('/api', apiLimiter)
app.set('query parser', 'extended')

connectDB()

app.use('/api/auth', authRoute)
app.use('/api/products', productRoute)
app.use('/api/bids', bidRoute) 

app.get('/', (req, res) => {
    res.send('Auction Platform API is working perfectly!')
})

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Auction Platform Server is running on PORT ${PORT}`)
})