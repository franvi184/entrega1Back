/* import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import path from "path"
import { json } from "stream/consumers"

export const inicializadorIDs = (carritosArray) => {
    return carritosArray.map(c => {
        if (c.id === "uuidv4()") {
            return {
                ...c,
                id: uuidv4()
            }
        }
        return c;
    });
};

const rutaCarritos = path.resolve(process.cwd(), 'carrito.json')

export const leerCarritos = () => {
    return new Promise((res, rej) => {
        fs.readFile(rutaCarritos, 'utf-8', (err, data) => {
            if(err){
                if(err.code === 'ENOENT'){
                    console.log("se crea un carrito vacio porque no existia")
                    fs.writeFileSync(rutaCarritos, JSON.stringify([], null, 2))
                    res([]);
                    return;
                }
                console.log("error al leer carritos", err)
                rej(err);
                return;
            }
            try {
                console.log("antes de parsear", data)
                const carrito = JSON.parse(data)
                res(carrito)
            }
            catch (err){
                console.log("error al parsear", err)
                rej(err)
            }
        })
    })
}




export const guardarCarritos = (carritosArray) => {
    const dataJson = JSON.stringify(carritosArray, null, 2);
    fs.writeFile(rutaCarritos, dataJson, 'utf-8', (err) => {
        if (err) {
            console.log("Error al guardar los carritos:", err);
            return;
        }
        console.log("Carritos guardados correctamente");
    });
};

// 🔹 Crear un nuevo carrito (opcional helper)
export const crearCarrito = async () => {
    const carritos = await leerCarritos();
    const nuevoCarrito = { id: uuidv4(), products: [] };

    carritos.push(nuevoCarrito);
    await guardarCarritos(carritos);

    return nuevoCarrito;
}; */