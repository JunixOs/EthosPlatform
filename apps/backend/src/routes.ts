import { Router } from 'express';
import type { Container } from './container';

export function createRoutes(container: Container): Router {
  const router = Router();
  const { authMiddleware, requireAdmin } = container;

  // Auth
  router.post('/auth/register', container.authController.register);
  router.post('/auth/login', container.authController.login);
  router.post('/auth/logout', authMiddleware, container.authController.logout);

  // Experiencias — orden importante: rutas específicas antes que /:id
  router.get('/experiencias/buscar', container.experienciasController.buscar);
  router.get('/experiencias', container.experienciasController.list);
  router.get('/experiencias/:id/preview', authMiddleware, container.experienciasController.preview);
  router.get('/experiencias/:id/relacionadas', container.experienciasController.relacionadas);
  router.get('/experiencias/:id/relacionadas-autor', container.experienciasController.relacionadasAutor);
  router.get('/experiencias/:id', container.experienciasController.getById);
  router.post('/experiencias', authMiddleware, container.experienciasController.create);
  router.put('/experiencias/:id', authMiddleware, container.experienciasController.update);
  router.delete('/experiencias/:id', authMiddleware, container.experienciasController.delete);
  router.patch('/experiencias/:id/publicar', authMiddleware, container.experienciasController.publish);

  // Usuarios — /me antes que /:id para evitar conflictos
  router.get('/usuarios/me', authMiddleware, container.usuariosController.getMiPerfil);
  router.put('/usuarios/me/perfil', authMiddleware, container.usuariosController.editarPerfil);
  router.put('/usuarios/me/foto', authMiddleware, container.usuariosController.editarFoto);
  router.delete('/usuarios/me', authMiddleware, container.usuariosController.eliminarCuenta);
  router.get('/usuarios/:id', container.usuariosController.getPerfil);
  router.get('/usuarios/:id/estadisticas', container.usuariosController.getEstadisticas);
  router.get('/usuarios/:id/experiencias', container.usuariosController.getExperiencias);

  // Admin (requieren auth + rol admin)
  router.get('/admin/usuarios', authMiddleware, requireAdmin, container.adminController.listarUsuarios);
  router.put('/admin/usuarios/:id', authMiddleware, requireAdmin, container.adminController.editarUsuario);
  router.delete('/admin/usuarios/:id', authMiddleware, requireAdmin, container.adminController.eliminarUsuario);
  router.patch('/admin/usuarios/:id/rol', authMiddleware, requireAdmin, container.adminController.asignarRol);
  router.patch('/admin/usuarios/:id/suspender', authMiddleware, requireAdmin, container.adminController.suspender);
  router.patch('/admin/usuarios/:id/reactivar', authMiddleware, requireAdmin, container.adminController.reactivar);

  // Favoritos
  router.post('/favoritos/:experienciaId', authMiddleware, container.favoritosController.toggle);
  router.get('/favoritos/mios', authMiddleware, container.favoritosController.listarMios);

  // Reacciones
  router.get('/experiencias/:id/reacciones', container.reaccionesController.contar);
  router.post('/experiencias/:id/reacciones', authMiddleware, container.reaccionesController.toggle);

  // Respuestas
  router.get('/experiencias/:id/respuestas', container.respuestasController.listar);
  router.post('/experiencias/:id/respuestas', authMiddleware, container.respuestasController.crear);
  router.delete('/respuestas/:id', authMiddleware, container.respuestasController.eliminar);

  // Etiquetas
  router.get('/etiquetas', container.etiquetasController.listar);
  router.get('/etiquetas/:slug/experiencias', container.etiquetasController.buscarPorEtiqueta);
  router.put('/experiencias/:id/etiquetas', authMiddleware, container.etiquetasController.asociar);

  // Reportes
  router.post('/reportes', authMiddleware, container.reportesController.crear);
  router.get('/admin/reportes', authMiddleware, requireAdmin, container.reportesController.listarPendientes);
  router.patch('/admin/reportes/:id/ocultar', authMiddleware, requireAdmin, container.reportesController.ocultar);

  // Pagina Equipo
  router.get('/pagina-equipo', container.paginaEquipoController.obtener);
  router.put('/admin/pagina-equipo', authMiddleware, requireAdmin, container.paginaEquipoController.editar);

  return router;
}
