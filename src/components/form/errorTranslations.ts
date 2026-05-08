// ─── Shared form error translations ──────────────────────────────────────────
// All Zod validation messages are written in English and translated here at
// display time when the user has selected Tamil.

const errorMap: Record<string, string> = {
  // Generic select
  "You must select an option":
    "நீங்கள் ஒரு விருப்பத்தை தேர்ந்தெடுக்க வேண்டும்.",

  // Full name
  "Full name must be at least 2 characters":
    "முழு பெயர் குறைந்தது 2 எழுத்துகள் இருக்க வேண்டும்.",

  // Phone
  "Please enter a valid phone number":
    "சரியான தொலைபேசி எண்ணை உள்ளிடவும்.",

  // Email
  "Please enter a valid email address":
    "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
  "Invalid email": "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.",

  // Date of birth
  "Please select your date of birth":
    "உங்கள் பிறந்த தேதியை தேர்ந்தெடுக்கவும்.",
  "Please select a valid date": "சரியான தேதியை தேர்ந்தெடுக்கவும்.",
  "Please enter a valid date": "சரியான தேதியை உள்ளிடவும்.",
  "Date of birth cannot be in the future":
    "பிறந்த தேதி எதிர்காலத்தில் இருக்கக் கூடாது.",
  "Year must be 1900 or later": "ஆண்டு 1900 அல்லது அதற்குப் பிறகு இருக்க வேண்டும்.",

  // Address / postal
  "Address must be at least 10 characters":
    "முகவரி குறைந்தது 10 எழுத்துகள் இருக்க வேண்டும்.",
  "Please enter a valid postal code":
    "சரியான அஞ்சல் குறியீட்டை உள்ளிடவும்.",

  // Job
  "Job description must be at least 5 characters":
    "வேலை விவரம் குறைந்தது 5 எழுத்துகள் இருக்க வேண்டும்.",

  // Profile picture
  "Profile picture is required.": "சுயவிவர படம் அவசியம்.",
  "Max file size is 5 MB.": "கோப்பு அளவு அதிகபட்சம் 5 MB.",
};

/**
 * Returns the Tamil translation of a Zod error message when language is "tamil",
 * otherwise returns the original English message.
 */
export function translateError(
  message: string | undefined,
  language: string
): string | undefined {
  if (!message) return message;
  if (language !== "tamil") return message;
  return errorMap[message] ?? message;
}
