import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Head } from "src/components/Head";
import { prisma } from "src/server/db/client";
import { inferQueryOutput, trpc } from "src/utils/trpc";
import { Nav } from "src/components/Nav";
import { numberFromHashidparam } from "src/utils/hashids";
import { FallbackPage } from "src/components/FallbackPage";
import { ReplayTable } from "src/components/ReplayTable";

type Profile = NonNullable<inferQueryOutput<"profile.get-by-id">>;
type Replays = NonNullable<inferQueryOutput<"replay.get-by-profileId">>;

type Props = {
  profile: Profile;
  replays: Replays;
};

const Page: NextPage<Props> = ({ profile, replays }) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <FallbackPage />;
  }

  //get replays on each visit instead?
  //const { data: replays } = trpc.useQuery(["replay.get-by-profileId", { profileId: profile.id }]);

  return (
    <>
      <Head
        title={`${profile.name} | User | Botgame`}
        description={`Profile page and replays`}
        domainUrl="https://botgame.andyfx.net"
        url={`https://botgame.andyfx.net/replay/${profile.id}`}
      />
      <Nav />
      <main className="flex justify-center min-h-screen">
        <div>
          <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">{profile.name}</h1>
          <p>stats and replays of bot here</p>
          <p>creator: {profile.user.name}</p>

          <h2 className="text-4xl md:text-[4rem] leading-normal font-extrabold text-gray-700">Replays</h2>
          {replays && <ReplayTable replays={replays} />}
        </div>
      </main>
    </>
  );
};

export default Page;

///////////////////////////////////////

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = numberFromHashidparam(params?.id);
    if (id == undefined) return { notFound: true };

    const profile = await prisma.profile.findUnique({ where: { id }, include: { user: true } });
    if (!profile) return { notFound: true };

    const replaysOnProfiles = await prisma.replaysOnProfiles.findMany({
      where: { profileId: id },
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
    const replays = replaysOnProfiles.map((rop) => rop.replay);

    const props: Props = { profile, replays };
    return {
      props,
      revalidate: 10, //at most once every 10 seconds
    };
  } catch (error) {
    return { notFound: true };
  }
};
