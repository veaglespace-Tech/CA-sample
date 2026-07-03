"use client";

import { useCallback, useState } from "react";

function hasValue(value) {
  if (typeof value === "boolean") return true;
  if (typeof value === "number") return true;
  return String(value ?? "").trim().length > 0;
}

export default function useLiveValidation(validators = {}) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value, values) => {
    const validator = validators[name];
    const nextError = validator ? validator(value, values) : null;

    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: nextError || null }));

    return nextError;
  }, [validators]);

  const validateForm = useCallback((values) => {
    const nextErrors = {};
    const nextTouched = {};

    Object.entries(validators).forEach(([name, validator]) => {
      nextTouched[name] = true;
      const nextError = validator ? validator(values[name], values) : null;
      if (nextError) {
        nextErrors[name] = nextError;
      }
    });

    setTouched((prev) => ({ ...prev, ...nextTouched }));
    setErrors(nextErrors);

    return nextErrors;
  }, [validators]);

  const clearFieldError = useCallback((name) => {
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const getFieldStatus = useCallback((name, value) => {
    if (!touched[name] || !hasValue(value)) return "idle";
    return errors[name] ? "error" : "success";
  }, [errors, touched]);

  const getFieldSuccess = useCallback((name, value) => getFieldStatus(name, value) === "success", [getFieldStatus]);

  return {
    errors,
    touched,
    validateField,
    validateForm,
    clearFieldError,
    resetValidation,
    getFieldStatus,
    getFieldSuccess,
    setErrors,
    setTouched,
  };
}
