import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "$/server/api/trpc";
import { get } from "http";

export const menuItemsRouter = createTRPCRouter({
    
    create: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                name: z.string().min(1),
                price: z.number(),
                description: z.string().optional().default(""),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return ctx.db.menuItem.create({
                data: {
                    name: input.name,
                    price: input.price,
                    description: input.description,
                    restaurantId: input.id,
                    categoryId: 0, // Replace 0 with the actual categoryId value
                },
            });
        }),

        getAll: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.db.menuItem.findMany();
        }
        ),

    getMenuItemById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const menuItem = await ctx.db.menuItem.findUnique({
        where: { id: input.id },
      });

      if (!menuItem) {
        throw new Error("Menu item not found");
      }

      return menuItem;
    }),

    updateMenuItemById: protectedProcedure
    .input(
        z.object({
            id: z.number(),
            name: z.string().min(1),
            price: z.number(),
            description: z.string().min(1),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return ctx.db.menuItem.update({
            where: { id: input.id },
            data: {
                name: input.name,
                price: input.price,
                description: input.description,
            },
        });
    }),

    getAllMenuItemByRestaurantId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
        return ctx.db.menuItem.findMany({
            where: {
                restaurantId: input.id,
            },
        });
    }),

});