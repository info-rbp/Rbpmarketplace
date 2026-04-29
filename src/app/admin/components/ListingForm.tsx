/**
 * ListingForm – shared by Add and Edit listing pages.
 * Covers every field visible in the BusinessDetailPage screenshots:
 *   Hero: title, description, price, type, category, featured
 *   About: longDescription
 *   Business info: businessModel, targetMarket, revenueModel[]
 *   What's Included: inclusions[]
 *   Optional Add-Ons: addOns[]
 *   Technical Details: stack[], features[], integrations[]
 *   Included Extras: extras[]
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Business } from '../../data/businesses';
import { slugify } from '../../data/businessStore';
import {
  Plus, X, Save, ArrowLeft, Info, Code, Package,
  DollarSign, Users, CheckCircle2, Star
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
type StringListField =
  | 'inclusions' | 'addOns' | 'extras'
  | 'revenueModel' | 'techStack' | 'techFeatures' | 'techIntegrations';

function emptyForm(): FormState {
  return {
    title: '',
    description: '',
    longDescription: '',
    price: '',
    category: '',
    type: 'standard',
    featured: false,
    businessModel: '',
    targetMarket: '',
    revenueModel: [''],
    inclusions: [''],
    addOns: [''],
    extras: [''],
    techStack: [''],
    techFeatures: [''],
    techIntegrations: [''],
  };
}

interface FormState {
  title: string;
  description: string;
  longDescription: string;
  price: string;
  category: string;
  type: 'standard' | 'business-in-a-box';
  featured: boolean;
  businessModel: string;
  targetMarket: string;
  revenueModel: string[];
  inclusions: string[];
  addOns: string[];
  extras: string[];
  techStack: string[];
  techFeatures: string[];
  techIntegrations: string[];
}

function businessToForm(b: Business): FormState {
  return {
    title: b.title,
    description: b.description,
    longDescription: b.longDescription,
    price: b.price,
    category: b.category,
    type: b.type,
    featured: b.featured ?? false,
    businessModel: b.businessModel ?? '',
    targetMarket: b.targetMarket ?? '',
    revenueModel: b.revenueModel?.length ? b.revenueModel : [''],
    inclusions: b.inclusions?.length ? b.inclusions : [''],
    addOns: b.addOns?.length ? b.addOns : [''],
    extras: b.extras?.length ? b.extras : [''],
    techStack: b.technicalDetails?.stack?.length ? b.technicalDetails.stack : [''],
    techFeatures: b.technicalDetails?.features?.length ? b.technicalDetails.features : [''],
    techIntegrations: b.technicalDetails?.integrations?.length ? b.technicalDetails.integrations : [''],
  };
}

function formToBusiness(f: FormState, existingId?: string): Business {
  const id = existingId ?? (slugify(f.title) || `listing-${Date.now()}`);
  const clean = (arr: string[]) => arr.map((s) => s.trim()).filter(Boolean);
  return {
    id,
    title: f.title.trim(),
    description: f.description.trim(),
    longDescription: f.longDescription.trim(),
    price: f.price.trim(),
    category: f.category.trim(),
    type: f.type,
    featured: f.featured,
    businessModel: f.businessModel.trim() || undefined,
    targetMarket: f.targetMarket.trim() || undefined,
    revenueModel: clean(f.revenueModel).length ? clean(f.revenueModel) : undefined,
    inclusions: clean(f.inclusions),
    addOns: clean(f.addOns).length ? clean(f.addOns) : undefined,
    extras: clean(f.extras).length ? clean(f.extras) : undefined,
    technicalDetails:
      clean(f.techStack).length || clean(f.techFeatures).length || clean(f.techIntegrations).length
        ? {
            stack: clean(f.techStack),
            features: clean(f.techFeatures),
            integrations: clean(f.techIntegrations),
          }
        : undefined,
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function TextInput({
  label, value, onChange, placeholder, required, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function TextareaInput({
  label, value, onChange, placeholder, required, rows = 4, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; rows?: number; hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        required={required}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-vertical"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function ListEditor({
  label, items, onChange, placeholder, hint, addLabel = 'Add item',
}: {
  label: string; items: string[]; onChange: (items: string[]) => void;
  placeholder?: string; hint?: string; addLabel?: string;
}) {
  const update = (idx: number, val: string) => {
    const next = [...items];
    next[idx] = val;
    onChange(next);
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, '']);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-gray-300 shrink-0" />
            <input
              type="text"
              value={item}
              onChange={(e) => update(idx, e.target.value)}
              placeholder={placeholder ?? 'Enter item…'}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface ListingFormProps {
  initial?: Business;
  mode: 'create' | 'edit';
  onSave: (business: Business) => void;
}

export function ListingForm({ initial, mode, onSave }: ListingFormProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(
    initial ? businessToForm(initial) : emptyForm()
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setList = (field: StringListField, items: string[]) =>
    set(field as keyof FormState, items as any);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Short description is required';
    if (!form.longDescription.trim()) e.longDescription = 'Full description is required';
    if (!form.price.trim()) e.price = 'Price is required';
    if (!form.category.trim()) e.category = 'Category is required';
    if (form.inclusions.every((s) => !s.trim())) e.inclusions = 'Add at least one inclusion';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const business = formToBusiness(form, initial?.id);
      onSave(business);
      setSaving(false);
      setSaved(true);
      setTimeout(() => navigate('/admin'), 800);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Validation banner */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-red-700 mb-2">Please fix the following errors:</p>
          <ul className="list-disc list-inside space-y-1">
            {Object.values(errors).map((e, i) => (
              <li key={i} className="text-sm text-red-600">{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── SECTION 1: Core listing info ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <SectionHeader icon={Info} title="Core Listing Information" subtitle="The essential details shown in the hero and listing cards" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <TextInput
              label="Listing Title"
              required
              value={form.title}
              onChange={(v) => set('title', v)}
              placeholder="e.g. E-Commerce SaaS Platform"
              hint="Shown as the main heading on the listing page"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div className="md:col-span-2">
            <TextareaInput
              label="Short Description"
              required
              rows={2}
              value={form.description}
              onChange={(v) => set('description', v)}
              placeholder="One-sentence summary shown on cards and the hero subtitle"
              hint="Keep this under 160 characters — it appears on listing cards"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <TextInput
              label="Price"
              required
              value={form.price}
              onChange={(v) => set('price', v)}
              placeholder="e.g. From $8,900 or $12,500"
              hint='Use "From $X" for variable pricing'
            />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <TextInput
              label="Category"
              required
              value={form.category}
              onChange={(v) => set('category', v)}
              placeholder="e.g. SaaS Application, EdTech Platform, Business-In-A-Box"
            />
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Listing Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'standard', label: 'Business For Sale', desc: 'Appears on /businesses-for-sale' },
                { value: 'business-in-a-box', label: 'Business-In-A-Box', desc: 'Appears on /business-in-a-box' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('type', opt.value as 'standard' | 'business-in-a-box')}
                  className={`text-left p-3 rounded-lg border-2 transition-all ${
                    form.type === opt.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-900">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Featured Listing</label>
            <button
              type="button"
              onClick={() => set('featured', !form.featured)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg border-2 transition-all ${
                form.featured ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Star className={`h-5 w-5 ${form.featured ? 'text-yellow-500 fill-yellow-400' : 'text-gray-300'}`} />
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">
                  {form.featured ? 'Featured — shown with badge' : 'Not featured'}
                </div>
                <div className="text-xs text-gray-500">Featured listings appear prominently on the homepage</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: About This Business ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <SectionHeader icon={Info} title="About This Business" subtitle="Full description shown in the 'About This Business' section" />
        <TextareaInput
          label="Full Description"
          required
          rows={6}
          value={form.longDescription}
          onChange={(v) => set('longDescription', v)}
          placeholder="Write a compelling, detailed description of the business opportunity, its market potential, and what makes it unique…"
        />
        {errors.longDescription && <p className="text-xs text-red-500 mt-1">{errors.longDescription}</p>}
      </div>

      {/* ── SECTION 3: Business Model Cards ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <SectionHeader
          icon={Package}
          title="Business Info Cards"
          subtitle="The three info cards shown below the hero: Business Model, Target Market, Revenue Model"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextareaInput
            label="Business Model"
            rows={3}
            value={form.businessModel}
            onChange={(v) => set('businessModel', v)}
            placeholder="e.g. Commission-based marketplace with optional vendor subscription tiers"
          />
          <TextareaInput
            label="Target Market"
            rows={3}
            value={form.targetMarket}
            onChange={(v) => set('targetMarket', v)}
            placeholder="e.g. Entrepreneurs, niche marketplace operators, industry-specific platforms"
          />
        </div>
        <ListEditor
          label="Revenue Model (bullet list)"
          items={form.revenueModel}
          onChange={(items) => setList('revenueModel', items)}
          placeholder="e.g. Commission per sale (5–15%)"
          hint="Each line becomes one bullet point in the Revenue Model card"
          addLabel="Add revenue stream"
        />
      </div>

      {/* ── SECTION 4: What's Included ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <SectionHeader
          icon={CheckCircle2}
          title="What's Included"
          subtitle="Checklist shown in the two-column grid — shown with green tick icons"
        />
        {errors.inclusions && <p className="text-xs text-red-500 mb-3">{errors.inclusions}</p>}
        <ListEditor
          label=""
          items={form.inclusions}
          onChange={(items) => setList('inclusions', items)}
          placeholder="e.g. Complete source code (React, Node.js, PostgreSQL)"
          hint="Each item appears as a green-ticked checklist row"
          addLabel="Add inclusion"
        />
      </div>

      {/* ── SECTION 5: Optional Add-Ons ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <SectionHeader
          icon={Plus}
          title="Optional Add-Ons"
          subtitle="Shown in the blue-tinted two-column grid — include price in the text e.g. 'Mobile app (iOS & Android) ($8,000)'"
        />
        <ListEditor
          label=""
          items={form.addOns}
          onChange={(items) => setList('addOns', items)}
          placeholder="e.g. Custom branding & design ($2,500)"
          hint="Include the price in brackets at the end of each item"
          addLabel="Add add-on"
        />
      </div>

      {/* ── SECTION 6: Technical Details ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <SectionHeader
          icon={Code}
          title="Technical Details"
          subtitle="The three cards: Technology Stack · Key Features · Integrations"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ListEditor
            label="Technology Stack"
            items={form.techStack}
            onChange={(items) => setList('techStack', items)}
            placeholder="e.g. React"
            addLabel="Add technology"
          />
          <ListEditor
            label="Key Features"
            items={form.techFeatures}
            onChange={(items) => setList('techFeatures', items)}
            placeholder="e.g. Multi-vendor"
            addLabel="Add feature"
          />
          <ListEditor
            label="Integrations"
            items={form.techIntegrations}
            onChange={(items) => setList('techIntegrations', items)}
            placeholder="e.g. Stripe"
            addLabel="Add integration"
          />
        </div>
      </div>

      {/* ── SECTION 7: Included Extras (BIaB only) ── */}
      <div className={`bg-white rounded-xl border p-6 transition-all ${
        form.type === 'business-in-a-box' ? 'border-purple-300 bg-purple-50/30' : 'border-gray-200'
      }`}>
        <SectionHeader
          icon={DollarSign}
          title="Included Extras"
          subtitle="Shown with purple tick icons — typically used for Business-In-A-Box packages"
        />
        {form.type !== 'business-in-a-box' && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
            💡 Extras are typically used for Business-In-A-Box listings but can be added to any type.
          </p>
        )}
        <ListEditor
          label=""
          items={form.extras}
          onChange={(items) => setList('extras', items)}
          placeholder="e.g. 3 months of technical support"
          addLabel="Add extra"
        />
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <button
          type="submit"
          disabled={saving || saved}
          className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors ${
            saved
              ? 'bg-green-600'
              : saving
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          <Save className="h-4 w-4" />
          {saved ? 'Saved! Redirecting…' : saving ? 'Saving…' : mode === 'create' ? 'Publish Listing' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
