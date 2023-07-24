import { model, Schema } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
    },
    slug: {
        type: String,
        lowecase: true,
    },

})

export default model('category', categorySchema);