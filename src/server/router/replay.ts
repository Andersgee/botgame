import { createRouter } from "./context";
import { z } from "zod";

export const replayRouter = createRouter()
  .query("get-by-id", {
    input: z
      .object({
        id: z.number().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      const id = input?.id;
      if (!id) return null;
      return await ctx.prisma.replay.findUnique({
        where: { id },
        include: {
          bots: {
            include: {
              bot: true,
            },
          },
        },
      });
    },
  })
  .query("get-by-id-with-data", {
    input: z
      .object({
        id: z.number().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      const id = input?.id;
      if (!id) return null;
      return await ctx.prisma.replay.findUnique({
        where: { id },
        include: {
          bots: {
            include: {
              bot: true,
            },
          },
          replayData: true,
        },
      });
    },
  })
  .query("get-by-botId", {
    input: z
      .object({
        id: z.number().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      const id = input?.id;
      if (!id) return null;
      const replaysOnProfiles = await ctx.prisma.replaysOnBots.findMany({
        where: { botId: id },
        orderBy: [
          {
            replay: {
              createdAt: "desc",
            },
          },
        ],
        include: {
          replay: {
            include: {
              bots: {
                include: {
                  bot: true,
                },
              },
            },
          },
        },
      });
      return replaysOnProfiles.map((rop) => rop.replay);
    },
  })
  .query("get-all", {
    async resolve({ ctx }) {
      return await ctx.prisma.replay.findMany({
        include: {
          bots: {
            include: {
              bot: true,
            },
          },
        },
      });
    },
  });
