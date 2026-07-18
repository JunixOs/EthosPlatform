import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UsuarioORM } from '../entities/UsuarioORM';
import { ExperienciaORM } from '../entities/ExperienciaORM';
import { SesionORM } from '../entities/SesionORM';
import { IntentoFallidoORM } from '../entities/IntentoFallidoORM';
import { FavoritoORM } from '../entities/FavoritoORM';
import { ReaccionORM } from '../entities/ReaccionORM';
import { RespuestaORM } from '../entities/RespuestaORM';
import { EtiquetaORM } from '../entities/EtiquetaORM';
import { ExperienciaEtiquetaORM } from '../entities/ExperienciaEtiquetaORM';
import { ReporteORM } from '../entities/ReporteORM';
import { AuditoriaORM } from '../entities/AuditoriaORM';
import { PaginaEquipoORM } from '../entities/PaginaEquipoORM';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: Number(process.env['DB_PORT'] ?? 5432),
  username: process.env['DB_USER'] ?? 'postgres',
  password: process.env['DB_PASSWORD'] ?? 'postgres',
  database: process.env['DB_NAME'] ?? 'ethos_platform',
  entities: [
    UsuarioORM, ExperienciaORM, SesionORM, IntentoFallidoORM,
    FavoritoORM, ReaccionORM, RespuestaORM, EtiquetaORM,
    ExperienciaEtiquetaORM, ReporteORM, AuditoriaORM, PaginaEquipoORM,
  ],
  synchronize: process.env['NODE_ENV'] === 'development',
  logging: process.env['NODE_ENV'] === 'development',
});
