const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// enterpriseUser Schema
const enterprise = new Schema(
    {
        enterpriseName:{
            type:String,
            trim:true,
            unique:true,
            required: true
        },
        accessToken: {
            type: String,
            trim: true,
            default:null
        }
    },
    { timestamps: true}
);

const Enterprise = mongoose.model("enterprise", enterprise);

module.exports = Enterprise;