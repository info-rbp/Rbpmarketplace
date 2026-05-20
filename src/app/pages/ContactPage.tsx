import { Mail, MapPin, Send } from 'lucide-react';
import { useState, type ChangeEvent, type FormEvent } from 'react';

const WEB3FORMS_ACCESS_KEY = '0327cba3-a670-48cf-bcef-f8c118dd2247';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const ENQUIRY_TYPE_OPTIONS = [
  { value: 'business-for-sale', label: 'Interested in a Business For Sale' },
  { value: 'business-in-a-box', label: 'Interested in Business-In-A-Box' },
  { value: 'custom-solution', label: 'Request Custom Solution' },
  { value: 'general', label: 'General Enquiry' },
] as const;

const TIMELINE_OPTIONS = [
  'Immediately',
  'Within 2 weeks',
  'Within 30 days',
  '1-3 months',
  'Just researching',
] as const;

type SubmitStatus = 'idle' | 'success' | 'error';

type FormState = {
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  budgetRange: string;
  timeline: string;
  message: string;
  contactMethod: 'email' | 'phone' | 'either';
  botcheck: string;
};

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

const INITIAL_FORM_DATA: FormState = {
  name: '',
  email: '',
  phone: '',
  enquiryType: '',
  budgetRange: '',
  timeline: '',
  message: '',
  contactMethod: 'email',
  botcheck: '',
};

function getEnquiryTypeLabel(enquiryType: string) {
  return (
    ENQUIRY_TYPE_OPTIONS.find((option) => option.value === enquiryType)?.label ??
    enquiryType
  );
}

export function ContactPage() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.botcheck.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      enquiryType: formData.enquiryType,
      budgetRange: formData.budgetRange,
      timeline: formData.timeline,
      message: formData.message,
      contactMethod: formData.contactMethod,
      subject: `New RBP Marketplace Enquiry - ${getEnquiryTypeLabel(formData.enquiryType)}`,
      botcheck: formData.botcheck,
    };

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as Web3FormsResponse;

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setSubmitMessage(
          'Thanks for your enquiry. Our team has received your message and will be in touch soon.',
        );
        setFormData(INITIAL_FORM_DATA);
        return;
      }

      setSubmitStatus('error');
      setSubmitMessage(
        result.message || 'Something went wrong while sending your enquiry. Please try again.',
      );
    } catch {
      setSubmitStatus('error');
      setSubmitMessage(
        'We could not send your enquiry right now. Please check your connection and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormState;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: value as FormState[typeof fieldName],
    }));

    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setSubmitMessage('');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-gray-600">
              Ready to launch your digital business? Contact our team to discuss your goals,
              explore available opportunities, or request a custom solution.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="absolute left-[-9999px]" aria-hidden="true">
                  <label htmlFor="botcheck">Leave this field empty</label>
                  <input
                    type="text"
                    id="botcheck"
                    name="botcheck"
                    value={formData.botcheck}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Smith"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="enquiryType"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Enquiry Type *
                  </label>
                  <select
                    id="enquiryType"
                    name="enquiryType"
                    required
                    value={formData.enquiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select an option</option>
                    {ENQUIRY_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="budgetRange"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Budget Range
                    </label>
                    <select
                      id="budgetRange"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select a range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-plus">$50,000+</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="timeline" className="block text-sm font-semibold text-gray-700 mb-2">
                      Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select a timeline</option>
                      {TIMELINE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us about your goals, timeline, and any specific requirements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Preferred Contact Method *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="email"
                        checked={formData.contactMethod === 'email'}
                        onChange={handleChange}
                        required
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="phone"
                        checked={formData.contactMethod === 'phone'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Phone</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="either"
                        checked={formData.contactMethod === 'either'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Either</span>
                    </label>
                  </div>
                </div>

                {submitStatus !== 'idle' && submitMessage && (
                  <div
                    className={`rounded-lg border px-4 py-3 text-sm ${
                      submitStatus === 'success'
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-red-200 bg-red-50 text-red-800'
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-colors disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a
                        href="mailto:marketplace@remotebusinesspartner.com.au"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        marketplace@remotebusinesspartner.com.au
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                      <p className="text-gray-600">Remote Business Partner</p>
                      <p className="text-sm text-gray-500 mt-1">Serving clients worldwide</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Response Time</h3>
                <p className="text-gray-700 mb-4">
                  We typically respond to all enquiries within 24 hours during business days.
                  For urgent matters, please mention it in your message.
                </p>
              </div>

              <div className="bg-gray-900 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Prefer to Schedule a Call?</h3>
                <p className="text-gray-300 mb-6">
                  Book a discovery call directly with our team to discuss your project in detail.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Book a Discovery Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
