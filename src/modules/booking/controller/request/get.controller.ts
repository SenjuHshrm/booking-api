import { Request, Response, Router } from "express";
import { PaginationParams } from "modules/booking/booking.interface";
import BookingService from "../../booking.service";
import passport from "passport";

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

const getBookingRoutes: Router = Router().get(
  "/list/:id/:page/:limit/:type",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => {
    const { limit, offset } = validatePaginationParams(
      req.params.limit,
      req.params.page
    );

    return BookingService.getBookingByType(
      res,
      req.params.type,
      limit,
      offset,
      <string>req.query?.search,
      req.params.id
    );
  }
);

export default getBookingRoutes;
