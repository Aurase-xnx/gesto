import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession, GetSessionParams } from 'next-auth/react';
import { prisma } from '$/lib/prisma';

type RestaurantCreateBody = {
    name: string;
    address: string;
    phone: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req } as GetSessionParams);

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    if (!session || !session.user || !session.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, address, phone } = req.body as RestaurantCreateBody;

    if (!name || !address || !phone) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const restaurant = await prisma.restaurant.create({
            data: {
                name,
                address,
                phone,
                ownerId: session.user.id,
            },
        });

        await prisma.user.update({
            where: { id: session.user.id },
            data: { role: 'OWNER' },
        });

        return res.status(200).json({
            message: 'Restaurant created successfully',
            restaurant,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        } else {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}