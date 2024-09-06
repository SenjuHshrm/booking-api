import { Response } from "express";
import Booking from "./schema/Booking.schema";
import {
  IBookingSchema,
  IBookingInput,
  IBookingPayment,
} from "./booking.interface";
import { logger } from "./../../utils/logger.util";
import Transaction from "./../payment/schema/Transaction.schema";
import moment from "moment";
import mongoose from "mongoose";
import BookingCancellation from "./schema/BookingCancellation.schema";
import BookingGuest from './schema/BookingGuest.schema'

let addBooking = async (
  res: Response,
  data: IBookingInput
): Promise<Response> => {
  try {
    new Booking({ ...data }).save();
    return res.status(201).json({ success: true });
  } catch (e: any) {
    logger("booking.controller", "addBooking", e.message, "BKNG-0001");
    return res.status(500).json({ code: "BKNG-0001" });
  }
};

let addPaymentToBooking = async (
  res: Response,
  id: string,
  data: IBookingPayment
): Promise<Response> => {
  try {
    await Booking.findByIdAndUpdate(id, {
      $push: { payment: { ...data } },
    }).exec();
    return res.status(201).json({ success: true });
  } catch (e: any) {
    logger("booking.controller", "addPaymentToBooking", e.message, "BKNG-0002");
    return res.status(500).json({ code: "BKNG-0002" });
  }
};

let listBookingByGuestId = async (
  res: Response,
  id: string
): Promise<Response> => {
  try {
    let total = await Booking.countDocuments({ initiatedBy: id }).exec();
    let bookings: IBookingSchema[] = <IBookingSchema[]>(
      await Booking.find({ initiatedBy: id })
        .populate({ path: "bookTo", select: "_id name cover" })
        .exec()
    );
    return res.status(200).json({ total, bookings });
  } catch (e: any) {
    logger(
      "booking.controller",
      "listBookingByGuestId",
      e.message,
      "BKNG-0003"
    );
    return res.status(500).json({ code: "BKNG-0003" });
  }
};

let listAllBookingsByHost = async (
  res: Response,
  id: string
): Promise<Response> => {
  try {
    let total = await Booking.countDocuments({ bookTo: id }).exec();
    let bookings: IBookingSchema[] = <IBookingSchema[]>(
      await Booking.find({ bookTo: id })
        .populate({ path: "initiatedBy", select: "_id name img" })
        .exec()
    );
    return res.status(200).json({ total, bookings });
  } catch (e: any) {
    logger(
      "booking.controller",
      "listAllBookingsByHost",
      e.message,
      "BKNG-0004"
    );
    return res.status(500).json({ code: "BKNG-0004" });
  }
};

let removeBooking = async (res: Response, id: string): Promise<Response> => {
  try {
    await Booking.findByIdAndDelete(id).exec();
    return res.status(200).json({ success: true });
  } catch (e: any) {
    logger("booking.controller", "removeBooking", e.message, "BKNG-0005");
    return res.status(500).json({ code: "BKNG-0005" });
  }
};

let getBookingDetails = async (
  res: Response,
  id: string
): Promise<Response> => {
  try {
    let booking: IBookingSchema = <IBookingSchema>await Booking.findById(id)
      .populate([
        { path: "initiatedBy", select: "_id name img" },
        { path: "bookTo", select: "_id name cover" },
      ])
      .exec();
    return res.status(200).json(booking);
  } catch (e: any) {
    logger("booking.controller", "getBookingDetails", e.message, "BKNG-0006");
    return res.status(500).json({ code: "BKNG-0006" });
  }
};

let tempBooking = async (
  res: Response,
  data: IBookingInput,
  trn: any
): Promise<Response> => {
  try {
    let newTrn = await new Transaction({ ...trn }).save();
    new Booking({ ...data, transaction: newTrn.id }).save();
    return res.status(201).json({ success: true });
  } catch (e: any) {
    logger("booking.controller", "tempBooking", e.message, "BKNG-0007");
    return res.status(500).json({ code: "BKNG-0007" });
  }
};

let getBookingByType = async (
  res: Response,
  type: string,
  limit: number,
  offset: number,
  keyword: string,
  hostId: string
): Promise<Response> => {
  try {
    const populatedFields = [
      {
        $lookup: {
          from: "users",
          localField: "initiatedBy",
          foreignField: "_id",
          as: "initiatedBy",
        },
      },
      {
        $unwind: "$initiatedBy",
      },
      {
        $lookup: {
          from: "staycations",
          localField: "bookTo",
          foreignField: "_id",
          as: "bookTo",
        },
      },
      {
        $unwind: "$bookTo",
      },
      {
        $lookup: {
          from: "transactions",
          localField: "transaction",
          foreignField: "_id",
          as: "transaction",
        },
      },
      {
        $unwind: "$transaction",
      },
    ];

    const addFullname = {
      $addFields: {
        fullName: {
          $concat: [
            "$initiatedBy.name.fName",
            " ",
            {
              $cond: {
                if: {
                  $and: [
                    {
                      $ne: ["$initiatedBy.name.mName", ""],
                    },
                    {
                      $ne: ["$initiatedBy.name.mName", null],
                    },
                  ],
                },
                then: {
                  $concat: [
                    {
                      $substrCP: ["$initiatedBy.name.mName", 0, 1],
                    },
                    ". ",
                  ],
                },
                else: "",
              },
            },
            "$initiatedBy.name.lName",
            {
              $cond: {
                if: {
                  $ne: ["$initiatedBy.name.xName", ""],
                },
                then: {
                  $concat: [", ", "$initiatedBy.name.xName"],
                },
                else: "",
              },
            },
          ],
        },
      },
    };

    const project = {
      $project: {
        _id: 1,
        initiatedBy: {
          _id: 1,
          img: 1,
          fullName: "$fullName",
          contact: 1,
        },
        bookTo: 1,
        arrivalDate: 1,
        details: 1,
        transaction: 1,
        isCancelled: 1,
        cancellationPolicy: 1,
        isApproved: 1,
        createdAt: 1,
      },
    };

    const sort = {
      $sort: {
        createdAt: -1,
      },
    };

    const skipper = {
      $skip: offset,
    };

    const limiter = {
      $limit: limit,
    };

    let filter: any = {
      $match: {
        $and: [{ "bookTo.host": new mongoose.Types.ObjectId(hostId) }],
      },
    };

    if (keyword) {
      filter.$match.$and.push({
        "initiatedBy.fullName": new RegExp(`${keyword}`, "imu"),
      });
    }

    if (type === "for_approval") {
      const sevenDaysAgo = moment().subtract(7, "days").startOf("day").toDate();
      const today = moment().endOf("day").toDate();
      filter.$match.$and.push(
        ...[
          {
            status: type,
          },
          {
            createdAt: {
              $gte: sevenDaysAgo,
              $lte: today,
            },
          },
        ]
      );
    }

    if (type === "upcoming") {
      const startOfMonth = moment().startOf("month").toDate();
      const endOfMonth = moment().endOf("month").toDate();
      const startOfToday = moment().startOf("day").toDate();
      const endOfToday = moment().endOf("day").toDate();
      filter.$match.$and.push(
        ...[
          {
            status: type,
          },
          {
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth,
              $not: {
                $gte: startOfToday,
                $lte: endOfToday,
              },
            },
          },
        ]
      );
    }

    if (type === "arriving") {
      const startOfToday = moment().startOf("day").toDate();
      const endOfToday = moment().endOf("day").toDate();
      filter.$match.$and.push(
        ...[
          {
            status: type,
          },
          {
            createdAt: {
              $gte: startOfToday,
              $lte: endOfToday,
            },
          },
        ]
      );
    }

    if (type === "current_guest") {
      filter.$match.$and.push(
        ...[
          {
            isApproved: true,
          },
          { checkInDate: { $exists: true } },
          { checkOutDate: { $exists: false } },
        ]
      );
    }

    if (type === "check_out") {
      filter.$match.$and.push(
        ...[
          {
            isApproved: true,
          },
          { checkInDate: { $exists: true } },
          { checkOutDate: { $exists: true } },
        ]
      );
    }

    if (type === "pending") {
      const sevenDaysAgo = moment().subtract(7, "days").startOf("day").toDate();
      filter.$match.$and.push(
        ...[
          {
            status: 'for_approval',
          },
          {
            createdAt: {
              $lt: sevenDaysAgo,
            },
          },
        ]
      );
    }

    if (type === "cancelled") {
      filter.$match.$and.push({
        isCancelled: true,
        status: type
      });
    }

    const count: any = await Booking.aggregate([
      ...populatedFields,
      addFullname,
      project,
      filter,
      { $count: "totalCount" },
    ]).exec();

    const bookings = await Booking.aggregate([
      ...populatedFields,
      addFullname,
      project,
      filter,
      sort,
      skipper,
      limiter,
    ]).exec();

    return res.json({
      bookings,
      totalCount: count.length > 0 ? count[0].totalCount : 0,
    });
  } catch (e: any) {
    logger("booking.controller", "bookingByTyoe", e.message, "BKNG-0008");
    return res.status(500).json({ code: "BKNG-0007" });
  }
};

let requestCancellation = async (res: Response, id: string, reason: string): Promise<Response> => {
  try {
    new BookingCancellation({ booking: id, reason, status: 'pending' }).save()
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('booking.controller', 'requestCancellation', e.message, 'BKNG-0007')
    return res.status(500).json({ code: "BKNG-0007" })
  }
}

let updateCancelRequest = async (res: Response, booking: string): Promise<Response> => {
  try {
    await Booking.findByIdAndUpdate(booking, { $set: { status: 'cancelled' } }).exec()
    await BookingCancellation.findOneAndUpdate({ booking }, { $set: { status: 'cancelled' } }).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('booking.controller', 'updateCancelRequest', e.message, 'BKNG-0008')
    return res.status(500).json({ code: 'BKNG-0008' })
  }
}

let addGuest = async (res: Response, booking: string, data: any): Promise<Response> => {
  try {
    new BookingGuest({ ...data, booking }).save()
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('booking.controller', 'updateCancelRequest', e.message, 'BKNG-0009')
    return res.status(500).json({ code: 'BKNG-0009' })
  }
}

let updateBookStatus = async (res: Response, booking: string, status: string): Promise<Response> => {
  try {
    await Booking.findByIdAndUpdate(booking, { $set: { status } }).exec()
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('booking.controller', 'updateCancelRequest', e.message, 'BKNG-0010')
    return res.status(500).json({ code: 'BKNG-0010' })
  }
}

let checkOutGuest = async (res: Response, id: string, checkOutDate: string, checkOutTime: string): Promise<Response> => {
  try {
    await BookingGuest.findByIdAndUpdate(id, { $set: { checkOutDate, checkOutTime } }).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('booking.controller', 'updateCancelRequest', e.message, 'BKNG-0011')
    return res.status(500).json({ code: 'BKNG-0011' })
  }
}

const BookingService = {
  addBooking,
  addPaymentToBooking,
  listBookingByGuestId,
  listAllBookingsByHost,
  removeBooking,
  getBookingDetails,
  tempBooking,
  getBookingByType,
  requestCancellation,
  updateCancelRequest,
  addGuest,
  updateBookStatus,
  checkOutGuest
};

export default BookingService;
