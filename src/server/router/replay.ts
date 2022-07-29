import { createRouter } from "./context";
import { z } from "zod";

export const replayRouter = createRouter()
  .query("replayId", {
    input: z
      .object({
        id: z.number().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      const id = input?.id;
      if (!id) return null;
      return await ctx.prisma.replay.findFirst({ where: { id } });
    },
  })
  .query("id", {
    input: z
      .object({
        id: z.number().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      const id = input?.id;
      if (!id) return null;
      return await ctx.prisma.replay.findFirst({
        where: { id },
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      });
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.replay.findMany();
    },
  });
