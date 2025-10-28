import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// inicializamos los IDs únicos
export const inicializadorIDs = (productosArray) => {
    return productosArray.map(p => {
        if (p.id === "uuidv4()") {
            return {
                ...p,
                id: uuidv4()
            }
        }
        return p;
    });
};

// ruta absoluta del archivo
const rutaProductos = path.resolve(process.cwd(), 'productos.json');

//  nueva función: leer los productos
export const leerProductos = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(rutaProductos, 'utf-8', (err, data) => {
            if (err) {
                console.log("Error al leer productos:", err);
                reject(err);
                return;
            }

            try {
                const productosCrudos = JSON.parse(data);
                const productosInicializados = inicializadorIDs(productosCrudos);
                resolve(productosInicializados);
            } catch (error) {
                console.log("Error al parsear los productos:", error);
                reject(error);
            }
        });
    });
};

// Guardar productos
export const guardarProductos = (productosArray) => {
    const dataJson = JSON.stringify(productosArray, null, 2);
    fs.writeFile(rutaProductos, dataJson, 'utf-8', (err) => {
        if (err) {
            console.log("Error al guardar los productos:", err);
            return;
        }
        console.log("Productos guardados correctamente");
    });
};


