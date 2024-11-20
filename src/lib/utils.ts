import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ErrorsCode = "INVALID_INPUT" | "UNAUTHORIZED" | "QUOTE_LIMIT_EXCEEDED";

export type ErrorHandler = (data?: unknown) => {
  code: ErrorsCode;
  message: string;
  errors?: unknown;
};

export const errors: Record<string, ErrorHandler> = {
  invalidInput(error) {
    return {
      code: "INVALID_INPUT",
      message: "Invalid input",
      errors: error instanceof ZodError ? error?.errors : null,
    };
  },
  unauthorized() {
    return {
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    };
  },

  quoteLimitExceeded() {
    return {
      code: "QUOTE_LIMIT_EXCEEDED",
      message: "Quote limit exceeded",
    };
  },
};

type Right<DataType> = {
  success: true;
  data: DataType;
};

type Left<ExceptionType> = {
  success: false;
  exception: ExceptionType;
};

export const left = <T = unknown>(exception: T): Left<T> => {
  return {
    success: false,
    exception,
  };
};

export const right = <T = null>(value: T): Right<T> => {
  return {
    success: true,
    data: value,
  };
};

export const cpfMask = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const defaultImageUrl =
  "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=1060";
