/**
 * Générateur de PDF manuel (certificat d'authenticité + contrat de vente)
 *
 * Orchestrateur — logique dans ./pdf/
 *
 * @author Lalou
 */

export type { CertificateData, SaleContractData } from './pdf/types';
export { generateCertificatePDF } from './pdf/certificate';
export { generateSaleContractPDF } from './pdf/sale-contract';

// Lalou
