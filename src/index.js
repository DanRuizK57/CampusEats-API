import connect from "./configs/mongo.js";
import express from "express";
import cors from "cors";
import envs from "./configs/environments.js";
import UserRoutes from "./routes/user.routes.js"
import UniversityRoutes from "./routes/university.routes.js";


// Crear servidor Node
const app = express();

// Configurar cors
app.use(cors());

// Convertir body a objeto json
app.use(express.json());

// Convertir cada propiedad del body en obj json
app.use(express.urlencoded({ extended: true })); // form-urlencoded

// Rutas
app.use("/user", UserRoutes);
app.use("/university", UniversityRoutes); 

// Crear servidor, escuchar peticiones HTTP y conectar con MongoDB
console.log("Conectando a la base de datos...");
connect()
  .then(() => {
    console.log("MongoDB Conectado Correctamente");
    app.listen(3000, async () => {
      console.log(`Servidor iniciado en el PUERTO: ${envs.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(-1);
  });
