const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mentionedTweetsSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique:true
    },
    id_str: {
        type: String,
        required: true,
    },
    in_reply_to_status_id: {
        type: String,
        default: null
    },
    created_at: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    user: {
        type:Object,
        screen_name: {
            type: String
        },
        name: {
            type: String
        },
        profile_image_url: {
            type: String
        },
        location: {
            type: String
        },
        description: {
            type: String
        },
        followers_count: {
            type: String
        }
    },
    enterprise: {
        type:Schema.Types.ObjectId,
        ref:'enterprise'
    }
})

const MentionedTweets = mongoose.model('mentionedTweet', mentionedTweetsSchema)

module.exports = MentionedTweets