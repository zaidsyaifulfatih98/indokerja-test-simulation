import express from 'express'
import userRouter from './routers/user.router'

const app = express()
const PORT = 8080

app.use(express.json())

app.use("/api", userRouter)

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err)
    res.status(500).json({
        success: false,
        message: err.message
    })
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})