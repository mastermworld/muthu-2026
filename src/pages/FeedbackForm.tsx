import React, { useState } from 'react';
import { Mail, Phone, Send, Star, CheckCircle, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { useLanguage } from '../components/layout/Navbar';
import { API_URL } from '../config/api';

const categories = [
  { value: 'general', english: 'General Feedback', tamil: 'பொதுவான கருத்து' },
  { value: 'suggestion', english: 'Suggestion', tamil: 'பரிந்துரை' },
  { value: 'complaint', english: 'Complaint', tamil: 'புகார்' },
  { value: 'bug', english: 'Bug / Issue', tamil: 'பிழை / சிக்கல்' },
  { value: 'other', english: 'Other', tamil: 'மற்றவை' },
];

const t = (lang: string, en: string, ta: string) => (lang === 'tamil' ? ta : en);

const FeedbackForm: React.FC = () => {
  const { language } = useLanguage();

  const [form, setForm] = useState({ name: '', email: '', phone: '', category: '', rating: 0, message: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.category || !form.rating || !form.message) {
      setStatus('error');
      setErrorMsg(t(language, 'Please fill in all fields.', 'அனைத்து புலங்களையும் நிரப்பவும்.'));
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Submission failed');
      }
      setStatus('success');
      setForm({ name: '', email: '', phone: '', category: '', rating: 0, message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || t(language, 'Something went wrong.', 'ஏதோ தவறு ஏற்பட்டது.'));
    }
  };

  const ratingLabels = language === 'tamil'
    ? ['மிகவும் மோசமான', 'மோசமான', 'சரி', 'நன்றாக', 'அருமை']
    : ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/40 to-secondary-50/40 py-3 sm:py-5 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
            {t(language, 'Contact Us', 'தொடர்பு கொள்ள')}
          </h1>
          <p className="text-neutral-500 mt-2 text-sm sm:text-base">
            {t(language, 'Get in touch with us for any questions or feedback.', 'எந்தவொரு கேள்விகளுக்கும் அல்லது கருத்துகளுக்கும் எங்களை தொடர்பு கொள்ளவும்.')}
          </p>
        </div>

        {/* Success State */}
        {status === 'success' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-800 mb-2">
              {t(language, 'Thank You!', 'நன்றி!')}
            </h2>
            <p className="text-neutral-500 mb-6">
              {t(language, 'Your feedback has been submitted successfully.', 'உங்கள் கருத்து வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.')}
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              {t(language, 'Submit Another', 'மீண்டும் அனுப்பவும்')}
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Banner */}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{errorMsg}</p>
              </div>
            )}

            {/* Name, Email & Phone */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-neutral-700 font-semibold mb-2 text-sm">
                    {t(language, 'Your Name', 'உங்கள் பெயர்')}
                  </label>
                  <input
                    id="name" name="name" type="text" value={form.name} onChange={handleChange}
                    placeholder={t(language, 'Enter your name', 'பெயரை உள்ளிடவும்')}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-800 font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-500/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-neutral-700 font-semibold mb-2 text-sm">
                    {t(language, 'Email Address', 'மின்னஞ்சல் முகவரி')}
                  </label>
                  <input
                    id="email" name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder={t(language, 'your@email.com', 'your@email.com')}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-800 font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-500/20 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-neutral-700 font-semibold mb-2 text-sm">
                    {t(language, 'Mobile Number', 'மொபைல் எண்')}
                    <span className="text-neutral-400 font-normal ml-1">({t(language, 'optional', 'விரும்பினால்')})</span>
                  </label>
                  <input
                    id="phone" name="phone" type="tel" inputMode="numeric" value={form.phone} onChange={handleChange}
                    placeholder={t(language, 'Enter your mobile number', 'மொபைல் எண்ணை உள்ளிடவும்')}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-800 font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Category & Rating */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8 space-y-6">
              <div>
                <label htmlFor="category" className="block text-neutral-700 font-semibold mb-2 text-sm">
                  {t(language, 'Feedback Category', 'கருத்து வகை')}
                </label>
                <select
                  id="category" name="category" value={form.category} onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-800 font-medium focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-500/20 transition-all appearance-none"
                >
                  <option value="">{t(language, 'Select a category', 'வகையைத் தேர்ந்தெடுக்கவும்')}</option>
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>
                      {language === 'tamil' ? c.tamil : c.english}
                    </option>
                  ))}
                </select>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-3 text-sm">
                  {t(language, 'How would you rate your experience?', 'உங்கள் அனுபவத்தை எவ்வாறு மதிப்பிடுவீர்கள்?')}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, rating: star }))}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${star <= (hoverRating || form.rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-neutral-300'
                          }`}
                      />
                    </button>
                  ))}
                  {(hoverRating || form.rating) > 0 && (
                    <span className="ml-3 text-sm font-medium text-neutral-600">
                      {ratingLabels[(hoverRating || form.rating) - 1]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8">
              <label htmlFor="message" className="block text-neutral-700 font-semibold mb-2 text-sm">
                {t(language, 'Your Message', 'உங்கள் செய்தி')}
              </label>
              <textarea
                id="message" name="message" rows={5} value={form.message} onChange={handleChange}
                placeholder={t(language, 'Tell us what you think...', 'உங்கள் கருத்தை எங்களிடம் சொல்லுங்கள்...')}
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-800 font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-500/20 transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-xl font-bold text-lg hover:from-primary-700 hover:to-secondary-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t(language, 'Submitting...', 'சமர்ப்பிக்கிறது...')}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t(language, 'Submit Feedback', 'கருத்தை அனுப்பவும்')}
                </>
              )}
            </button>
          </form>
        )}

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 text-center flex flex-col items-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mb-4 rounded-full overflow-hidden border-4 border-primary-100">
              <img src="/r.jpeg" alt="Ramesh Varman" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800">Ramesh Varman</h3>
            <p className="text-neutral-500 text-sm mb-4">ரமேஷ் வர்மன்</p>
            <a
              href="tel:+919087099000"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition-colors text-sm w-full max-w-xs"
            >
              <Phone className="w-4 h-4" />
              +91 90870 99000
            </a>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 text-center flex flex-col items-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mb-4 rounded-full overflow-hidden border-4 border-primary-100">
              <img src="/cb.jpeg" alt="Chandra Babu" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800">Chandra Babu</h3>
            <p className="text-neutral-500 text-sm mb-4">சந்திர பாபு</p>
            <a
              href="tel:+919841659298"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition-colors text-sm w-full max-w-xs"
            >
              <Phone className="w-4 h-4" />
              +91 98416 59298
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
