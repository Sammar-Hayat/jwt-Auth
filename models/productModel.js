const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        company: {
            type: String,
        },
        code: {
            type: String,
        },
        name: {
            type: String,
        },
        price: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('product', productSchema)
