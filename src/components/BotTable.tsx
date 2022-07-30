import { inferQueryOutput } from "src/utils/trpc";
import { IdLink } from "./IdLink";

type Bot = NonNullable<inferQueryOutput<"bot.get-by-id">>;

type Props = {
  className?: string;
  bots: Bot[];
};

export function BotTable({ className, bots }: Props) {
  return (
    <table className="bg-neutral-100 dark:bg-neutral-800 border-separate border-spacing-3">
      <thead>
        <tr className="border-b-2 border-neutral-600 dark:border-neutral-400">
          <th>name</th>
          <th>creator</th>
        </tr>
      </thead>
      <tbody>
        {bots.map((bot) => {
          return (
            <tr key={bot.id} className="border-b-2 border-neutral-500 dark:border-neutral-500">
              <td>
                <IdLink href="/bot/" id={bot.id}>
                  <div className="hover:opacity-60">{bot.name}</div>
                </IdLink>
              </td>
              <td>
                <IdLink href="/profile/" id={bot.user.intId}>
                  <div className="hover:opacity-60">{bot.user.name}</div>
                </IdLink>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
