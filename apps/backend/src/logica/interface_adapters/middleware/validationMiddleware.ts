import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { ValidationException } from '../../application/exceptions/AppException';

function formatIssues(err: z.ZodError): string {
  return err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
}

export function validateBody(schema: z.ZodType) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return next(new ValidationException(formatIssues(err)));
      }
      next(err);
    }
  };
}

export function validateQuery(schema: z.ZodType) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = (await schema.parseAsync(req.query)) as Request['query'];
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return next(new ValidationException(formatIssues(err)));
      }
      next(err);
    }
  };
}
