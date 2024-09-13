export interface PaginationParams {
  limit: number;
  offset: number;
}

const validatePaginationParams = (
  limit: string | null,
  page: string | null
): PaginationParams => {
  const validatedLimit: number =
    limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;
  const validatedPage: number =
    page && !isNaN(parseInt(page, 10)) ? parseInt(page, 10) : 1;
  const validatedOffset: number = (validatedPage - 1) * validatedLimit;
  return {
    limit: validatedLimit,
    offset: validatedOffset,
  };
};

export default validatePaginationParams;
