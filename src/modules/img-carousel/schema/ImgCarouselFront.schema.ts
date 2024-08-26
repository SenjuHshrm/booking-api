import { Schema, model } from 'mongoose'
import { IImageCarouselFrontSchema } from '../img-carouse.interface'

let imgCarFr: Schema<IImageCarouselFrontSchema> = new Schema<IImageCarouselFrontSchema>({
  img: { type: String, required: true },
  isActive: { type: Boolean, required: true }
}, {
  timestamps: true
})

const ImageCarouselFront = model('img-carousel-loc', imgCarFr)

export default ImageCarouselFront;