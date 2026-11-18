import { z } from 'zod';
import { PROFILE, SITE_CONFIG } from '@/data/profile';

export const ContactFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter at least 2 characters for your name.').max(120),
  email: z.string().trim().email('Please provide a valid email address.'),
  subject: z.string().trim().min(3, 'Please enter a brief subject (at least 3 characters).').max(160),
  message: z
    .string()
    .trim()
    .min(10, 'Please include a short message (at least 10 characters).')
    .max(3000),
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;

export interface ContactSubmissionResult {
  mode: 'api' | 'mailto';
  mailtoUrl?: string;
}

export function buildMailtoUrl(values: ContactFormValues): string {
  const body = [
    `Hi Chaitanya,`,
    '',
    values.message,
    '',
    '---',
    `From: ${values.name} (${values.email})`,
  ].join('\n');

  const params = new URLSearchParams({
    subject: `[Portfolio] ${values.subject}`,
    body,
  });

  return `mailto:${PROFILE.email}?${params.toString().replace(/\+/g, '%20')}`;
}

export function hasConfiguredContactEndpoint(): boolean {
  return Boolean(SITE_CONFIG.contactEndpoint && SITE_CONFIG.contactEndpoint.trim().length > 0);
}

export async function submitContactMessage(
  values: ContactFormValues,
  openMailto: (url: string) => void = (url) => {
    window.location.href = url;
  },
): Promise<ContactSubmissionResult> {
  const parsed = ContactFormSchema.parse(values);

  if (hasConfiguredContactEndpoint()) {
    const response = await fetch(SITE_CONFIG.contactEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(parsed),
    });

    if (!response.ok) {
      throw new Error(`Submission service responded with status ${response.status}`);
    }

    return { mode: 'api' };
  }

  const mailtoUrl = buildMailtoUrl(parsed);
  openMailto(mailtoUrl);
  return { mode: 'mailto', mailtoUrl };
}

