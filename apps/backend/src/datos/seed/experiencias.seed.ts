import type { EntityManager } from 'typeorm';
import { ExperienciaORM } from '../presistence/entities/ExperienciaORM';
import { ExperienciaEtiquetaORM } from '../presistence/entities/ExperienciaEtiquetaORM';
import { seedId, upsertWithCount, type UpsertCount } from './helpers';
import type { SeedUsuario } from './usuarios.seed';
import type { SeedEtiqueta } from './etiquetas.seed';

export interface SeedExperiencia {
  id: string;
  titulo: string;
  descripcion: string;
  reflexionMoral: string;
  reflexionEtica: string;
  estado: 'publicada' | 'borrador';
  etiquetas: string[]; // slugs
}

const EXPERIENCIAS_PLANTILLA: Omit<SeedExperiencia, 'id'>[] = [
  { titulo: 'Mi primer dilema ético en el trabajo', descripcion: 'La primera vez que enfrenté una decisión ética difícil en mi carrera profesional.', reflexionMoral: 'Aprendí que la integridad es más importante que el beneficio inmediato.', reflexionEtica: 'Decidí actuar según mi propio criterio de lo correcto, aunque no fuera la opción más cómoda.', estado: 'publicada', etiquetas: ['integridad', 'trabajo'] },
  { titulo: 'Cuando tuve que elegir entre un amigo y mis principios', descripcion: 'Un conflicto entre lealtad personal y mis valores éticos.', reflexionMoral: 'Los verdaderos amigos respetan tus valores, aunque no siempre estén de acuerdo.', reflexionEtica: 'Elegí mantenerme fiel a mis principios, confiando en que la amistad genuina lo entendería.', estado: 'publicada', etiquetas: ['coraje', 'relaciones', 'confianza'] },
  { titulo: 'Transparencia en la comunicación', descripcion: 'La importancia de ser honesto incluso cuando es difícil.', reflexionMoral: 'La verdad siempre sale a la luz, mejor siendo honesto desde el inicio.', reflexionEtica: 'Opté por decir la verdad de inmediato, aunque implicara una conversación incómoda.', estado: 'publicada', etiquetas: ['honestidad', 'transparencia'] },
  { titulo: 'Solidaridad con un colega', descripcion: 'Cómo defendí a un compañero injustamente criticado en una reunión.', reflexionMoral: 'La empatía y solidaridad son fundamentales en cualquier comunidad.', reflexionEtica: 'Decidí hablar en su defensa porque consideré que era lo justo, más allá de las consecuencias.', estado: 'publicada', etiquetas: ['empatia', 'relaciones', 'trabajo'] },
  { titulo: 'Errores y responsabilidad', descripcion: 'Asumir responsabilidad por un error en un proyecto importante.', reflexionMoral: 'Asumir errores genera confianza y fortalece las relaciones.', reflexionEtica: 'Reconocí mi error abiertamente porque creo que la honestidad vale más que cuidar mi imagen.', estado: 'publicada', etiquetas: ['responsabilidad', 'confianza'] },
  { titulo: 'Una decisión de justicia en el aula', descripcion: 'Como docente, tuve que calificar de forma justa incluso cuando la presión decía otra cosa.', reflexionMoral: 'La norma decía flexibilizar la nota por presión de un padre de familia.', reflexionEtica: 'Decidí calificar según el criterio justo y explicar la decisión con transparencia.', estado: 'publicada', etiquetas: ['justicia', 'trabajo'] },
  { titulo: 'Respeto ante una opinión distinta', descripcion: 'Un debate donde tuve que escuchar una postura muy diferente a la mía.', reflexionMoral: 'La sociedad valora la tolerancia y el respeto por la diversidad de ideas.', reflexionEtica: 'Elegí escuchar con respeto antes de responder, aunque no compartiera la opinión.', estado: 'publicada', etiquetas: ['respeto', 'empatia'] },
  { titulo: 'Lealtad a la verdad frente al grupo', descripcion: 'Cuando todo el equipo quería ocultar un problema y yo no estuve de acuerdo.', reflexionMoral: 'El grupo prefería la comodidad de callar antes que enfrentar el problema.', reflexionEtica: 'Preferí ser leal a la verdad, aunque eso significara ir contra la mayoría.', estado: 'publicada', etiquetas: ['lealtad', 'honestidad', 'coraje'] },
  { titulo: 'Humildad para aceptar una crítica', descripcion: 'Recibí una crítica dura sobre mi trabajo y tuve que procesarla con madurez.', reflexionMoral: 'La reacción esperada socialmente hubiera sido defenderme sin escuchar.', reflexionEtica: 'Decidí escuchar con humildad y usar la crítica para mejorar.', estado: 'publicada', etiquetas: ['humildad', 'responsabilidad'] },
  { titulo: 'Perseverar cuando nadie más creía en el proyecto', descripcion: 'Un proyecto comunitario que casi se cancela por falta de apoyo.', reflexionMoral: 'Muchos pensaban que era mejor abandonar la idea ante el desánimo general.', reflexionEtica: 'Decidí perseverar porque creía en el valor del proyecto para la comunidad.', estado: 'publicada', etiquetas: ['perseverancia', 'solidaridad'] },
  { titulo: 'Confianza traicionada, lección aprendida', descripcion: 'Alguien en quien confiaba usó mal esa confianza.', reflexionMoral: 'La reacción común hubiera sido responder con la misma deslealtad.', reflexionEtica: 'Elegí no responder con la misma moneda y aprender del episodio.', estado: 'publicada', etiquetas: ['confianza', 'lealtad'] },
  { titulo: 'Justicia por encima de la conveniencia', descripcion: 'Tuve que tomar una decisión que perjudicaba mis intereses pero era justa.', reflexionMoral: 'Lo conveniente era mirar para otro lado.', reflexionEtica: 'Decidí actuar con justicia aunque me costara algo personalmente.', estado: 'publicada', etiquetas: ['justicia', 'integridad'] },
  { titulo: 'Empatía en un momento difícil de un desconocido', descripcion: 'Ayudé a una persona desconocida que estaba pasando por un mal momento.', reflexionMoral: 'La indiferencia hubiera sido la opción más fácil.', reflexionEtica: 'Elegí detenerme y ayudar porque me puse en su lugar.', estado: 'publicada', etiquetas: ['empatia', 'solidaridad'] },
  { titulo: 'Transparencia con un cliente', descripcion: 'Tuve que informar a un cliente sobre un error que podía costarme el contrato.', reflexionMoral: 'Ocultar el error hubiera sido más seguro a corto plazo.', reflexionEtica: 'Decidí ser transparente porque la relación de confianza vale más que un contrato.', estado: 'publicada', etiquetas: ['transparencia', 'honestidad', 'trabajo'] },
  { titulo: 'Respetar un límite que me costó decir que no', descripcion: 'Tuve que decir que no a una petición que iba contra mis valores.', reflexionMoral: 'La presión social esperaba que accediera sin cuestionar.', reflexionEtica: 'Elegí poner un límite claro aunque generara incomodidad.', estado: 'publicada', etiquetas: ['respeto', 'coraje'] },
  { titulo: 'Coraje para denunciar una injusticia', descripcion: 'Presencié una situación injusta y decidí denunciarla.', reflexionMoral: 'Callar hubiera sido lo más seguro para mí.', reflexionEtica: 'Decidí actuar con coraje porque el silencio hubiera sido cómplice.', estado: 'publicada', etiquetas: ['coraje', 'justicia'] },
  { titulo: 'Solidaridad en tiempos de crisis', descripcion: 'Organizamos ayuda comunitaria durante una emergencia local.', reflexionMoral: 'Cada quien podía resolver solo su propia situación.', reflexionEtica: 'Elegimos apoyarnos como comunidad porque juntos superamos mejor la crisis.', estado: 'publicada', etiquetas: ['solidaridad', 'responsabilidad'] },
  { titulo: 'Aprender a confiar de nuevo', descripcion: 'Reconstruir la confianza en una relación después de un conflicto.', reflexionMoral: 'Lo fácil era cortar la relación por completo.', reflexionEtica: 'Decidí dar espacio a la reconciliación con límites claros.', estado: 'publicada', etiquetas: ['confianza', 'humildad'] },
  { titulo: 'Una reflexión aún en borrador', descripcion: 'Todavía estoy procesando esta experiencia antes de compartirla públicamente.', reflexionMoral: 'Sigo pensando en qué dice la norma social sobre esta situación.', reflexionEtica: 'Aún no tengo clara mi postura personal al respecto.', estado: 'borrador', etiquetas: ['integridad'] },
  { titulo: 'Otra experiencia en proceso de reflexión', descripcion: 'Quiero madurar mejor esta idea antes de publicarla.', reflexionMoral: 'La norma general sugiere una postura, pero quiero pensarlo más.', reflexionEtica: 'Prefiero tomarme un tiempo antes de decidir qué pienso realmente.', estado: 'borrador', etiquetas: ['responsabilidad'] },
];

export const EXPERIENCIAS_SEED: SeedExperiencia[] = EXPERIENCIAS_PLANTILLA.map((e, i) => ({
  ...e,
  id: seedId(`experiencia:${i}`),
}));

export interface ExperienciasSeedResult {
  count: UpsertCount;
  experiencias: Array<SeedExperiencia & { usuarioId: string }>;
}

/**
 * Crea las experiencias distribuyéndolas de forma determinística (round-robin)
 * entre los usuarios recibidos, y asocia sus etiquetas vía experiencia_etiquetas.
 */
export async function seedExperiencias(
  manager: EntityManager,
  usuarios: SeedUsuario[],
  etiquetas: SeedEtiqueta[],
): Promise<ExperienciasSeedResult> {
  const etiquetaIdPorSlug = new Map(etiquetas.map((e) => [e.slug, e.id]));

  const experienciasConUsuario = EXPERIENCIAS_SEED.map((exp, i) => ({
    ...exp,
    usuarioId: usuarios[i % usuarios.length]!.id,
  }));

  const rows = experienciasConUsuario.map((e) => ({
    id: e.id,
    usuarioId: e.usuarioId,
    titulo: e.titulo,
    descripcion: e.descripcion,
    reflexionMoral: e.reflexionMoral,
    reflexionEtica: e.reflexionEtica,
    estado: e.estado,
  }));
  const count = await upsertWithCount(manager, ExperienciaORM, rows, ['id']);

  const asociaciones = experienciasConUsuario.flatMap((e) =>
    e.etiquetas
      .map((slug) => etiquetaIdPorSlug.get(slug))
      .filter((etiquetaId): etiquetaId is string => Boolean(etiquetaId))
      .map((etiquetaId) => ({ experienciaId: e.id, etiquetaId })),
  );
  if (asociaciones.length > 0) {
    await manager
      .getRepository(ExperienciaEtiquetaORM)
      .upsert(asociaciones, { conflictPaths: ['experienciaId', 'etiquetaId'] });
  }

  return { count, experiencias: experienciasConUsuario };
}
