export interface PerfilUsuario {
  id: string;
  nombre: string;
  biografia: string | null;
  fotoPerfil: string | null;
  perfilPublico: boolean;
  rol: string;
  creadoEn: string;
  estadisticas: {
    totalExperiencias: number;
    totalFavoritos: number;
    miembroDesde: number;
  };
}
