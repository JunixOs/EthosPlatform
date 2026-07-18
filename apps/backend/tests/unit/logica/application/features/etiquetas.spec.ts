import { describe, it, expect, vi } from 'vitest';
import { AsociarEtiquetasUseCase } from '@/logica/application/features/etiquetas/AsociarEtiquetasUseCase';
import { BuscarPorEtiquetaUseCase } from '@/logica/application/features/etiquetas/BuscarPorEtiquetaUseCase';
import { ListarEtiquetasUseCase } from '@/logica/application/features/etiquetas/ListarEtiquetasUseCase';
import { Etiqueta } from '@/logica/domain/entities/Etiqueta';
import { NotFoundException, ValidationException } from '@/logica/application/exceptions/AppException';

const mockEtiquetaRepo = {
  findById: vi.fn(),
  findBySlug: vi.fn(),
  findByNombre: vi.fn(),
  findAll: vi.fn(),
  findByExperienciaId: vi.fn(),
  save: vi.fn(),
  asociarAExperiencia: vi.fn(),
  desasociarDeExperiencia: vi.fn(),
  findExperienciasByEtiquetaId: vi.fn(),
};

const mockExperienciaRepo = {
  findById: vi.fn(),
};

describe('AsociarEtiquetasUseCase', () => {
  const useCase = new AsociarEtiquetasUseCase(mockEtiquetaRepo as any, mockExperienciaRepo as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw NotFoundException when experiencia does not exist', async () => {
    mockExperienciaRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ experienciaId: 'e1', usuarioId: 'u1', nombresEtiquetas: ['etica'] }))
      .rejects.toThrow(NotFoundException);
  });

  it('should throw ValidationException when user is not owner', async () => {
    mockExperienciaRepo.findById.mockResolvedValue({ getUsuarioId: () => 'u2' });
    await expect(useCase.execute({ experienciaId: 'e1', usuarioId: 'u1', nombresEtiquetas: ['etica'] }))
      .rejects.toThrow(ValidationException);
  });

  it('should throw ValidationException when more than 5 etiquetas', async () => {
    mockExperienciaRepo.findById.mockResolvedValue({ getUsuarioId: () => 'u1' });
    await expect(useCase.execute({ experienciaId: 'e1', usuarioId: 'u1', nombresEtiquetas: ['a', 'b', 'c', 'd', 'e', 'f'] }))
      .rejects.toThrow(ValidationException);
  });

  it('should create and associate new etiquetas', async () => {
    mockExperienciaRepo.findById.mockResolvedValue({ getUsuarioId: () => 'u1' });
    mockEtiquetaRepo.findByExperienciaId.mockResolvedValue([]);
    mockEtiquetaRepo.findByNombre.mockResolvedValue(null);

    const result = await useCase.execute({ experienciaId: 'e1', usuarioId: 'u1', nombresEtiquetas: ['etica', 'moral'] });
    expect(result.etiquetas).toHaveLength(2);
    expect(mockEtiquetaRepo.save).toHaveBeenCalledTimes(2);
    expect(mockEtiquetaRepo.asociarAExperiencia).toHaveBeenCalledTimes(2);
  });

  it('should reuse existing etiquetas', async () => {
    mockExperienciaRepo.findById.mockResolvedValue({ getUsuarioId: () => 'u1' });
    mockEtiquetaRepo.findByExperienciaId.mockResolvedValue([]);
    const existing = new Etiqueta('et1', 'etica', 'etica');
    mockEtiquetaRepo.findByNombre.mockImplementation((n: string) => n === 'etica' ? existing : null);

    const result = await useCase.execute({ experienciaId: 'e1', usuarioId: 'u1', nombresEtiquetas: ['etica', 'nueva'] });
    expect(result.etiquetas).toHaveLength(2);
    expect(mockEtiquetaRepo.save).toHaveBeenCalledTimes(1); // only 'nueva' is new
  });
});

describe('BuscarPorEtiquetaUseCase', () => {
  const useCase = new BuscarPorEtiquetaUseCase(mockEtiquetaRepo as any, mockExperienciaRepo as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw NotFoundException when etiqueta does not exist', async () => {
    mockEtiquetaRepo.findBySlug.mockResolvedValue(null);
    await expect(useCase.execute('inexistente', 1, 10)).rejects.toThrow(NotFoundException);
  });

  it('should return public experiencias by etiqueta', async () => {
    const etiqueta = new Etiqueta('et1', 'etica', 'etica');
    mockEtiquetaRepo.findBySlug.mockResolvedValue(etiqueta);
    mockEtiquetaRepo.findExperienciasByEtiquetaId.mockResolvedValue({ experienciaIds: ['e1', 'e2'], total: 2 });
    mockExperienciaRepo.findById.mockImplementation((id: string) =>
      Promise.resolve({ isPublicada: () => true, getId: () => id } as any)
    );

    const result = await useCase.execute('etica', 1, 10);
    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
  });
});

describe('ListarEtiquetasUseCase', () => {
  const useCase = new ListarEtiquetasUseCase(mockEtiquetaRepo as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all etiquetas ordered', async () => {
    const etiquetas = [new Etiqueta('et1', 'etica', 'etica'), new Etiqueta('et2', 'moral', 'moral')];
    mockEtiquetaRepo.findAll.mockResolvedValue(etiquetas);

    const result = await useCase.execute();
    expect(result).toHaveLength(2);
    expect(result[0].nombre).toBe('etica');
  });
});
