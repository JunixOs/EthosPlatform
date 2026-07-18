import { describe, it, expect, vi } from 'vitest';
import { CrearRespuestaUseCase } from '@/logica/application/features/respuestas/CrearRespuestaUseCase';
import { ListarRespuestasUseCase } from '@/logica/application/features/respuestas/ListarRespuestasUseCase';
import { EliminarRespuestaUseCase } from '@/logica/application/features/respuestas/EliminarRespuestaUseCase';
import { Respuesta } from '@/logica/domain/entities/Respuesta';
import { NotFoundException, ForbiddenException } from '@/logica/application/exceptions/AppException';

const mockExperienciaRepo = {
  findById: vi.fn(),
};

const mockRespuestaRepo = {
  findById: vi.fn(),
  findByExperienciaId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
};

describe('CrearRespuestaUseCase', () => {
  const useCase = new CrearRespuestaUseCase(mockRespuestaRepo as any, mockExperienciaRepo as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw NotFoundException when experiencia does not exist', async () => {
    mockExperienciaRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ experienciaId: 'e1', usuarioId: 'u1', contenido: 'test' }))
      .rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when experiencia is not published', async () => {
    mockExperienciaRepo.findById.mockResolvedValue({ isPublicada: () => false });
    await expect(useCase.execute({ experienciaId: 'e1', usuarioId: 'u1', contenido: 'test' }))
      .rejects.toThrow(ForbiddenException);
  });

  it('should create respuesta for published experiencia', async () => {
    mockExperienciaRepo.findById.mockResolvedValue({ isPublicada: () => true });
    mockRespuestaRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute({ experienciaId: 'e1', usuarioId: 'u1', contenido: 'Great post!' });
    expect(result.contenido).toBe('Great post!');
    expect(result.experienciaId).toBe('e1');
    expect(result.usuarioId).toBe('u1');
    expect(mockRespuestaRepo.save).toHaveBeenCalledTimes(1);
  });
});

describe('ListarRespuestasUseCase', () => {
  const useCase = new ListarRespuestasUseCase(mockRespuestaRepo as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return paginated respuestas', async () => {
    const respuestas = [new Respuesta('r1', 'e1', 'u1', 'content')];
    mockRespuestaRepo.findByExperienciaId.mockResolvedValue({ data: respuestas, total: 1, page: 1, limit: 10 });

    const result = await useCase.execute('e1', 1, 10);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });
});

describe('EliminarRespuestaUseCase', () => {
  const useCase = new EliminarRespuestaUseCase(mockRespuestaRepo as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw NotFoundException if respuesta does not exist', async () => {
    mockRespuestaRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('r1', 'u1', 'user')).rejects.toThrow(NotFoundException);
  });

  it('should allow author to delete', async () => {
    mockRespuestaRepo.findById.mockResolvedValue(new Respuesta('r1', 'e1', 'u1', 'content'));
    await useCase.execute('r1', 'u1', 'user');
    expect(mockRespuestaRepo.delete).toHaveBeenCalledWith('r1');
  });

  it('should allow admin to delete', async () => {
    mockRespuestaRepo.findById.mockResolvedValue(new Respuesta('r1', 'e1', 'u2', 'content'));
    await useCase.execute('r1', 'u1', 'admin');
    expect(mockRespuestaRepo.delete).toHaveBeenCalledWith('r1');
  });

  it('should throw ForbiddenException for non-author non-admin', async () => {
    mockRespuestaRepo.findById.mockResolvedValue(new Respuesta('r1', 'e1', 'u2', 'content'));
    await expect(useCase.execute('r1', 'u1', 'user')).rejects.toThrow(ForbiddenException);
  });
});
