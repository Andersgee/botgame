type Props = {
  className?: string;
};

export function FallbackPage({ className }: Props) {
  return (
    <main>
      <div className={className}>loading animation here.</div>
    </main>
  );
}
