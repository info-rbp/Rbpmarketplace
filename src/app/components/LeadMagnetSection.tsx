interface LeadMagnetSectionProps {
  items: string[];
}

export function LeadMagnetSection({ items }: LeadMagnetSectionProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Lead magnets</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">First offers to attract enquiries</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
        These simple downloads, checklists, and tools can help this business start
        conversations and build an audience from day one.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-sky-100 bg-white px-4 py-4 text-sm text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}