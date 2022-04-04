export interface ToolHeaderProps {
  icon: React.ReactNode;
  text: string[];
}

export function ToolHeader({ icon, text }: ToolHeaderProps) {
  const dir = text.slice(0, -1);
  const last = text[text.length - 1];

  return (
    <header className="mb-8 flex items-center gap-3 align-middle md:mb-11">
      {icon}
      {dir.map((str, i) => (
        <span key={i} className="text-sm text-deth-gray-300 sm:text-xl">
          {str} /
        </span>
      ))}
      <h3 className="text-sm text-deth-pink sm:text-xl">{last}</h3>
    </header>
  );
}
