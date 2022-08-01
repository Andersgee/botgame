import { createRouter } from "./context";
import { createProtectedRouter } from "./protected-router";
import { promise, z } from "zod";
import { newDbRating } from "src/game/rating";

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

export const protectedBotRouter = createProtectedRouter().mutation("create", {
  input: z.object({
    name: z.string(),
    bio: z.string().nullish(),
  }),
  async resolve({ ctx, input }) {
    const userId = ctx.session.user.id;

    if (!userId || !input.bio) return null;

    const bot = await ctx.prisma.bot.create({
      data: {
        name: input.name,
        bio: input.bio,
        userId: userId,
      },
    });

    const botStats = await ctx.prisma.botStats.create({
      data: {
        botId: bot.id,
        wins: 0,
        losses: 0,
        draws: 0,
        gamesPlayed: 0,
      },
    });

    const rating = await ctx.prisma.rating.create({
      data: {
        botId: bot.id,
        ...newDbRating(),
      },
    });
    return bot;
  },
});
