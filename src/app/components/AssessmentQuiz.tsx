import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { BusinessConcept, BusinessComplexity, CategoryId } from '@/app/data/types';

interface QuizState {
  launchPreference: 'fast' | 'balanced' | 'complex';
  market: CategoryId | 'all';
  revenueModel: 'affiliate' | 'templates' | 'subscription' | 'consulting' | 'marketplace';
  complexity: BusinessComplexity;
  audience: 'B2B' | 'B2C' | 'Both';
}

interface AssessmentQuizProps {
  value: QuizState;
  onChange: (value: QuizState) => void;
  recommendations: BusinessConcept[];
}

function RadioGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              value === option.value
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AssessmentQuiz({ value, onChange, recommendations }: AssessmentQuizProps) {
  return (
    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          <RadioGroup
            label="Do you want a faster start or a more advanced business with a bigger build?"
            value={value.launchPreference}
            onChange={(launchPreference) => onChange({ ...value, launchPreference })}
            options={[
              { label: 'Fast launch', value: 'fast' },
              { label: 'Balanced', value: 'balanced' },
              { label: 'High-value complex', value: 'complex' },
            ]}
          />
          <RadioGroup
            label="Which market would you feel most confident selling into?"
            value={value.market}
            onChange={(market) => onChange({ ...value, market })}
            options={[
              { label: 'Compliance', value: 'compliance' },
              { label: 'Property', value: 'property' },
              { label: 'Insurance', value: 'insurance-risk' },
              { label: 'Business lifecycle', value: 'business-lifecycle' },
              { label: 'Digital platforms', value: 'digital-platforms' },
            ]}
          />
          <RadioGroup
            label="How would you prefer the business to make money first?"
            value={value.revenueModel}
            onChange={(revenueModel) => onChange({ ...value, revenueModel })}
            options={[
              { label: 'Affiliate commissions', value: 'affiliate' },
              { label: 'Template sales', value: 'templates' },
              { label: 'Subscription', value: 'subscription' },
              { label: 'Consulting or service fees', value: 'consulting' },
              { label: 'Marketplace or lead generation', value: 'marketplace' },
            ]}
          />
          <RadioGroup
            label="How much setup work are you comfortable taking on?"
            value={value.complexity}
            onChange={(complexity) => onChange({ ...value, complexity })}
            options={[
              { label: 'Low', value: 'Low' },
              { label: 'Medium', value: 'Medium' },
              { label: 'High', value: 'High' },
            ]}
          />
          <RadioGroup
            label="Who do you want this business to serve?"
            value={value.audience}
            onChange={(audience) => onChange({ ...value, audience })}
            options={[
              { label: 'B2B', value: 'B2B' },
              { label: 'B2C', value: 'B2C' },
              { label: 'Both', value: 'Both' },
            ]}
          />
        </div>
      </div>

      <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
          Top recommendations
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Based on your answers, these are the Business-In-A-Box offers most likely to suit
          your preferred market, sales model, and setup level.
        </p>
        <div className="mt-5 space-y-4">
          {recommendations.map((business, index) => (
            <div key={business.slug} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                Recommendation {index + 1}
              </p>
              <h3 className="mt-2 text-lg font-bold">{business.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{business.shortDescription}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/businesses/${business.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                >
                  View opportunity
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={`/enquire?business=${business.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white"
                >
                  Ask about it
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}