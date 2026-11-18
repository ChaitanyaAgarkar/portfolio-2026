import { describe, expect, it, vi } from 'vitest';
import {
  buildMailtoUrl,
  ContactFormSchema,
  submitContactMessage,
} from '@/lib/utils/contactAdapter';

describe('Contact form schema & submission adapter', () => {
  it('validates valid contact payload and rejects short inputs', () => {
    expect(
      ContactFormSchema.safeParse({
        name: 'A',
        email: 'bad-email',
        subject: 'Hi',
        message: 'Short',
      }).success,
    ).toBe(false);

    expect(
      ContactFormSchema.safeParse({
        name: 'Engineering Lead',
        email: 'lead@example.com',
        subject: 'Staff Frontend Opportunity',
        message: 'We would love to discuss a full-stack engineering role in Pune.',
      }).success,
    ).toBe(true);
  });

  it('builds a prefilled mailto URL with subject and body', () => {
    const url = buildMailtoUrl({
      name: 'Alex',
      email: 'alex@example.com',
      subject: 'Architecture Review',
      message: 'Let us connect regarding system architecture.',
    });

    expect(url.startsWith('mailto:chaitanyaagarkar11@gmail.com?')).toBe(true);
    expect(url).toContain('Architecture%20Review');
    expect(url).toContain('alex%40example.com');
  });

  it('invokes mailto fallback when no backend endpoint is configured', async () => {
    const openSpy = vi.fn();
    const res = await submitContactMessage(
      {
        name: 'Alex',
        email: 'alex@example.com',
        subject: 'Project Inquiry',
        message: 'Interested in collaborating on a scalable SaaS platform.',
      },
      openSpy,
    );

    expect(res.mode).toBe('mailto');
    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0][0]).toContain('mailto:chaitanyaagarkar11@gmail.com');
  });
});

