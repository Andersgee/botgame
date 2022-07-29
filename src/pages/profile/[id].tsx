import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Head } from "src/components/Head";
import { prisma } from "src/server/db/client";
import { inferQueryOutput, trpc } from "src/utils/trpc";
import { format } from "date-fns";
import { Nav } from "src/components/Nav";
import { numberFromHashidparam } from "src/utils/hashids";
import { FallbackPage } from "src/components/FallbackPage";

type Profile = NonNullable<inferQueryOutput<"profile.get-by-id">>;

type Props = {
  profile: Profile;
};

const Page: NextPage<Props> = ({ profile }) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <FallbackPage />;
  }

  const { data: replays } = trpc.useQuery(["replay.get-by-profileId", { profileId: profile.id }]);

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
          <p>profile and replays of {profile.name} here</p>

          <h2 className="text-4xl md:text-[4rem] leading-normal font-extrabold text-gray-700">Replays</h2>
          <div>
            {replays?.map(({ replay }) => {
              const id = replay.id;
              const date = replay.createdAt;
              const profiles = replay.profiles;
              const versusString = profiles.map(({ profile }) => profile.name).join(" vs ");

              const winnerUser = replay.profiles.find(({ profile }) => profile.id === replay.winningProfileId);
              const winnerName = winnerUser?.profile.name;

              return (
                <div key={id} className="flex gap-2 p-2 items-baseline">
                  <div>{format(date, "yyyy-MM-dd (mm:ss)")}</div>
                  <div>winner: {winnerName}</div>
                  <div>{versusString}</div>

                  <Link className="bg-slate-500 p-2" href={`/replay/${id}`}>
                    watch
                  </Link>
                </div>
              );
            })}
          </div>
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

    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile) return { notFound: true };

    const props: Props = { profile };
    return { props };
  } catch (error) {
    return { notFound: true };
  }
};
