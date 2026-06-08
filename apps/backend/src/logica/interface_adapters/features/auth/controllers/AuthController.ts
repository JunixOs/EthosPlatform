import type { Request, Response } from 'express';
import type { RegisterUseCase } from '../../../../application/features/auth/register/RegisterUseCase';
import type { LoginUseCase } from '../../../../application/features/auth/login/LoginUseCase';
import type { LogoutUseCase } from '../../../../application/features/auth/logout/LogoutUseCase';
import type { RegisterRequestDTO } from '../dtos/request/RegisterRequestDTO';
import type { LoginRequestDTO } from '../dtos/request/LoginRequestDTO';

export class AuthController {
  constructor(
    private readonly registerUC: RegisterUseCase,
    private readonly loginUC: LoginUseCase,
    private readonly logoutUC: LogoutUseCase,
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as RegisterRequestDTO;
    const result = await this.registerUC.execute({
      nombre: body.nombre,
      correo: body.correo,
      password: body.password,
    });
    res.status(201).json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as LoginRequestDTO;
    const ip = req.ip ?? '0.0.0.0';
    const result = await this.loginUC.execute({
      correo: body.correo,
      password: body.password,
      recordarme: body.recordarme ?? false,
      ip,
    });
    res.json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const token = (req.headers['authorization'] ?? '').slice(7);
    await this.logoutUC.execute(token);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };
}
