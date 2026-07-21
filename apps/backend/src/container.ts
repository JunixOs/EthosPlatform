import { AppDataSource } from './datos/presistence/connections/AppDataSource';
import { UsuarioRepository } from './datos/presistence/repositories/UsuarioRepository';
import { ExperienciaRepository } from './datos/presistence/repositories/ExperienciaRepository';
import { SesionRepository } from './datos/presistence/repositories/SesionRepository';
import { IntentoFallidoRepository } from './datos/presistence/repositories/IntentoFallidoRepository';
import { FavoritoRepository } from './datos/presistence/repositories/FavoritoRepository';
import { ReaccionRepository } from './datos/presistence/repositories/ReaccionRepository';
import { RespuestaRepository } from './datos/presistence/repositories/RespuestaRepository';
import { EtiquetaRepository } from './datos/presistence/repositories/EtiquetaRepository';
import { ReporteRepository } from './datos/presistence/repositories/ReporteRepository';
import { PaginaEquipoRepository } from './datos/presistence/repositories/PaginaEquipoRepository';

// Auth use cases
import { RegisterUseCase } from './logica/application/features/auth/register/RegisterUseCase';
import { LoginUseCase } from './logica/application/features/auth/login/LoginUseCase';
import { LogoutUseCase } from './logica/application/features/auth/logout/LogoutUseCase';

// Experiencia use cases
import { CreateExperienciaUseCase } from './logica/application/features/experiencias/crear_experiencia/CreateExperienciaUseCase';
import { EditExperienciaUseCase } from './logica/application/features/experiencias/editar/EditExperienciaUseCase';
import { DeleteExperienciaUseCase } from './logica/application/features/experiencias/eliminar/DeleteExperienciaUseCase';
import { PublishExperienciaUseCase } from './logica/application/features/experiencias/publicar/PublishExperienciaUseCase';
import { ListExperienciasUseCase } from './logica/application/features/experiencias/listar/ListExperienciasUseCase';
import { GetExperienciaUseCase } from './logica/application/features/experiencias/obtener/GetExperienciaUseCase';
import { BuscarExperienciasUseCase } from './logica/application/features/experiencias/buscar/BuscarExperienciasUseCase';
import { GetRelacionadasUseCase } from './logica/application/features/experiencias/relacionadas/GetRelacionadasUseCase';

// Usuario use cases
import { GetPerfilUseCase } from './logica/application/features/usuarios/obtener_perfil/GetPerfilUseCase';
import { EditarPerfilUseCase } from './logica/application/features/usuarios/editar_perfil/EditarPerfilUseCase';
import { EditarFotoPerfilUseCase } from './logica/application/features/usuarios/editar_foto/EditarFotoPerfilUseCase';
import { EliminarCuentaUseCase } from './logica/application/features/usuarios/eliminar_cuenta/EliminarCuentaUseCase';
import { GetEstadisticasUseCase } from './logica/application/features/usuarios/estadisticas/GetEstadisticasUseCase';
import { ListExperienciasPorUsuarioUseCase } from './logica/application/features/usuarios/listar_experiencias/ListExperienciasPorUsuarioUseCase';

// Admin use cases
import { AsignarRolUseCase } from './logica/application/features/admin/asignar_rol/AsignarRolUseCase';
import { SuspenderUsuarioUseCase } from './logica/application/features/admin/suspender_usuario/SuspenderUsuarioUseCase';
import { EditarUsuarioAdminUseCase } from './logica/application/features/admin/editar_usuario/EditarUsuarioAdminUseCase';
import { EliminarUsuarioAdminUseCase } from './logica/application/features/admin/eliminar_usuario/EliminarUsuarioAdminUseCase';
import { ListarUsuariosAdminUseCase } from './logica/application/features/admin/listar_usuarios/ListarUsuariosAdminUseCase';
import { ReactivarUsuarioUseCase } from './logica/application/features/admin/reactivar_usuario/ReactivarUsuarioUseCase';

// Favorito use cases
import { ToggleFavoritoUseCase } from './logica/application/features/favoritos/ToggleFavoritoUseCase';
import { ListarFavoritosUseCase } from './logica/application/features/favoritos/ListarFavoritosUseCase';

// Reaccion use cases
import { ToggleReaccionUseCase } from './logica/application/features/reacciones/ToggleReaccionUseCase';
import { ContarReaccionesUseCase } from './logica/application/features/reacciones/ContarReaccionesUseCase';

// Respuesta use cases
import { CrearRespuestaUseCase } from './logica/application/features/respuestas/CrearRespuestaUseCase';
import { ListarRespuestasUseCase } from './logica/application/features/respuestas/ListarRespuestasUseCase';
import { EliminarRespuestaUseCase } from './logica/application/features/respuestas/EliminarRespuestaUseCase';

// Etiqueta use cases
import { AsociarEtiquetasUseCase } from './logica/application/features/etiquetas/AsociarEtiquetasUseCase';
import { BuscarPorEtiquetaUseCase } from './logica/application/features/etiquetas/BuscarPorEtiquetaUseCase';
import { ListarEtiquetasUseCase } from './logica/application/features/etiquetas/ListarEtiquetasUseCase';
import { ObtenerEtiquetasDeExperienciaUseCase } from './logica/application/features/etiquetas/ObtenerEtiquetasDeExperienciaUseCase';

// Reporte use cases
import { CrearReporteUseCase } from './logica/application/features/reportes/CrearReporteUseCase';
import { ListarReportesUseCase } from './logica/application/features/reportes/ListarReportesUseCase';
import { OcultarContenidoUseCase } from './logica/application/features/reportes/OcultarContenidoUseCase';

// Pagina equipo use cases
import { ObtenerPaginaEquipoUseCase } from './logica/application/features/pagina_equipo/ObtenerPaginaEquipoUseCase';
import { EditarPaginaEquipoUseCase } from './logica/application/features/pagina_equipo/EditarPaginaEquipoUseCase';

// Controllers
import { AuthController } from './logica/interface_adapters/features/auth/controllers/AuthController';
import { ExperienciasController } from './logica/interface_adapters/features/experiencias/controllers/ExperienciasController';
import { UsuariosController } from './logica/interface_adapters/features/usuarios/controllers/UsuariosController';
import { AdminController } from './logica/interface_adapters/features/admin/controllers/AdminController';
import { FavoritosController } from './logica/interface_adapters/features/favoritos/controllers/FavoritosController';
import { ReaccionesController } from './logica/interface_adapters/features/reacciones/controllers/ReaccionesController';
import { RespuestasController } from './logica/interface_adapters/features/respuestas/controllers/RespuestasController';
import { EtiquetasController } from './logica/interface_adapters/features/etiquetas/controllers/EtiquetasController';
import { ReportesController } from './logica/interface_adapters/features/reportes/controllers/ReportesController';
import { PaginaEquipoController } from './logica/interface_adapters/features/pagina_equipo/controllers/PaginaEquipoController';

// Middleware
import { createAuthMiddleware, requireAdmin } from './logica/interface_adapters/middleware/authMiddleware';
import type { Request, Response, NextFunction } from 'express';

export interface Container {
  authController: AuthController;
  experienciasController: ExperienciasController;
  usuariosController: UsuariosController;
  adminController: AdminController;
  favoritosController: FavoritosController;
  reaccionesController: ReaccionesController;
  respuestasController: RespuestasController;
  etiquetasController: EtiquetasController;
  reportesController: ReportesController;
  paginaEquipoController: PaginaEquipoController;
  authMiddleware: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
  requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
}

export async function createContainer(): Promise<Container> {
  const dataSource = await AppDataSource.initialize();

  // Repositories
  const usuarioRepo = new UsuarioRepository(dataSource);
  const experienciaRepo = new ExperienciaRepository(dataSource);
  const sesionRepo = new SesionRepository(dataSource);
  const intentoRepo = new IntentoFallidoRepository(dataSource);
  const favoritoRepo = new FavoritoRepository(dataSource);
  const reaccionRepo = new ReaccionRepository(dataSource);
  const respuestaRepo = new RespuestaRepository(dataSource);
  const etiquetaRepo = new EtiquetaRepository(dataSource);
  const reporteRepo = new ReporteRepository(dataSource);
  const paginaEquipoRepo = new PaginaEquipoRepository(dataSource);

  // Auth
  const registerUC = new RegisterUseCase(usuarioRepo);
  const loginUC = new LoginUseCase(usuarioRepo, sesionRepo, intentoRepo);
  const logoutUC = new LogoutUseCase(sesionRepo);
  const authController = new AuthController(registerUC, loginUC, logoutUC);

  // Experiencias
  const createExpUC = new CreateExperienciaUseCase(experienciaRepo);
  const editExpUC = new EditExperienciaUseCase(experienciaRepo);
  const deleteExpUC = new DeleteExperienciaUseCase(experienciaRepo);
  const publishExpUC = new PublishExperienciaUseCase(experienciaRepo);
  const listExpUC = new ListExperienciasUseCase(experienciaRepo);
  const getExpUC = new GetExperienciaUseCase(experienciaRepo);
  const buscarExpUC = new BuscarExperienciasUseCase(experienciaRepo);
  const relacionadasUC = new GetRelacionadasUseCase(experienciaRepo);
  const experienciasController = new ExperienciasController(
    createExpUC, editExpUC, deleteExpUC, publishExpUC,
    listExpUC, getExpUC, buscarExpUC, relacionadasUC,
  );

  // Usuarios
  const getPerfilUC = new GetPerfilUseCase(usuarioRepo, experienciaRepo, favoritoRepo);
  const editarPerfilUC = new EditarPerfilUseCase(usuarioRepo);
  const editarFotoUC = new EditarFotoPerfilUseCase(usuarioRepo);
  const eliminarCuentaUC = new EliminarCuentaUseCase(usuarioRepo, sesionRepo, experienciaRepo, favoritoRepo, reaccionRepo);
  const estadisticasUC = new GetEstadisticasUseCase(usuarioRepo, experienciaRepo, favoritoRepo);
  const listExpUsuarioUC = new ListExperienciasPorUsuarioUseCase(experienciaRepo);
  const usuariosController = new UsuariosController(
    getPerfilUC, editarPerfilUC, editarFotoUC, eliminarCuentaUC, estadisticasUC, listExpUsuarioUC,
  );

  // Admin
  const asignarRolUC = new AsignarRolUseCase(usuarioRepo);
  const suspenderUC = new SuspenderUsuarioUseCase(usuarioRepo);
  const editarUsuarioAdminUC = new EditarUsuarioAdminUseCase(usuarioRepo);
  const eliminarUsuarioAdminUC = new EliminarUsuarioAdminUseCase(usuarioRepo, sesionRepo);
  const listarUsuariosAdminUC = new ListarUsuariosAdminUseCase(usuarioRepo);
  const reactivarUsuarioUC = new ReactivarUsuarioUseCase(usuarioRepo);
  const adminController = new AdminController(
    asignarRolUC, suspenderUC, editarUsuarioAdminUC, eliminarUsuarioAdminUC, listarUsuariosAdminUC, reactivarUsuarioUC,
  );

  // Favoritos
  const toggleFavUC = new ToggleFavoritoUseCase(favoritoRepo, experienciaRepo);
  const listarFavUC = new ListarFavoritosUseCase(favoritoRepo, experienciaRepo);
  const favoritosController = new FavoritosController(toggleFavUC, listarFavUC);

  // Reacciones
  const toggleReaccionUC = new ToggleReaccionUseCase(reaccionRepo, experienciaRepo);
  const contarReaccionesUC = new ContarReaccionesUseCase(reaccionRepo);
  const reaccionesController = new ReaccionesController(toggleReaccionUC, contarReaccionesUC);

  // Respuestas
  const crearRespuestaUC = new CrearRespuestaUseCase(respuestaRepo, experienciaRepo);
  const listarRespuestasUC = new ListarRespuestasUseCase(respuestaRepo);
  const eliminarRespuestaUC = new EliminarRespuestaUseCase(respuestaRepo);
  const respuestasController = new RespuestasController(crearRespuestaUC, listarRespuestasUC, eliminarRespuestaUC);

  // Etiquetas
  const asociarEtiquetasUC = new AsociarEtiquetasUseCase(etiquetaRepo, experienciaRepo);
  const buscarPorEtiquetaUC = new BuscarPorEtiquetaUseCase(etiquetaRepo, experienciaRepo);
  const listarEtiquetasUC = new ListarEtiquetasUseCase(etiquetaRepo);
  const obtenerEtiquetasExpUC = new ObtenerEtiquetasDeExperienciaUseCase(etiquetaRepo);
  const etiquetasController = new EtiquetasController(asociarEtiquetasUC, buscarPorEtiquetaUC, listarEtiquetasUC, obtenerEtiquetasExpUC);

  // Reportes
  const crearReporteUC = new CrearReporteUseCase(reporteRepo, experienciaRepo);
  const listarReportesUC = new ListarReportesUseCase(reporteRepo);
  const ocultarContenidoUC = new OcultarContenidoUseCase(reporteRepo, experienciaRepo);
  const reportesController = new ReportesController(crearReporteUC, listarReportesUC, ocultarContenidoUC);

  // Pagina Equipo
  const obtenerPaginaEquipoUC = new ObtenerPaginaEquipoUseCase(paginaEquipoRepo);
  const editarPaginaEquipoUC = new EditarPaginaEquipoUseCase(paginaEquipoRepo);
  const paginaEquipoController = new PaginaEquipoController(obtenerPaginaEquipoUC, editarPaginaEquipoUC);

  const authMiddleware = createAuthMiddleware(sesionRepo);

  return {
    authController,
    experienciasController,
    usuariosController,
    adminController,
    favoritosController,
    reaccionesController,
    respuestasController,
    etiquetasController,
    reportesController,
    paginaEquipoController,
    authMiddleware,
    requireAdmin,
  };
}
