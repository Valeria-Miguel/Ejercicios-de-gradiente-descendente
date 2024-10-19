import React, { useState } from 'react';
import { derivative, parse } from 'mathjs';
import './NewtonRaphson.css';

const App = () => {
  const [coeffX2, setCoeffX2] = useState('');
  const [coeffX, setCoeffX] = useState('');
  const [constant, setConstant] = useState('');
  const [alpha, setAlpha] = useState(0.01);
  const [iterations, setIterations] = useState([]);
  const [derivativeExpression, setDerivativeExpression] = useState('');
  const [lastX, setLastX] = useState(null);
  const [iterationCount, setIterationCount] = useState(0);
  const [error, setError] = useState(null);

  const validateNumber = (value) => {
    return /^-?\d*$/.test(value);  // Permite números enteros y negativos
  };

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (validateNumber(value)) {
      setter(value);
    } else {
      alert('Solo números enteros son permitidos.');
    }
  };

  const validateInputs = () => {
    if (coeffX2 === '' || coeffX === '' || constant === '' || coeffX2 === '-' || coeffX === '-' || constant === '-') {
      alert('Todos los campos deben tener un número válido.');
      return false;
    }
    return true;
  };

  const createFunctionString = () => {
    return `${coeffX2 || '0'} * x^2 + ${coeffX || '0'} * x + ${constant || '0'}`;
  };

  const evaluateDerivative = (x) => {
    try {
      const functionString = createFunctionString();
      const derived = derivative(functionString, 'x').toString();
      const parsedDerivative = parse(derived);
      const derivativeValue = parsedDerivative.evaluate({ x });
      return { value: parseFloat(derivativeValue.toFixed(8)), expression: derived };
    } catch (err) {
      throw new Error('Error al evaluar la derivada. Revisa la sintaxis de la función.');
    }
  };

  const solve = () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setIterations([]);
      setLastX(null);
      setIterationCount(0);
      setError(null);

      let x = 0;
      const newIterations = [];
      const repeatedCount = {};
      let iteration = 0;
      const tolerance = 1e-8;

      while (true) {
        const { value: derivativeValue, expression: derivedExpression } = evaluateDerivative(x);
        if (iteration === 0) {
          setDerivativeExpression(derivedExpression);
        }

        if (derivativeValue === 0 || !isFinite(derivativeValue)) {
          break;
        }

        const newX = parseFloat((x - alpha * derivativeValue).toFixed(8));

        newIterations.push(`Iteración ${iteration + 1}:    x_${iteration} = ${x.toFixed(8)}  f'(x_${iteration}) = ${derivedExpression.replace(/x/g, x.toFixed(8))} = ${derivativeValue.toFixed(8)}  x_${iteration + 1} = ${x.toFixed(8)} - (${alpha.toFixed(2)} × ${derivativeValue.toFixed(8)}) = ${newX.toFixed(8)}  `);

        const newXKey = newX.toFixed(8);
        repeatedCount[newXKey] = (repeatedCount[newXKey] || 0) + 1;

        if (repeatedCount[newXKey] === 3) {
          break;
        }

        if (Math.abs(newX - x) < tolerance) {
          x = newX;
          break;
        }

        if (Math.abs(newX) > 1e10) {
          break;
        }

        x = newX;
        iteration++;
      }

      setIterations(newIterations);
      setLastX(x);
      setIterationCount(iteration);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Calculadora gradiente descendente</h1>
      <div className="input-group">
        <label>
          Coeficiente de x^2:
          <input
            type="text"
            value={coeffX2}
            onChange={handleInputChange(setCoeffX2)}
            placeholder="Ingresa el coeficiente de x^2"
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Coeficiente de x:
          <input
            type="text"
            value={coeffX}
            onChange={handleInputChange(setCoeffX)}
            placeholder="Ingresa el coeficiente de x"
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Término constante:
          <input
            type="text"
            value={constant}
            onChange={handleInputChange(setConstant)}
            placeholder="Ingresa el término constante"
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
      <button className="solve-button" onClick={solve}>Resolver</button>
      <div>
        <h2>Derivada de la función:</h2>
        <p>f'(x) = {derivativeExpression}</p>
      </div>
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

export default App;
