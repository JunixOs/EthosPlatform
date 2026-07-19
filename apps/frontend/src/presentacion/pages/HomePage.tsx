import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/app/store/auth.store';

import { LinkComponent } from '@/shared/components/Link/Link.component';
import { CardComponent } from '@/shared/components/Card/Card.component';
import { experienciasService } from '@features/experiencias/services/experiencias.service';
import type { Experiencia } from '@features/experiencias/types/experiencia.types';

export function HomePage() {
  const { usuario } = useAuthStore();
  const [recientes, setRecientes] = useState<Experiencia[]>([]);
  const [loadingRecientes, setLoadingRecientes] = useState(true);

  useEffect(() => {
    experienciasService.listar({ page: 1, limit: 6, sort: 'date' })
      .then((res) => setRecientes(res.data))
      .catch(() => null)
      .finally(() => setLoadingRecientes(false));
  }, []);

  return (
    <div className="space-y-20 max-w-7xl mx-auto px-4">
      {/* Hero */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-6">
          Comparte tu experiencia <br />
          <span className="text-indigo-600 dark:text-indigo-400">ética y moral</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Un espacio para reflexionar sobre dilemas éticos reales, comparar lo que dice la moral
          con lo que dicta tu propia ética personal, y aprender de las experiencias de otros.
        </p>
        <div className="flex justify-center gap-4">
          <LinkComponent
            to='/experiencias'
            variant='primary_button_indigo'
            size='lg'
            className='rounded-lg font-medium transition-colors'>
              Ver experiencias
          </LinkComponent>
          {!usuario && (
            <LinkComponent
              to='/registro'
              variant='secondary_button_indigo_edge'
              size='lg'
              className='rounded-lg transition-colors'>
                Unirse gratis
            </LinkComponent>
          )}
        </div>
      </section>

      {/* Experiencias recientes */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experiencias recientes</h2>
          <Link to="/experiencias" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Ver todas →
          </Link>
        </div>

        {loadingRecientes ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recientes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">Aún no hay experiencias publicadas.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recientes.map((exp) => (
              <Link
                key={exp.id}
                to={`/experiencias/${exp.id}`}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-2">{exp.titulo}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">{exp.descripcion}</p>
                <p className="text-xs text-gray-400 mt-3">
                  {new Date(exp.creadaEn).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Qué es */}
      <section className="grid md:grid-cols-3 gap-8">
        <CardComponent
          variant='outlined'
          className='text-center p-6 border'>
          <div className="text-4xl mb-4">🤔</div>
          <h3 className="text-lg font-semibold mb-2">Reflexiona</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Analiza dilemas éticos reales a través de la doble perspectiva: la moral colectiva y tu ética personal.
          </p>
        </CardComponent>

        <CardComponent 
          variant='outlined'
          className='text-center p-6 border'>
          <div className="text-4xl mb-4">✍️</div>
          <h3 className="text-lg font-semibold mb-2">Comparte</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Cuenta tu experiencia, qué dijeron las normas y qué decidiste tú. Tu perspectiva importa.
          </p>
        </CardComponent>
        <CardComponent 
          variant='outlined'
          className='text-center p-6 border'>
          <div className="text-4xl mb-4">🌐</div>
          <h3 className="text-lg font-semibold mb-2">Aprende</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Descubre cómo otros enfrentaron situaciones similares y amplía tu visión ética del mundo.
          </p>
        </CardComponent>
      </section>

      {/* Diferencia moral vs ética */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-2xl p-10">
        <h2 className="text-2xl font-bold text-center mb-8">Moral vs. Ética</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400 mb-3">La Moral</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Son las normas, valores y principios que una sociedad, cultura o religión
              ha establecido como correctos o incorrectos. Es el conjunto de reglas
              que heredamos y adoptamos de nuestro entorno.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-3">Tu Ética</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Es tu criterio personal, racional y reflexivo sobre lo que es correcto.
              Es la disciplina que te lleva a cuestionar, evaluar y en ocasiones contradecir
              la moral establecida cuando tu razón así lo indica.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      {usuario && (
        <section className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">¿Tienes una experiencia para compartir?</h2>
          <Link
            to="/experiencias/nueva"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium text-lg"
          >
            Compartir ahora
          </Link>
        </section>
      )}
    </div>
  );
}
