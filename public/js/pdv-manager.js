class PDVManager {
    constructor() {
        this.materialesDisponibles = {};
        // Esperamos a que el DOM esté listo antes de inicializar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeEventListeners();
                this.cargarMateriales();
            });
        } else {
            this.initializeEventListeners();
            this.cargarMateriales();
        }
    }

    initializeEventListeners() {
        // Botón para agregar nuevo PDV
        const btnAgregarPDV = document.getElementById('agregar-pdv-manual');
        if (btnAgregarPDV) {
            btnAgregarPDV.addEventListener('click', (e) => {
                e.preventDefault();
                this.agregarNuevoPDV();
            });
        } else {
            console.error('No se encontró el botón agregar-pdv-manual');
        }
    }

    agregarNuevoPDV() {
        const contenedorPDVs = document.getElementById('contenedor-pdvs');
        if (!contenedorPDVs) return;

        const index = document.querySelectorAll('.tabla-pdv').length;
        const pdvDiv = document.createElement('div');
        pdvDiv.classList.add('w-full', 'bg-white', 'p-4', 'rounded', 'shadow', 'mb-6', 'tabla-pdv');

        pdvDiv.innerHTML = this.generarTemplatePDV(index);
        contenedorPDVs.appendChild(pdvDiv);

        // Inicializar eventos para el nuevo PDV
        this.initializePDVEvents(pdvDiv, index);
    }

    generarTemplatePDV(index) {
        return `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-800">PDV</h2>
                <button class="eliminar-pdv text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i> Eliminar PDV
                </button>
            </div>
            <input type="text" placeholder="Nombre del punto de venta" 
                   class="mb-4 w-full p-2 border rounded text-sm">

<<<<<<< HEAD
            <table id="tabla-pdv-${index}" class="w-full text-sm bg-white rounded-md shadow border border-gray-200 mb-4">
                <thead class="bg-red-700 text-white text-sm text-center">
                    <tr>
                        <th class="p-3">Foto</th>
                        <th class="p-3">Isla</th>
                        <th class="p-3">Concepto</th>
                        <th class="p-3">Alto</th>
                        <th class="p-3">Ancho</th>
                        <th class="p-3">Material</th>
                        <th class="p-3">Precio/M.Prima</th>
                        <th class="p-3">Precio Unitario</th>
                        <th class="p-3">Unidades</th>
                        <th class="p-3">Total</th>
                        <th class="p-3">Escaparate</th>
                        <th class="p-3">Total Escaparate</th>
                        <th class="p-3">Montaje</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
=======
            <div class="overflow-x-auto">
                <table id="tabla-pdv-${index}" class="w-full text-sm bg-white rounded-md shadow border border-gray-200 mb-4">
                    <thead class="bg-red-700 text-white text-sm text-center">
                        <tr>
                            <th class="p-3 whitespace-nowrap">Foto</th>
                            <th class="p-3 whitespace-nowrap">Isla</th>
                            <th class="p-3 whitespace-nowrap">Concepto</th>
                            <th class="p-3 whitespace-nowrap">Alto</th>
                            <th class="p-3 whitespace-nowrap">Ancho</th>
                            <th class="p-3 whitespace-nowrap">Material</th>
                            <th class="p-3 whitespace-nowrap">Precio/M.Prima</th>
                            <th class="p-3 whitespace-nowrap">Precio Unitario</th>
                            <th class="p-3 whitespace-nowrap">Unidades</th>
                            <th class="p-3 whitespace-nowrap">Total</th>
                            <th class="p-3 whitespace-nowrap">Escaparate</th>
                            <th class="p-3 whitespace-nowrap">Total Escaparate</th>
                            <th class="p-3 whitespace-nowrap">Montaje</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
>>>>>>> bcd6a41bece50b3fabbf1477829843c3f653401b

            <div class="flex justify-end mt-2">
                <button class="add-row bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 transition"
                        data-target="tabla-pdv-${index}">
                    + Añadir línea
                </button>
            </div>
        `;
    }

    initializePDVEvents(pdvDiv, index) {
        // Botón para agregar fila
        const addRowBtn = pdvDiv.querySelector('.add-row');
        if (addRowBtn) {
            addRowBtn.addEventListener('click', () => this.agregarFila(index));
        }

        // Botón para eliminar PDV
        const deleteBtn = pdvDiv.querySelector('.eliminar-pdv');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => pdvDiv.remove());
        }
    }

    agregarFila(tableIndex) {
        const table = document.getElementById(`tabla-pdv-${tableIndex}`);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        const esFilaInicial = tbody.children.length === 0;
        const newRow = document.createElement('tr');
        newRow.classList.add('border-b', 'text-center');

<<<<<<< HEAD
        newRow.innerHTML = this.generarTemplateFilaPDV(esFilaInicial);
        tbody.appendChild(newRow);

        // Inicializar eventos de la nueva fila
        this.initializeRowEvents(newRow, esFilaInicial);
    }

    generarTemplateFilaPDV(esFilaInicial = false) {
        return `
            <td class="p-2">
                ${esFilaInicial ? `
=======
        // Verificar si es la primera fila
        const isFirstRow = tbody.children.length === 0;
        newRow.innerHTML = this.generarTemplateFilaPDV(isFirstRow);
        tbody.appendChild(newRow);

        // Inicializar eventos de la nueva fila
        this.initializeRowEvents(newRow, isFirstRow);
    }

    generarTemplateFilaPDV(isFirstRow) {
        const islaOptions = ['GC', 'FTV', 'HIERRO', 'LZT', 'TFE', 'GOMERA', 'PALMA']
            .map(isla => `<option value="${isla}">${isla}</option>`)
            .join('');

        return `
            <td class="p-2 whitespace-nowrap">
                ${isFirstRow ? `
>>>>>>> bcd6a41bece50b3fabbf1477829843c3f653401b
                    <input type="file" class="file-input hidden">
                    <button class="upload-btn w-full p-1.5 text-sm border border-gray-300 rounded bg-gray-50">
                        Subir foto
                    </button>
                ` : ''}
<<<<<<< HEAD
            </td>
            <td class="p-2">
                ${esFilaInicial ? `
                    <select class="isla w-full p-1.5 border rounded">
                        <option value="">Seleccionar</option>
                        <option value="GC">GC</option>
                        <option value="TFE">TFE</option>
                        <option value="LZT">LZT</option>
                        <option value="FTV">FTV</option>
                        <option value="HIERRO">HIERRO</option>
                        <option value="GOMERA">GOMERA</option>
                        <option value="PALMA">PALMA</option>
                    </select>
                ` : ''}
=======
>>>>>>> bcd6a41bece50b3fabbf1477829843c3f653401b
            </td>
            <td class="p-2 whitespace-nowrap">
                ${isFirstRow ? `
                    <select class="isla w-full p-1.5 border rounded">
                        <option value="">Seleccionar</option>
                        ${islaOptions}
                    </select>
                ` : ''}
            </td>
            <td class="p-2 whitespace-nowrap">
                <input type="text" class="w-full p-1.5 border rounded text-sm" placeholder="Concepto">
            </td>
            <td class="p-2 whitespace-nowrap">
                <input type="number" step="0.01" class="dimension w-16 p-1.5 border rounded text-sm" placeholder="Alto">
            </td>
            <td class="p-2 whitespace-nowrap">
                <input type="number" step="0.01" class="dimension w-16 p-1.5 border rounded text-sm" placeholder="Ancho">
            </td>
            <td class="p-2 whitespace-nowrap">
                <select class="material w-full p-1.5 border rounded">
                    <option value="">Seleccionar</option>
                    ${this.generarOpcionesMateriales()}
                </select>
            </td>
            <td class="p-2 whitespace-nowrap">
                <input type="number" step="0.01" class="precio-mp w-20 p-1.5 border rounded" readonly>
            </td>
            <td class="p-2 whitespace-nowrap">
                <input type="number" step="0.01" class="precio-unitario w-20 p-1.5 border rounded">
            </td>
            <td class="p-2 whitespace-nowrap">
                <input type="number" class="unidades w-16 p-1.5 border rounded text-sm" value="1">
            </td>
            <td class="p-2 whitespace-nowrap">
                <input type="number" step="0.01" class="total w-20 p-1.5 border rounded" readonly>
            </td>
<<<<<<< HEAD
            <td class="p-2">
                ${esFilaInicial ? `
                    <input type="text" class="escaparate w-24 p-1.5 border rounded">
                ` : ''}
            </td>
            <td class="p-2">
                ${esFilaInicial ? `
                    <input type="number" step="0.01" class="total-escaparate w-24 p-1.5 border rounded" readonly>
                ` : ''}
            </td>
            <td class="p-2">
                ${esFilaInicial ? `
=======
            <td class="p-2 whitespace-nowrap">
                ${isFirstRow ? `
                    <input type="text" class="escaparate w-24 p-1.5 border rounded">
                ` : ''}
            </td>
            <td class="p-2 whitespace-nowrap">
                ${isFirstRow ? `
                    <input type="number" step="0.01" class="total-escaparate w-24 p-1.5 border rounded" readonly>
                ` : ''}
            </td>
            <td class="p-2 whitespace-nowrap">
                ${isFirstRow ? `
>>>>>>> bcd6a41bece50b3fabbf1477829843c3f653401b
                    <input type="number" step="0.01" class="montaje w-20 p-1.5 border rounded">
                ` : ''}
            </td>
        `;
    }

    generarOpcionesMateriales() {
        return Object.entries(this.materialesDisponibles)
            .map(([nombre, precio]) => `<option value="${nombre}">${nombre}</option>`)
            .join('');
    }

<<<<<<< HEAD
    initializeRowEvents(row, esFilaInicial) {
        if (esFilaInicial) {
=======
    initializeRowEvents(row, isFirstRow) {
        if (isFirstRow) {
>>>>>>> bcd6a41bece50b3fabbf1477829843c3f653401b
            // Manejo de foto
            const uploadBtn = row.querySelector('.upload-btn');
            const fileInput = row.querySelector('.file-input');
            
            if (uploadBtn && fileInput) {
                uploadBtn.addEventListener('click', () => fileInput.click());
                fileInput.addEventListener('change', (e) => this.handleFileUpload(e, uploadBtn));
            }
<<<<<<< HEAD
=======

            // Manejo de escaparate y montaje
            const escaparate = row.querySelector('.escaparate');
            const totalEscaparate = row.querySelector('.total-escaparate');
            const montaje = row.querySelector('.montaje');

            if (escaparate && totalEscaparate) {
                escaparate.addEventListener('input', () => {
                    const valor = parseFloat(escaparate.value) || 0;
                    totalEscaparate.value = valor.toFixed(2);
                });
            }
>>>>>>> bcd6a41bece50b3fabbf1477829843c3f653401b
        }

        // Manejo de cálculos
        const material = row.querySelector('.material');
        if (material) {
            material.addEventListener('change', () => this.actualizarPrecioMP(row));
        }

        // Eventos para cálculos automáticos
        ['dimension', 'precio-unitario', 'unidades'].forEach(className => {
            const input = row.querySelector(`.${className}`);
            input?.addEventListener('input', () => this.calcularTotales(row));
        });
    }

    handleFileUpload(event, button) {
        const file = event.target.files[0];
        if (file) {
            button.textContent = file.name;
            button.classList.add('bg-green-50', 'text-green-700', 'border-green-300');
        }
    }

    actualizarPrecioMP(row) {
        const material = row.querySelector('.material');
        const precioMP = row.querySelector('.precio-mp');
        if (material && precioMP) {
            const materialSeleccionado = material.value;
            precioMP.value = this.materialesDisponibles[materialSeleccionado] || '';
            this.calcularTotales(row);
        }
    }

    calcularTotales(row) {
        const alto = parseFloat(row.querySelector('input[placeholder="Alto"]').value) || 0;
        const ancho = parseFloat(row.querySelector('input[placeholder="Ancho"]').value) || 0;
        const precioUnitario = parseFloat(row.querySelector('.precio-unitario').value) || 0;
        const unidades = parseInt(row.querySelector('.unidades').value) || 1;

        const total = (alto * ancho * precioUnitario * unidades).toFixed(2);
        row.querySelector('.total').value = total;

        this.actualizarTotalPDV(row.closest('table'));
    }

    actualizarTotalPDV(table) {
        const totales = Array.from(table.querySelectorAll('.total'))
            .map(input => parseFloat(input.value) || 0);
        
        const totalPDV = totales.reduce((sum, value) => sum + value, 0).toFixed(2);
        const inputTotalPDV = table.querySelector('tfoot input');
        if (inputTotalPDV) {
            inputTotalPDV.value = totalPDV;
        }
    }

    async cargarMateriales() {
        try {
<<<<<<< HEAD
            const res = await fetchWithAuth('/api/materialesPresupuesto');
            if (!res.ok) throw new Error('Error al cargar materiales');
            const data = await res.json();
            console.log('Datos de materiales recibidos en PDVManager:', data);
=======
            const response = await fetch('/api/recogerModuloZoho?modulo=PreciosMaterialesYServ');
            if (!response.ok) {
                throw new Error(`Error al cargar materiales: ${response.status}`);
            }
            const data = await response.json();
            
            if (!data || !data.proveedores) {
                throw new Error('Formato de respuesta inválido');
            }
>>>>>>> bcd6a41bece50b3fabbf1477829843c3f653401b

            // Actualizar materialesDisponibles
            this.materialesDisponibles = {};
            if (data.materiales && Array.isArray(data.materiales)) {
                data.materiales.forEach(material => {
                    if (material.nombre && material.importe !== undefined) {
                        this.materialesDisponibles[material.nombre] = material.importe;
                    }
                });
            }
            console.log('Materiales disponibles en PDVManager:', this.materialesDisponibles);

            // Actualizar todos los selectores de materiales existentes
            document.querySelectorAll('.material').forEach(select => {
                const currentValue = select.value;
                select.innerHTML = '<option value="">Seleccionar</option>' +
                    Object.entries(this.materialesDisponibles)
                        .map(([nombre, precio]) => `<option value="${nombre}">${nombre}</option>`)
                        .join('');
                
                // Restaurar el valor seleccionado si aún existe
                if (currentValue && this.materialesDisponibles[currentValue]) {
                    select.value = currentValue;
                }

                // Actualizar el precio si hay un material seleccionado
                if (select.value) {
                    this.actualizarPrecioMP(select.closest('tr'));
                }
            });
        } catch (error) {
            console.error('Error al cargar materiales en PDVManager:', error);
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        window.pdvManager = new PDVManager();
        await window.pdvManager.cargarMateriales();
    });
} else {
    window.pdvManager = new PDVManager();
    window.pdvManager.cargarMateriales();
} 