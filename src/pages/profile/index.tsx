import type { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Head } from "src/components/Head";
import { prisma } from "src/server/db/client";
import { Nav } from "src/components/Nav";
import { hashidFromNumber, numberFromHashidparam } from "src/utils/hashids";
import { FallbackPage } from "src/components/FallbackPage";
import { inferAsyncReturnType } from "@trpc/server";
import { Bot } from "@prisma/client";
import { IdLink } from "src/components/IdLink";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../api/auth/[...nextauth]";

async function finduser(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      bots: {
        include: {
          botStats: true,
          user: true,
        },
      },
    },
  });
}

type User = inferAsyncReturnType<typeof finduser>;

type Props = {
  user: User;
};

const Page: NextPage<Props> = ({ user }) => {
  const { isFallback } = useRouter();

  if (isFallback || !user) {
    return <FallbackPage />;
  }

  return (
    <>
      <Head
        title={`${user.name} | Profile | Botgame`}
        description="Edit your profile"
        domainUrl="https://botgame.andyfx.net"
        url="https://botgame.andyfx.net/profile"
      />
      <Nav />
      <main className="flex justify-center min-h-screen">
        <div>
          <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">Your profile</h1>
          <p>allow {user.name} to edit things here</p>
        </div>
      </main>
    </>
  );
};

export default Page;

///////////////////////////////////////

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, nextAuthOptions);

  if (!session?.user?.id) {
    res.setHeader("location", "/signin");
    res.statusCode = 302;
    res.end();
    return { props: { user: null } };
  } else {
    const user = await finduser(session.user.id);
    return { props: { user } };
  }
};
