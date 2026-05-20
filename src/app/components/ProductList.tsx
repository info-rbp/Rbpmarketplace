interface ProductListProps {
  title: string;
  items: string[];
}

export function ProductList({ title, items }: ProductListProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}