interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}

export function DetailRow({ label, value, accent }: DetailRowProps) {
  return (
    <div className="flex justify-between items-start py-1.5 text-[13px] gap-3">
      <span className="font-mono text-[11px] text-muted shrink-0 min-w-[100px]">{label}</span>
      <span className={`text-right break-words ${accent ? 'text-accent font-medium' : 'text-text'}`}>
        {value}
      </span>
    </div>
  );
}
