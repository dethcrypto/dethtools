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
        <span key={i} className="text-xl text-gray-300 sm:text-lg">
          {str} /
        </span>
      ))}
      <h3 className="text-2xl text-pink sm:text-xl">{last}</h3>
    </header>
  );
}
