import { CreditCardType } from '@types';

export function formatCreditCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  const formatted = [];
  for (let i = 0; i < cleaned.length; i += 4) {
    formatted.push(cleaned.substring(i, i + 4));
  }
  return formatted.join(' ');
}

export function formatExpirationDate(expirationDate: string): string {
  if (expirationDate.length === 4) {
    return `${expirationDate.substring(0, 2)}/${expirationDate.substring(2, 4)}`;
  }
  return expirationDate;
}

export function formatCVC(cvc: string): string {
  return cvc.replace(/\D/g, '').substring(0, 3);
}

export function getCardTypeFromNumber(cardNumber: string): CreditCardType {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.startsWith('4')) return 'Visa';
  if (cleaned.startsWith('51') || cleaned.startsWith('52') || cleaned.startsWith('53') || cleaned.startsWith('54') || cleaned.startsWith('55')) return 'MasterCard';
  if (cleaned.startsWith('37') || cleaned.startsWith('34')) return 'AmericanExpress';
  if (cleaned.startsWith('38')) return 'DinersClub';
  return 'Unknown';
}
