import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FallbackPage } from "src/components/FallbackPage";
import { Head } from "src/components/Head";
import { Viewer } from "src/components/replay/Viewer";
import { prisma } from "src/server/db/client";
import { getByIdWithDataQuery } from "src/server/router/replay";
import { numberFromHashidparam } from "src/utils/hashids";
import { inferQueryOutput } from "src/utils/trpc";

export type Replay = NonNullable<inferQueryOutput<"replay.get-by-id-with-data">>;

type Props = {
  replay: Replay;
};

const Page: NextPage<Props> = ({ replay }) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <FallbackPage />;
  }

  const profileNames = replay.profiles.map(({ profile }) => profile.name);
  const versusString = profileNames.join(" vs ");

  const winningProfile = replay.profiles.find(({ profile }) => profile.id === replay.winningProfileId);
  const winnerName = winningProfile?.profile.name;
  return (
    <>
      <Head
        title={`${versusString} | Replay | Botgame`}
        description={`Winner: ${winnerName}`}
        domainUrl="https://botgame.andyfx.net"
        url={`https://botgame.andyfx.net/replay/${replay.id}`}
      />
      <main className="relative">
        <Viewer replay={replay} />
        <div className="absolute top-[-1px] left-0">
          <Link href="/" className="bg-red-400">
            Home
          </Link>
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

    const replay = await prisma.replay.findUnique(getByIdWithDataQuery(id));
    if (!replay) return { notFound: true };

    const props: Props = { replay };
    return { props };
  } catch (error) {
    return { notFound: true };
  }
};
