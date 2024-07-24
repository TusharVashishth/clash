import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Env from "./env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (img: string): string => {
  return `${Env.BACKEND_URL}/images/${img}`;
};

export const checkDateExpiry = (date: string): boolean => {
  const currentDate = new Date();
  const givenDate = new Date(date);
  return givenDate < currentDate;
};
