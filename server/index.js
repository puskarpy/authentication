import dotenv from 'dotenv'
import { app } from "./app.js";
import { db } from './utils/db.js';

dotenv.config()

db();

app.listen(process.env.PORT, () => console.log(`Server started at port ${process.env.PORT}`))