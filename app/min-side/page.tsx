import type { Metadata } from "next";
import { MinSide } from "./min-side-client";

export const metadata: Metadata = {
  title: "Min side",
  description:
    "Logg inn med Vipps for å se kommende avtaler, servicehistorikk per bil og kvitteringer.",
};

export default function MinSidePage() {
  return <MinSide />;
}
