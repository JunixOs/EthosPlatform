const TEAM = [
  {
    nombre: 'Javier',
    rol: 'Desarrollador Full Stack',
    descripcion: 'Responsable de la arquitectura, backend y frontend del sistema.',
    inicial: 'J',
    color: 'bg-indigo-600',
  },
];

export function TeamPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Nuestro Equipo</h1>
        <p className="text-gray-600 dark:text-gray-400">
          EthosPlatform es un proyecto académico desarrollado con pasión por la ética y la tecnología.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {TEAM.map((miembro) => (
          <div
            key={miembro.nombre}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center"
          >
            <div className={`${miembro.color} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
              {miembro.inicial}
            </div>
            <h2 className="text-lg font-semibold mb-1">{miembro.nombre}</h2>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">{miembro.rol}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{miembro.descripcion}</p>
          </div>
        ))}
      </div>

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
