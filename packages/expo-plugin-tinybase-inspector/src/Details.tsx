export const Details = ({
  label,
  hook,
}: {
  label: string;
  hook: () => any;
}) => {
  return (
    <details open>
      <summary>{label}</summary>
      <pre>{JSON.stringify(hook(), null, 2)}</pre>
    </details>
  );
};
