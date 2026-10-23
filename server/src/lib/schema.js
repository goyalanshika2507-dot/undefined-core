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
  'Executive / C-Level',
  'Legal/Compliance',
  'Legal / Compliance'
];

export const ALLOWED_CHANNELS = [
  'Email',
  'Chat',
  'Chat / Direct Message',
  'Announcement',
  'Feedback'
];

export const ALLOWED_PRESETS = [
  'executive',
  'supportive',
  'legal',
  'genz',
  'Executive C-Level',
  'Supportive Peer',
  'Legal / Compliance',
  'Gen-Z Hype',
  null
];

export const ALLOWED_LENGTHS = [
  'shorter',
  'same',
  'longer',
  'Shorter',
  'Same',
  'Longer'
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
 * Normalizes preset name to internal key.
 */
export function normalizePreset(preset) {
  if (!preset) return null;
  const p = String(preset).trim().toLowerCase();
  if (p.includes('exec')) return 'executive';
  if (p.includes('support')) return 'supportive';
  if (p.includes('legal')) return 'legal';
  if (p.includes('genz') || p.includes('gen-z')) return 'genz';
  return null;
}

/**
 * Normalizes audience name to canonical key.
 */
export function normalizeAudience(audience) {
  if (!audience) return 'Manager';
  if (audience === 'Executive / C-Level') return 'Executive/C-Level';
  if (audience === 'Legal / Compliance') return 'Legal/Compliance';
  return audience;
}

/**
 * Normalizes channel name to canonical key.
 */
export function normalizeChannel(channel) {
  if (!channel) return 'Email';
  if (channel === 'Chat / Direct Message') return 'Chat';
  return channel;
}

/**
 * Counts words by whitespace separation.
 */
export function countWords(str) {
  if (!str || typeof str !== 'string') return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

const rawRequestSchema = z.object({
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
    z.enum(['executive', 'supportive', 'legal', 'genz', 'Executive C-Level', 'Supportive Peer', 'Legal / Compliance', 'Gen-Z Hype']),
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

/**
 * Pre-processed request schema that maps frontend field variations (e.g. message -> text)
 * and normalizes audience/channel/preset casing.
 */
export const rewriteRequestSchema = z.preprocess((val) => {
  if (val && typeof val === 'object') {
    const copy = { ...val };

    // Support frontend field name `message` alongside `text`
    if ((copy.text === undefined || copy.text === null) && typeof copy.message === 'string') {
      copy.text = copy.message;
    }

    // Support frontend field name `targetWords` alongside `targetWordLimit`
    if (copy.targetWordLimit === undefined && copy.targetWords !== undefined && copy.targetWords !== null && copy.targetWords !== '') {
      copy.targetWordLimit = Number(copy.targetWords);
    }

    // Normalize length to lowercase string
    if (typeof copy.length === 'string') {
      copy.length = copy.length.toLowerCase();
    }

    return copy;
  }
  return val;
}, rawRequestSchema);

export const rewriteVersionSchema = z.object({
  id: z.string().optional(),
  label: z.string({
    required_error: 'Version label is required.'
  }).min(1, 'Version label cannot be empty.'),
  text: z.string({
    required_error: 'Rewritten text is required.'
  }).min(1, 'Rewritten text cannot be empty.'),
  whatChanged: z.string().optional(),
  styleDescription: z.string().optional(),
  tone: z.string().optional(),
  audience: z.string().optional()
}).refine(data => Boolean(data.whatChanged || data.styleDescription), {
  message: 'Either whatChanged or styleDescription explanation must be provided.'
}).transform(data => ({
  id: data.id || `v-${Math.random().toString(36).substring(2, 7)}`,
  label: data.label,
  text: data.text,
  whatChanged: data.whatChanged || data.styleDescription || 'Refined clarity, tone, and flow.',
  styleDescription: data.styleDescription || data.whatChanged || 'Refined clarity, tone, and flow.',
  tone: data.tone,
  audience: data.audience
}));

export const modelOutputSchema = z.object({
  status: z.string().optional().default('success'),
  versions: z.array(rewriteVersionSchema)
    .length(3, 'Model response must contain exactly three rewrite versions.'),
  insights: z.object({
    toneShift: z.string().optional(),
    clarity: z.string().optional(),
    directness: z.string().optional(),
    audienceFit: z.string().optional(),
    keyChanges: z.array(z.string()).optional(),
    howItMightComeAcross: z.string().optional(),
    meaningCheck: z.object({
      preservedFacts: z.array(z.string()).optional(),
      possibleOmissions: z.array(z.string()).optional(),
      unsupportedAdditions: z.array(z.string()).optional(),
      uncertainChanges: z.array(z.string()).optional()
    }).optional()
  }).optional()
});
