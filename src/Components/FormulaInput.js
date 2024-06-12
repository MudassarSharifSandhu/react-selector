import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";

const fields = {
  "Actual New MRR": 1000,
  "New Customers": 10,
  "Monthly ACV": 100,
};

const FormulaInput = () => {
  const [formula, setFormula] = useState("");

  const handleChange = (value) => {
    setFormula(value);
  };

  const handleAutocomplete = (context) => {
    const word = context.matchBefore(/\w*/);
    if (word.from === word.to && !context.explicit) return null;
    return {
      from: word.from,
      options: [
        { label: "Actual New MRR", type: "variable" },
        { label: "New Customers", type: "variable" },
        { label: "Monthly ACV", type: "variable" },
      ],
    };
  };

  const generateSafeVariableName = (name) => name.replace(/ /g, "_");

  const evaluateFormula = (formula) => {
    try {
      const variableMapping = {};
      let safeFormula = formula;

      for (const [key, value] of Object.entries(fields)) {
        const safeName = generateSafeVariableName(key);
        safeFormula = safeFormula.replace(new RegExp(key, "g"), safeName);
        variableMapping[safeName] = value;
      }

      const evaluated = new Function(
        "variables",
        `with(variables) { return ${safeFormula}; }`
      )(variableMapping);
      console.log("evaluated", evaluated);
      return evaluated;
    } catch (e) {
      return "Invalid formula";
    }
  };

  return (
    <div>
      <CodeMirror
        value={formula}
        height="200px"
        extensions={[
          javascript(),
          autocompletion({ override: [handleAutocomplete] }),
        ]}
        onChange={handleChange}
      />
      <div>
        <strong>Evaluated Result:</strong> {evaluateFormula(formula)}
      </div>
      <div className="selector-fields">
        <h3>Test select fields:</h3>
        <ul>
          {Object.entries(fields).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FormulaInput;
