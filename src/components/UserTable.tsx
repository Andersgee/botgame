/* eslint-disable @next/next/no-img-element */
import { inferQueryOutput } from "src/utils/trpc";
import { IdLink } from "./IdLink";

type User = NonNullable<inferQueryOutput<"user.get-by-id">>;

type Props = {
  className?: string;
  users: User[];
};

export function UserTable({ className, users }: Props) {
  return (
    <table className="bg-neutral-100 dark:bg-neutral-800 border-separate border-spacing-3">
      <thead>
        <tr className="border-b-2 border-neutral-600 dark:border-neutral-400">
          <th>img</th>
          <th>name</th>
          <th>email</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b-2 border-neutral-500 dark:border-neutral-500">
            <td>{user.image && <img className="w-4 h-4" src={user.image} alt={`${user.name} icon`} />}</td>
            <td>
              <IdLink className="hover:opacity-60" href="/profile/" id={user.intId}>
                {user.name}
              </IdLink>
            </td>
            <td>***{/*user.email*/}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
