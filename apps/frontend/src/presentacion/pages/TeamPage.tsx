import { useState, useEffect } from 'react';
import { paginaEquipoService } from '@features/pagina_equipo/services/paginaEquipo.service';

export function TeamPage() {
  const [pagina, setPagina] = useState<{ titulo: string; contenido: string; miembros: { nombre: string; rol: string; fotoUrl?: string; bio?: string }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paginaEquipoService.obtener()
      .then((res) => setPagina(res))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const miembros = pagina?.miembros ?? [];
  const titulo = pagina?.titulo ?? 'Nuestro Equipo';
  const contenido = pagina?.contenido ?? 'EthosPlatform es un proyecto académico desarrollado con pasión por la ética y la tecnología.';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">{titulo}</h1>
        <p className="text-gray-600 dark:text-gray-400">{contenido}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : miembros.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">Información del equipo no disponible.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {miembros.map((miembro, i) => (
            <div
              key={`${miembro.nombre}-${i}`}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center"
            >
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {miembro.nombre.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-semibold mb-1">{miembro.nombre}</h2>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">{miembro.rol}</p>
              {miembro.bio && <p className="text-sm text-gray-600 dark:text-gray-400">{miembro.bio}</p>}
            </div>
          ))}
        </div>
      )}

      <section className="bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Sobre el proyecto</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
          EthosPlatform nació como un proyecto académico para explorar la intersección entre la tecnología
          y la filosofía ética. Creemos que compartir experiencias morales reales puede enriquecer
          la reflexión colectiva y ayudarnos a ser mejores personas.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Licencia MIT — 2026
        </p>
      </section>
    </div>
  );
}
