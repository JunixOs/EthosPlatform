import { z } from 'zod';

// ─── Auth ───────────────────────────────────────────────────────────────────
// Espejo de la validación de dominio (ver Password.ts / Email.ts) para
// devolver 400 antes de llegar al use case.

export const registerSchema = z.object({
  correo: z.string().trim().pipe(z.email({ message: 'El correo electrónico no es válido.' })),
  nombre: z.string().trim().min(2, 'El nombre es muy corto.').max(100, 'El nombre es muy largo.'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula.')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula.')
    .regex(/\d/, 'La contraseña debe contener al menos un dígito.'),
});

export const loginSchema = z.object({
  correo: z.string().trim().pipe(z.email({ message: 'El correo electrónico no es válido.' })),
  password: z.string().min(1, 'La contraseña es requerida.'),
  recordarme: z.boolean().optional(),
});

// ─── Experiencias ───────────────────────────────────────────────────────────
// min(10) en descripcion/reflexiones espeja la regla de CreateExperienciaUseCase
// y EditExperienciaUseCase (MIN_CHARS = 10).

const experienciaFields = {
  titulo: z.string().trim().min(1, 'El título es requerido.').max(255, 'El título es muy largo.'),
  descripcion: z.string().trim().min(10, 'La descripción debe tener al menos 10 caracteres.').max(5000, 'La descripción es muy larga.'),
  reflexionMoral: z.string().trim().min(10, 'La reflexión moral debe tener al menos 10 caracteres.').max(5000, 'La reflexión moral es muy larga.'),
  reflexionEtica: z.string().trim().min(10, 'La reflexión ética debe tener al menos 10 caracteres.').max(5000, 'La reflexión ética es muy larga.'),
};

export const createExperienciaSchema = z.object({
  ...experienciaFields,
  publicar: z.boolean().optional(),
});

export const updateExperienciaSchema = z.object(experienciaFields);

// ─── Usuarios ───────────────────────────────────────────────────────────────

export const editarPerfilSchema = z.object({
  nombre: z.string().trim().min(2, 'El nombre es muy corto.').max(100, 'El nombre es muy largo.'),
  biografia: z.string().max(500, 'La biografía es muy larga.').optional().nullable(),
  perfilPublico: z.boolean(),
});
