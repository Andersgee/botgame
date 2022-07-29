import { format } from "date-fns";
import Link from "next/link";
import { hashidFromNumber } from "src/utils/hashids";
import { inferQueryOutput } from "src/utils/trpc";

type Replays = NonNullable<inferQueryOutput<"replay.get-all">>;

type Props = {
  className?: string;
  replays: Replays;
};

export function ReplayTable({ className, replays }: Props) {
  return (
    <div className={className}>
      {replays.map((replay) => {
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

            <Link className="bg-slate-500 p-2" href={`/replay/${hashidFromNumber(id)}`}>
              watch
            </Link>
          </div>
        );
      })}
    </div>
  );
}
