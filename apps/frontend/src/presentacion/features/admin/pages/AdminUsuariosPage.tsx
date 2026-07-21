import { useEffect, useState } from 'react';

import { adminService, type UsuarioAdmin } from '@features/admin/services/admin.service';

const ROLES = ['usuario', 'moderador', 'admin'];

export function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [suspenderModal, setSuspenderModal] = useState<string | null>(null);
  const [dias, setDias] = useState(7);
  const [feedback, setFeedback] = useState('');

  const cargar = () => {
    setLoading(true);
    adminService
      .listarUsuarios(page, 20)
      .then((res) => {
        setUsuarios(res.data);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect -- fetch-on-page-change, no stale-closure risk
  useEffect(() => { cargar(); }, [page]);

  const toast = (msg: string) => { setFeedback(msg); setTimeout(() => setFeedback(''), 3000); };

  const handleRol = async (id: string, rol: string) => {
    await adminService.asignarRol(id, rol);
    cargar();
    toast('Rol actualizado.');
  };

  const handleSuspender = async () => {
    if (!suspenderModal) return;
    await adminService.suspender(suspenderModal, dias);
    setSuspenderModal(null);
    cargar();
    toast(`Usuario suspendido por ${dias} días.`);
  };

  const handleReactivar = async (id: string) => {
    await adminService.reactivar(id);
    cargar();
    toast('Usuario reactivado.');
  };

  const handleEliminar = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Eliminar a "${nombre}" permanentemente?`)) return;
    await adminService.eliminar(id);
    cargar();
    toast('Usuario eliminado.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de administración</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">{total} usuarios</span>
      </div>

      {feedback && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg px-4 py-2 text-sm">
          {feedback}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="text-left px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">Correo</th>
                <th className="text-left px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">Rol</th>
                <th className="text-left px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{u.nombre}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.correo}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.rol}
                      onChange={(e) => void handleRol(u.id, e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {u.suspendido
                      ? <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-0.5 rounded-full">Suspendido</span>
                      : <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-0.5 rounded-full">Activo</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {u.suspendido
                        ? (
                          <button
                            onClick={() => void handleReactivar(u.id)}
                            className="text-xs text-green-600 dark:text-green-400 hover:underline"
                          >
                            Reactivar
                          </button>
                        )
                        : (
                          <button
                            onClick={() => setSuspenderModal(u.id)}
                            className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline"
                          >
                            Suspender
                          </button>
                        )
                      }
                      <button
                        onClick={() => void handleEliminar(u.id, u.nombre)}
                        className="text-xs text-red-500 dark:text-red-400 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {total > 20 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700">
            Anterior
          </button>
          <span className="px-4 py-2 text-sm text-gray-500">Página {page}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page * 20 >= total}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700">
            Siguiente
          </button>
        </div>
      )}

      {/* Modal suspender */}
      {suspenderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Suspender usuario</h2>
            <label htmlFor="diasSuspension" className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Días de suspensión (1-365)</label>
            <input
              id="diasSuspension"
              type="number" min={1} max={365} value={dias}
              onChange={(e) => setDias(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="flex gap-3">
              <button onClick={() => void handleSuspender()}
                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium">
                Suspender
              </button>
              <button onClick={() => setSuspenderModal(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
