import { format } from "date-fns";
import { inferQueryOutput } from "src/utils/trpc";
import { IdLink } from "./IdLink";

type Replay = NonNullable<inferQueryOutput<"replay.get-by-id">>;

type Props = {
  replays: Replay[];
};

export function ReplayTable({ replays }: Props) {
  return (
    <table className="bg-neutral-100 dark:bg-neutral-800 border-separate border-spacing-3">
      <thead>
        <tr className="border-b-2 border-neutral-600 dark:border-neutral-400">
          <th>players</th>
          <th>played at</th>
          <th>link</th>
        </tr>
      </thead>
      <tbody>{replays.map(TableRow)}</tbody>
    </table>
  );
}

function TableRow(replay: Replay) {
  const id = replay.id;
  const date = replay.createdAt;
  const bots = replay.bots;
  const versusString = bots.map(({ bot }) => bot.name).join(" vs ");

  const winnerUser = replay.bots.find(({ bot }) => bot.id === replay.winningBotId);
  const winnerName = winnerUser?.bot.name;

  return (
    <tr className="border-b-2 border-neutral-500 dark:border-neutral-500">
      <td>
        {bots.map((bot) => {
          const id = bot.bot.id;
          const name = bot.bot.name;
          const isWinner = id === replay.winningBotId;

          return (
            <div key={id}>
              <IdLink className="hover:opacity-60" href="/bot/" id={id}>
                <span
                  className={`w-6 text-center text-sm inline-block font-bold ${
                    isWinner ? "text-green-500" : "text-red-600"
                  }`}
                >
                  {isWinner ? "W" : " "}
                </span>
                <span className="ml-1">{name}</span>
              </IdLink>
            </div>
          );
        })}
      </td>
      <td>{format(date, "yyyy-MM-dd (hh:ss)")}</td>
      <td>
        <IdLink href="/replay/" id={id}>
          <div className="hover:opacity-60">watchicon</div>
        </IdLink>
      </td>
    </tr>
  );
}
