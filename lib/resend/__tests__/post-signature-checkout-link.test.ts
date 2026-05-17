/**
 * Tests unitaires - sendPostSignatureCheckoutLink
 *
 * Couvre :
 *  - Fallback gracieux si RESEND_API_KEY absente : return { success: false }
 *  - Construction du HTML/text avec echappement
 *  - Propagation des erreurs Resend
 *  - Appel correct du client.emails.send
 *
 * @author Lalou
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockSend = vi.fn();

vi.mock('../client', async () => {
  const actual = await vi.importActual<typeof import('../client')>('../client');
  return {
    ...actual,
    FROM_EMAIL: 'Guillaume Farre <noreply@test>',
    getResendClient: vi.fn(),
  };
});

import { sendPostSignatureCheckoutLink } from '../post-signature-checkout-link';
import { getResendClient } from '../client';

beforeEach(() => {
  mockSend.mockReset();
  (getResendClient as ReturnType<typeof vi.fn>).mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('sendPostSignatureCheckoutLink', () => {
  const BASE_PARAMS = {
    to: 'buyer@example.org',
    buyerName: 'Jean Dupont',
    canvasTitle: 'Klein',
    reservationId: '11111111-2222-3333-4444-555555555555',
    checkoutUrl: 'https://guillaumefarre.com/fr/vip/reservation/11111111-2222-3333-4444-555555555555/checkout',
  };

  it('retourne { success: false } si RESEND_API_KEY absent (degrade gracieux)', async () => {
    (getResendClient as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const result = await sendPostSignatureCheckoutLink(BASE_PARAMS);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Resend API key missing');
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('appelle client.emails.send avec html et text valides', async () => {
    mockSend.mockResolvedValue({ data: { id: 'msg_123' }, error: null });
    (getResendClient as ReturnType<typeof vi.fn>).mockReturnValue({
      emails: { send: mockSend },
    });
    const result = await sendPostSignatureCheckoutLink(BASE_PARAMS);
    expect(result.success).toBe(true);
    expect(result.messageId).toBe('msg_123');
    expect(mockSend).toHaveBeenCalledOnce();
    const args = mockSend.mock.calls[0][0];
    expect(args.from).toBe('Guillaume Farre <noreply@test>');
    expect(args.to).toBe('buyer@example.org');
    expect(args.subject).toContain('Finalisez');
    expect(args.html).toContain(BASE_PARAMS.checkoutUrl);
    expect(args.html).toContain(BASE_PARAMS.buyerName);
    expect(args.html).toContain(BASE_PARAMS.canvasTitle);
    expect(args.html).toContain(BASE_PARAMS.reservationId);
    expect(args.text).toContain(BASE_PARAMS.checkoutUrl);
    expect(args.text).toContain(BASE_PARAMS.buyerName);
  });

  it('echappe le HTML dans les champs utilisateur', async () => {
    mockSend.mockResolvedValue({ data: { id: 'msg_xss' }, error: null });
    (getResendClient as ReturnType<typeof vi.fn>).mockReturnValue({
      emails: { send: mockSend },
    });
    await sendPostSignatureCheckoutLink({
      ...BASE_PARAMS,
      buyerName: '<script>alert(1)</script>',
      canvasTitle: 'Klein "double"',
    });
    const args = mockSend.mock.calls[0][0];
    expect(args.html).not.toContain('<script>');
    expect(args.html).toContain('&lt;script&gt;');
    expect(args.html).toContain('&quot;double&quot;');
  });

  it('propage l erreur Resend metier', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'rate_limited' } });
    (getResendClient as ReturnType<typeof vi.fn>).mockReturnValue({
      emails: { send: mockSend },
    });
    const result = await sendPostSignatureCheckoutLink(BASE_PARAMS);
    expect(result.success).toBe(false);
    expect(result.error).toBe('rate_limited');
  });

  it('capture les exceptions reseau', async () => {
    mockSend.mockRejectedValue(new Error('econnreset'));
    (getResendClient as ReturnType<typeof vi.fn>).mockReturnValue({
      emails: { send: mockSend },
    });
    const result = await sendPostSignatureCheckoutLink(BASE_PARAMS);
    expect(result.success).toBe(false);
    expect(result.error).toBe('econnreset');
  });
});
