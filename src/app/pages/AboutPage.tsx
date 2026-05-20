import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';

export function AboutPage() {
  useDocumentMeta(
    'About | Business-In-A-Box',
    'Learn how RBP Marketplace packages Business-In-A-Box opportunities into customer-ready offers.',
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">About the model</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Business-In-A-Box turns strong concepts into offers that people can actually buy</h1>
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
          <p>
            RBP Marketplace is designed for people who do not want a vague business idea. They
            want a commercial opportunity that can be packaged properly, explained clearly, and
            taken to market with confidence.
          </p>
          <p>
            Each Business-In-A-Box opportunity is structured around who it serves, what can be
            sold first, how it can earn revenue, and how the offer can grow over time.
          </p>
          <p>
            That means you can explore the catalogue as a buyer, a partner, or an operator who
            wants help turning the right opportunity into a real business.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'What you are looking at',
            body: 'These are packaged business opportunities, not random idea notes. Each one is presented so you can understand the offer, the market, and the likely revenue path.',
          },
          {
            title: 'How people use it',
            body: 'Some buyers want a business they can launch quickly. Others want a tailored build, a partnership pathway, or a concept they can grow into a larger service or digital product.',
          },
          {
            title: 'What happens next',
            body: 'Once you identify a shortlist, you can compare opportunities, take the fit assessment, or send an enquiry so RBP can recommend the right commercial next step.',
          },
        ].map((item) => (
          <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}