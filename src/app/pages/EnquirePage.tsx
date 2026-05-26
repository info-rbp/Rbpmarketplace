import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { businesses, getBusinessBySlug } from '@/app/data/businesses';
import type { EnquiryFormValues } from '@/app/data/types';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import { ApiError, apiRequest } from '@/app/lib/api';
import { trackEvent } from '@/app/lib/analytics';
import {
  budgetOptions,
  enquirySchema,
  enquiryTypes,
  timelineOptions,
} from '@/shared/contracts';

export function EnquirePage() {
  useDocumentMeta(
    'Enquire | Business-In-A-Box',
    'Send an enquiry about buying, building, or tailoring a Business-In-A-Box opportunity.',
  );

  const [params] = useSearchParams();
  const selectedBusiness = params.get('business') ?? '';
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<EnquiryFormValues>({
    defaultValues: {
      businessSlug: selectedBusiness,
      enquiryType: 'Buy or build this business',
      budgetRange: '$5,000 - $15,000',
      timeline: '1-3 months',
      companyWebsite: '',
    },
  });

  const businessTitle = useMemo(() => getBusinessBySlug(selectedBusiness)?.title, [selectedBusiness]);

  async function onSubmit(values: EnquiryFormValues) {
    setServerError(null);

    const parsed = enquirySchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string') {
          setError(field as keyof EnquiryFormValues, { message: issue.message });
        }
      }
      return;
    }

    trackEvent('enquiry_started', { businessSlug: parsed.data.businessSlug });

    try {
      await apiRequest<{ success: true; id: string }>('/api/enquiries', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
      });
      trackEvent('enquiry_submitted', {
        businessSlug: parsed.data.businessSlug,
        enquiryType: parsed.data.enquiryType,
      });
      setSubmitted(true);
      reset({
        businessSlug: selectedBusiness,
        enquiryType: 'Buy or build this business',
        budgetRange: '$5,000 - $15,000',
        timeline: '1-3 months',
        companyWebsite: '',
        email: '',
        message: '',
        name: '',
        phone: '',
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
        return;
      }

      setServerError('Something went wrong while submitting your enquiry. Please try again.');
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Enquire</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Tell us what you want to buy, build, or customise</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Send us the opportunity you are interested in, your budget range, and the kind of
          help you need. We use this information to recommend the right starting point.
        </p>
        {businessTitle ? (
          <p className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900">
            Selected business: {businessTitle}
          </p>
        ) : null}
        <p className="mt-4 text-sm leading-7 text-slate-600">
          You can enquire about a single business, ask for a done-for-you build, request a
          quote, or start a partnership discussion.
        </p>
      </section>

      {submitted ? (
        <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-emerald-900">Enquiry received</h2>
          <p className="mt-3 text-sm leading-7 text-emerald-800">
            Thanks for reaching out. Your enquiry has been securely recorded and is ready for follow-up.
          </p>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="sr-only" aria-hidden="true">
            <label>
              Company website
              <input
                tabIndex={-1}
                autoComplete="off"
                {...register('companyWebsite')}
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-semibold">Full name</span>
              <input {...register('name')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
              {errors.name ? <span className="text-xs text-rose-600">{errors.name.message}</span> : null}
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-semibold">Email</span>
              <input {...register('email')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
              {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-semibold">Phone</span>
              <input {...register('phone')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
              {errors.phone ? <span className="text-xs text-rose-600">{errors.phone.message}</span> : null}
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-semibold">Business concept of interest</span>
              <select {...register('businessSlug')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                <option value="">Choose a business</option>
                {businesses.map((business) => (
                  <option key={business.slug} value={business.slug}>
                    {business.title}
                  </option>
                ))}
              </select>
              {errors.businessSlug ? <span className="text-xs text-rose-600">{errors.businessSlug.message}</span> : null}
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-semibold">Enquiry type</span>
              <select {...register('enquiryType')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                {enquiryTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.enquiryType ? <span className="text-xs text-rose-600">{errors.enquiryType.message}</span> : null}
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-semibold">Budget range</span>
              <select {...register('budgetRange')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                {budgetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.budgetRange ? <span className="text-xs text-rose-600">{errors.budgetRange.message}</span> : null}
            </label>

            <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
              <span className="font-semibold">Timeline</span>
              <select {...register('timeline')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                {timelineOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.timeline ? <span className="text-xs text-rose-600">{errors.timeline.message}</span> : null}
            </label>

            <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
              <span className="font-semibold">Message</span>
              <textarea
                {...register('message')}
                rows={6}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
              {errors.message ? <span className="text-xs text-rose-600">{errors.message.message}</span> : null}
            </label>
          </div>

          {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}
          <p className="text-sm leading-7 text-slate-600">
            We only use these details to review your enquiry and contact you about the
            opportunity you have selected.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Send enquiry'}
          </button>
        </form>
      )}
    </div>
  );
}
