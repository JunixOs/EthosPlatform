import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import { AppDataSource } from './datos/presistence/connections/AppDataSource';
// Repositories
import { UsuarioRepository } from './datos/presistence/repositories/UsuarioRepository';
import { ExperienciaRepository } from './datos/presistence/repositories/ExperienciaRepository';
import { SesionRepository } from './datos/presistence/repositories/SesionRepository';
import { IntentoFallidoRepository } from './datos/presistence/repositories/IntentoFallidoRepository';
import { FavoritoRepository } from './datos/presistence/repositories/FavoritoRepository';
import { ReaccionRepository } from './datos/presistence/repositories/ReaccionRepository';
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
// Admin use cases
import { AsignarRolUseCase } from './logica/application/features/admin/asignar_rol/AsignarRolUseCase';
import { SuspenderUsuarioUseCase } from './logica/application/features/admin/suspender_usuario/SuspenderUsuarioUseCase';
import { EditarUsuarioAdminUseCase } from './logica/application/features/admin/editar_usuario/EditarUsuarioAdminUseCase';
import { EliminarUsuarioAdminUseCase } from './logica/application/features/admin/eliminar_usuario/EliminarUsuarioAdminUseCase';
// Favorito use cases
import { ToggleFavoritoUseCase } from './logica/application/features/favoritos/ToggleFavoritoUseCase';
import { ListarFavoritosUseCase } from './logica/application/features/favoritos/ListarFavoritosUseCase';
// Controllers
import { AuthController } from './logica/interface_adapters/features/auth/controllers/AuthController';
import { ExperienciasController } from './logica/interface_adapters/features/experiencias/controllers/ExperienciasController';
import { UsuariosController } from './logica/interface_adapters/features/usuarios/controllers/UsuariosController';
import { AdminController } from './logica/interface_adapters/features/admin/controllers/AdminController';
import { FavoritosController } from './logica/interface_adapters/features/favoritos/controllers/FavoritosController';
// Middleware
import { authMiddleware, requireAdmin } from './logica/interface_adapters/middleware/authMiddleware';
import { AppException } from './logica/application/exceptions/AppException';

const app = express();
const PORT = process.env['PORT'] ?? 3000;

app.use(cors({ origin: process.env['FRONTEND_URL'] ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());

AppDataSource.initialize()
  .then((dataSource) => {
    // --- Repositories ---
    const usuarioRepo = new UsuarioRepository(dataSource);
    const experienciaRepo = new ExperienciaRepository(dataSource);
    const sesionRepo = new SesionRepository(dataSource);
    const intentoRepo = new IntentoFallidoRepository(dataSource);
    const favoritoRepo = new FavoritoRepository(dataSource);
    const reaccionRepo = new ReaccionRepository(dataSource);

    // --- Auth ---
    const registerUC = new RegisterUseCase(usuarioRepo);
    const loginUC = new LoginUseCase(usuarioRepo, sesionRepo, intentoRepo);
    const logoutUC = new LogoutUseCase(sesionRepo);
    const authCtrl = new AuthController(registerUC, loginUC, logoutUC);

    // --- Experiencias ---
    const createExpUC = new CreateExperienciaUseCase(experienciaRepo);
    const editExpUC = new EditExperienciaUseCase(experienciaRepo);
    const deleteExpUC = new DeleteExperienciaUseCase(experienciaRepo);
    const publishExpUC = new PublishExperienciaUseCase(experienciaRepo);
    const listExpUC = new ListExperienciasUseCase(experienciaRepo);
    const getExpUC = new GetExperienciaUseCase(experienciaRepo);
    const buscarExpUC = new BuscarExperienciasUseCase(experienciaRepo);
    const relacionadasUC = new GetRelacionadasUseCase(experienciaRepo);
    const expCtrl = new ExperienciasController(
      createExpUC, editExpUC, deleteExpUC, publishExpUC,
      listExpUC, getExpUC, buscarExpUC, relacionadasUC,
    );

    // --- Usuarios ---
    const getPerfilUC = new GetPerfilUseCase(usuarioRepo, experienciaRepo, favoritoRepo);
    const editarPerfilUC = new EditarPerfilUseCase(usuarioRepo);
    const editarFotoUC = new EditarFotoPerfilUseCase(usuarioRepo);
    const eliminarCuentaUC = new EliminarCuentaUseCase(usuarioRepo, sesionRepo);
    const estadisticasUC = new GetEstadisticasUseCase(usuarioRepo, experienciaRepo, favoritoRepo);
    const usuariosCtrl = new UsuariosController(
      getPerfilUC, editarPerfilUC, editarFotoUC, eliminarCuentaUC, estadisticasUC, listExpUC,
    );

    // --- Admin ---
    const asignarRolUC = new AsignarRolUseCase(usuarioRepo);
    const suspenderUC = new SuspenderUsuarioUseCase(usuarioRepo);
    const editarUsuarioAdminUC = new EditarUsuarioAdminUseCase(usuarioRepo);
    const eliminarUsuarioAdminUC = new EliminarUsuarioAdminUseCase(usuarioRepo, sesionRepo);
    const adminCtrl = new AdminController(
      asignarRolUC, suspenderUC, editarUsuarioAdminUC, eliminarUsuarioAdminUC, usuarioRepo,
    );

    // --- Favoritos ---
    const toggleFavUC = new ToggleFavoritoUseCase(favoritoRepo, experienciaRepo);
    const listarFavUC = new ListarFavoritosUseCase(favoritoRepo, experienciaRepo);
    const favCtrl = new FavoritosController(toggleFavUC, listarFavUC);

    // ==================== ROUTES ====================

    // Health
    app.get('/api/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Auth
    app.post('/api/auth/register', authCtrl.register);
    app.post('/api/auth/login', authCtrl.login);
    app.post('/api/auth/logout', authMiddleware, authCtrl.logout);

    // Experiencias — orden importante: rutas específicas antes que /:id
    app.get('/api/experiencias/buscar', expCtrl.buscar);
    app.get('/api/experiencias', expCtrl.list);
    app.get('/api/experiencias/:id/preview', authMiddleware, expCtrl.preview);
    app.get('/api/experiencias/:id/relacionadas', expCtrl.relacionadas);
    app.get('/api/experiencias/:id/relacionadas-autor', expCtrl.relacionadasAutor);
    app.get('/api/experiencias/:id', expCtrl.getById);
    app.post('/api/experiencias', authMiddleware, expCtrl.create);
    app.put('/api/experiencias/:id', authMiddleware, expCtrl.update);
    app.delete('/api/experiencias/:id', authMiddleware, expCtrl.delete);
    app.patch('/api/experiencias/:id/publicar', authMiddleware, expCtrl.publish);

    // Usuarios — /me antes que /:id para evitar conflictos
    app.get('/api/usuarios/me', authMiddleware, usuariosCtrl.getMiPerfil);
    app.put('/api/usuarios/me/perfil', authMiddleware, usuariosCtrl.editarPerfil);
    app.put('/api/usuarios/me/foto', authMiddleware, usuariosCtrl.editarFoto);
    app.delete('/api/usuarios/me', authMiddleware, usuariosCtrl.eliminarCuenta);
    app.get('/api/usuarios/:id', usuariosCtrl.getPerfil);
    app.get('/api/usuarios/:id/estadisticas', usuariosCtrl.getEstadisticas);
    app.get('/api/usuarios/:id/experiencias', usuariosCtrl.getExperiencias);

    // Admin (requieren auth + rol admin) — R02, R06, R19, R21, R22, R37
    app.get('/api/admin/usuarios', authMiddleware, requireAdmin, adminCtrl.listarUsuarios);
    app.put('/api/admin/usuarios/:id', authMiddleware, requireAdmin, adminCtrl.editarUsuario);
    app.delete('/api/admin/usuarios/:id', authMiddleware, requireAdmin, adminCtrl.eliminarUsuario);
    app.patch('/api/admin/usuarios/:id/rol', authMiddleware, requireAdmin, adminCtrl.asignarRol);
    app.patch('/api/admin/usuarios/:id/suspender', authMiddleware, requireAdmin, adminCtrl.suspender);
    app.patch('/api/admin/usuarios/:id/reactivar', authMiddleware, requireAdmin, adminCtrl.reactivar);

    // Favoritos — R49
    app.post('/api/favoritos/:experienciaId', authMiddleware, favCtrl.toggle);
    app.get('/api/favoritos/mios', authMiddleware, favCtrl.listarMios);

    // Global error handler
    app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof AppException) {
        res.status(err.httpStatus).json({
          success: false,
          data: [],
          errorMessage: err.message,
          errorCode: err.errorCode,
          httpErrorCode: String(err.httpStatus),
        });
        return;
      }
      if (err instanceof Error) {
        res.status(400).json({
          success: false,
          data: [],
          errorMessage: err.message,
          errorCode: 'BAD_REQUEST',
          httpErrorCode: '400',
        });
        return;
      }
      res.status(500).json({
        success: false,
        data: [],
        errorMessage: 'Error interno del servidor.',
        errorCode: 'INTERNAL_ERROR',
        httpErrorCode: '500',
      });
    });

    app.listen(PORT, () => {
      console.log(`EthosPlatform API corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('Error al conectar con la base de datos:', err);
    process.exit(1);
  });
