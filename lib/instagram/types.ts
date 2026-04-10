/**
 * Instagram Optimizer - Types
 *
 * @author Lalou
 */

export interface InstagramPost {
  visual: {
    type: 'reel' | 'carousel' | 'post';
    photoPath: string;
    additionalPhotos?: string[];
    coverImageIndex?: number;
    duration?: string;
    music?: string;
  };

  caption: {
    hook: string;
    body: string;
    callToAction: string;
    full: string;
  };

  hashtags: {
    primary: string[];
    secondary: string[];
    geo: string[];
    full: string;
  };

  timing: {
    bestDay: string;
    bestTime: string;
    timezone: string;
    reasoning: string;
  };

  predictions: {
    estimatedReach: string;
    estimatedEngagement: string;
    targetAudience: string;
    conversionPotential: 'élevé' | 'moyen' | 'faible';
  };

  engagementStrategy: {
    replyToComments: string;
    dmStrategy: string;
    storyFollowUp: string;
    crossPromotion: string;
  };

  technicalSpecs: {
    imageRatio: string;
    resolution: string;
    fileSize: string;
    filters: string;
    tips: string[];
  };
}
