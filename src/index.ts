import * as readline from 'readline';

interface Tarea {
    id: number;
    titulo: string;
    descripcion: string;
    estado: 'pendiente' | 'en curso' | 'terminada' | 'cancelada';
    fechaCreacion: Date;
    vencimiento: Date | null;
    dificultad: number;
}

let tareas: Tarea[] = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function leerEntrada(pregunta: string): Promise<string> {
    return new Promise(resolve => rl.question(pregunta, (respuesta) => resolve(respuesta.trim())));
}

function buscarTareaPorId(id: number): Tarea | undefined {
    return tareas.find(t => t.id === id);
}

function mostrarTarea(t: Tarea): void {
    const estrellas = '⭐'.repeat(t.dificultad);
    console.log(`ID: ${t.id} | ${t.titulo} [${t.estado}] | Dificultad: ${estrellas}`);
    if (t.descripcion) console.log(`   Descripción: ${t.descripcion}`);
    console.log(`   Creación: ${t.fechaCreacion.toLocaleString()}`);
    if (t.vencimiento) console.log(`   Vencimiento: ${t.vencimiento.toLocaleString()}`);
}

async function crearTarea(): Promise<void> {
    const titulo = await leerEntrada('Título de la tarea: ');
    const descripcion = await leerEntrada('Descripción (opcional): ');
    const vencimiento = await leerEntrada('Vencimiento (YYYY-MM-DD HH:MM, opcional): ');
    const dificultad = await leerEntrada('Dificultad (1=Fácil, 2=Medio, 3=Difícil, default=1): ');

    const nuevaTarea: Tarea = {
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

function listarTareas(): void {
    console.log('\n--- LISTA DE TAREAS ---');
    if (tareas.length === 0) {
        console.log('No hay tareas cargadas.');
        return;
    }

    tareas.forEach(mostrarTarea);
}

async function cambiarEstado(): Promise<void> {
    const idStr = await leerEntrada('Ingresa el ID de la tarea: ');
    const id = parseInt(idStr);
    const tarea = buscarTareaPorId(id);

    if (!tarea) {
        console.log('❌ ID no encontrado');
        return;
    }

    console.log('Estados posibles: pendiente, en curso, terminada, cancelada');
    const nuevoEstado = await leerEntrada('Nuevo estado: ') as Tarea['estado'];
    const estadosValidos: Tarea['estado'][] = ['pendiente', 'en curso', 'terminada', 'cancelada'];

    if (estadosValidos.includes(nuevoEstado)) {
        tarea.estado = nuevoEstado;
        console.log('✅ Estado actualizado!');
    } else {
        console.log('❌ Estado no válido');
    }
}

async function eliminarTarea(): Promise<void> {
    const idStr = await leerEntrada('Ingresa el ID de la tarea a eliminar: ');
    const id = parseInt(idStr);
    const indice = tareas.findIndex(t => t.id === id);

    if (indice !== -1) {
        tareas.splice(indice, 1);
        console.log('🗑️ Tarea eliminada!');
    } else {
        console.log('❌ ID no encontrado');
    }
}

async function mostrarMenu(): Promise<void> {
    console.log('\n--- TO-DO LIST ---');
    console.log('1. Crear tarea');
    console.log('2. Listar tareas');
    console.log('3. Cambiar estado de tarea');
    console.log('4. Eliminar tarea');
    console.log('5. Salir');

    const opcion = await leerEntrada('Elige una opción: ');

    switch (opcion) {
        case '1': await crearTarea(); break;
        case '2': listarTareas(); break;
        case '3': await cambiarEstado(); break;
        case '4': await eliminarTarea(); break;
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