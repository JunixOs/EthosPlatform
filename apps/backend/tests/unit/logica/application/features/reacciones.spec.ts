import { describe, it, expect, vi } from 'vitest';
import { ToggleReaccionUseCase } from '@/logica/application/features/reacciones/ToggleReaccionUseCase';
import { ContarReaccionesUseCase } from '@/logica/application/features/reacciones/ContarReaccionesUseCase';
import { Reaccion } from '@/logica/domain/entities/Reaccion';
import { NotFoundException } from '@/logica/application/exceptions/AppException';

const mockExperienciaRepo = {
  findById: vi.fn(),
};

const mockReaccionRepo = {
  findByUsuarioAndExperiencia: vi.fn(),
  countByExperienciaId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
};

describe('ToggleReaccionUseCase', () => {
  const toggleUC = new ToggleReaccionUseCase(mockReaccionRepo as any, mockExperienciaRepo as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw NotFoundException if experiencia does not exist', async () => {
    mockExperienciaRepo.findById.mockResolvedValue(null);
    await expect(toggleUC.execute('u1', 'e1')).rejects.toThrow(NotFoundException);
  });

  it('should add reaction when none exists', async () => {
    const experiencia = { getId: () => 'e1' };
    mockExperienciaRepo.findById.mockResolvedValue(experiencia);
    mockReaccionRepo.findByUsuarioAndExperiencia.mockResolvedValue(null);
    mockReaccionRepo.countByExperienciaId.mockResolvedValue(1);

    const result = await toggleUC.execute('u1', 'e1');
    expect(result.accion).toBe('agregado');
    expect(result.experienciaId).toBe('e1');
    expect(result.totalReacciones).toBe(1);
    expect(mockReaccionRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should remove reaction when one exists', async () => {
    const experiencia = { getId: () => 'e1' };
    mockExperienciaRepo.findById.mockResolvedValue(experiencia);
    const reaccion = new Reaccion('r1', 'u1', 'e1');
    mockReaccionRepo.findByUsuarioAndExperiencia.mockResolvedValue(reaccion);
    mockReaccionRepo.countByExperienciaId.mockResolvedValue(0);

    const result = await toggleUC.execute('u1', 'e1');
    expect(result.accion).toBe('eliminado');
    expect(result.totalReacciones).toBe(0);
    expect(mockReaccionRepo.delete).toHaveBeenCalledWith('r1');
  });
});

describe('ContarReaccionesUseCase', () => {
  const contarUC = new ContarReaccionesUseCase(mockReaccionRepo as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return count and false for anonymous user', async () => {
    mockReaccionRepo.countByExperienciaId.mockResolvedValue(5);
    const result = await contarUC.execute('e1');
    expect(result.total).toBe(5);
    expect(result.usuarioHaReaccionado).toBe(false);
  });

  it('should return count and true when user has reacted', async () => {
    mockReaccionRepo.countByExperienciaId.mockResolvedValue(5);
    mockReaccionRepo.findByUsuarioAndExperiencia.mockResolvedValue(new Reaccion('r1', 'u1', 'e1'));
    const result = await contarUC.execute('e1', 'u1');
    expect(result.total).toBe(5);
    expect(result.usuarioHaReaccionado).toBe(true);
  });

  it('should return count and false when user has not reacted', async () => {
    mockReaccionRepo.countByExperienciaId.mockResolvedValue(3);
    mockReaccionRepo.findByUsuarioAndExperiencia.mockResolvedValue(null);
    const result = await contarUC.execute('e1', 'u1');
    expect(result.total).toBe(3);
    expect(result.usuarioHaReaccionado).toBe(false);
  });
});
