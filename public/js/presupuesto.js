// Variables globales
if (typeof window.materialesDisponibles === 'undefined') {
    window.materialesDisponibles = {};
}
if (typeof window.todosLosClientes === 'undefined') {
    window.todosLosClientes = [];
}
if (typeof window.clienteSeleccionado === 'undefined') {
    window.clienteSeleccionado = null;
}
if (typeof window.currentPage === 'undefined') {
    window.currentPage = 1;
}
if (typeof window.isLoading === 'undefined') {
    window.isLoading = false;
}

// Función simple para hacer peticiones
async function fetchData(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Error en la petición');
    }
    return response;
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Verificar autenticación al cargar
if (!isAuthenticated()) {
    window.location.href = '/login';
}

// Esperar a que auth.js esté cargado
async function initializeApp() {
    if (typeof requireAuth !== 'function') {
        console.error('requireAuth no está definido. Asegúrate de que auth.js está cargado.');
        return;
    }

    if (!requireAuth()) return;

    try {
        await cargarMateriales();
        await cargarClientes();
        
        // Solo inicializar los elementos si estamos en la página correcta
        const inputBuscador = document.getElementById('buscador-cliente');
        if (inputBuscador) {
            initializeBuscador();
        }
    } catch (error) {
        console.error('Error en la inicialización:', error);
    }
}

function initializeBuscador() {
    const inputBuscador = document.getElementById('buscador-cliente');
    const sugerenciasUl = document.getElementById('sugerencias-clientes');
    const nombreClienteSpan = document.getElementById('nombre-cliente');
    const infoCliente = document.getElementById('info-cliente');

    if (!inputBuscador || !sugerenciasUl) return;

    // Autocompletado
    inputBuscador.addEventListener('input', () => {
        const termino = inputBuscador.value.toLowerCase();
        sugerenciasUl.innerHTML = '';

        if (!termino) {
            sugerenciasUl.classList.add('hidden');
            return;
        }

        const filtrados = window.todosLosClientes.filter(c =>
            c.Account_Name?.toLowerCase?.().includes(termino) ||
            c.Account_Name?.name?.toLowerCase?.().includes(termino)
        );

        if (filtrados.length === 0) {
            sugerenciasUl.classList.add('hidden');
            return;
        }

        filtrados.slice(0, 10).forEach(cliente => {
            const li = document.createElement('li');
            li.textContent = cliente.Account_Name?.name || cliente.Account_Name || 'Nombre desconocido';
            li.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer';

            li.addEventListener('click', async () => {
                clienteSeleccionado = cliente;
                inputBuscador.value = li.textContent;
                sugerenciasUl.classList.add('hidden');
                if (nombreClienteSpan) {
                    nombreClienteSpan.textContent = li.textContent;
                }

<<<<<<< HEAD
                // Guardar información del cliente en sessionStorage
                sessionStorage.setItem('clienteSeleccionado', JSON.stringify({
                    id: cliente.id,
                    nombre: li.textContent,
                    Account_Name: cliente.Account_Name
                }));

                // Mostrar OTs del cliente seleccionado
                currentPage = 1;
                await cargarOTsDelCliente(cliente);
                
=======
>>>>>>> bcd6a41bece50b3fabbf1477829843c3f653401b
                // Actualizar el filtro activo
                const filtroActivo = document.getElementById('filtro-activo');
                const nombreClienteFiltro = document.getElementById('nombre-cliente-filtro');
                if (filtroActivo && nombreClienteFiltro) {
                    nombreClienteFiltro.textContent = li.textContent;
                    filtroActivo.classList.remove('hidden');
                }
            });

            sugerenciasUl.appendChild(li);
        });

        sugerenciasUl.classList.remove('hidden');
    });
}

<<<<<<< HEAD
async function cargarTodasLasOTs(append = false) {
    const listaOTs = document.getElementById('lista-ots');
    if (!listaOTs) return;

    try {
        window.spinner.show();
        
        const res = await fetchWithAuth('/api/recogerModuloZoho?modulo=OTs');
        if (!res.ok) throw new Error('Error al cargar OTs');
        const data = await res.json();
        console.log('Datos de OTs recibidos:', data);

        listaOTs.innerHTML = '';

        if (data.proveedores && data.proveedores.length > 0) {
            data.proveedores.forEach(ot => {
                const card = document.createElement('div');
                card.className = 'bg-white p-6 rounded-lg shadow-md border border-gray-200';
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-lg font-semibold text-gray-900">${ot.Deal_Name || 'OT sin nombre'}</h2>
                        <span class="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded">${ot.C_digo || 'Sin código'}</span>
                    </div>
                    <div class="space-y-2 text-sm text-gray-600">
                        <p><span class="font-medium">Cliente:</span> ${ot.Account_Name?.name || 'Sin cliente'}</p>
                        <p><span class="font-medium">Estado:</span> ${ot.Stage || 'Sin estado'}</p>
                        <p><span class="font-medium">Firma:</span> ${ot.Firma || 'Sin firma'}</p>
                    </div>
                    <div class="mt-4 flex justify-end">
                        <a href="/presupuesto/${ot.C_digo}" class="text-red-700 hover:text-red-800 font-medium">
                            Ver detalles →
                        </a>
                    </div>
                `;
                listaOTs.appendChild(card);
            });
        } else {
            listaOTs.innerHTML = '<div class="col-span-full text-center text-gray-500">No hay OTs disponibles</div>';
        }
    } catch (err) {
        console.error('Error al cargar OTs:', err);
        listaOTs.innerHTML = '<div class="col-span-full text-center text-red-500">Error al cargar las OTs</div>';
    } finally {
        window.spinner.hide();
    }
}

async function cargarOTsDelCliente(cliente) {
    const listaOTs = document.getElementById('lista-ots');
    if (!listaOTs) return;

    try {
        window.spinner.show();
        
        const criteria = `Account_Name.id:equals:${cliente.id}`;
        const res = await fetchWithAuth(`/api/recogerModuloZoho?modulo=OTs&criteria=${encodeURIComponent(criteria)}`);
        if (!res.ok) throw new Error('Error al cargar OTs');
        const data = await res.json();
        console.log('Datos de OTs del cliente recibidos:', data);

        listaOTs.innerHTML = '';

        if (data.proveedores && data.proveedores.length > 0) {
            data.proveedores.forEach(ot => {
                const card = document.createElement('div');
                card.className = 'bg-white p-6 rounded-lg shadow-md border border-gray-200';
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-lg font-semibold text-gray-900">${ot.Deal_Name || 'OT sin nombre'}</h2>
                        <span class="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded">${ot.C_digo || 'Sin código'}</span>
                    </div>
                    <div class="space-y-2 text-sm text-gray-600">
                        <p><span class="font-medium">Cliente:</span> ${ot.Account_Name?.name || 'Sin cliente'}</p>
                        <p><span class="font-medium">Estado:</span> ${ot.Stage || 'Sin estado'}</p>
                        <p><span class="font-medium">Firma:</span> ${ot.Firma || 'Sin firma'}</p>
                    </div>
                    <div class="mt-4 flex justify-end">
                        <a href="/presupuesto/${ot.C_digo}" class="text-red-700 hover:text-red-800 font-medium">
                            Ver detalles →
                        </a>
                    </div>
                `;
                listaOTs.appendChild(card);
            });
        } else {
            listaOTs.innerHTML = '<div class="col-span-full text-center text-gray-500">Este cliente no tiene OTs registradas</div>';
        }
    } catch (err) {
        console.error('Error al cargar OTs del cliente:', err);
        listaOTs.innerHTML = '<div class="col-span-full text-center text-red-500">Error al cargar las OTs</div>';
    } finally {
        window.spinner.hide();
    }
}

async function cargarMasOTs() {
    if (clienteSeleccionado) {
        await cargarOTsDelCliente(clienteSeleccionado, true);
    } else {
        await cargarTodasLasOTs(true);
    }
}

async function cargarClientes() {
    try {
        const res = await fetchWithAuth('/api/recogerModuloZoho?modulo=Clientes');
        if (!res.ok) throw new Error('Error al cargar clientes');
        const json = await res.json();
        window.todosLosClientes = json.proveedores || [];
    } catch (err) {
        console.error('Error al cargar clientes:', err);
        window.todosLosClientes = [];
=======
async function cargarClientes() {
    try {
        const res = await fetchData('/api/recogerModuloZoho?modulo=Accounts');
        const data = await res.json();
        todosLosClientes = data.proveedores || [];
    } catch (err) {
        console.error('Error al cargar clientes:', err);
>>>>>>> bcd6a41bece50b3fabbf1477829843c3f653401b
    }
}

async function cargarMateriales() {
    try {
<<<<<<< HEAD
        const res = await fetchWithAuth('/api/materialesPresupuesto');
        if (!res.ok) throw new Error('Error al cargar materiales');
        const data = await res.json();
        console.log('Datos de materiales recibidos:', data);

        // Convertimos a diccionario: { nombre: precio }
        window.materialesDisponibles = {};
        if (data.materiales && Array.isArray(data.materiales)) {
            data.materiales.forEach(material => {
                if (material.nombre && material.importe !== undefined) {
                    window.materialesDisponibles[material.nombre] = material.importe;
                }
            });
        }
        console.log('Materiales disponibles:', window.materialesDisponibles);

        // Actualizar todos los selectores de materiales existentes
        document.querySelectorAll('select[data-tipo="material"]').forEach(select => {
            actualizarSelectorMateriales(select);
        });
    } catch (error) {
        console.error('Error al cargar materiales:', error);
        window.materialesDisponibles = {
            "Vinilo ácido": 12.5,
            "Foam 5mm": 7.2,
            "Metacrilato": 15.0
        };
    }
}

function actualizarSelectorMateriales(select) {
    // Guardar el valor seleccionado actualmente
    const valorActual = select.value;
    
    // Limpiar opciones existentes
    select.innerHTML = '<option value="">Seleccionar</option>';
    
    // Añadir nuevas opciones
    Object.keys(window.materialesDisponibles).forEach(nombreMaterial => {
        const option = document.createElement('option');
        option.value = nombreMaterial;
        option.textContent = nombreMaterial;
        select.appendChild(option);
    });
    
    // Restaurar el valor seleccionado si existía
    if (valorActual && window.materialesDisponibles[valorActual]) {
        select.value = valorActual;
    }
}

// Botón "Generar PDF"
document.getElementById('generar-pdf')?.addEventListener('click', async () => {
    const data = {
        codigoOT: document.querySelector('p strong')?.nextSibling?.textContent?.trim(), // código OT
        puntos_de_venta: []
    };

    document.querySelectorAll('table').forEach((table, index) => {
        const pdvName = document.querySelectorAll('h2')[index]?.textContent.replace('PDV: ', '').trim();
        const rows = table.querySelectorAll('tbody tr');
        const elementos = [];

        rows.forEach(row => {
            const inputs = row.querySelectorAll('input, select');

            // Verifica si los inputs numéricos tienen valores válidos
            const isValid = [...inputs].every(input => {
                if (input.type === 'number' && input.value !== '') {
                    return !isNaN(parseFloat(input.value));
                }
                return true; // si no es number, se ignora
            });

            if (!isValid) {
                alert('Por favor, asegúrate de que todos los campos numéricos contengan valores válidos.');
                throw new Error('Valores no numéricos detectados');
            }

            elementos.push({
                foto: inputs[0]?.value || '',
                concepto: inputs[1]?.value || '',
                alto: inputs[2]?.value || '',
                ancho: inputs[3]?.value || '',
                material: inputs[4]?.value || '',
                precioMP: inputs[5]?.value || '',
                precioUnitario: inputs[6]?.value || '',
                unidades: inputs[7]?.value || '',
                total: inputs[8]?.value || '',
                totalEscaparate: inputs[9]?.value || '',
                montaje: inputs[10]?.value || ''
            });
        });

        data.puntos_de_venta.push({
            nombre: pdvName,
            elementos
        });
    });

    try {
        const response = await fetchWithAuth('/api/generar-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error al generar PDF');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Forzar descarga del PDF
        const a = document.createElement('a');
        a.href = url;
        a.download = `Presupuesto_${data.codigoOT}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        alert('Ocurrió un error al generar el PDF');
        console.error(err);
    }
});

const views = {
    buscador: document.getElementById('view-buscador'),
    formularioExistente: document.getElementById('formulario-ot-existente'),
    formularioNueva: document.getElementById('formulario-nueva-ot'),
};

=======
        const res = await fetchData('/api/materialesPresupuesto');
        const data = await res.json();
        materialesDisponibles = data;
    } catch (err) {
        console.error('Error al cargar materiales:', err);
    }
}

>>>>>>> bcd6a41bece50b3fabbf1477829843c3f653401b
function ocultarTodasLasVistas() {
    document.querySelectorAll('.vista').forEach(vista => {
        vista.classList.add('hidden');
    });
}

function mostrarVista(nombre) {
    ocultarTodasLasVistas();
    const vista = document.getElementById(`vista-${nombre}`);
    if (vista) {
        vista.classList.remove('hidden');
    }
}

function inicializarBotonesAddRow() {
    document.querySelectorAll('.add-row').forEach(button => {
        button.addEventListener('click', handleAddRow);
    });
}

function handleAddRow(event) {
    const button = event.target;
    const tableId = button.dataset.table;
    const table = document.getElementById(tableId);
    if (!table) return;

    const tbody = table.querySelector('tbody');
<<<<<<< HEAD
    const newRow = document.createElement('tr');
    newRow.classList.add('border-b', 'text-center');

    newRow.innerHTML = `
        <td class="p-2"><select class="w-full p-1.5 border border-gray-300 rounded"><option value="">Seleccionar</option></select></td>
        <td class="p-2"><input type="number" placeholder="Alto" step="any" class="w-16 p-1.5 border rounded text-sm"></td>
        <td class="p-2"><input type="number" placeholder="Ancho" step="any" class="w-16 p-1.5 border rounded text-sm"></td>
        <td class="p-2"><select class="w-full p-1.5 border border-gray-300 rounded" data-tipo="material"><option value="">Seleccionar</option></select></td>
        <td class="p-2"><input type="number" class="w-20 p-1.5 border rounded" placeholder="MP" readonly></td>
        <td class="p-2"><input type="number" class="w-20 p-1.5 border rounded" placeholder="Unitario"></td>
        <td class="p-2"><input type="number" placeholder="Unidades" class="w-16 p-1.5 border rounded text-sm"></td>
        <td class="p-2"><input type="number" class="w-20 p-1.5 border rounded" placeholder="Total"></td>
    `;

    // Configurar el selector de materiales
    const selectMaterial = newRow.querySelector('select[data-tipo="material"]');
    const inputPrecioMP = newRow.querySelectorAll('input[type="number"]')[3]; // El cuarto input es el de Precio/M.Prima

    actualizarSelectorMateriales(selectMaterial);

    // Evento para actualizar el precio cuando se selecciona un material
    selectMaterial.addEventListener('change', () => {
        const material = selectMaterial.value;
        const precio = window.materialesDisponibles[material];
        inputPrecioMP.value = precio !== undefined ? precio : '';
=======
    const newRow = tbody.rows[0].cloneNode(true);
    
    // Limpiar valores
    newRow.querySelectorAll('input, select').forEach(input => {
        if (input.type === 'number') {
            input.value = '0';
        } else if (input.type === 'text') {
            input.value = '';
        } else if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        }
>>>>>>> bcd6a41bece50b3fabbf1477829843c3f653401b
    });

    tbody.appendChild(newRow);
}

