/**
 * Tests unitaires pour pricing-calculator
 *
 * @author Lalou
 * @date 2025-11-08
 *
 * Tests complets des fonctions de calcul pricing
 */

import { describe, it, expect } from 'vitest';
import {
  calculatePrice,
  updateBasePrice,
  setManualPrice,
  clearManualPrice,
  updateMultiplier,
  formatPrice,
  calculatePercentageIncrease,
} from '../pricing-calculator';
import { DEFAULT_PRICING, type PricingConfig } from '../pricing-config';

describe('pricing-calculator', () => {
  describe('calculatePrice', () => {
    it('should calculate unlimited A4 price correctly', () => {
      const result = calculatePrice('unlimited', 'a4', DEFAULT_PRICING);

      expect(result.price).toBe(150); // 150 × 1.0
      expect(result.isManual).toBe(false);
      expect(result.multiplier).toBe(1.0);
      expect(result.basePrice).toBe(150);
    });

    it('should calculate unlimited A3 price correctly', () => {
      const result = calculatePrice('unlimited', 'a3', DEFAULT_PRICING);

      expect(result.price).toBe(251); // 150 × 1.67 = 250.5 → 251
      expect(result.isManual).toBe(false);
      expect(result.multiplier).toBe(1.67);
    });

    it('should calculate unlimited A2 price correctly', () => {
      const result = calculatePrice('unlimited', 'a2', DEFAULT_PRICING);

      expect(result.price).toBe(401); // 150 × 2.67 = 400.5 → 401
      expect(result.isManual).toBe(false);
    });

    it('should calculate limited A3 price correctly', () => {
      const result = calculatePrice('limited', 'a3', DEFAULT_PRICING);

      expect(result.price).toBe(1500); // 1500 × 1.0
      expect(result.isManual).toBe(false);
      expect(result.basePrice).toBe(1500);
    });

    it('should calculate limited A2 price correctly', () => {
      const result = calculatePrice('limited', 'a2', DEFAULT_PRICING);

      expect(result.price).toBe(2295); // 1500 × 1.53
      expect(result.isManual).toBe(false);
    });

    it('should calculate limited A1 price correctly', () => {
      const result = calculatePrice('limited', 'a1', DEFAULT_PRICING);

      expect(result.price).toBe(3000); // 1500 × 2.0
      expect(result.isManual).toBe(false);
    });

    it('should return manual price when override exists', () => {
      const config: PricingConfig = {
        ...DEFAULT_PRICING,
        manualPrices: {
          'unlimited-a4': 200,
        },
      };

      const result = calculatePrice('unlimited', 'a4', config);

      expect(result.price).toBe(200);
      expect(result.isManual).toBe(true);
      expect(result.multiplier).toBeUndefined();
    });
  });

  describe('updateBasePrice', () => {
    it('should update unlimited base price', () => {
      const newConfig = updateBasePrice('unlimited', 200, DEFAULT_PRICING);

      expect(newConfig.prixBaseUnlimited).toBe(200);
      expect(newConfig.prixBaseLimited).toBe(1500); // unchanged
    });

    it('should update limited base price', () => {
      const newConfig = updateBasePrice('limited', 2000, DEFAULT_PRICING);

      expect(newConfig.prixBaseLimited).toBe(2000);
      expect(newConfig.prixBaseUnlimited).toBe(150); // unchanged
    });

    it('should preserve manual prices when updating base', () => {
      const config: PricingConfig = {
        ...DEFAULT_PRICING,
        manualPrices: {
          'unlimited-a4': 200,
        },
      };

      const newConfig = updateBasePrice('unlimited', 300, config);

      expect(newConfig.manualPrices['unlimited-a4']).toBe(200); // preserved
    });

    it('should update lastUpdated timestamp', () => {
      const before = new Date().toISOString();
      const newConfig = updateBasePrice('unlimited', 200, DEFAULT_PRICING);
      const after = new Date().toISOString();

      expect(newConfig.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });

  describe('setManualPrice', () => {
    it('should set manual price for a format', () => {
      const newConfig = setManualPrice('unlimited-a4', 250, DEFAULT_PRICING);

      expect(newConfig.manualPrices['unlimited-a4']).toBe(250);
    });

    it('should preserve other manual prices', () => {
      const config: PricingConfig = {
        ...DEFAULT_PRICING,
        manualPrices: {
          'unlimited-a3': 300,
        },
      };

      const newConfig = setManualPrice('unlimited-a4', 250, config);

      expect(newConfig.manualPrices['unlimited-a3']).toBe(300);
      expect(newConfig.manualPrices['unlimited-a4']).toBe(250);
    });
  });

  describe('clearManualPrice', () => {
    it('should remove manual price override', () => {
      const config: PricingConfig = {
        ...DEFAULT_PRICING,
        manualPrices: {
          'unlimited-a4': 200,
        },
      };

      const newConfig = clearManualPrice('unlimited-a4', config);

      expect(newConfig.manualPrices['unlimited-a4']).toBeUndefined();
    });

    it('should preserve other manual prices', () => {
      const config: PricingConfig = {
        ...DEFAULT_PRICING,
        manualPrices: {
          'unlimited-a3': 300,
          'unlimited-a4': 200,
        },
      };

      const newConfig = clearManualPrice('unlimited-a4', config);

      expect(newConfig.manualPrices['unlimited-a3']).toBe(300);
      expect(newConfig.manualPrices['unlimited-a4']).toBeUndefined();
    });
  });

  describe('updateMultiplier', () => {
    it('should update unlimited multiplier', () => {
      const newConfig = updateMultiplier('unlimited', 'a3', 2.0, DEFAULT_PRICING);

      expect(newConfig.multipliersUnlimited.a3).toBe(2.0);
    });

    it('should update limited multiplier', () => {
      const newConfig = updateMultiplier('limited', 'a2', 1.8, DEFAULT_PRICING);

      expect(newConfig.multipliersLimited.a2).toBe(1.8);
    });

    it('should preserve other multipliers', () => {
      const newConfig = updateMultiplier('unlimited', 'a3', 2.0, DEFAULT_PRICING);

      expect(newConfig.multipliersUnlimited.a4).toBe(1.0); // unchanged
      expect(newConfig.multipliersUnlimited.a2).toBe(2.67); // unchanged
    });
  });

  describe('formatPrice', () => {
    it('should format price with French spacing', () => {
      expect(formatPrice(150)).toBe('150 €');
      expect(formatPrice(1500)).toBe('1 500 €');
      expect(formatPrice(10500)).toBe('10 500 €');
      expect(formatPrice(100000)).toBe('100 000 €');
    });

    it('should round to nearest euro', () => {
      expect(formatPrice(150.4)).toBe('150 €');
      expect(formatPrice(150.6)).toBe('151 €');
    });
  });

  describe('calculatePercentageIncrease', () => {
    it('should calculate percentage increase correctly', () => {
      expect(calculatePercentageIncrease(100, 150)).toBe(50);
      expect(calculatePercentageIncrease(100, 200)).toBe(100);
      expect(calculatePercentageIncrease(150, 250)).toBe(67); // rounded
    });

    it('should handle same base and target', () => {
      expect(calculatePercentageIncrease(100, 100)).toBe(0);
    });

    it('should handle zero base', () => {
      expect(calculatePercentageIncrease(0, 100)).toBe(0);
    });
  });

  describe('integration tests', () => {
    it('should correctly handle full pricing workflow', () => {
      // Start with default config
      let config = { ...DEFAULT_PRICING };

      // Update base price
      config = updateBasePrice('unlimited', 200, config);
      expect(config.prixBaseUnlimited).toBe(200);

      // Calculate new price (should use new base)
      let result = calculatePrice('unlimited', 'a3', config);
      expect(result.price).toBe(334); // 200 × 1.67

      // Set manual override
      config = setManualPrice('unlimited-a3', 400, config);
      result = calculatePrice('unlimited', 'a3', config);
      expect(result.price).toBe(400);
      expect(result.isManual).toBe(true);

      // Update base again (manual should persist)
      config = updateBasePrice('unlimited', 300, config);
      result = calculatePrice('unlimited', 'a3', config);
      expect(result.price).toBe(400); // still manual

      // Clear manual override
      config = clearManualPrice('unlimited-a3', config);
      result = calculatePrice('unlimited', 'a3', config);
      expect(result.price).toBe(501); // 300 × 1.67
      expect(result.isManual).toBe(false);
    });

    it('should respect Peter Lik pricing strategy', () => {
      // Limited should be ~10x more expensive than unlimited
      const unlimitedA3 = calculatePrice('unlimited', 'a3', DEFAULT_PRICING);
      const limitedA3 = calculatePrice('limited', 'a3', DEFAULT_PRICING);

      const ratio = limitedA3.price / unlimitedA3.price;
      expect(ratio).toBeGreaterThan(5); // at least 5x more expensive
    });
  });
});
