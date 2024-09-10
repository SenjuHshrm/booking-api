import { PaginationParams } from "modules/booking/booking.interface";

const validatePaginationParams = (
  limit: string,
  page: string
): PaginationParams => {
  const validatedLimit: number = parseInt(limit, 10) || 10;
  const validatedPage: number = parseInt(page, 10) || 1;
  const validatedOffset: number = (validatedPage - 1) * validatedLimit;
  return {
    limit: validatedLimit,
    offset: validatedOffset,
  };
};

export default validatePaginationParams;
