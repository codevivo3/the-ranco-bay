import {Manrope, Questrial} from "next/font/google";

export const displayFont = Questrial({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

export const bodyFont = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});
