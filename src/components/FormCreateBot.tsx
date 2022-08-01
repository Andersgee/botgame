import { useState } from "react";
import { trpc } from "src/utils/trpc";

type Props = {
  className?: string;
};

export function FormCreateBot({ className }: Props) {
  const [name, setName] = useState("some botname");
  const [bio, setBio] = useState("optional description");

  const { mutate: mutateBot, isLoading, data, error } = trpc.useMutation(["protected-bot.create"]);

  const handleCreate = async () => {
    mutateBot({ name, bio });
  };

  return (
    <div className={className}>
      {error && <div>error.message: {error.message}</div>}
      {isLoading && <div>isLoading: {isLoading}</div>}
      <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
      <input type="text" onChange={(e) => setBio(e.target.value)} value={bio} />
      <button onClick={handleCreate}>Create bot</button>
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
