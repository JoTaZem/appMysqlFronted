import express from 'express';
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';
import patch from 'path';
import { fileURLToPath } from 'url'; 

//configuracion de las rutas ES Modules
const__filename = fileURLToPath(import.meta.url);
const __dirname = patch.dirname(__filename);

//configuracion de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

//configuracion mysql
const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT || 3306,
    connectionLimit: 10,
    queueLimit: 0
    });

//middlewares
app.use(cors({
    origin: '',
    methods: 'GET'    
}));
app.use(express.json());
app.use(express.static(patch.join(__dirname, 'public')));