import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "$/server/api/trpc";
import { get } from "http";

export const restaurantRouter = createTRPCRouter({

    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1),
                address: z.string().min(1),
                phone: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return ctx.db.restaurant.create({
                data: {
                    name: input.name,
                    address: input.address,
                    phone: input.phone,
                    ownerId: ctx.session.user.id,
                },
            });
        }),

        getAll: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.db.restaurant.findMany();
        }
        ),

        getOne: publicProcedure
        .query(async ({ ctx, input }) => {
            return ctx.db.restaurant.findUnique({
                where: {
                    id: input.id,  
                },
            });
        }
        ),

        getAllByOwner: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.db.restaurant.findMany({
                where: {
                    ownerId: ctx.session.user.id,
                },
            });
        }),


});