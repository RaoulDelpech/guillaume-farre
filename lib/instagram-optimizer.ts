/**
 * Instagram Optimizer - Facade re-export
 *
 * @author Lalou
 */

export type { InstagramPost } from './instagram/types';
export { HASHTAG_STRATEGY, OPTIMAL_POSTING_TIMES, MARKET_TRENDS_2025 } from './instagram/data';
export { generateOptimizedInstagramPost } from './instagram/post-generator';
export { generate30DayInstagramStrategy } from './instagram/strategy';
