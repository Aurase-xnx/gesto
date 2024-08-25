import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "$/server/api/trpc";
import { get } from "http";
import Restaurant from "$/pages/restaurants/[id]";

export const menuItemsRouter = createTRPCRouter({
    
    create: protectedProcedure
        .input(
            z.object({
                id: z.number().optional(),
                name: z.string().min(1),
                price: z.number(),
                description: z.string().optional().default(""),
                restaurantId: z.number(),
                categoryId: z.number(),
                typeId: z.number().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return ctx.db.menuItems.create({
                data: {
                    name: input.name,
                    price: input.price,
                    description: input.description,
                    restaurantId: input.restaurantId,
                    categoryId: input.categoryId, 
                    typeId: input.typeId,
                },
            });
        }),

        getAll: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.db.menuItems.findMany();
        }
        ),

    getMenuItemById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const menuItem = await ctx.db.menuItems.findUnique({
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
        return ctx.db.menuItems.update({
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
        return ctx.db.menuItems.findMany({
            where: {
                restaurantId: input.id,
            },
        });
    }),

});