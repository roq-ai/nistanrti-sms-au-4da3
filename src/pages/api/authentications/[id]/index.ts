import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { authenticationValidationSchema } from 'validationSchema/authentications';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.authentication
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getAuthenticationById();
    case 'PUT':
      return updateAuthenticationById();
    case 'DELETE':
      return deleteAuthenticationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAuthenticationById() {
    const data = await prisma.authentication.findFirst(convertQueryToPrismaUtil(req.query, 'authentication'));
    return res.status(200).json(data);
  }

  async function updateAuthenticationById() {
    await authenticationValidationSchema.validate(req.body);
    const data = await prisma.authentication.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteAuthenticationById() {
    const data = await prisma.authentication.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
