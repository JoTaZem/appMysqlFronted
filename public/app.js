import express from 'express';
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; 


//configuracion de las rutas ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use(express.static(path.join(__dirname, 'public')));

app.get('api/products',async(requestAnimationFrame,res) =>{
    let connection;
    try{
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM products');
        if(!rows || rows.length === 0) 
            return res.status(404).json({success:false, message: 'No products found' });
        res.json({ success: true, data: rows});
    }catch (error) {
        console.error('Error en /api/products:', error);
        res.status(500).json({
            success: false,
            message: 'error al obtener productos',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }finally {
        if (connection)
            connection.release();
    }
});

//ruta principal
app.get ('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public', 'index.html'));
});

//manejo de errores global 
app.use((err, req, res, next) => {
    console.error('Error global:', err);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
});

//inicio del servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//manejo de cierre del servidor
process.on('SIGTERM',()=>{
    server.close(() =>{
        pool.end();
        console.log('Servidor cerrado');
        process.exit(0);
    });
});