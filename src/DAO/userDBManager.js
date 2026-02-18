import userModel from "../model/User.Model.js"

class UserDBManager {
    //crear nuevo usuario
    async create(userData) {
        return await userModel.create(userData)
    }
    //buscar un usuario por email 
    async findByEmail(email){
        return await userModel.findOne({email: email})
    }
    //buscar usuario por id
    async findByID(id){
        return await userModel.findById(id)
    }
    //obtener todos los usuarios
    async getAllUsers(){
        return await userModel.find()
    }
    //actualizar usuario
    async updateUser(id, updateData){
        return await userModel.findByIdAndUpdate(id, updateData, {new: true})
    }
    //eliminar usuario 
    async deleteUser(id){
        return await userModel.findByIdAndDelete(id)
    }
}

export default UserDBManager