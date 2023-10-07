
import mongoose from "mongoose"

const BeachSchema = new mongoose.Schema({
    beachName: {
        type: String,
        required: true
    },
    capabilityToSwim: {
        type: Boolean,
        required: true
    },
    capabilityToDrink: {
        type: Boolean,
        required: true
    },
    species: [
        {
          type: String,
          required: true,
        },
      ],
    city:{
        type:String,
        required:true
    },
    photos: [
        {
          type: String,
          required: true,
        },
      ],
    tips:{
        type:String,
        required:true
    }

}, {
    timestamps: true
})


const BeachModel = mongoose.models.Beach || mongoose.model('Beach', BeachSchema)

export default BeachModel
