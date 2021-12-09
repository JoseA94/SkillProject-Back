// import { ModeloAvance } from "../avance/avance.js";
// import { InscriptionModel } from "../inscripcion/inscripcion.js";
// import { UserModel } from "../usuario/usuario.js";
import { ProjectModel } from "./proyecto.js";
const resolversProyecto = {
  // Proyecto: {
  //   // lider: async (parent, args, context) => {
  //   //   return await UserModel.find({ Usuario: parent._id });
  //   // },
  //   // avances: async (parent, args, context) => {
  //   //   return await ModeloAvance.find({ creadoPor: parent._id });
  //   // },
  //   inscripciones: async (parent, args, context) => {
  //     return await InscriptionModel.find({ estudiante: parent.estudiante._id });
  //   },
  // },
  Query: {
    Proyectos: async (parent, args) => {
      const proyectosEncontrados = await ProjectModel.find().populate([
        {
          path: "avances",
          populate: [{ path: "creadoPor" }],
        },
        {
          path: "inscripciones",
          populate: [{ path: "estudiante" }],
        },
        { path: "lider" },
      ]);
      return proyectosEncontrados;
    },
    Proyecto: async (parent, args) => {
      const proyectoEncontrado = await ProjectModel.findOne({
        _id: args._id,
      }).populate([
        {
          path: "avances",
          populate: [{ path: "creadoPor" }],
        },
        {
          path: "inscripciones",
          populate: [{ path: "estudiante" }],
        },
        { path: "lider" },
      ]);
      return proyectoEncontrado;
    },
    ProyectosLider: async (parent, args) => {
      const proyectosPorLider = await ProjectModel.find({ lider: args.lider });

      return proyectosPorLider;
    },
  },
  Mutation: {
    crearProyecto: async (parent, args) => {
      const proyectoCreado = await ProjectModel.create({
        ...args.campos,
      });
      return proyectoCreado;
    },
    eliminarProyecto: async (parent, args) => {
      const proyectoEliminado = await ProjectModel.findByIdAndDelete({
        _id: args._id,
      });
      return proyectoEliminado;
    },
    actualizarProyecto: async (parent, args) => {
      const proyectoActualizado = await ProjectModel.findByIdAndUpdate(
        { _id: args._id },
        {
          ...args.campos,
        },
        { new: true }
      );
      return proyectoActualizado;
    },
    crearObjetivos: async (parent, args) => {
      const objetivosCreados = await ProjectModel.findByIdAndUpdate(
        args.idProyecto,
        {
          $addToSet: {
            objetivos: { ...args.campos },
          },
        },
        { new: true }
      );
      return objetivosCreados;
    },
    editarObjetivo: async (parent, args) => {
      const proyectoEditado = await ProjectModel.findByIdAndUpdate(
        args.idProyecto,
        {
          $set: {
            [`objetivos.${args.indexObjetivo}.descripcion`]:
              args.campos.descripcion,
            [`objetivos.${args.indexObjetivo}.tipo`]: args.campos.tipo,
          },
        },
        { new: true }
      );
      return proyectoEditado;
    },
    eliminarObjetivo: async (parent, args) => {
      const proyectoObjetivo = await ProjectModel.findByIdAndUpdate(
        { _id: args.idProyecto },
        {
          $pull: {
            objetivos: {
              _id: args.idObjetivo,
            },
          },
        },
        { new: true }
      );
      return proyectoObjetivo;
    },
  },
};

export { resolversProyecto };
