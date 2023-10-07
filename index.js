import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./DB/connection.js";
import * as allRouter from "./modules/index.router.js";
import { globalResponse } from "./utils/errorHandling.js";

dotenv.config();
connectDB();

const app = express();
const port = 8080 
app.use(cors());
app.use(express.json({}));
// app.use(morgan('dev'))

app.get('/', async (req, res) => {
    res.status(200).json({
      message: 'Hello!',
    });
  });

// app.all('*', (req, res, next) => {
//     res.json('In-valid Routing Plz check url  or  method')
// })

app.use('/api/beach', allRouter.beachRouter)

// app.use(globalResponse)

app.listen(port, () =>
    console.log(
      `Example app listening on port ${port}!`,
    ),
  )
  