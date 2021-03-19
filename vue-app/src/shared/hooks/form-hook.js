import { reactive } from "vue";

export const useForm = (initialInputs, initialValidity) => {
  const formState = reactive({
    inputs: initialInputs,
    isValid: initialValidity
  });

  const inputHandler = (id, inputVal, inputIsValid) => {
    let formIsValid = true;
    for (const inputId in formState.inputs) {
      if (inputId === id) {
        formIsValid = formIsValid && inputIsValid;
      } else {
        formIsValid = formIsValid && formState.inputs[inputId].isValid;
      }
    }

    formState.inputs = {
      ...formState.inputs,
      [id]: {
        value: inputVal,
        isValid: inputIsValid
      }
    };

    formState.isValid = formIsValid;
  };

  return [formState, inputHandler];
};
