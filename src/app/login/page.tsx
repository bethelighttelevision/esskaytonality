import type { Metadata } from "next";
import LoginClient from "./page-client";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your ESSKAYTONALITY account. Access your dashboard, playlists, and more.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LoginClient />;
}
