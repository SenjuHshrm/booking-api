import { Schema, model } from 'mongoose'
import { IGlobalStaticSchema, EStaticType } from '../global-static.interface'

let GlobalStaticSchema: Schema<IGlobalStaticSchema> = new Schema<IGlobalStaticSchema>({
  type: { type: String, enum: { values: Object.keys(EStaticType) } },
  values: [Schema.Types.Mixed]
})

const GlobalStatic = model('global-static', GlobalStaticSchema)

export default GlobalStatic