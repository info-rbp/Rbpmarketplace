import { useMemo, useState } from 'react';
import { AssessmentQuiz } from '@/app/components/AssessmentQuiz';
import { getBusinessRecommendations } from '@/app/lib/business';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import { trackEvent } from '@/app/lib/analytics';

export function AssessmentPage() {
  useDocumentMeta(
    'Assessment | Business-In-A-Box',
    'Answer a short quiz and discover the Business-In-A-Box opportunities most likely to suit you.',
  );

  const [answers, setAnswers] = useState({
    launchPreference: 'fast' as const,
    market: 'compliance' as const,
    revenueModel: 'templates' as const,
    complexity: 'Medium' as const,
    audience: 'B2B' as const,
  });

  const recommendations = useMemo(() => getBusinessRecommendations(answers), [answers]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Assessment</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Find the best Business-In-A-Box for you</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Answer a few quick questions and we will surface the opportunities most aligned
          with your preferred market, setup level, and first revenue model.
        </p>
      </section>

      <AssessmentQuiz
        value={answers}
        onChange={(next) => {
          setAnswers(next);
          trackEvent('assessment_started');
          trackEvent('assessment_completed', { topBusiness: getBusinessRecommendations(next)[0]?.slug });
        }}
        recommendations={recommendations}
      />
    </div>
  );
}