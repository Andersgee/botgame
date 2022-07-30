import { createRouter } from "./context";
import { z } from "zod";

export const botRouter = createRouter()
  .query("get-by-id", {
    input: z
      .object({
        id: z.number().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      const id = input?.id;
      if (!id) return null;
      return await ctx.prisma.bot.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });
    },
  })
  .query("get-all", {
    async resolve({ ctx }) {
      return await ctx.prisma.bot.findMany({
        include: {
          user: true,
        },
      });
    },
  });
