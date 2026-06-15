import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UsuarioORM } from '../entities/UsuarioORM';
import { ExperienciaORM } from '../entities/ExperienciaORM';
import { SesionORM } from '../entities/SesionORM';
import { IntentoFallidoORM } from '../entities/IntentoFallidoORM';
import { EtiquetaORM } from '../entities/EtiquetaORM';
import { ExperienciaEtiquetaORM } from '../entities/ExperienciaEtiquetaORM';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: Number(process.env['DB_PORT'] ?? 5432),
  username: process.env['DB_USER'] ?? 'postgres',
  password: process.env['DB_PASSWORD'] ?? 'postgres',
  database: process.env['DB_NAME'] ?? 'ethos_platform',
  entities: [
    UsuarioORM, 
    ExperienciaORM, 
    SesionORM, 
    IntentoFallidoORM,
    EtiquetaORM,
    ExperienciaEtiquetaORM
  ],
  synchronize: process.env['NODE_ENV'] === 'development',
  logging: process.env['NODE_ENV'] === 'development',
});
