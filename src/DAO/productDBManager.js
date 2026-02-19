import productModel from "../model/Product.model.js"

class ProductDBManager {

    async countProducts(filtro){
        return await productModel.countDocuments(filtro)
    }

    async getAllProducts({filtro, limit, skip, orden}) {
        return await productModel
            .find(filtro)
            .skip(skip)
            .limit(limit)
            .sort(orden)
            .lean()
    }

    async getProductsById(pid){
        return await productModel.findById(pid)
    }

    async getByCode(code){
        return await productModel.findOne({ code })
    }

    async create(product){
        return await productModel.create(product)
    }

    async update(pid, productUpdate){
        return await productModel.findByIdAndUpdate(
            pid, 
            productUpdate,
            { new: true }
        )
    }

    async delete(pid){
        return await productModel.findByIdAndDelete(pid)
    }

}

export default new ProductDBManager()
