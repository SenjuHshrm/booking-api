import { Response } from "express";
import Booking from "./schema/Booking.schema";
import {
  IBookingSchema,
  IBookingInput,
  IBookingPayment,
  IBookingCancellationSchema,
} from "./booking.interface";
import { logger } from "./../../utils/logger.util";
import Transaction from "./../payment/schema/Transaction.schema";
import moment from "moment";
import mongoose from "mongoose";
import BookingCancellation from "./schema/BookingCancellation.schema";
import BookingGuest from "./schema/BookingGuest.schema";

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
  type: string,
  limit: number,
  offset: number,
  keyword: string,
  initiatedBy: string
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
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "host",
                foreignField: "_id",
                as: "host",
              },
            },
            {
              $unwind: "$host",
            },
            {
              $project: {
                _id: 1,
                host: {
                  _id: 1,
                  name: 1,
                },
                descriptionFilter: 1,
                placeType: 1,
                maxBooking: 1,
                address: 1,
                landmark: 1,
                cover: 1,
                name: 1,
                bedroomList: 1,
              },
            },
          ],
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
        status: 1,
        duration: 1,
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
        $and: [
          { "initiatedBy._id": new mongoose.Types.ObjectId(initiatedBy) },
          { status: type },
        ],
      },
    };

    if (keyword) {
      filter.$match.$and.push({
        "bookTo.name": new RegExp(`${keyword}`, "imu"),
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
        status: 1,
        duration: 1,
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
        $and: [
          { "bookTo.host": new mongoose.Types.ObjectId(hostId) },
          { status: type },
        ],
      },
    };

    if (keyword) {
      filter.$match.$and.push({
        "initiatedBy.fullName": new RegExp(`${keyword}`, "imu"),
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

let requestCancellation = async (
  res: Response,
  id: string,
  reason: string
): Promise<Response> => {
  try {
    new BookingCancellation({ booking: id, reason, status: "pending" }).save();
    return res.status(201).json({ success: true });
  } catch (e: any) {
    logger("booking.controller", "requestCancellation", e.message, "BKNG-0007");
    return res.status(500).json({ code: "BKNG-0007" });
  }
};

let updateCancelRequest = async (
  res: Response,
  booking: string
): Promise<Response> => {
  try {
    await Booking.findByIdAndUpdate(booking, {
      $set: { status: "cancelled" },
    }).exec();
    await BookingCancellation.findOneAndUpdate(
      { booking },
      { $set: { status: "cancelled" } }
    ).exec();
    return res.status(200).json({ success: true });
  } catch (e: any) {
    logger("booking.controller", "updateCancelRequest", e.message, "BKNG-0008");
    return res.status(500).json({ code: "BKNG-0008" });
  }
};

let addGuest = async (
  res: Response,
  booking: string,
  data: any
): Promise<Response> => {
  try {
    new BookingGuest({ ...data, booking }).save();
    return res.status(201).json({ success: true });
  } catch (e: any) {
    logger("booking.controller", "updateCancelRequest", e.message, "BKNG-0009");
    return res.status(500).json({ code: "BKNG-0009" });
  }
};

let updateBookStatus = async (
  res: Response,
  booking: string,
  status: string
): Promise<Response> => {
  try {
    await Booking.findByIdAndUpdate(booking, { $set: { status } }).exec();
    return res.status(201).json({ success: true });
  } catch (e: any) {
    logger("booking.controller", "updateCancelRequest", e.message, "BKNG-0010");
    return res.status(500).json({ code: "BKNG-0010" });
  }
};

let checkOutGuest = async (
  res: Response,
  id: string,
  checkOutDate: string,
  checkOutTime: string
): Promise<Response> => {
  try {
    await BookingGuest.findByIdAndUpdate(id, {
      $set: { checkOutDate, checkOutTime },
    }).exec();
    return res.status(200).json({ success: true });
  } catch (e: any) {
    logger("booking.controller", "updateCancelRequest", e.message, "BKNG-0011");
    return res.status(500).json({ code: "BKNG-0011" });
  }
};

let listGuestFromBooking = async (
  res: Response,
  booking: string
): Promise<Response> => {
  try {
    let list = await BookingGuest.find({ booking }).exec();
    return res.status(200).json(list);
  } catch (e: any) {
    logger(
      "booking.controller",
      "listGuestFromBooking",
      e.message,
      "BKNG-0012"
    );
    return res.status(500).json({ code: "BKNG-0012" });
  }
};

let guestCancelBooking = async (
  res: Response,
  authId: string,
  bookingId: string,
  reason?: string
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ msg: "Invalid booking ID." });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      initiatedBy: authId,
    }).exec();
    if (!booking) return res.status(400).json({ msg: "Booking not found." });

    if (booking.status === "for_approval") {
      return updateBookStatus(res, booking._id, "cancelled");
    }

    if (["upcoming", "arriving"].includes(booking.status) && reason) {
      const request = await BookingCancellation.findOne({
        booking: booking._id,
      }).exec();
      if (request)
        return res.status(400).json({
          msg: "A cancellation request has already been submitted. Please wait for the host's approval.",
        });

      return requestCancellation(res, booking._id, reason);
    }

    return res.status(400).json({ msg: "Booking cannot be cancelled." });
  } catch (e: any) {
    logger("booking.controller", "cancelBooking", e.message, "BKNG-0013");
    return res.status(500).json({ code: "BKNG-0013" });
  }
};

let checkInOutBooking = async (
  res: Response,
  bookingId: string,
  authId: string,
  status: string
) => {
  try {
    if (!["current_guest", "check_out"].includes(status))
      return res.status(400).json({
        msg: "The provided booking status is invalid for check-in/check-out operations.",
      });

    if (!mongoose.Types.ObjectId.isValid(bookingId))
      return res.status(400).json({ msg: "Invalid booking ID" });

    const statusFilter =
      status === "current_guest" ? "arriving" : "current_guest";

    const bookPromise: Promise<IBookingSchema> = <Promise<IBookingSchema>>(
      Booking.findOne({ _id: bookingId, status: statusFilter })
        .populate("bookTo")
        .exec()
    );

    const guestsPromise: Promise<number> = <Promise<number>>(
      BookingGuest.countDocuments({
        booking: bookingId,
      }).exec()
    );
    const [book, guests] = await Promise.all([bookPromise, guestsPromise]);

    if (!book) return res.status(400).json({ msg: "Booking not found." });
    if (!new mongoose.Types.ObjectId(authId).equals(book.bookTo?.host))
      return res.status(400).json({
        msg: "Access denied: You are not authorized to change the status of this booking. Please contact an administrator if you believe this is an error.",
      });

    if (guests < 1)
      return res.status(400).json({
        msg: "The guest list for this booking is currently empty. Please add guests before proceeding.",
      });

    if (status === "check_out") {
      const checkedOutGuests: number = await BookingGuest.countDocuments({
        booking: bookingId,
        checkOutDate: { $exists: true, $ne: "" },
      }).exec();

      if (checkedOutGuests !== guests) {
        return res.status(400).json({
          msg: "Not all guests for this booking have checked out. Please ensure all guests have checked out before completing the booking check-out process.",
        });
      }
    }

    const filter = { _id: book._id };
    let updates: any = { $set: {} };

    const currentTime = moment().format("HH:mm");
    const currentDate = moment().format("MM/DD/YYYY");

    if (status === "current_guest") {
      updates.$set.checkInTime = currentTime;
      updates.$set.checkInDate = currentDate;
    }

    if (status === "check_out") {
      updates.$set.checkOutTime = currentTime;
      updates.$set.checkOutDate = currentDate;
    }

    await Booking.updateOne(filter, updates).exec();
    return updateBookStatus(res, book._id, status);
  } catch (e: any) {
    logger("booking.controller", "checkInOutBooking", e.message, "BKNG-0014");
    return res.status(500).json({ code: "BKNG-0014" });
  }
};

let getCancelledRequest = async (
  res: Response,
  limit: number,
  offset: number,
  keyword: string,
  hostId: string
) => {
  try {
    const populatedFields = [
      {
        $lookup: {
          from: "booking-cancellations",
          localField: "_id",
          foreignField: "booking",
          as: "cancel",
        },
      },
      {
        $unwind: "$cancel",
      },
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
        status: 1,
        duration: 1,
        details: 1,
        transaction: 1,
        isCancelled: 1,
        cancellationPolicy: 1,
        isApproved: 1,
        createdAt: 1,
        cancel: 1,
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
    logger("booking.controller", "getCancelledRequest", e.message, "BKNG-0015");
    return res.status(500).json({ code: "BKNG-0015" });
  }
};

let approveDenyCancellation = async (
  res: Response,
  cancelId: string,
  bookingId: string,
  authId: string,
  action: string
) => {
  try {
    // if (!["approve", "deny"].includes(action))
    //   return res.status(400).json({
    //     msg: "The provided action is invalid for approve/deny operations.",
    //   });

    if (!mongoose.Types.ObjectId.isValid(cancelId))
      return res.status(400).json({ msg: "Invalid cancellation request ID" });

    if (!mongoose.Types.ObjectId.isValid(bookingId))
      return res.status(400).json({ msg: "Invalid booking ID" });

    const bookPromise: Promise<IBookingSchema> = <Promise<IBookingSchema>>(
      Booking.findOne({ _id: bookingId }).populate("bookTo").exec()
    );

    const cancelPromise: Promise<IBookingCancellationSchema> = <
      Promise<IBookingCancellationSchema>
    >BookingCancellation.findOne({ _id: cancelId, booking: bookingId }).exec();

    const [book, cancel] = await Promise.all([bookPromise, cancelPromise]);

    if (!book) return res.status(400).json({ msg: "Booking not found." });
    if (!cancel)
      return res.status(400).json({ msg: "Cancellation request not found." });

    if (!new mongoose.Types.ObjectId(authId).equals(book.bookTo?.host))
      return res.status(400).json({
        msg: "Access denied: You are not authorized to change the status of this booking. Please contact an administrator if you believe this is an error.",
      });

    const cancelUpdates = {
      $set: { status: action === "approve" ? "approved" : "denied" },
    };

    const bookingUpdates = {
      $set: { status: action === "approve" ? "cancelled" : "upcoming" },
    };

    await BookingCancellation.updateOne({ _id: cancel._id }, cancelUpdates);
    await Booking.updateOne({ _id: book._id }, bookingUpdates);

    return res.json({
      cancelStatus: action === "approve" ? "approved" : "denied",
    });
  } catch (e: any) {
    logger(
      "booking.controller",
      "approveDenyCancellation",
      e.message,
      "BKNG-0016"
    );
    return res.status(500).json({ code: "BKNG-0015" });
  }
};

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
  checkOutGuest,
  listGuestFromBooking,
  guestCancelBooking,
  checkInOutBooking,
  getCancelledRequest,
  approveDenyCancellation,
};

export default BookingService;
