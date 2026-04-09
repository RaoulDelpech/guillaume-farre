/**
 * Tests unitaires pour pricing-calculator + pricing-config
 *
 * @author Lalou
 * @date 2026-04-09
 *
 * Systeme simplifie : prix fixes par format, pas de multiplicateurs.
 */

import { describe, it, expect } from 'vitest';
import { getPrice, validatePrice, formatPrice, CANONICAL_PRICES } from '../pricing-calculator';
import {
  FORMATS,
  STANDARD_FORMATS,
  PURCHASABLE_FORMATS,
  TOTAL_EXEMPLAIRES_STANDARD,
  getFormatPrice,
  isPurchasable,
  type PrintFormat,
} from '../pricing-config';

describe('pricing-config', () => {
  describe('FORMATS', () => {
    it('should define 5 formats', () => {
      const formats = Object.keys(FORMATS);
      expect(formats).toHaveLength(5);
      expect(formats).toContain('24x36');
      expect(formats).toContain('40x60');
      expect(formats).toContain('80x120');
      expect(formats).toContain('hors-format');
      expect(formats).toContain('monumental');
    });

    it('should have correct prices for standard formats', () => {
      expect(FORMATS['24x36'].price).toBe(500);
      expect(FORMATS['40x60'].price).toBe(1000);
      expect(FORMATS['80x120'].price).toBe(2000);
    });

    it('should have null prices for sur-demande formats', () => {
      expect(FORMATS['hors-format'].price).toBeNull();
      expect(FORMATS['monumental'].price).toBeNull();
    });

    it('should have correct exemplaires count', () => {
      expect(FORMATS['24x36'].exemplaires).toBe(9);
      expect(FORMATS['40x60'].exemplaires).toBe(9);
      expect(FORMATS['80x120'].exemplaires).toBe(9);
      expect(FORMATS['hors-format'].exemplaires).toBe(3);
      expect(FORMATS['monumental'].exemplaires).toBe(1);
    });

    it('should have sequential numbering (1-9, 10-18, 19-27, 28-30)', () => {
      expect(FORMATS['24x36'].numberingStart).toBe(1);
      expect(FORMATS['24x36'].numberingEnd).toBe(9);

      expect(FORMATS['40x60'].numberingStart).toBe(10);
      expect(FORMATS['40x60'].numberingEnd).toBe(18);

      expect(FORMATS['80x120'].numberingStart).toBe(19);
      expect(FORMATS['80x120'].numberingEnd).toBe(27);

      expect(FORMATS['hors-format'].numberingStart).toBe(28);
      expect(FORMATS['hors-format'].numberingEnd).toBe(30);
    });

    it('should have monumental numbering 1-1', () => {
      expect(FORMATS['monumental'].numberingStart).toBe(1);
      expect(FORMATS['monumental'].numberingEnd).toBe(1);
    });

    it('should have numbering ranges matching exemplaires count', () => {
      for (const [, config] of Object.entries(FORMATS)) {
        const rangeSize = config.numberingEnd - config.numberingStart + 1;
        expect(rangeSize).toBe(config.exemplaires);
      }
    });
  });

  describe('STANDARD_FORMATS', () => {
    it('should contain 4 standard formats', () => {
      expect(STANDARD_FORMATS).toHaveLength(4);
      expect(STANDARD_FORMATS).toEqual(['24x36', '40x60', '80x120', 'hors-format']);
    });
  });

  describe('PURCHASABLE_FORMATS', () => {
    it('should contain only formats with fixed prices', () => {
      expect(PURCHASABLE_FORMATS).toHaveLength(3);
      expect(PURCHASABLE_FORMATS).toEqual(['24x36', '40x60', '80x120']);
    });
  });

  describe('TOTAL_EXEMPLAIRES_STANDARD', () => {
    it('should equal 30 (9+9+9+3)', () => {
      expect(TOTAL_EXEMPLAIRES_STANDARD).toBe(30);

      const total = STANDARD_FORMATS.reduce(
        (sum, fmt) => sum + FORMATS[fmt].exemplaires,
        0
      );
      expect(total).toBe(TOTAL_EXEMPLAIRES_STANDARD);
    });
  });

  describe('getFormatPrice', () => {
    it('should return correct price for purchasable formats', () => {
      expect(getFormatPrice('24x36')).toBe(500);
      expect(getFormatPrice('40x60')).toBe(1000);
      expect(getFormatPrice('80x120')).toBe(2000);
    });

    it('should return null for sur-demande formats', () => {
      expect(getFormatPrice('hors-format')).toBeNull();
      expect(getFormatPrice('monumental')).toBeNull();
    });
  });

  describe('isPurchasable', () => {
    it('should return true for formats with fixed prices', () => {
      expect(isPurchasable('24x36')).toBe(true);
      expect(isPurchasable('40x60')).toBe(true);
      expect(isPurchasable('80x120')).toBe(true);
    });

    it('should return false for sur-demande formats', () => {
      expect(isPurchasable('hors-format')).toBe(false);
      expect(isPurchasable('monumental')).toBe(false);
    });
  });
});

describe('pricing-calculator', () => {
  describe('getPrice', () => {
    it('should return fixed prices for standard formats', () => {
      expect(getPrice('24x36')).toBe(500);
      expect(getPrice('40x60')).toBe(1000);
      expect(getPrice('80x120')).toBe(2000);
    });

    it('should return null for hors-format and monumental', () => {
      expect(getPrice('hors-format')).toBeNull();
      expect(getPrice('monumental')).toBeNull();
    });
  });

  describe('CANONICAL_PRICES', () => {
    it('should only contain purchasable formats', () => {
      expect(Object.keys(CANONICAL_PRICES)).toEqual(['24x36', '40x60', '80x120']);
    });

    it('should match FORMATS prices', () => {
      for (const [format, price] of Object.entries(CANONICAL_PRICES)) {
        expect(FORMATS[format as PrintFormat].price).toBe(price);
      }
    });
  });

  describe('validatePrice', () => {
    it('should accept correct prices', () => {
      expect(validatePrice('24x36', 500)).toBe(true);
      expect(validatePrice('40x60', 1000)).toBe(true);
      expect(validatePrice('80x120', 2000)).toBe(true);
    });

    it('should reject incorrect prices', () => {
      expect(validatePrice('24x36', 499)).toBe(false);
      expect(validatePrice('40x60', 1001)).toBe(false);
      expect(validatePrice('80x120', 999)).toBe(false);
    });

    it('should reject unknown formats', () => {
      expect(validatePrice('hors-format', 5000)).toBe(false);
      expect(validatePrice('monumental', 10000)).toBe(false);
      expect(validatePrice('inexistant', 100)).toBe(false);
    });

    it('should tolerate floating point rounding (< 0.01)', () => {
      expect(validatePrice('24x36', 500.005)).toBe(true);
      expect(validatePrice('24x36', 499.995)).toBe(true);
    });
  });

  describe('formatPrice', () => {
    it('should format with euro sign and French spacing', () => {
      expect(formatPrice(500)).toMatch(/500.*€/);
      expect(formatPrice(1000)).toMatch(/1.*000.*€/);
      expect(formatPrice(2000)).toMatch(/2.*000.*€/);
    });

    it('should round to nearest euro', () => {
      const result = formatPrice(1500);
      expect(result).toMatch(/1.*500.*€/);
    });
  });
});
