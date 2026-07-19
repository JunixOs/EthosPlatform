import { Link } from 'react-router-dom';

interface EtiquetaDTO {
  id: string;
  nombre: string;
  slug: string;
}

interface EtiquetasListProps {
  etiquetas: EtiquetaDTO[];
}

export function EtiquetasList({ etiquetas }: EtiquetasListProps) {
  if (etiquetas.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {etiquetas.map((tag) => (
        <Link
          key={tag.id}
          to={`/buscar?etiqueta=${encodeURIComponent(tag.slug)}`}
          className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          #{tag.nombre}
        </Link>
      ))}
    </div>
  );
}
