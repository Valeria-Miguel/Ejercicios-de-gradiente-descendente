import React, { useState } from 'react';
import { derivative, parse } from 'mathjs'; // Asegúrate de tener mathjs instalado: npm install mathjs
import './NewtonRaphson.css'; // Importa el archivo de estilo CSS

const NewtonRaphson = () => {
  // Estado para almacenar la función ingresada por el usuario
  const [functionString, setFunctionString] = useState('-3 * x^2 + 12 * x + 100'); // Función inicial

  // Estado para almacenar el valor de alpha
  const [alpha, setAlpha] = useState(0.01); // Alpha inicial

  // Estado para almacenar las iteraciones
  const [iterations, setIterations] = useState([]);

  // Estado para almacenar la expresión de la derivada
  const [derivativeExpression, setDerivativeExpression] = useState('');

  // Estado para almacenar el último valor de x después de las iteraciones
  const [lastX, setLastX] = useState(null);

  // Estado para almacenar el conteo de iteraciones realizadas
  const [iterationCount, setIterationCount] = useState(0);

  // Estado para almacenar cualquier error durante la evaluación
  const [error, setError] = useState(null);

  // Función para evaluar f'(x)
  const evaluateDerivative = (x) => {
    try {
      // Calcula la derivada simbólica de la función respecto a x
      const derived = derivative(functionString, 'x').toString();

      // Evalúa la derivada en el valor actual de x
      const parsedDerivative = parse(derived);
      const derivativeValue = parsedDerivative.evaluate({ x });

      return { value: derivativeValue, expression: derived };
    } catch (err) {
      throw new Error('Error al evaluar la derivada. Revisa la sintaxis de la función.');
    }
  };

  // Método para resolver el método de Newton-Raphson
  const solve = () => {
    try {
      // Reinicia los estados antes de comenzar
      setIterations([]);
      setLastX(null);
      setIterationCount(0);
      setError(null);

      let x = 0; // Valor inicial fijo
      const newIterations = [];
      const repeatedCount = {}; // Para contar repeticiones
      let iteration = 0; // Contador de iteraciones
      const maxIterations = 1000; // Límite de iteraciones para evitar bucles infinitos
      const tolerance = 1e-8; // Tolerancia para la convergencia

      while (iteration < maxIterations) {
        const { value: derivativeValue, expression: derivedExpression } = evaluateDerivative(x);

        // Almacena la expresión de la derivada solo en la primera iteración
        if (iteration === 0) {
          setDerivativeExpression(derivedExpression);
        }

        // Verifica si la derivada es cero para evitar división por cero
        if (derivativeValue === 0) {
          setError(`Derivada cero en x = ${x}. Método falla.`);
          break;
        }

        // Calcula el nuevo valor de x utilizando la fórmula de actualización
        const newX = parseFloat((x - alpha * derivativeValue).toFixed(8));

        // Formato para mostrar las iteraciones
        newIterations.push(`Iteración ${iteration + 1}:

_${iteration} = ${x.toFixed(8)}
'(${x.toFixed(8)}) = ${derivedExpression.replace(/x/g, x.toFixed(8))} = ${derivativeValue.toFixed(8)}
_${iteration + 1} = ${x.toFixed(8)} - (${alpha.toFixed(2)} × ${derivativeValue.toFixed(8)}) = ${newX.toFixed(8)}
`);

        // Contar repeticiones del nuevo valor de x
        const newXKey = newX.toFixed(8);
        repeatedCount[newXKey] = (repeatedCount[newXKey] || 0) + 1;

        // Si el nuevo valor se repite 3 veces, detener la iteración
        if (repeatedCount[newXKey] === 3) {
          setError('Repetición detectada. Método no converge.');
          break;
        }

        // Verificar convergencia: si el cambio en x es menor que la tolerancia
        if (Math.abs(newX - x) < tolerance) {
          x = newX;
          break;
        }

        // Actualizar x para la siguiente iteración
        x = newX;
        iteration++;
      }

      // Actualizar los estados con los resultados
      setIterations(newIterations);
      setLastX(x);
      setIterationCount(iteration);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Método de Newton-Raphson con Alpha</h1>

      {/* Resumen de resultados */}
      <div className="results-summary">
        <h3>Número de Iteraciones: {iterationCount}</h3>
        <h3>Último Valor de x: {lastX !== null ? lastX.toFixed(8) : 'N/A'}</h3>
        <h3>f'(Último x): {lastX !== null ? evaluateDerivative(lastX).value.toFixed(8) : 'N/A'}</h3>
        {error && <h3 className="error-message">Error: {error}</h3>}
      </div>

      {/* Grupo de entradas para la función y el valor de alpha */}
      <div className="input-group">
        <label>
          Función (ejemplo: -3 * x^2 + 12 * x + 100):
          <input
            type="text"
            value={functionString}
            onChange={(e) => setFunctionString(e.target.value)}
            placeholder="Ingresa la función f(x)"
          />
        </label>
      </div>

      <div className="input-group">
        <label>
          Alpha (tasa de aprendizaje, por ejemplo: 0.01):
          <input
            type="number"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            step="0.01"
            min="0"
            placeholder="Ingresa el valor de alpha"
          />
        </label>
      </div>

      {/* Botón para resolver */}
      <button className="solve-button" onClick={solve}>Resolver</button>

      {/* Mostrar la derivada de la función */}
      <div>
        <h2>Derivada de la función:</h2>
        <p>f'(x) = {derivativeExpression}</p>
      </div>

      {/* Mostrar los resultados de las iteraciones */}
      <div>
        <h2>Resultados:</h2>
        <pre>
          {iterations.map((iteration, index) => (
            <div key={index}>{iteration}</div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default NewtonRaphson;
