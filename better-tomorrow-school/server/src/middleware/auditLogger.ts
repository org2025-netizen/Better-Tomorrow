import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import prisma from '../config/database';

export const auditLog = (action: string, entity: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
      const userId = req.user?.userId;
      const entityId = req.params?.id;
      const details = JSON.stringify({ body: req.body, params: req.params, query: req.query });

      prisma.auditLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          details,
          ipAddress: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers['user-agent'],
        },
      }).catch(console.error);

      return originalJson(body);
    };
    next();
  };
};

export const createAuditLog = async (
  userId: string | undefined,
  action: string,
  entity: string,
  entityId?: string,
  details?: string,
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    await prisma.auditLog.create({
      data: { userId, action, entity, entityId, details, ipAddress, userAgent },
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
};
