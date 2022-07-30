import { createRouter } from "./context";
import { z } from "zod";
//import { prisma } from "src/server/db/client";

/** extract this "object" to utility to use it elsewhere aka in getstaticprops */
export const getByIdWithDataQuery = (id: number) => ({
  where: { id },
  include: {
    profiles: {
      include: {
        profile: true,
      },
    },
    replayData: true,
  },
});

//type ReplaysOnProfilesFindManyQuery = Parameters<typeof prisma.replaysOnProfiles.findMany>[0];

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
          profiles: {
            include: {
              profile: true,
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
      return await ctx.prisma.replay.findUnique(getByIdWithDataQuery(id));
    },
  })
  .query("get-by-profileId", {
    input: z
      .object({
        profileId: z.number().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      const profileId = input?.profileId;
      if (!profileId) return null;
      const replaysOnProfiles = await ctx.prisma.replaysOnProfiles.findMany({
        where: { profileId },
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
              profiles: {
                include: {
                  profile: true,
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
          profiles: {
            include: {
              profile: true,
            },
          },
        },
      });
    },
  });
