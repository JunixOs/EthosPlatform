import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { usuariosService } from '@features/usuarios/services/usuarios.service';
import type { PerfilUsuario } from '@features/usuarios/types/usuario.types';

import { useAuthStore } from '@/app/store/auth.store';

export function EditarPerfilPage() {
  const navigate = useNavigate();
  const { usuario: miUsuario } = useAuthStore();
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [nombre, setNombre] = useState('');
  const [biografia, setBiografia] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [perfilPublico, setPerfilPublico] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    usuariosService.getMiPerfil().then((p) => {
      setPerfil(p);
      setNombre(p.nombre);
      setBiografia(p.biografia ?? '');
      setFotoUrl(p.fotoPerfil ?? '');
      setPerfilPublico(p.perfilPublico);
    }).catch(() => setError('No se pudo cargar el perfil.'));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await usuariosService.editarPerfil({
        nombre: nombre.trim(),
        biografia: biografia.trim() || null,
        perfilPublico,
      });
      if (fotoUrl !== (perfil?.fotoPerfil ?? '')) {
        await usuariosService.editarFoto(fotoUrl.trim() || null);
      }
      setSuccess('Perfil actualizado correctamente.');
      setTimeout(() => navigate(`/perfil/${miUsuario?.id}`), 1500);
    } catch {
      setError('Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (!perfil) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Editar perfil</h1>
      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-5">
        {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}
        {success && <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg px-4 py-3 text-sm">{success}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Biografía</label>
          <textarea
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            rows={3}
            placeholder="Cuéntanos sobre ti..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de foto de perfil</label>
          <input
            type="url"
            value={fotoUrl}
            onChange={(e) => setFotoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {fotoUrl && (
            <img src={fotoUrl} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-600" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="perfilPublico"
            checked={perfilPublico}
            onChange={(e) => setPerfilPublico(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="perfilPublico" className="text-sm text-gray-700 dark:text-gray-300">
            Perfil público (visible para todos)
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
