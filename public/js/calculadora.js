/**
 * Calculadora.js
 * Clase para centralizar todas las operaciones relacionadas con cálculos 
 * de presupuestos, totales, precios, etc.
 */
class Calculadora {
    constructor() {
        this.materialesDisponibles = {};
    }

    /**
     * Actualiza el precio de materia prima basado en el material seleccionado
     * @param {Element} elementoRow - Fila del elemento
     * @param {number} pdvIndex - Índice del PDV
     * @param {number} escaparateIndex - Índice del escaparate
     */
    actualizarPrecioMP(elementoRow, pdvIndex, escaparateIndex) {
        const material = elementoRow.querySelector('.material');
        const precioMP = elementoRow.querySelector('.precio-mp');
        if (material && precioMP) {
            const materialSeleccionado = material.value;
            precioMP.value = this.materialesDisponibles[materialSeleccionado] || '';
            this.calcularTotalesElemento(elementoRow, pdvIndex, escaparateIndex);
        }
    }

    /**
     * Calcula los totales para un elemento (fila) específico
     * @param {Element} elementoRow - Fila del elemento
     * @param {number} pdvIndex - Índice del PDV
     * @param {number} escaparateIndex - Índice del escaparate
     */
    calcularTotalesElemento(elementoRow, pdvIndex, escaparateIndex) {
        const alto = parseFloat(elementoRow.querySelector('.alto').value) || 0;
        const ancho = parseFloat(elementoRow.querySelector('.ancho').value) || 0;
        const precioUnitario = parseFloat(elementoRow.querySelector('.precio-unitario').value) || 0;
        const unidades = parseInt(elementoRow.querySelector('.unidades').value) || 1;

        const total = (alto * ancho * precioUnitario * unidades).toFixed(2);
        elementoRow.querySelector('.total-elemento').value = total;

        this.actualizarTotalEscaparate(pdvIndex, escaparateIndex);
    }

    /**
     * Actualiza el total de un escaparate sumando todos sus elementos
     * @param {number} pdvIndex - Índice del PDV
     * @param {number} escaparateIndex - Índice del escaparate
     */
    actualizarTotalEscaparate(pdvIndex, escaparateIndex) {
        const pdvDiv = document.querySelector(`.tabla-pdv[data-pdv-index="${pdvIndex}"]`);
        if (!pdvDiv) return;

        const escaparateItem = pdvDiv.querySelector(`.escaparate-item[data-escaparate-index="${escaparateIndex}"]`);
        if (!escaparateItem) return;

        const totales = Array.from(escaparateItem.querySelectorAll('.total-elemento'))
            .map(input => parseFloat(input.value) || 0);
        
        const totalEscaparate = totales.reduce((sum, value) => sum + value, 0).toFixed(2);
        
        // Actualizar total en el footer de la tabla
        const totalElementosInput = escaparateItem.querySelector('.total-elementos');
        if (totalElementosInput) {
            totalElementosInput.value = totalEscaparate;
        }
        
        // Actualizar total en el header del escaparate
        const totalEscaparateInput = escaparateItem.querySelector('.total-escaparate');
        if (totalEscaparateInput) {
            totalEscaparateInput.value = totalEscaparate;
        }

        this.actualizarTotalPDV(pdvIndex);
    }

    /**
     * Actualiza el total de un PDV sumando todos sus escaparates y el montaje
     * @param {number} pdvIndex - Índice del PDV
     */
    actualizarTotalPDV(pdvIndex) {
        const pdvDiv = document.querySelector(`.tabla-pdv[data-pdv-index="${pdvIndex}"]`);
        if (!pdvDiv) return;

        // Sumar totales de todos los escaparates
        const totalesEscaparates = Array.from(pdvDiv.querySelectorAll('.total-escaparate'))
            .map(input => parseFloat(input.value) || 0);
        
        const totalEscaparates = totalesEscaparates.reduce((sum, value) => sum + value, 0);
        
        // Obtener valor del montaje
        const montaje = parseFloat(pdvDiv.querySelector('.montaje-pdv').value) || 0;
        
        // Calcular total del PDV (escaparates + montaje)
        const totalPDV = (totalEscaparates + montaje).toFixed(2);
        
        // Actualizar campos
        const totalEscaparatesInput = pdvDiv.querySelector('.total-escaparates-pdv');
        if (totalEscaparatesInput) {
            totalEscaparatesInput.value = totalEscaparates.toFixed(2);
        }
        
        const totalPDVInput = pdvDiv.querySelector('.total-pdv');
        if (totalPDVInput) {
            totalPDVInput.value = totalPDV;
        }

        this.recalcularTotales();
    }

    /**
     * Recalcula el total general sumando todos los PDVs
     */
    recalcularTotales() {
        // Calcular el total general sumando todos los totales de PDV
        const totalesPDV = Array.from(document.querySelectorAll('.total-pdv'))
            .map(input => parseFloat(input.value) || 0);
        
        const totalGeneral = totalesPDV.reduce((sum, value) => sum + value, 0).toFixed(2);
        
        // Actualizar total general si existe un elemento para ello
        const totalGeneralInput = document.getElementById('total-general');
        if (totalGeneralInput) {
            totalGeneralInput.value = totalGeneral;
        }
    }

    /**
     * Genera las opciones HTML para el selector de materiales
     * @returns {string} - HTML con las opciones de materiales
     */
    generarOpcionesMateriales() {
        return Object.entries(this.materialesDisponibles)
            .map(([nombre, precio]) => `<option value="${nombre}">${nombre}</option>`)
            .join('');
    }

    /**
     * Actualiza la lista de materiales disponibles con los datos del servidor
     * @param {Object} data - Datos recibidos del servidor
     */
    actualizarMaterialesDisponibles(data) {
        this.materialesDisponibles = {};
        if (data.materiales && Array.isArray(data.materiales)) {
            data.materiales.forEach(material => {
                if (material.nombre && material.importe !== undefined) {
                    this.materialesDisponibles[material.nombre] = material.importe;
                }
            });
        }
    }

    /**
     * Actualiza los selectores de materiales en el DOM
     */
    actualizarSelectoresMateriales() {
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
                const elementoRow = select.closest('tr');
                if (elementoRow) {
                    const pdvDiv = select.closest('.tabla-pdv');
                    const escaparateItem = select.closest('.escaparate-item');
                    
                    if (pdvDiv && escaparateItem) {
                        const pdvIndex = parseInt(pdvDiv.dataset.pdvIndex);
                        const escaparateIndex = parseInt(escaparateItem.dataset.escaparateIndex);
                        
                        this.actualizarPrecioMP(elementoRow, pdvIndex, escaparateIndex);
                    }
                }
            }
        });
    }
}

// Crear instancia global
window.calculadora = new Calculadora(); 