import React from "react";
import { useState } from "react";
import Forms from "../components/Forms";

function DrillInputs() {
  const [formElements, setFormElements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  return (
    <div>
      <Forms
        isLoading={isLoading}
        isSubmiting={isSubmiting}
        formElements={formElements}
        setFormElements={setFormElements}
        onSubmit={() => {}}
        title={"Drill Input Form"}
        getData={() => {}}
        isDrillInput={true}
      />
    </div>
  );
}

export default DrillInputs;
