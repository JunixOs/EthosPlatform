import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1784605944519 implements MigrationInterface {
    name = 'InitialSchema1784605944519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" uuid NOT NULL, "nombre" character varying(100) NOT NULL, "correo" character varying(255) NOT NULL, "password_hash" character varying NOT NULL, "rol" character varying(20) NOT NULL DEFAULT 'user', "perfil_publico" boolean NOT NULL DEFAULT true, "suspendido" boolean NOT NULL DEFAULT false, "suspendido_hasta" TIMESTAMP, "biografia" text, "foto_perfil" character varying(500), "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_63665765c1a778a770c9bd585d3" UNIQUE ("correo"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experiencias" ("id" uuid NOT NULL, "usuario_id" uuid NOT NULL, "titulo" character varying(255) NOT NULL, "descripcion" text NOT NULL, "reflexion_moral" text NOT NULL, "reflexion_etica" text NOT NULL, "estado" character varying(20) NOT NULL DEFAULT 'borrador', "creada_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizada_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8299f6bb73e2f3fe5590b134a7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sesiones" ("id" uuid NOT NULL, "usuario_id" uuid NOT NULL, "token" text NOT NULL, "tipo" character varying(10) NOT NULL, "expira_en" TIMESTAMP NOT NULL, "creada_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1a45893c7ba49b11889db0d3038" UNIQUE ("token"), CONSTRAINT "PK_e4237ef09f1dc217c1660f23253" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "intentos_fallidos" ("id" uuid NOT NULL, "correo" character varying(255) NOT NULL, "ip" character varying(50) NOT NULL, "fecha_intento" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cc18503dd3e31d77937b49171ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favoritos" ("usuario_id" uuid NOT NULL, "experiencia_id" uuid NOT NULL, "guardado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_98fa2c202dfcab6d8067c7d84d4" PRIMARY KEY ("usuario_id", "experiencia_id"))`);
        await queryRunner.query(`CREATE TABLE "reacciones" ("id" uuid NOT NULL, "usuario_id" uuid NOT NULL, "experiencia_id" uuid NOT NULL, "creada_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_07793f62d2a2b81d09026f7cad8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "respuestas" ("id" uuid NOT NULL, "experiencia_id" uuid NOT NULL, "usuario_id" uuid NOT NULL, "contenido" text NOT NULL, "creada_en" TIMESTAMP NOT NULL DEFAULT now(), "actualizada_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_826786093f38b700d83d5a5adf2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "etiquetas" ("id" uuid NOT NULL, "nombre" character varying(50) NOT NULL, "slug" character varying(50) NOT NULL, "creada_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a4b4a8a74f3d0795a06ef1f24b8" UNIQUE ("nombre"), CONSTRAINT "UQ_89866a19f3cf5aa8522aba141b5" UNIQUE ("slug"), CONSTRAINT "PK_7ebf44885c27deb39c934e5560b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experiencia_etiquetas" ("experiencia_id" uuid NOT NULL, "etiqueta_id" uuid NOT NULL, CONSTRAINT "PK_9821b7888c22816b9da18198539" PRIMARY KEY ("experiencia_id", "etiqueta_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reportes_tipo_enum" AS ENUM('spam', 'contenido_inapropiado', 'acoso', 'informacion_falsa', 'otro')`);
        await queryRunner.query(`CREATE TABLE "reportes" ("id" uuid NOT NULL, "reporter_id" uuid NOT NULL, "experiencia_id" uuid NOT NULL, "tipo" "public"."reportes_tipo_enum" NOT NULL, "descripcion" text, "estado" character varying(20) NOT NULL DEFAULT 'pendiente', "creado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4204634633cb4099bc06b27a17e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auditoria" ("id" uuid NOT NULL, "admin_id" uuid NOT NULL, "accion" character varying(50) NOT NULL, "entidad" character varying(20) NOT NULL, "entidad_id" uuid NOT NULL, "detalles" text, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_135fe98308816fe3a2d458e6637" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pagina_equipo" ("id" uuid NOT NULL, "titulo" character varying(200) NOT NULL, "contenido" text NOT NULL, "miembros" text, "actualizado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b2a1598a7cbcec7cb5af2981a7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pagina_equipo"`);
        await queryRunner.query(`DROP TABLE "auditoria"`);
        await queryRunner.query(`DROP TABLE "reportes"`);
        await queryRunner.query(`DROP TYPE "public"."reportes_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "experiencia_etiquetas"`);
        await queryRunner.query(`DROP TABLE "etiquetas"`);
        await queryRunner.query(`DROP TABLE "respuestas"`);
        await queryRunner.query(`DROP TABLE "reacciones"`);
        await queryRunner.query(`DROP TABLE "favoritos"`);
        await queryRunner.query(`DROP TABLE "intentos_fallidos"`);
        await queryRunner.query(`DROP TABLE "sesiones"`);
        await queryRunner.query(`DROP TABLE "experiencias"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }

}
