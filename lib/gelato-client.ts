/**
 * Client pour l'API Gelato (impression à la demande)
 *
 * @author Lalou
 */

export type { GelatoConfig, GelatoProduct, GelatoRecipient, GelatoOrderItem, GelatoOrder, GelatoOrderResponse } from './gelato/types';
export { GelatoClient, initGelatoClient, getGelatoClient } from './gelato/client';

// Lalou
