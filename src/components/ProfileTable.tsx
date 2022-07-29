import { format } from "date-fns";
import Link from "next/link";
import { hashidFromNumber } from "src/utils/hashids";
import { inferQueryOutput } from "src/utils/trpc";

type Replays = NonNullable<inferQueryOutput<"profile.get-all">>;

type Props = {
  className?: string;
  profiles: Replays;
};

export function ProfileTable({ className, profiles }: Props) {
  return (
    <div className={className}>
      {profiles.map((profile) => {
        const id = profile.id;
        const date = profile.createdAt;
        const name = profile.name;
        const bio = profile.bio;

        return (
          <div key={id} className="flex gap-2 p-2 items-baseline">
            <div>{format(date, "yyyy-MM-dd (mm:ss)")}</div>
            <div>name: {name}</div>
            <div>bio: {bio}</div>
            <Link className="bg-slate-500 p-2" href={`/profile/${hashidFromNumber(id)}`}>
              view
            </Link>
          </div>
        );
      })}
    </div>
  );
}
