<<<<<<< HEAD
// Función para cargar el nombre del cliente desde sessionStorage
function cargarInformacionCliente() {
    const clienteGuardado = sessionStorage.getItem('clienteSeleccionado');
    
    // Si no hay cliente guardado Y estamos en producción (no en desarrollo local)
    if (!clienteGuardado && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // Guardamos una bandera para evitar redirecciones infinitas
        if (!sessionStorage.getItem('redireccionando')) {
            sessionStorage.setItem('redireccionando', 'true');
            window.location.href = '/presupuestos';
            return;
        } else {
            sessionStorage.removeItem('redireccionando');
            return;
        }
    }

    const cliente = JSON.parse(clienteGuardado);
    const nombreClienteSpan = document.getElementById('nombre-cliente-formulario');
    if (nombreClienteSpan) {
        nombreClienteSpan.textContent = cliente.nombre;
    }
}

// Inicialización segura
document.addEventListener('DOMContentLoaded', () => {
    if (typeof requireAuth === 'function' && !requireAuth()) {
        return;
    }
    cargarInformacionCliente();
=======
document.addEventListener('DOMContentLoaded', async () => {
    // Elementos del DOM
    const contenedorPDVs = document.getElementById('contenedor-pdvs');
    const agregarPDVBtn = document.getElementById('agregar-pdv-manual');
    
    let materiales = [];

    // Cargar materiales al iniciar
    async function cargarMateriales() {
        try {
            const response = await window.apiService.getMaterialesPresupuesto();
            materiales = response.data || [];
            console.log('Materiales cargados:', materiales);
            
            // Actualizar todos los selects existentes con los materiales
            actualizarSelectsMateriales();
        } catch (error) {
            console.error('Error al cargar materiales:', error);
            mostrarError('Error al cargar los materiales');
        }
    }

    // Función para actualizar los selects con los materiales
    function actualizarSelectsMateriales() {
        const selects = document.querySelectorAll('.material');
        selects.forEach(select => {
            // Guardar el valor seleccionado actualmente
            const valorActual = select.value;
            
            // Limpiar el select excepto la primera opción
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Agregar los materiales
            materiales.forEach(material => {
                const option = document.createElement('option');
                option.value = material.id;
                option.textContent = material.nombre;
                select.appendChild(option);
            });
            
            // Restaurar el valor seleccionado si existe
            if (valorActual) {
                select.value = valorActual;
            }
        });
    }

    // Función para mostrar error
    function mostrarError(mensaje) {
        const div = document.createElement('div');
        div.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
        div.textContent = mensaje;
        contenedorPDVs.prepend(div);
    }

    // Event Listeners
    agregarPDVBtn.addEventListener('click', () => {
        // Cuando se agrega un nuevo PDV, actualizar los selects
        setTimeout(actualizarSelectsMateriales, 0);
    });

    // Inicializar
    await cargarMateriales();
>>>>>>> bcd6a41bece50b3fabbf1477829843c3f653401b
}); 