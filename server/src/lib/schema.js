import { z } from 'zod';

export const ALLOWED_TONES = [
  'Professional',
  'Friendly',
  'Diplomatic',
  'Generic',
  'Custom'
];

export const ALLOWED_AUDIENCES = [
  'Manager',
  'Professor',
  'Teacher',
  'Friend',
  'Executive/C-Level',
  'Legal/Compliance'
];

export const ALLOWED_CHANNELS = [
  'Email',
  'Chat',
  'Announcement',
  'Feedback'
];

export const ALLOWED_PRESETS = [
  'executive',
  'supportive',
  'legal',
  'genz',
  null
];

export const ALLOWED_LENGTHS = [
  'shorter',
  'same',
  'longer'
];

export const ALLOWED_LANGUAGES = [
  'English',
  'Hindi',
  'Hinglish',
  'Spanish',
  'French',
  'German',
  'Arabic',
  'Japanese'
];

/**
 * Counts words by whitespace separation.
 */
export function countWords(str) {
  if (!str || typeof str !== 'string') return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export const rewriteRequestSchema = z.object({
  text: z.string({
    required_error: 'Draft text is required.',
    invalid_type_error: 'Draft text must be a string.'
  })
    .refine((val) => val.trim().length > 0, {
      message: 'Draft text cannot be empty or whitespace only.'
    })
    .refine((val) => countWords(val) <= 2000, {
      message: 'Draft text cannot exceed 2,000 words.'
    }),
  tone: z.enum(ALLOWED_TONES, {
    errorMap: () => ({ message: `Tone must be one of: ${ALLOWED_TONES.join(', ')}` })
  }).default('Professional'),
  customTone: z.string().optional().default(''),
  audience: z.enum(ALLOWED_AUDIENCES, {
    errorMap: () => ({ message: `Audience must be one of: ${ALLOWED_AUDIENCES.join(', ')}` })
  }).default('Manager'),
  channel: z.enum(ALLOWED_CHANNELS, {
    errorMap: () => ({ message: `Channel must be one of: ${ALLOWED_CHANNELS.join(', ')}` })
  }).optional(),
  preset: z.union([
    z.enum(['executive', 'supportive', 'legal', 'genz']),
    z.null()
  ], {
    errorMap: () => ({ message: 'Preset must be one of: executive, supportive, legal, genz, or null' })
  }).optional().default(null),
  length: z.enum(ALLOWED_LENGTHS, {
    errorMap: () => ({ message: `Length must be one of: ${ALLOWED_LENGTHS.join(', ')}` })
  }).default('same'),
  targetWordLimit: z.number({
    invalid_type_error: 'Target word limit must be a positive integer.'
  })
    .int('Target word limit must be an integer.')
    .positive('Target word limit must be a positive integer.')
    .max(2000, 'Target word limit cannot exceed 2,000 words.')
    .optional(),
  language: z.enum(ALLOWED_LANGUAGES, {
    errorMap: () => ({ message: `Language must be one of: ${ALLOWED_LANGUAGES.join(', ')}` })
  }).default('English')
}).superRefine((data, ctx) => {
  if (data.tone === 'Custom') {
    const trimmed = (data.customTone || '').trim();
    if (!trimmed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['customTone'],
        message: 'A custom tone instruction is required when Custom tone is selected (up to 300 characters).'
      });
    } else if (trimmed.length > 300) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['customTone'],
        message: 'Custom tone instruction cannot exceed 300 characters.'
      });
    }
  }
});

export const rewriteVersionSchema = z.object({
  label: z.string({
    required_error: 'Version label is required.'
  }).min(1, 'Version label cannot be empty.'),
  text: z.string({
    required_error: 'Rewritten text is required.'
  }).min(1, 'Rewritten text cannot be empty.'),
  whatChanged: z.string({
    required_error: 'whatChanged explanation is required.'
  }).min(1, 'whatChanged explanation cannot be empty.')
});

export const modelOutputSchema = z.object({
  versions: z.array(rewriteVersionSchema)
    .length(3, 'Model response must contain exactly three rewrite versions.')
});
