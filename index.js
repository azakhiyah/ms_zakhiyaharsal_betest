import express from 'express';
import { connectDB } from './config/db.js';
import { config } from './config/config.js';
import router from './routes/userRoute.js';


const PORT = config.port;

const app = express();
app.use(express.json());
app.use('/api',router);



app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:"+ PORT
    );
})