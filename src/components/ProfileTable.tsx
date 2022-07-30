import { format } from "date-fns";
import Link from "next/link";
import { hashidFromNumber } from "src/utils/hashids";
import { inferQueryOutput } from "src/utils/trpc";
import { IdLink } from "./IdLink";

type Profile = NonNullable<inferQueryOutput<"profile.get-by-id">>;

type Props = {
  className?: string;
  profiles: Profile[];
};

export function ProfileTable({ className, profiles }: Props) {
  return (
    <table className="bg-neutral-100 dark:bg-neutral-800 border-separate border-spacing-3">
      <thead>
        <tr className="border-b-2 border-neutral-600 dark:border-neutral-400">
          <th>name</th>
        </tr>
      </thead>
      <tbody>{profiles.map(TableRow)}</tbody>
    </table>
  );
}

function TableRow(profile: Profile) {
  const id = profile.id;
  const date = profile.createdAt;
  const name = profile.name;
  const bio = profile.bio;

  return (
    <tr className="border-b-2 border-neutral-500 dark:border-neutral-500">
      <td>
        <IdLink href="/profile/" id={id}>
          <div className="hover:opacity-60">{name}</div>
        </IdLink>
      </td>
    </tr>
  );
}
