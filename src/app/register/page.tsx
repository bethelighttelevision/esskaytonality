import type { Metadata } from "next";
import RegisterClient from "./page-client";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your ESSKAYTONALITY account. Join as a fan or artist and discover new music.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <RegisterClient />;
}
