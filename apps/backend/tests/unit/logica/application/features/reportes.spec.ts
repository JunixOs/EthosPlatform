import { describe, it, expect, vi } from 'vitest';
import { CrearReporteUseCase } from '@/logica/application/features/reportes/CrearReporteUseCase';
import { ListarReportesUseCase } from '@/logica/application/features/reportes/ListarReportesUseCase';
import { OcultarContenidoUseCase } from '@/logica/application/features/reportes/OcultarContenidoUseCase';
import { Reporte } from '@/logica/domain/entities/Reporte';
import { NotFoundException, ConflictException, ValidationException } from '@/logica/application/exceptions/AppException';
import { TipoReporteEnum } from '@/logica/domain/enum/index';
import type { IReporteRepository } from '@/logica/application/gateway/repositories/IReporteRepository';
import type { IExperienciaRepository } from '@/logica/application/gateway/repositories/IExperienciaRepository';

const mockReporteRepo = {
  findById: vi.fn(),
  findPendientes: vi.fn(),
  save: vi.fn(),
  update: vi.fn(),
  existeReporteDeUsuario: vi.fn(),
};

const mockExperienciaRepo = {
  findById: vi.fn(),
  update: vi.fn(),
};

describe('CrearReporteUseCase', () => {
  const useCase = new CrearReporteUseCase(mockReporteRepo as unknown as IReporteRepository, mockExperienciaRepo as unknown as IExperienciaRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw NotFoundException when experiencia does not exist', async () => {
    mockExperienciaRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ reporterId: 'u1', experienciaId: 'e1', tipo: TipoReporteEnum.SPAM }))
      .rejects.toThrow(NotFoundException);
  });

  it('should throw ValidationException when experiencia is not published', async () => {
    mockExperienciaRepo.findById.mockResolvedValue({ isPublicada: () => false });
    await expect(useCase.execute({ reporterId: 'u1', experienciaId: 'e1', tipo: TipoReporteEnum.SPAM }))
      .rejects.toThrow(ValidationException);
  });

  it('should throw ConflictException when user already reported', async () => {
    mockExperienciaRepo.findById.mockResolvedValue({ isPublicada: () => true });
    mockReporteRepo.existeReporteDeUsuario.mockResolvedValue(true);
    await expect(useCase.execute({ reporterId: 'u1', experienciaId: 'e1', tipo: TipoReporteEnum.SPAM }))
      .rejects.toThrow(ConflictException);
  });

  it('should create reporte successfully', async () => {
    mockExperienciaRepo.findById.mockResolvedValue({ isPublicada: () => true });
    mockReporteRepo.existeReporteDeUsuario.mockResolvedValue(false);
    mockReporteRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute({ reporterId: 'u1', experienciaId: 'e1', tipo: TipoReporteEnum.SPAM, descripcion: 'Bad content' });
    expect(result.estado).toBe('pendiente');
    expect(mockReporteRepo.save).toHaveBeenCalledTimes(1);
  });
});

describe('ListarReportesUseCase', () => {
  const useCase = new ListarReportesUseCase(mockReporteRepo as unknown as IReporteRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return paginated pending reportes', async () => {
    const reportes = [new Reporte('r1', 'u1', 'e1', TipoReporteEnum.SPAM, 'desc')];
    mockReporteRepo.findPendientes.mockResolvedValue({ data: reportes, total: 1, page: 1, limit: 10 });

    const result = await useCase.execute(1, 10);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });
});

describe('OcultarContenidoUseCase', () => {
  const useCase = new OcultarContenidoUseCase(mockReporteRepo as unknown as IReporteRepository, mockExperienciaRepo as unknown as IExperienciaRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw NotFoundException when reporte does not exist', async () => {
    mockReporteRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('r1')).rejects.toThrow(NotFoundException);
  });

  it('should archive experiencia and resolve reporte', async () => {
    const reporte = new Reporte('r1', 'u1', 'e1', TipoReporteEnum.SPAM, 'desc');
    mockReporteRepo.findById.mockResolvedValue(reporte);
    const experiencia = { archivar: vi.fn(), getId: () => 'e1' };
    mockExperienciaRepo.findById.mockResolvedValue(experiencia);

    await useCase.execute('r1');
    expect(experiencia.archivar).toHaveBeenCalled();
    expect(mockExperienciaRepo.update).toHaveBeenCalled();
    expect(mockReporteRepo.update).toHaveBeenCalled();
  });
});
