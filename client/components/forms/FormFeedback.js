"use client";

import FormError from "./FormError";

export default function FormFeedback({
  error,
  success = false,
  successMessage = "Looks good",
  className = "",
}) {
  if (error) {
    return <FormError message={error} className={className} />;
  }

  return null;
}
