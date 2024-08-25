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
            category: z.number(), // For creating a new categoryType
        }),
    )
    .mutation(async ({ ctx, input }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return ctx.db.categoryType.create({
            data: {
                name: input.name,
                category: {
                    connect: {
                        id: input.category,
                    },
                },
            },
        });
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
        return ctx.db.categoryType.findMany({
            where: { categoryId: input.categoryId },
        });
    }),
    
    update: protectedProcedure
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
            data: { name: input.name },
        });
    }),

    delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return ctx.db.category.delete({
            where: { id: input.id },
        });
    }),
});