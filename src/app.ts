import "dotenv/config"
import express from "express"
import cors from "cors"
import routes from "./infrastructure/router"
import { join } from "path";
const port = process.env.PORT || 3001
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(join(process.cwd(), "public")))
app.use(`/`,routes)


app.listen(port, () => console.log(`Ready...${port}`))