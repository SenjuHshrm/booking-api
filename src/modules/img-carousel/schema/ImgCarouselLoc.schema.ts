import { Schema, model } from 'mongoose'
import { IImageCarouselLocSchema } from '../img-carouse.interface'

let imgCarLoc: Schema<IImageCarouselLocSchema> = new Schema<IImageCarouselLocSchema>({
  img: { type: String, required: true },
  desc: { type: String, required: true },
  isActive: { type: Boolean, required: true }
}, {
  timestamps: true
})

const ImageCarouselLocation = model('img-carousel-location', imgCarLoc)

export default ImageCarouselLocation;