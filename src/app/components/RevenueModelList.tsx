interface RevenueModelListProps {
  items: string[];
}

export function RevenueModelList({ items }: RevenueModelListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Revenue stream</p>
          <p className="mt-3 text-sm leading-6 text-slate-700">{item}</p>
        </div>
      ))}
    </div>
  );
}