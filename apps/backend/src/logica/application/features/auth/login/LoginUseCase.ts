import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { IntentoFallido } from '../../../../domain/entities/IntentoFallido';
import { Sesion } from '../../../../domain/entities/Sesion';
import { TipoSesionEnum } from '../../../../domain/enum/index';
import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import type { ISesionRepository } from '../../../gateway/repositories/ISesionRepository';
import type { IIntentoFallidoRepository } from '../../../gateway/repositories/IIntentoFallidoRepository';
import {
  UnauthorizedException,
  TooManyRequestsException,
} from '../../../exceptions/AppException';
import type { LoginCommand } from './LoginCommand';

export interface LoginResult {
  token: string;
  usuarioId: string;
  nombre: string;
  rol: string;
  expiraEn: Date
}

export class LoginUseCase {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly sesionRepo: ISesionRepository,
    private readonly intentoRepo: IIntentoFallidoRepository,
  ) {}

  async execute(cmd: LoginCommand): Promise<LoginResult> {
    const intentos = await this.intentoRepo.findRecientesByCorreo(cmd.correo);
    if (IntentoFallido.debeBloquearse(intentos)) {
      throw new TooManyRequestsException();
    }

    const usuario = await this.usuarioRepo.findByEmail(cmd.correo.toLowerCase().trim());

    if (!usuario) {
      await this.registrarIntento(cmd.correo, cmd.ip);
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    if (usuario.isSuspendido()) {
      throw new UnauthorizedException('Tu cuenta está suspendida.');
    }

    const passwordOk = await bcrypt.compare(cmd.password, usuario.getPasswordHash());
    if (!passwordOk) {
      await this.registrarIntento(cmd.correo, cmd.ip);
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    await this.intentoRepo.deleteByCorreo(cmd.correo);

    const tipo = cmd.recordarme ? TipoSesionEnum.LARGA : TipoSesionEnum.CORTA;
    const duracionMs = tipo === TipoSesionEnum.LARGA ? 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000;
    const expiraEn = new Date(Date.now() + duracionMs);
    const jwtSecret = process.env['JWT_SECRET'] ?? 'secret';

    const token = jwt.sign(
      { sub: usuario.getId(), rol: usuario.getRol() },
      jwtSecret,
      { expiresIn: tipo === TipoSesionEnum.LARGA ? '24h' : '2h' },
    );

    const sesion = new Sesion(uuidv4(), usuario.getId(), token, tipo, expiraEn);
    await this.sesionRepo.save(sesion);

    return {
      token,
      usuarioId: usuario.getId(),
      nombre: usuario.getNombre(),
      rol: usuario.getRol(),
      expiraEn: sesion.getExpiraEn()
    };
  }

  private async registrarIntento(correo: string, ip: string): Promise<void> {
    const intento = new IntentoFallido(uuidv4(), correo, ip);
    await this.intentoRepo.save(intento);
  }
}
