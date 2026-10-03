import express from 'express';
import path from 'path';
import rubroRouter from './routes/rubroRoutes';
import subRubroRouter from './routes/subRubroRoutes';
import planCuentaRouter from './routes/planCuentaRoutes';
import asientoRouter from './routes/asientoRoutes';
import entradaRouter from './routes/entradaRoutes';

const app = express();
const port = 3000;
const cors = require('cors'); 

app.use(express.static(path.join(__dirname, '../../frontend/public')));

app.use(cors()); 
app.use(express.json());
app.use('/api/rubros', rubroRouter);
app.use('/api/subrubros', subRubroRouter);
app.use('/api/plancuentas', planCuentaRouter);
app.use('/api/asientos', asientoRouter);
app.use('/api/entradas', entradaRouter);

app.get("/", (req,res)=>{
	res.sendFile(
		path.join (__dirname, "../../frontend/public","index.html")
);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});