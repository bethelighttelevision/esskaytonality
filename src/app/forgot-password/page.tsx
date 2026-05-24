import type { Metadata } from "next";
import ForgotPasswordClient from "./page-client";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your ESSKAYTONALITY account password.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ForgotPasswordClient />;
}
