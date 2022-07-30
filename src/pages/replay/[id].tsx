import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FallbackPage } from "src/components/FallbackPage";
import { Head } from "src/components/Head";
import { Viewer } from "src/components/replay/Viewer";
import { prisma } from "src/server/db/client";
import { numberFromHashidparam } from "src/utils/hashids";
import { inferAsyncReturnType } from "@trpc/server";

async function findreplay(id: number) {
  return prisma.replay.findUnique({
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
}

export type Replay = NonNullable<inferAsyncReturnType<typeof findreplay>>;

type Props = {
  replay: Replay;
};

const Page: NextPage<Props> = ({ replay }) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <FallbackPage />;
  }

  const profileNames = replay.bots.map(({ bot }) => bot.name);
  const versusString = profileNames.join(" vs ");

  const winningProfile = replay.bots.find(({ bot }) => bot.id === replay.winningBotId);
  const winnerName = winningProfile?.bot.name;
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
        <div className="absolute top-3 left-0">
          <Link
            href="/"
            className="justify-around p-3 font-medium hover:opacity-75 transition duration-100 ease-out hover:ease-in"
          >
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

    const replay = await findreplay(id);
    if (!replay) return { notFound: true };

    const props: Props = { replay };
    return { props };
  } catch (error) {
    return { notFound: true };
  }
};
