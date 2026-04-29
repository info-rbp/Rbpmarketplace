import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: '',
    budgetRange: '',
    message: '',
    contactMethod: 'email',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your enquiry! We will get back to you within 24 hours.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
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

      {/* Contact Form & Info Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <label htmlFor="enquiryType" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    <option value="business-for-sale">Interested in a Business For Sale</option>
                    <option value="business-in-a-box">Interested in Business-In-A-Box</option>
                    <option value="custom-solution">Request Custom Solution</option>
                    <option value="general">General Enquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="budgetRange" className="block text-sm font-semibold text-gray-700 mb-2">
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

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                  Send Message
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Contact Information */}
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
                      <a href="mailto:info@rbpmarketplace.com" className="text-gray-600 hover:text-blue-600">
                        info@rbpmarketplace.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <a href="tel:+15551234567" className="text-gray-600 hover:text-blue-600">
                        +1 (555) 123-4567
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9am-6pm EST</p>
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
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Business Hours:</span><br />
                    Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                    Saturday - Sunday: Closed
                  </p>
                </div>
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
