import { createRouter } from "./context";
import { z } from "zod";

export const userRouter = createRouter()
  .query("get-by-id", {
    input: z
      .object({
        id: z.string().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      const id = input?.id;
      if (!id) return null;
      return await ctx.prisma.user.findUnique({
        where: { id },
      });
    },
  })
  .query("get-all", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findMany();
    },
  });
