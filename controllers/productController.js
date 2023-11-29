const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')
const dotenv = require("dotenv");
// const constantFile = require('../constants')

const createData = asyncHandler(async (req, res) => {
    const data = await Product.create({ ...req.body })
    res.status(200).json({ message: 'Successfully Created' })
})

const getAll = asyncHandler(async (req, res) => {
    const perPage =
        req.query.perpage ||
        process.env.PERPAGE 
        // constantFile.constants.PERPAGE
    const pageNo = req.query.pageno || 1
    const count = await Product.countDocuments()
    const totalPage = Math.ceil(count / perPage)
    const findedData = await Product.find()
        .limit(perPage)
        .skip(perPage * (pageNo - 1))

    res.status(200).json({ data: findedData, count, totalPage })
})

const getOne = asyncHandler(async (req, res) => {
    const findData = await Product.findById(req.params.id)
    if (!findData) {
        res.status(404)
        throw new Error('Product not found')
    }
    res.status(200).json(findData)
})

const updateData = asyncHandler(async (req, res) => {
    const findData = await Product.findById(req.params.id)
    if (!findData) {
        res.status(404)
        throw new Error('Product not found')
    }

    if (Object.keys(req.body).length === 0) {
        res.status(400)
        throw new Error('Request body is empty')
    }

    const updatedProduct = Object.assign(findData, req.body)

    await updatedProduct.save()

    res.status(200).json({ message: 'Successfully Updated' })
})

const deleteData = asyncHandler(async (req, res) => {
    const findData = await Product.findById(req.params.id)
    if (!findData) {
        res.status(404)
        throw new Error('Product not found')
    }
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Successfully Deleted' })
})



module.exports = {
    createData,
    getAll,
    getOne,
    updateData,
    deleteData,
}
