import { createCallerFactory, createTRPCRouter } from "$/server/api/trpc";
import {restaurantRouter} from "$/server/api/routers/restaurant";
import { menuItemsRouter } from "./routers/menuItems";
import { userRouter } from "./routers/user";
import { categoriesRouter } from "./routers/categories";
import { categoryTypesRouter } from "./routers/categoryTypes";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  categoryTypes: categoryTypesRouter,
  menuItems: menuItemsRouter,
  restaurant: restaurantRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
