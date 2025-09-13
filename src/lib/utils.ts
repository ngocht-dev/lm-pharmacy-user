import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to extract error message from API response
export const getApiErrorMessage = (error: any): string => {
  // Check if error has response data (Axios error)
  if (error?.response?.data) {
    const data = error.response.data;

    // Handle array of messages
    if (data.message && Array.isArray(data.message)) {
      return data.message.join(', ');
    }

    // Handle single message string
    if (data.message && typeof data.message === 'string') {
      return data.message;
    }

    // Handle error field
    if (data.error && typeof data.error === 'string') {
      return data.error;
    }
  }

  // Fallback to error message if available
  if (error?.message) {
    return error.message;
  }

  // Default fallback
  return 'Đã xảy ra lỗi không xác định';
};

export function handleSubmitError(error: any, baseMsg: string) {
  let msg = baseMsg;
  const ve = getValidationErrors(error);
  if (Object.keys(ve).length) {
    msg += " – " + Object.values(ve).join(", ");
  } else if (error instanceof Error) {
    msg += " – " + error.message;
  }
  console.error(msg, error);
  return msg;
}

/**
 * Extracts NestJS validation errors from AxiosError response.
 * Returns a mapping of property names to concatenated error messages.
 */
export const getValidationErrors = (error: any): Record<string, string> => {
  const newErrors: Record<string, string> = {};
  const data = error?.response?.data;

  // Handle NestJS validation error array
  if (data?.message && Array.isArray(data.message)) {
    data.message.forEach((err: any) => {
      if (err.property && err.constraints) {
        newErrors[err.property] = Object.values(err.constraints).join(', ');
      }
    });
  }
  // Handle single message string (e.g. conflict, custom error)
  else if (typeof data?.message === 'string') {
    newErrors['form'] = data.message;
  }
  // Handle error field as string
  else if (typeof data?.error === 'string') {
    newErrors['form'] = data.error;
  }

  return newErrors;
};