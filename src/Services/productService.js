import mongoose from "mongoose";
import ProductDBManager from "../DAO/productDBManager.js";
import ProductDTO from "../DTO/productDTO.js";

const productDTO = ProductDTO
const productDAO = ProductDBManager

class productServices {
    async getAllProducts(queryParams) {
        const { query, limit = 5, page = 1, sort } = queryParams
        let filtro = {} //aca creamos el array del filtro
        if (query) {
            filtro.category = query
        }
        const limitNum = Number(limit);
        const pageNum = Number(page);
        const totalProductos = await productDAO.countProducts(filtro)
        const totalPages = Math.ceil(totalProductos / limitNum) // con ceil, redondeamos para arriba, con floor, corta para abajo, mientras que con round redonde normal

        const hasPrevPage = pageNum > 1;
        const hasNextPage = pageNum < totalPages

        const prevPage = hasPrevPage ? pageNum - 1 : null;
        const nextPage = hasNextPage ? pageNum + 1 : null;


        const baseUrl = `/api/products?limit=${limitNum}`

        const prevLink = hasPrevPage ? `${baseUrl}&page=${prevPage}` : null;
        const nextLink = hasNextPage ? `${baseUrl}&page=${nextPage}` : null;

        let orden = {}
        if (sort === "asc") {
            orden.price = 1
        }
        if (sort === "desc") {
            orden.price = -1
        }
        const skip = (pageNum - 1) * limitNum
        const productos = await productDAO.getAllProducts({
            filtro,
            limit: limitNum,
            skip,
            orden
        })
        const productosFormateados = productos.map(
            p => new productDTO(p)
        )
        return {
            productos: productosFormateados,
            totalPages,
            prevPage,
            nextPage,
            page: pageNum,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        }
    }

    async getProductsById(pid) {
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            const error = new Error("ID invalido")
            error.status = 400
            throw error
        }
        const product = await productDAO.getProductsById(pid)
        if (!product) {
            const error = new Error("no existe el id")
            error.status = 404
            throw error
        }
        return new productDTO(product)
    }

    async createProduct(product) {
        const { title, price, code, description, category } = product
        if (!title || price === undefined || !code || !description || !category) {
            const error = new Error("campos incompletos")
            error.status = 400
            throw error
        }
        const productExistente = await productDAO.getByCode(code)
        if (productExistente) {
            const error = new Error("el product ya existe")
            error.status = 400
            throw error
        }
        const newProduct = await productDAO.create({
            title,
            price,
            code,
            description,
            category
        })
        return new productDTO(newProduct)
    }

    async updateProduct(pid, productUpdate) {
        delete productUpdate._id
        const product = await productDAO.update(pid, productUpdate)
        if (!product) {
            const error = new Error("El producto con ese id no existe")
            error.status = 404
            throw error
        }
        return new productDTO(product)
    }

    async deleteProduct(pid) {
        const productDeleted = await productDAO.delete(pid)
        if (!productDeleted) {
            const error = new Error("el id no existe")
            error.status = 404
            throw error
        }
        return new productDTO(productDeleted)
    }
}

export default new productServices