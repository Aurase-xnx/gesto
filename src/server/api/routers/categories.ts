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
        restaurant: z.number(), // For creating a new categoryType
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.category.create({
      data: {
        name: input.name,
        Restaurant: {
          connect: {
            id: input.restaurant,
          },
        },
      },
    });
  }
  ),

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
            where: { Restaurant: { id: input.restaurantId } },
        });
    }),

    getCategoryWithTypesByRestaurant: protectedProcedure
    .input(z.object({ restaurantId: z.number() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.category.findMany({
        where: { restaurantId: input.restaurantId },
        include: { categoryTypes: true },
      });
    }),

  createCategory: protectedProcedure
    .input(z.object({
      name: z.string(),
      restaurantId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.category.create({
        data: {
          name: input.name,
          restaurantId: input.restaurantId,
        },
      });
    }),

  updateCategory: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.category.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),

  createCategoryType: protectedProcedure
    .input(z.object({
      name: z.string(),
      categoryId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.categoryType.create({
        data: {
          name: input.name,
          categoryId: input.categoryId,
        },
      });
    }),

  updateCategoryType: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.categoryType.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),

  deleteCategoryAndTypes: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.categoryType.deleteMany({
        where: { categoryId: input.id },
      });
      return ctx.db.category.delete({
        where: { id: input.id },
      });
    }),

  deleteCategoryType: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.categoryType.delete({
        where: { id: input.id },
      });
    }),

});