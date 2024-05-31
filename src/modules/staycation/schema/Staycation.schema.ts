import { Schema, model, Types } from 'mongoose'
import { 
  IStaycationSchema,
  IStaycationDiscountSchema,
  EPlaceType,
  EReservationConfirmation,
  EWelcomingGuest
} from '../staycation.interface'

let StaycationDiscountSchema: Schema<IStaycationDiscountSchema> = new Schema<IStaycationDiscountSchema>({
  percentage: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true }
})

let StaycationSchema: Schema<IStaycationSchema> = new Schema<IStaycationSchema>({
  host: { type: Types.ObjectId, ref: 'user' },
  name: { type: String, required: true },
  descriptionFilter: { type: [String], required: true },
  descriptionText: { type: [String], required: true },
  placeType: { type: String, enum: { values: Object.keys(EPlaceType) } },
  // location: {
  //   type: String,
  //   coordinates: []
  // },
  address: {
    country: { type: String, required: true },
    unit: String,
    street: { type: String, required: true },
    brgy: String,
    city: { type: String, required: true },
    province: { type: String, required: true },
    zip: { type: String, required: true }
  },
  details: Schema.Types.Mixed,
  amenities: [String],
  media: {
    cover: { type: String, required: true },
    imgs: { type: [String], required: true }
  },
  reservationConfirmation: { type: String, enum: { values: Object.keys(EReservationConfirmation) } },
  welcomingGuest: { type: String, enum: { values: Object.keys(EWelcomingGuest) } },
  price: {
    common: { type: Number, required: true },
    beforeTax: { type: Number, required: true }
  },
  discounts: [StaycationDiscountSchema],
  security: [String],
  isListed: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false }
}, {
  timestamps: true
})

const Staycation = model('staycation', StaycationSchema)

export default Staycation