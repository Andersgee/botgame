import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Head } from "src/components/Head";
import { Viewer } from "src/components/replay/Viewer";
import { prisma } from "src/server/db/client";
import { inferQueryOutput } from "src/utils/trpc";

type Replay = NonNullable<inferQueryOutput<"replay.id">>;
/** Date is not serializable for static site generation */
export type SerializableReplay = Omit<Replay, "createdAt"> & { createdAt: string };

type Props = {
  replay: SerializableReplay;
};

const Page: NextPage<Props> = ({ replay }: Props) => {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <FallbackPage />;
  }

  const v = replay.users.map((user) => user.user.name);
  const versusString = v.join(" vs ");

  const winnerUser = replay.users.find((user) => user.user.id === replay.winnerId);
  const winnerName = winnerUser?.user.name;
  return (
    <>
      <Head
        title={`${versusString} | Replay | Botgame`}
        description={`Winner: ${winnerName}`}
        domainUrl="https://svgbattle.andyfx.se"
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

//dont pre generate anything, but use fallback
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    if (!params?.id) {
      throw new Error("params.id undefined");
    }
    const id = params.id;
    const a = typeof id === "string" ? id : id[0];
    if (!a) {
      throw new Error("params.id undefined");
    }

    const replayId = parseInt(a, 10);

    const replay = await prisma.replay.findFirst({
      where: { id: replayId },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!replay) {
      throw new Error(`Replay with id ${replayId} not found`);
    }
    console.log(replay.users);

    const serializableReplay: SerializableReplay = {
      id: replay.id,
      createdAt: replay.createdAt.toString(),
      winnerId: replay.winnerId,
      info: replay.info,
      data: replay.data,
      users: replay.users,
    };

    const props: Props = { replay: serializableReplay };
    return { props };
  } catch (error) {
    //console.error(error);
    return { notFound: true };
  }
};

function FallbackPage() {
  return (
    <main>
      <p>looking for replay for the first time...</p>
    </main>
  );
}
