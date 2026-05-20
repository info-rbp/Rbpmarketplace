interface VariationListProps {
  items: string[];
}

export function VariationList({ items }: VariationListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          {item}
        </div>
      ))}
    </div>
  );
}