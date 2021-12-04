import mongoose from "mongoose";
const { Schema, model } = mongoose;

//crea el esquema que utilizan los documentos en la coleccion usuario de la BD

const userSchema = new Schema({
  correo: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email); //prueba para que el email tenga el fromato correcto
      },
      message: "El formato del correo electrónico está malo.",
    },
  },
  password: {
    type: String,
    required: true,
  },
  identificacion: {
    type: String,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
    enum: ["ESTUDIANTE", "LIDER", "ADMINISTRADOR"],
  },
  estado: {
    type: String,
    enum: ["PENDIENTE", "AUTORIZADO", "NO_AUTORIZADO"],
    default: "PENDIENTE",
  },
});

userSchema.virtual("proyectosLiderados", {
  ref: "Proyecto",
  localField: "_id",
  foreignField: "lider",
});

userSchema.virtual("avancesCreados", {
  ref: "Avance",
  localField: "_id",
  foreignField: "creadoPor",
});

userSchema.virtual("inscripciones", {
  ref: "Inscripcion",
  localField: "_id",
  foreignField: "estudiante",
});

const UserModel = model("Usuario", userSchema);

export { UserModel };
