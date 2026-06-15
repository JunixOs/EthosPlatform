import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usuariosService } from '../services/usuarios.service';
import { experienciasService } from '../../experiencias/services/experiencias.service';
import type { PerfilUsuario } from '../types/usuario.types';
import type { Experiencia } from '../../experiencias/types/experiencia.types';
import { useAuthStore } from '../../auth/store/auth.store';

export function PerfilPage() {
  const { id } = useParams<{ id: string }>();
  const { usuario: miUsuario } = useAuthStore();
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const esMiPerfil = miUsuario?.id === id;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      usuariosService.getPerfil(id),
      experienciasService.listar({ page: 1, limit: 6, usuarioId: id }),
    ])
      .then(([p, exp]) => {
        setPerfil(p);
        setExperiencias(exp.data);
      })
      .catch(() => setError('No se pudo cargar el perfil.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" /></div>;
  if (error || !perfil) return <div className="text-center py-20 text-red-500">{error || 'Perfil no encontrado.'}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden flex-shrink-0">
            {perfil.fotoPerfil
              ? <img src={perfil.fotoPerfil} alt={perfil.nombre} className="w-full h-full object-cover" />
              : <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">{perfil.nombre[0]?.toUpperCase()}</span>
            }
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{perfil.nombre}</h1>
              {perfil.rol === 'admin' && (
                <span className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs font-medium px-2 py-0.5 rounded-full">Admin</span>
              )}
            </div>
            {perfil.biografia && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{perfil.biografia}</p>
            )}
            <p className="text-xs text-gray-400">Miembro desde {new Date(perfil.creadoEn).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}</p>
          </div>
          {esMiPerfil && (
            <Link to="/perfil/editar" className="ml-auto bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Editar perfil
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{perfil.estadisticas.totalExperiencias}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Experiencias</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{perfil.estadisticas.totalFavoritos}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Favoritos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{new Date(perfil.estadisticas.miembroDesde).getFullYear()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Año de ingreso</p>
          </div>
        </div>
      </div>

      {/* Experiencias del usuario */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Experiencias publicadas</h2>
        {experiencias.length === 0
          ? <p className="text-gray-500 dark:text-gray-400 text-sm">Ninguna experiencia publicada aún.</p>
          : (
            <div className="grid sm:grid-cols-2 gap-4">
              {experiencias.map((exp) => (
                <Link key={exp.id} to={`/experiencias/${exp.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">{exp.titulo}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{exp.descripcion}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(exp.creadaEn).toLocaleDateString('es-ES')}</p>
                </Link>
              ))}
            </div>
          )
        }
        {esMiPerfil && (
          <div className="mt-4">
            <Link to="/mis-experiencias" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              Ver todas mis experiencias →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
