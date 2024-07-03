import { Schema, Types, model } from 'mongoose';
import { IRecentLocationSearchSchema } from '../staycation.interface';


let recentLocSearchSchema: Schema<IRecentLocationSearchSchema> = new Schema<IRecentLocationSearchSchema>({
  user: { type: Types.ObjectId, ref: 'user' },
  recentSearches: [String]
})

const RecentLocationSearch = model('recent-loc-search', recentLocSearchSchema)

export default RecentLocationSearch