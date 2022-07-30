/* eslint-disable @next/next/no-img-element */
import { inferQueryOutput } from "src/utils/trpc";

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
      <tbody>{users.map(TableRow)}</tbody>
    </table>
  );
}

function TableRow(user: User) {
  const id = user.id;
  const name = user.name;
  const email = user.email;
  const image = user.image;

  return (
    <tr className="border-b-2 border-neutral-500 dark:border-neutral-500">
      <td>{image && name && <img className="w-4 h-4" src={image} alt={name} />}</td>
      <td>{name}</td>
      <td>{email}</td>
    </tr>
  );
}
