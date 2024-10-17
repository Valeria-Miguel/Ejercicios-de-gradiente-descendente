function gradienteDescendente() {
    // Datos de entrada: p (unidades), precios
    const datos = [
        [10, 100],
        [15, 80],
        [20, 60],
        [25, 40],
        [30, 20]
    ];

    let m = 0; // Valor inicial de m
    let b = 0; // Valor inicial de b
    const alpha = 0.001; // Tasa de aprendizaje reducida
    const tolerancia = 0.0001; // Criterio de convergencia
    let iteraciones = 0; // Número de iteraciones dinámico

    // Función para calcular el error cuadrático medio
    function calcularError(datos, m, b) {
        let errorTotal = 0;
        for (let i = 0; i < datos.length; i++) {
            const x = datos[i][0];
            const y = datos[i][1];
            const y_pred = m * x + b;
            errorTotal += Math.pow(y - y_pred, 2);
        }
        return errorTotal / datos.length;
    }

    // Gradiente descendente hasta converger
    while (true) {
        iteraciones++;
        let m_derivada = 0;
        let b_derivada = 0;
        const n = datos.length;

        // Cálculo de las derivadas parciales
        for (let j = 0; j < n; j++) {
            const x = datos[j][0];
            const y = datos[j][1];
            const y_pred = m * x + b;

            // Verificación de NaN en las predicciones
            if (isNaN(y_pred)) {
                console.log(`Error: y_pred es NaN en la iteración ${iteraciones}`);
                return;
            }

            // Derivada respecto a m y b
            m_derivada += -2 * x * (y - y_pred);
            b_derivada += -2 * (y - y_pred);
        }

        // Actualización de los parámetros
        const m_anterior = m;
        const b_anterior = b;

        m -= alpha * (m_derivada / n);
        b -= alpha * (b_derivada / n);

        // Verificación de NaN en las actualizaciones de m y b
        if (isNaN(m) || isNaN(b)) {
            console.log(`Error: m o b se convirtieron en NaN en la iteración ${iteraciones}`);
            console.log(`m: ${m}, b: ${b}, m_derivada: ${m_derivada}, b_derivada: ${b_derivada}`);
            return;
        }

        // Mostrar los valores intermedios en cada iteración
        console.log(`Iteración: ${iteraciones}`);
        console.log(`m: ${m}`);
        console.log(`b: ${b}`);
        console.log(`Error: ${calcularError(datos, m, b)}`);
        console.log('');

        // Criterio de convergencia: detener cuando los cambios sean pequeños
        if (Math.abs(m - m_anterior) < tolerancia && Math.abs(b - b_anterior) < tolerancia) {
            break;
        }
    }

    // Mostrar los valores finales de m y b
    console.log("Valores finales:");
    console.log(`m: ${m}`);
    console.log(`b: ${b}`);

    // Mostrar la ecuación de la recta final
    console.log(`Ecuación de la recta: y = ${m}x + ${b}`);
}

gradienteDescendente();
