import {
  IStaycation,
  IStaycationSchema,
} from "./../staycation/staycation.interface";
import { Response } from "express";
import {
  IUserInput,
  IUserSchema,
  IProprietorApplicationSchema,
  IUser,
  IWishlistSchema,
  IUserVerificationInput,
  IUserVerificationSchema
} from "./user.interface";
import { IAuthSchema } from "../auth/auth.interface";
import User from "./schema/User.schema";
import Auth from "../auth/schema/Auth.schema";
import { logger, randomPassword, sendPassword } from "./../../utils";
import ProprietorApplication from "./schema/ProprietorApplication.schema";
import Staycation from "./../staycation/schema/Staycation.schema";
import Wishlist from "./schema/Wishlist.schema";
import { join } from "path";
import moment from "moment";
import PaymentService from "./../payment/payment.service";
import UserVerification from "./schema/UserVerification.schema";

let register = async (
  res: Response,
  u: IUserInput
): Promise<Response<{ success: boolean }>> => {
  try {
    let user: IUserSchema = new User({
      name: {
        fName: u.fName,
        mName: "",
        lName: u.lName,
        xName: "",
      },
      status: "active",
      identificationStat: "pending",
      approvedAsProprietorOn: "",
    });
    user.setImg("", u.email);
    user.save();

    // let newPassword = randomPassword()
    let auth: IAuthSchema = new Auth({
      userId: user.id,
      email: u.email,
      access: ["customer"],
    });
    auth.generateHash(u.password);
    auth.save();
    // sendPassword(u.email, newPassword)
    PaymentService.addCustomer(user.id, u, "");
    new Wishlist({ user: user.id, staycation: [] }).save();
    return res.status(201).json({ success: true });
  } catch (e: any) {
    logger("user.controller", "register", e.message, "USR-0001");
    return res.status(500).json({ code: "USR-0001" });
  }
};

let getUsersByAccess = async (
  res: Response,
  access: string,
  page: number,
  limit: number
): Promise<Response> => {
  try {
    let total = await Auth.countDocuments({ access }).exec();
    let auth: IAuthSchema[] = <IAuthSchema[]>(
      await Auth.find({ access }, { password: 0 })
        .populate({ path: "userId", select: "name status img" })
        .skip(page)
        .limit(limit)
        .exec()
    );
    return res.status(200).json({
      total,
      auth,
    });
  } catch (e: any) {
    logger("user.controller", "getUsersByAccess", e.message, "USR-0002");
    return res.status(500).json({ code: "USR-0002" });
  }
};

let getProprietorApplications = async (
  res: Response,
  page: number,
  limit: number,
  approvedAsProprietorOn?: string
): Promise<Response> => {
  try {
    let pipelineMatch = {};
    if (approvedAsProprietorOn === undefined) {
      pipelineMatch = {
        $or: [
          { "user.approvedAsProprietorOn": { $ne: "" } },
          { "user.approvedAsProprietorOn": "" },
        ],
      };
    } else {
      if (approvedAsProprietorOn === "true") {
        pipelineMatch = { "user.approvedAsProprietorOn": { $ne: "" } };
      } else {
        pipelineMatch = { "user.approvedAsProprietorOn": "" };
      }
    }

    let propApp = await ProprietorApplication.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $match: pipelineMatch,
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          "user.name": 1,
          "user.img": 1,
          "user.approvedAsProprietorOn": 1,
        },
      },
      {
        $facet: {
          paginatedResults: [{ $skip: page }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]).exec();
    return res.status(200).json(propApp);
  } catch (e: any) {
    logger(
      "user.controller",
      "getProprietorApplications",
      e.message,
      "USR-0003"
    );
    return res.status(500).json({ code: "USR-0003" });
  }
};

let setAsProprietor = async (
  res: Response,
  userId: string,
  staycationId: string,
  propAppId: string
): Promise<Response<{ success: boolean }>> => {
  try {
    await Auth.findOneAndUpdate(
      { userId },
      { $push: { access: "host" } }
    ).exec();
    await User.findByIdAndUpdate(userId, {
      $set: { approvedAsProprietorOn: new Date().toISOString() },
    }).exec();
    return res.status(200).json({ success: true });
  } catch (e: any) {
    logger("user.controller", "setAsProprietor", e.message, "USR-0004");
    return res.status(500).json({ code: "USR-0004" });
  }
};

let addAdmin = async (
  res: Response,
  u: any
): Promise<Response<{ success: boolean }>> => {
  try {
    let user: IUserSchema = new User({
      name: {
        fName: u.fName,
        mName: "",
        lName: u.lName,
        xName: "",
      },
      status: "active",
      identificationStat: "pending",
    });
    user.setImg(u.imgFile, u.email);
    user.save();

    let auth: IAuthSchema = new Auth({
      email: u.email,
      userId: user.id,
      access: ["admin"],
    });
    auth.generateHash(u.password);
    auth.save();

    sendPassword(u.email, u.password);
    return res.status(201).json({ success: true });
  } catch (e: any) {
    logger("user.controller", "addAdmin", e.message, "USR-0005");
    return res.status(500).json({ code: "USR-0005" });
  }
};

let getUserProfile = async (
  res: Response,
  _id: string
): Promise<
  Response<{ auth: { email: string; auth: string }; profile: IUser }>
> => {
  try {
    let auth: IAuthSchema = <IAuthSchema>(
      await Auth.findOne({ userId: _id }, { email: 1, access: 1 }).exec()
    );
    let user: IUserSchema = <IUserSchema>await User.findById(_id).exec();
    let prop: IStaycationSchema[] = <IStaycationSchema[]>(
      await Staycation.find({ host: _id }).exec()
    );
    return res.status(200).json({
      auth: {
        email: auth.email,
        access: auth.access,
      },
      profile: user.toJSON(),
      properties: prop,
    });
  } catch (e: any) {
    logger("user.controller", "getUserProfile", e.message, "USR-0006");
    return res.status(500).json({ code: "USR-0006" });
  }
};

let updateUserProfile = async (
  res: Response,
  profile: any,
  id: string
): Promise<Response<{ success: boolean }>> => {
  try {
    await User.findByIdAndUpdate(id, { $set: { ...profile } }).exec();
    return res.status(200).json({ success: true });
  } catch (e: any) {
    logger("user.controller", "updateUserProfile", e.message, "USR-0007");
    return res.status(500).json({ code: "USR-0007" });
  }
};

let getWishlistByUser = async (
  res: Response,
  user: string
): Promise<Response<IStaycation[]>> => {
  try {
    let wl: IWishlistSchema[] = <IWishlistSchema[]>(
      await Wishlist.find({ user }).populate("staycation").exec()
    );
    return res.status(200).json(wl);
  } catch (e: any) {
    logger("user.controller", "getWishlistByUser", e.message, "USR-0008");
    return res.status(500).json({ code: "USR-0008" });
  }
};

let getUserProfileImg = async (res: Response, id: string): Promise<any> => {
  try {
    let user: IUserSchema = <IUserSchema>await User.findById(id).exec();
    return res
      .setHeader("Content-Type", "image/*")
      .status(200)
      .sendFile(join(global.appRoot, `/uploads${user.img}`));
  } catch (e: any) {
    logger("user.controller", "getUserProfileImg", e.message, "USR-0009");
    return res.status(500).json({ code: "USR-0009" });
  }
};

let addToWishList = async (
  res: Response,
  user: string,
  staycation: string
): Promise<Response> => {
  try {
    await Wishlist.findOneAndUpdate({ user }, { $push: { staycation } });
    return res.status(201).json({ success: true });
  } catch (e: any) {
    logger("user.controller", "addToWishList", e.message, "USR-0010");
    return res.status(500).json({ code: "USR-0010" });
  }
};

let removeToWishlist = async (
  res: Response,
  user: string,
  staycation: string
): Promise<Response> => {
  try {
    await Wishlist.findOneAndUpdate({ user }, { $pull: { staycation } }).exec();
    return res.status(200).json({ success: true });
  } catch (e: any) {
    logger("user.controller", "removeToWishlist", e.message, "USR-0011");
    return res.status(500).json({ code: "USR-0011" });
  }
};

let checkWishList = async (
  res: Response,
  user: string,
  staycation: string
): Promise<Response> => {
  try {
    let wl: IWishlistSchema = <IWishlistSchema>(
      await Wishlist.findOne({ user, staycation }).exec()
    );
    if (!wl) return res.status(404).json({ code: "not-found" });
    return res.status(200).json({ success: true });
  } catch (e: any) {
    logger("user.controller", "checkWishlist", e.message, "USR-0012");
    return res.status(500).json({ code: "USR-0012" });
  }
};

let verificationUpdateProfile = async (
  res: Response,
  data: any,
  id: string
): Promise<Response<{ success: boolean }>> => {
  try {
    let updates: any;
    const options = { new: true };

    if (data.type === "name") {
      updates = {
        $set: {
          "name.fName": data.fName,
          "name.lName": data.lName,
        },
      };
    }

    if (data.type === "address") {
      updates = {
        $set: {
          "address.unit": data.unit,
          "address.street": data.street,
          "address.brgy": data.brgy,
          "address.city": data.city,
          "address.province": data.province,
          "address.country": data.country,
          "address.zip": data.zip,
        },
      };
    }
    if (data.type === "contact") {
      updates = { $set: { contact: data.contact } };
    }

    const updated = await User.findByIdAndUpdate(id, updates, options)
      .select("name address contact -_id")
      .exec();
    return res.status(200).json({ success: true, profile: updated });
  } catch (e: any) {
    logger(
      "user.controller",
      "verificationUpdateProfile",
      e.message,
      "USR-0013"
    );
    return res.status(500).json({ code: "USR-0007" });
  }
};

let uploadVerification = async (res: Response, data: IUserVerificationInput): Promise<Response> => {
  try {
    new UserVerification({ ...data }).save()
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('user.controller', 'uploadVerification', e.message, 'USR-0008')
    return res.status(500).json({ code: 'USR-0008' })
  }
}

let setUserVerificationStatus = async (res: Response, id: string, status: string): Promise<Response> => {
  try {
    await UserVerification.findByIdAndUpdate(id, { $set: { status } }).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('user.controller', 'setUserVerification', e.message, 'USR-0009')
    return res.status(500).json({ code: 'USR-0009' })
  }
}

let getUserIDVerification = async (res: Response, page: number, limit: number, name?: string): Promise<Response> => {
  try {
    let aggregate: any = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]
    if(name !== undefined) {
      aggregate.push({
        $match: { 'user.name.fName': { $regex: new RegExp(`${name}`), $options: 'imu' } }
      })
    }
    aggregate.push({
      $project: {
        _id: 1,
        user: 1,
        createdAt: 1,
        updatedAt: 1,
        'user.name': 1,
        'user.img': 1,
        status: 1
      }
    }, {
      $facet: {
        paginatedResults: [{ $skip: page }, { $limit: limit }],
        totalCount: [{ $count: 'count' }]
      }
    })
    let users = await UserVerification.aggregate(aggregate).exec()
    return res.status(200).json(users)
  } catch(e: any) {
    logger('user.controller', 'getUserIDVerification', e.message, 'USR-0010')
    return res.status(500).json({ code: 'USR-0010' })
  }
}

let getUserVerificationStatus = async (res: Response, user: string): Promise<Response> => {
  try {
    let userStat: IUserVerificationSchema = <IUserVerificationSchema>(await UserVerification.findOne({ user }).exec())
    if(!userStat) return res.status(404).json({ msg: 'User verification not found' })
    return res.status(200).json({ status: userStat.status })
  } catch(e: any) {
    logger('user.controller', 'getUserVerificationStatus', e.message, 'USR-0011')
    return res.status(500).json({ code: 'USR-0011' })
  }
}

const UserService = {
  register,
  getUsersByAccess,
  getProprietorApplications,
  setAsProprietor,
  addAdmin,
  getUserProfile,
  updateUserProfile,
  getWishlistByUser,
  getUserProfileImg,
  addToWishList,
  removeToWishlist,
  checkWishList,
  verificationUpdateProfile,
  uploadVerification,
  setUserVerificationStatus,
  getUserIDVerification,
  getUserVerificationStatus
};

export default UserService;
