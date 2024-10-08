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
                id: z.number().optional(),
                name: z.string().min(1),
                address: z.string().min(1),
                phone: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const createdRestaurant = await ctx.db.restaurant.create({
                data: {
                    name: input.name,
                    address: input.address,
                    phone: input.phone,
                    ownerId: ctx.session.user.id,
                },
            });

            // Update the user's role to OWNER after creating the restaurant
            await ctx.db.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    role: "OWNER"
                },
            });

            return createdRestaurant;
        }),
        getAll: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.db.restaurant.findMany();
        }
        ),

        getRestaurantById: publicProcedure
    .input(z.object({ id: z.number() })) // Validate that id is a number
    .query(async ({ input, ctx }) => {
      const restaurant = await ctx.db.restaurant.findUnique({
        where: { id: input.id },
      });

      if (!restaurant) {
        throw new Error("Restaurant not found");
      }

      return restaurant;
    }),

    updateRestaurantById: protectedProcedure
    .input(
        z.object({
            id: z.number(),
            name: z.string().min(1),
            address: z.string().min(1),
            phone: z.string().min(1),
            capacity: z.number().optional(),
            }),
        )

    .mutation(async ({ ctx, input }) => {
        return ctx.db.restaurant.update({
            where: { id: input.id },
            data: {
                id: input.id,
                name: input.name,
                address: input.address,
                phone: input.phone,
                capacity: input.capacity,
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