const express = require ('express');
const app = express();
require ('dotenv').config();
const PORT = process.env.PORT || 8080;

const routes = require('./routes/productRoutes');
const cors = require('cors');

app.use(cors());


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 



app.use('/', routes);


app.listen(PORT, () => {
    console.log(`Servidor levantado en el puerto ${PORT} - http://localhost:${PORT} `)
})