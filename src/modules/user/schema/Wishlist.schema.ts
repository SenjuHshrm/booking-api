import { Schema, Types, model } from 'mongoose'
import { IWishlistSchema } from '../user.interface'

let wishListSchema: Schema<IWishlistSchema> = new Schema<IWishlistSchema>({
  user: { type: Types.ObjectId, ref: 'user' },
  staycation: { type: [Types.ObjectId], ref: 'staycation' }
})

const Wishlist = model('wishlist', wishListSchema)

export default Wishlist