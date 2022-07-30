import { createRouter } from "./context";
import { z } from "zod";

export const profileRouter = createRouter()
  .query("get-by-id", {
    input: z
      .object({
        id: z.number().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      const id = input?.id;
      if (!id) return null;
      return await ctx.prisma.profile.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });
    },
  })
  .query("get-all", {
    async resolve({ ctx }) {
      return await ctx.prisma.profile.findMany({
        include: {
          user: true,
        },
      });
    },
  });
