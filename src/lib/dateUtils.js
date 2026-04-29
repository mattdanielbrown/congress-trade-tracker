import { isAfter, parseISO } from 'date-fns';

/**
 * The current term for the 118th Congress started on Jan 3, 2023.
 * Only trades after this date are relevant for the current term filter.
 */
const CURRENT_TERM_START = '2023-01-03';

export const DateUtils = {
  /**
   * Checks if a given trade date falls within the current congressional term.
   * @param {string|Date} tradeDate - The date of the transaction.
   * @returns {boolean} True if the trade is within the current term.
   */
  isCurrentTerm: (tradeDate) => {
    if (!tradeDate) return false;
    
    const parsedDate = typeof tradeDate === 'string' ? parseISO(tradeDate) : tradeDate;
    const termStartDate = parseISO(CURRENT_TERM_START);
    
    return isAfter(parsedDate, termStartDate);
  },

  /**
   * Formats a date string to a standard YYYY-MM-DD.
   */
  formatStandardDate: (dateString) => {
    try {
      const d = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return d.toISOString().split('T')[0];
    } catch (e) {
      return dateString;
    }
  }
};
