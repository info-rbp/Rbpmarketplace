import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface EnquiryCTAProps {
  title?: string;
  body?: string;
  businessSlug?: string;
}

export function EnquiryCTA({
  title = 'Ready to talk through this Business-In-A-Box?',
  body = 'Tell us what you want to buy, build, or tailor. We will use your enquiry to recommend the best starting package, timeline, and next step.',
  businessSlug,
}: EnquiryCTAProps) {
  const target = businessSlug ? `/enquire?business=${businessSlug}` : '/enquire';

  return (
    <section className="rounded-[2rem] bg-slate-900 px-6 py-8 text-white sm:px-8">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{body}</p>
      <Link
        to={target}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
      >
        Start your enquiry
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}