import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "$/server/api/trpc";
import { get } from "http";
import { create } from "domain";

export const categoriesRouter = createTRPCRouter({

    create: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string().min(1),
        restaurant: z.number(),
        categoryTypeId: z.number().optional(), // For linking an existing categoryType
        categoryTypeName: z.string().min(1).optional(), // For creating a new categoryType
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      let categoryTypeId = input.categoryTypeId;
  
      if (!categoryTypeId && input.categoryTypeName) {
        const newCategoryType = await ctx.db.categoryType.create({
          data: {
            name: input.categoryTypeName,
          },
        });
        categoryTypeId = newCategoryType.id;
      }
  
      return ctx.db.category.create({
        data: {
          name: input.name,
          restaurant: {
            connect: {
              id: input.restaurant,
            },
          },
          categoryTypes: categoryTypeId
            ? {
                connect: {
                  id: categoryTypeId,
                },
              }
            : undefined,
        },
      });
    }),

    getAll: publicProcedure
    .query(async ({ ctx }) => {
        return ctx.db.category.findMany();
    }
    ),

    getCategoryById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
        const category = await ctx.db.category.findUnique({
            where: { id: input.id },
        });

        if (!category) {
            throw new Error("Category not found");
        }

        return category;
    }),

    updateCategoryById: protectedProcedure
    .input(
        z.object({
            id: z.number(),
            name: z.string().min(1),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return ctx.db.category.update({
            where: { id: input.id },
            data: {
                name: input.name,
            },
        });
    }),

    deleteCategoryById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return ctx.db.category.delete({
            where: { id: input.id },
        });
    }),
    
    getCategoryByRestaurant: protectedProcedure
    .input(z.object({ restaurantId: z.number() }))
    .query(async ({ input, ctx }) => {
        return ctx.db.category.findMany({
            where: { restaurant: { id: input.restaurantId } },
        });
    }),
});