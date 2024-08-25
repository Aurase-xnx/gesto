import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "$/server/api/trpc";
import { get } from "http";
import { create } from "domain";

export const categoryTypesRouter = createTRPCRouter({

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
    getTypes: publicProcedure
    .query(async ({ ctx }) => {
        return ctx.db.categoryType.findMany();
    }
    ),

    getByCategory: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input, ctx }) => {
        const category = await ctx.db.category.findUnique({
            where: { id: input.categoryId },
            include: {
                categoryTypes: true,
            },
        });
        return category?.categoryTypes || [];  // Return only the category types array
    }),
    

});