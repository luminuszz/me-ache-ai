import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { type ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const errors = {
  invalidInput(error: ZodError) {
    return {
      code: "INVALID_INPUT",
      message: "Invalid input",
      errors: error.errors,
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
