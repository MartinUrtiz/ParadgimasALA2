"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
let tareas = [];
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function leerEntrada(pregunta) {
    return new Promise(resolve => rl.question(pregunta, (respuesta) => resolve(respuesta.trim())));
}
function buscarTareaPorId(id) {
    return tareas.find(t => t.id === id);
}
function mostrarTarea(t) {
    const estrellas = '⭐'.repeat(t.dificultad);
    console.log(`ID: ${t.id} | ${t.titulo} [${t.estado}] | Dificultad: ${estrellas}`);
    if (t.descripcion)
        console.log(`   Descripción: ${t.descripcion}`);
    console.log(`   Creación: ${t.fechaCreacion.toLocaleString()}`);
    if (t.vencimiento)
        console.log(`   Vencimiento: ${t.vencimiento.toLocaleString()}`);
}
async function crearTarea() {
    const titulo = await leerEntrada('Título de la tarea: ');
    const descripcion = await leerEntrada('Descripción (opcional): ');
    const vencimiento = await leerEntrada('Vencimiento (YYYY-MM-DD HH:MM, opcional): ');
    const dificultad = await leerEntrada('Dificultad (1=Fácil, 2=Medio, 3=Difícil, default=1): ');
    const nuevaTarea = {
        id: tareas.length + 1,
        titulo,
        descripcion: descripcion || '',
        estado: 'pendiente',
        fechaCreacion: new Date(),
        vencimiento: vencimiento ? new Date(vencimiento) : null,
        dificultad: dificultad ? parseInt(dificultad) : 1
    };
    tareas.push(nuevaTarea);
    console.log('✅ Tarea creada correctamente!');
}
function listarTareas() {
    console.log('\n--- LISTA DE TAREAS ---');
    if (tareas.length === 0) {
        console.log('No hay tareas cargadas.');
        return;
    }
    tareas.forEach(mostrarTarea);
}
async function cambiarEstado() {
    const idStr = await leerEntrada('Ingresa el ID de la tarea: ');
    const id = parseInt(idStr);
    const tarea = buscarTareaPorId(id);
    if (!tarea) {
        console.log('❌ ID no encontrado');
        return;
    }
    console.log('Estados posibles: pendiente, en curso, terminada, cancelada');
    const nuevoEstado = await leerEntrada('Nuevo estado: ');
    const estadosValidos = ['pendiente', 'en curso', 'terminada', 'cancelada'];
    if (estadosValidos.includes(nuevoEstado)) {
        tarea.estado = nuevoEstado;
        console.log('✅ Estado actualizado!');
    }
    else {
        console.log('❌ Estado no válido');
    }
}
async function eliminarTarea() {
    const idStr = await leerEntrada('Ingresa el ID de la tarea a eliminar: ');
    const id = parseInt(idStr);
    const indice = tareas.findIndex(t => t.id === id);
    if (indice !== -1) {
        tareas.splice(indice, 1);
        console.log('🗑️ Tarea eliminada!');
    }
    else {
        console.log('❌ ID no encontrado');
    }
}
async function mostrarMenu() {
    console.log('\n--- TO-DO LIST ---');
    console.log('1. Crear tarea');
    console.log('2. Listar tareas');
    console.log('3. Cambiar estado de tarea');
    console.log('4. Eliminar tarea');
    console.log('5. Salir');
    const opcion = await leerEntrada('Elige una opción: ');
    switch (opcion) {
        case '1':
            await crearTarea();
            break;
        case '2':
            listarTareas();
            break;
        case '3':
            await cambiarEstado();
            break;
        case '4':
            await eliminarTarea();
            break;
        case '5':
            console.log('Adiós!');
            rl.close();
            process.exit(0);
        default:
            console.log('Opción no válida');
    }
    await mostrarMenu();
}
mostrarMenu();
