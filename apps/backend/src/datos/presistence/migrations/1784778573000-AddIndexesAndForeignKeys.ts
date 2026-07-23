import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Completa la integridad referencial que faltaba desde el esquema inicial:
 * el schema original no tenía ningún FK constraint ni índice sobre columnas
 * de clave foránea, lo que dejaba filas huérfanas al eliminar usuarios o
 * experiencias (ver comentarios de EliminarCuentaUseCase) y forzaba table
 * scans en consultas frecuentes (ej. IntentoFallidoRepository.findRecientesByCorreo
 * en cada intento de login).
 *
 * Antes de agregar los FKs se limpian las filas huérfanas ya existentes,
 * porque Postgres rechaza un FK constraint si ya hay datos que lo violan.
 * ON DELETE CASCADE en todos los casos porque es el comportamiento que el
 * código de la aplicación ya asume (ver EliminarCuentaUseCase) pero no
 * implementaba de forma completa.
 */
export class AddIndexesAndForeignKeys1784778573000 implements MigrationInterface {
    name = 'AddIndexesAndForeignKeys1784778573000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ─── Limpieza de filas huérfanas (children primero) ────────────────
        await queryRunner.query(`DELETE FROM "respuestas" r WHERE NOT EXISTS (SELECT 1 FROM "experiencias" e WHERE e.id = r.experiencia_id) OR NOT EXISTS (SELECT 1 FROM "usuarios" u WHERE u.id = r.usuario_id)`);
        await queryRunner.query(`DELETE FROM "reacciones" r WHERE NOT EXISTS (SELECT 1 FROM "experiencias" e WHERE e.id = r.experiencia_id) OR NOT EXISTS (SELECT 1 FROM "usuarios" u WHERE u.id = r.usuario_id)`);
        await queryRunner.query(`DELETE FROM "favoritos" f WHERE NOT EXISTS (SELECT 1 FROM "experiencias" e WHERE e.id = f.experiencia_id) OR NOT EXISTS (SELECT 1 FROM "usuarios" u WHERE u.id = f.usuario_id)`);
        await queryRunner.query(`DELETE FROM "experiencia_etiquetas" ee WHERE NOT EXISTS (SELECT 1 FROM "experiencias" e WHERE e.id = ee.experiencia_id) OR NOT EXISTS (SELECT 1 FROM "etiquetas" t WHERE t.id = ee.etiqueta_id)`);
        await queryRunner.query(`DELETE FROM "reportes" r WHERE NOT EXISTS (SELECT 1 FROM "experiencias" e WHERE e.id = r.experiencia_id) OR NOT EXISTS (SELECT 1 FROM "usuarios" u WHERE u.id = r.reporter_id)`);
        await queryRunner.query(`DELETE FROM "sesiones" s WHERE NOT EXISTS (SELECT 1 FROM "usuarios" u WHERE u.id = s.usuario_id)`);
        await queryRunner.query(`DELETE FROM "auditoria" a WHERE NOT EXISTS (SELECT 1 FROM "usuarios" u WHERE u.id = a.admin_id)`);

        // Deduplicar reacciones antes del UNIQUE (no debería haber ninguna,
        // pero por seguridad ante condiciones de carrera pasadas). Se usa
        // ROW_NUMBER() en vez de MIN(id) porque MIN() no soporta uuid.
        await queryRunner.query(`
            DELETE FROM "reacciones" r
            USING (
                SELECT id, ROW_NUMBER() OVER (PARTITION BY usuario_id, experiencia_id ORDER BY creada_en, id) AS rn
                FROM "reacciones"
            ) ranked
            WHERE r.id = ranked.id AND ranked.rn > 1
        `);

        // ─── Índices sobre columnas FK (evitan table scans) ────────────────
        await queryRunner.query(`CREATE INDEX "IDX_experiencias_usuario_id" ON "experiencias" ("usuario_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_sesiones_usuario_id" ON "sesiones" ("usuario_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_intentos_fallidos_correo" ON "intentos_fallidos" ("correo")`);
        await queryRunner.query(`CREATE INDEX "IDX_favoritos_experiencia_id" ON "favoritos" ("experiencia_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_reacciones_usuario_id" ON "reacciones" ("usuario_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_reacciones_experiencia_id" ON "reacciones" ("experiencia_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_respuestas_experiencia_id" ON "respuestas" ("experiencia_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_respuestas_usuario_id" ON "respuestas" ("usuario_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_experiencia_etiquetas_etiqueta_id" ON "experiencia_etiquetas" ("etiqueta_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_reportes_reporter_id" ON "reportes" ("reporter_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_reportes_experiencia_id" ON "reportes" ("experiencia_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_auditoria_admin_id" ON "auditoria" ("admin_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_auditoria_entidad_id" ON "auditoria" ("entidad_id")`);

        // ─── Unique constraint: un usuario solo puede reaccionar una vez a
        // la misma experiencia (ToggleReaccionUseCase asumía esto pero no
        // estaba garantizado a nivel de BD, permitiendo duplicados por
        // condición de carrera) ───────────────────────────────────────────
        await queryRunner.query(`ALTER TABLE "reacciones" ADD CONSTRAINT "UQ_reacciones_usuario_experiencia" UNIQUE ("usuario_id", "experiencia_id")`);

        // ─── Foreign keys con ON DELETE CASCADE (completa la cascada que
        // EliminarCuentaUseCase / DeleteExperienciaUseCase ya asumían) ──────
        await queryRunner.query(`ALTER TABLE "experiencias" ADD CONSTRAINT "FK_experiencias_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "sesiones" ADD CONSTRAINT "FK_sesiones_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favoritos" ADD CONSTRAINT "FK_favoritos_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favoritos" ADD CONSTRAINT "FK_favoritos_experiencia" FOREIGN KEY ("experiencia_id") REFERENCES "experiencias"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reacciones" ADD CONSTRAINT "FK_reacciones_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reacciones" ADD CONSTRAINT "FK_reacciones_experiencia" FOREIGN KEY ("experiencia_id") REFERENCES "experiencias"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "respuestas" ADD CONSTRAINT "FK_respuestas_experiencia" FOREIGN KEY ("experiencia_id") REFERENCES "experiencias"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "respuestas" ADD CONSTRAINT "FK_respuestas_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "experiencia_etiquetas" ADD CONSTRAINT "FK_experiencia_etiquetas_experiencia" FOREIGN KEY ("experiencia_id") REFERENCES "experiencias"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "experiencia_etiquetas" ADD CONSTRAINT "FK_experiencia_etiquetas_etiqueta" FOREIGN KEY ("etiqueta_id") REFERENCES "etiquetas"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reportes" ADD CONSTRAINT "FK_reportes_experiencia" FOREIGN KEY ("experiencia_id") REFERENCES "experiencias"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reportes" ADD CONSTRAINT "FK_reportes_reporter" FOREIGN KEY ("reporter_id") REFERENCES "usuarios"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "auditoria" ADD CONSTRAINT "FK_auditoria_admin" FOREIGN KEY ("admin_id") REFERENCES "usuarios"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auditoria" DROP CONSTRAINT "FK_auditoria_admin"`);
        await queryRunner.query(`ALTER TABLE "reportes" DROP CONSTRAINT "FK_reportes_reporter"`);
        await queryRunner.query(`ALTER TABLE "reportes" DROP CONSTRAINT "FK_reportes_experiencia"`);
        await queryRunner.query(`ALTER TABLE "experiencia_etiquetas" DROP CONSTRAINT "FK_experiencia_etiquetas_etiqueta"`);
        await queryRunner.query(`ALTER TABLE "experiencia_etiquetas" DROP CONSTRAINT "FK_experiencia_etiquetas_experiencia"`);
        await queryRunner.query(`ALTER TABLE "respuestas" DROP CONSTRAINT "FK_respuestas_usuario"`);
        await queryRunner.query(`ALTER TABLE "respuestas" DROP CONSTRAINT "FK_respuestas_experiencia"`);
        await queryRunner.query(`ALTER TABLE "reacciones" DROP CONSTRAINT "FK_reacciones_experiencia"`);
        await queryRunner.query(`ALTER TABLE "reacciones" DROP CONSTRAINT "FK_reacciones_usuario"`);
        await queryRunner.query(`ALTER TABLE "favoritos" DROP CONSTRAINT "FK_favoritos_experiencia"`);
        await queryRunner.query(`ALTER TABLE "favoritos" DROP CONSTRAINT "FK_favoritos_usuario"`);
        await queryRunner.query(`ALTER TABLE "sesiones" DROP CONSTRAINT "FK_sesiones_usuario"`);
        await queryRunner.query(`ALTER TABLE "experiencias" DROP CONSTRAINT "FK_experiencias_usuario"`);

        await queryRunner.query(`ALTER TABLE "reacciones" DROP CONSTRAINT "UQ_reacciones_usuario_experiencia"`);

        await queryRunner.query(`DROP INDEX "IDX_auditoria_entidad_id"`);
        await queryRunner.query(`DROP INDEX "IDX_auditoria_admin_id"`);
        await queryRunner.query(`DROP INDEX "IDX_reportes_experiencia_id"`);
        await queryRunner.query(`DROP INDEX "IDX_reportes_reporter_id"`);
        await queryRunner.query(`DROP INDEX "IDX_experiencia_etiquetas_etiqueta_id"`);
        await queryRunner.query(`DROP INDEX "IDX_respuestas_usuario_id"`);
        await queryRunner.query(`DROP INDEX "IDX_respuestas_experiencia_id"`);
        await queryRunner.query(`DROP INDEX "IDX_reacciones_experiencia_id"`);
        await queryRunner.query(`DROP INDEX "IDX_reacciones_usuario_id"`);
        await queryRunner.query(`DROP INDEX "IDX_favoritos_experiencia_id"`);
        await queryRunner.query(`DROP INDEX "IDX_intentos_fallidos_correo"`);
        await queryRunner.query(`DROP INDEX "IDX_sesiones_usuario_id"`);
        await queryRunner.query(`DROP INDEX "IDX_experiencias_usuario_id"`);
    }

}
