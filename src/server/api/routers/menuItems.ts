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
            categoryTypeId: z.number().optional().nullable(), // Allow null as a valid value
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
                categoryTypeId: input.categoryTypeId ?? null, // Default to null if undefined
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

    delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return ctx.db.menuItems.delete({
            where: { id: input.id },
        });
    }),

    update : protectedProcedure
    .input(
        z.object({
            id: z.number(),
            name: z.string().min(1),
            price: z.number(),
            description: z.string().optional(),
            restaurantId: z.number(),
            categoryId: z.number(),
            categoryTypeId: z.number().optional().nullable(),
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
                restaurantId: input.restaurantId,
                categoryId: input.categoryId,
                categoryTypeId: input.categoryTypeId,
            },
        });
    }),

    updateMenuItemById: protectedProcedure
    .input(
        z.object({
            id: z.number(),
            name: z.string().min(1),
            price: z.number(),
            description: z.string().optional(),
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

    getByRestaurant: protectedProcedure
  .input(z.object({ restaurantId: z.number() }))
  .query(async ({ input, ctx }) => {
    return ctx.db.menuItems.findMany({
      where: { restaurantId: input.restaurantId },
      include: {
        category: true,
        categoryType: true,
      },
    });
  }),

});