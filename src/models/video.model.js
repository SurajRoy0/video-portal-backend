import mongoose, {Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // This Package is use to write aggregation queries

const videoSchema = new Schema({
        videoFile:{
            type: String, //Cloudinary url
            required: [true, "Video is required"]
        },
        thumbnail:{
            type: String, //Cloudinary url
            required: [true, "Thumbnail is required"]
        },
        title:{
            type: String, 
            required: [true, "Title is required"]
        },
        description:{
            type: String, 
            required: [true, "Description is required"]
        },
        duration:{
            type: Number, 
            required: [true, "Duration is required"]
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }
},{timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate) 

export const Video = mongoose.model("Video", videoSchema)