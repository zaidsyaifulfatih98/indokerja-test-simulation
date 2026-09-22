import express from 'express'
import cors from 'cors'
import authRouter from './routers/auth.router'
import jobRouter from './routers/job.router'
import applicationRouter from './routers/application.router'

process.loadEnvFile()

const app = express()
const PORT = Number(process.env.PORT) || 8080

app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }))
app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/jobs", jobRouter)
app.use("/api/applications", applicationRouter)

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err)
    const statusCode = (err as { statusCode?: number }).statusCode ?? 500
    res.status(statusCode).json({
        success: false,
        message: err.message
    })
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
