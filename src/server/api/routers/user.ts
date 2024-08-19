import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "$/server/api/trpc";

export const userRouter = createTRPCRouter({

    updateRoleToOwner: protectedProcedure
        .input(
            z.object({
                id: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return ctx.db.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    role: "OWNER"
                },
            });
        }),


});