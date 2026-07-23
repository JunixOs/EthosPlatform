import { createApp, globalErrorHandler } from './app';
import { createContainer } from './container';
import { createRoutes } from './routes';
import { AppDataSource } from './datos/presistence/connections/AppDataSource';
import { runSeed } from './datos/seed';
import { logger } from './infrastructure/logger';

const PORT = process.env['BACKEND_PORT'] ?? 3000;

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception');
  process.exit(1);
});

async function startServer(): Promise<void> {
  try {
    const container = await createContainer();

    // El DataSource ya está inicializado (createContainer lo hace); el seed
    // reutiliza esa misma conexión, no abre una nueva.
    // await runSeed(AppDataSource, logger);

    const app = createApp();
    const apiRouter = createRoutes(container);

    app.use('/api', apiRouter);

    // Global error handler — DEBE ir DESPUÉS de todas las rutas
    app.use(globalErrorHandler);

    const server = app.listen(PORT, () => {
      logger.info(`EthosPlatform API corriendo en http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} recibido. Cerrando servidor...`);
      server.close(() => {
        logger.info('Servidor HTTP cerrado.');
      });
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        logger.info('Conexión a base de datos cerrada.');
      }
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error(err, 'Error al iniciar el servidor');
    process.exit(1);
  }
}

startServer();
