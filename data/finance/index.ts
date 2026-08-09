/**
 * data/finance/index.ts
 *
 * Data access layer for financial opportunities — loans, subsidies,
 * insurance schemes, pension plans, etc.
 *
 * This is a separate category from general welfare schemes because
 * financial products often have specific regulatory and eligibility contexts.
 */

// Financial schemes use the GovernmentScheme type with category="finance"
// A separate FinancialProduct type may be introduced in a future phase.

export const FINANCE_CATEGORY_NOTE = `
  Financial opportunities are stored as GovernmentScheme records
  with category set to "finance" or related sub-categories.
  Access them via data/schemes/index.ts with a category filter.
  A dedicated FinancialProduct type will be introduced when needed.
`;
