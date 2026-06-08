import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import { AppDataSource } from './datos/presistence/connections/AppDataSource';
import { UsuarioRepository } from './datos/presistence/repositories/UsuarioRepository';
import { ExperienciaRepository } from './datos/presistence/repositories/ExperienciaRepository';
import { SesionRepository } from './datos/presistence/repositories/SesionRepository';
import { IntentoFallidoRepository } from './datos/presistence/repositories/IntentoFallidoRepository';
import { RegisterUseCase } from './logica/application/features/auth/register/RegisterUseCase';
import { LoginUseCase } from './logica/application/features/auth/login/LoginUseCase';
import { LogoutUseCase } from './logica/application/features/auth/logout/LogoutUseCase';
import { CreateExperienciaUseCase } from './logica/application/features/experiencias/crear_experiencia/CreateExperienciaUseCase';
import { EditExperienciaUseCase } from './logica/application/features/experiencias/editar/EditExperienciaUseCase';
import { DeleteExperienciaUseCase } from './logica/application/features/experiencias/eliminar/DeleteExperienciaUseCase';
import { PublishExperienciaUseCase } from './logica/application/features/experiencias/publicar/PublishExperienciaUseCase';
import { ListExperienciasUseCase } from './logica/application/features/experiencias/listar/ListExperienciasUseCase';
import { GetExperienciaUseCase } from './logica/application/features/experiencias/obtener/GetExperienciaUseCase';
import { AuthController } from './logica/interface_adapters/features/auth/controllers/AuthController';
import { ExperienciasController } from './logica/interface_adapters/features/experiencias/controllers/ExperienciasController';
import { authMiddleware } from './logica/interface_adapters/middleware/authMiddleware';
import { AppException } from './logica/application/exceptions/AppException';

const app = express();
const PORT = process.env['PORT'] ?? 3000;

app.use(cors({ origin: process.env['FRONTEND_URL'] ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());

AppDataSource.initialize()
  .then((dataSource) => {
    const usuarioRepo = new UsuarioRepository(dataSource);
    const experienciaRepo = new ExperienciaRepository(dataSource);
    const sesionRepo = new SesionRepository(dataSource);
    const intentoRepo = new IntentoFallidoRepository(dataSource);

    const registerUC = new RegisterUseCase(usuarioRepo);
    const loginUC = new LoginUseCase(usuarioRepo, sesionRepo, intentoRepo);
    const logoutUC = new LogoutUseCase(sesionRepo);
    const createExpUC = new CreateExperienciaUseCase(experienciaRepo);
    const editExpUC = new EditExperienciaUseCase(experienciaRepo);
    const deleteExpUC = new DeleteExperienciaUseCase(experienciaRepo);
    const publishExpUC = new PublishExperienciaUseCase(experienciaRepo);
    const listExpUC = new ListExperienciasUseCase(experienciaRepo);
    const getExpUC = new GetExperienciaUseCase(experienciaRepo);

    const authCtrl = new AuthController(registerUC, loginUC, logoutUC);
    const expCtrl = new ExperienciasController(createExpUC, editExpUC, deleteExpUC, publishExpUC, listExpUC, getExpUC);

    // Auth routes
    app.post('/api/auth/register', authCtrl.register);
    app.post('/api/auth/login', authCtrl.login);
    app.post('/api/auth/logout', authMiddleware, authCtrl.logout);

    // Experiencias routes
    app.get('/api/experiencias', expCtrl.list);
    app.get('/api/experiencias/:id', expCtrl.getById);
    app.post('/api/experiencias', authMiddleware, expCtrl.create);
    app.put('/api/experiencias/:id', authMiddleware, expCtrl.update);
    app.delete('/api/experiencias/:id', authMiddleware, expCtrl.delete);
    app.patch('/api/experiencias/:id/publicar', authMiddleware, expCtrl.publish);

    // Health check
    app.get('/api/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

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
