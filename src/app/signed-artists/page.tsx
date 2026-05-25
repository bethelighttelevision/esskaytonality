import type { Metadata } from "next";
import SignedArtistsClient from "./page-client";

export const metadata: Metadata = {
  title: "Signed Artists",
  description: "Meet the official ESSKAYTONALITY roster — discover signed artists, their music, and exclusive content.",
};

export default function Page() {
  return <SignedArtistsClient />;
}
