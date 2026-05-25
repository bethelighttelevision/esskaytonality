import type { Metadata } from "next";
import TeamClient from "./page-client";

export const metadata: Metadata = {
  title: "Team | ESSKAYTONALITY",
  description: "Meet the team behind ESSKAYTONALITY.",
  openGraph: { images: ["/icon-512.png"] },
};

const TEAM_DATA = [
  {
    category: "Founder & CEO",
    members: [
      { name: "Sahir Alam", title: "Founder & Chief Executive Officer", image: "/images/team/sahir-alam.jpg" },
    ],
  },
  {
    category: "Management",
    members: [
      { name: "Aisha Khan", title: "Chief Operating Officer", image: "/images/team/aisha-khan.svg" },
      { name: "Ravi Patel", title: "Head of Operations", image: "/images/team/ravi-patel.svg" },
    ],
  },
  {
    category: "Technical Media",
    members: [
      { name: "Marcus Chen", title: "Head of Technical Media", image: "/images/team/marcus-chen.svg" },
      { name: "Priya Sharma", title: "Media Production Manager", image: "/images/team/priya-sharma.svg" },
    ],
  },
  {
    category: "Writers",
    members: [
      { name: "James Wilson", title: "Lead Songwriter", image: "/images/team/james-wilson.svg" },
      { name: "Zara Ahmed", title: "Staff Writer", image: "/images/team/zara-ahmed.svg" },
    ],
  },
  {
    category: "Composers",
    members: [
      { name: "David Kim", title: "Lead Composer", image: "/images/team/david-kim.svg" },
      { name: "Elena Torres", title: "Composer & Arranger", image: "/images/team/elena-torres.svg" },
    ],
  },
  {
    category: "Band",
    members: [
      { name: "Alex Rivera", title: "Lead Guitarist", image: "/images/team/alex-rivera.svg" },
      { name: "Sam Johnson", title: "Drummer", image: "/images/team/sam-johnson.svg" },
      { name: "Maya Singh", title: "Bassist", image: "/images/team/maya-singh.svg" },
      { name: "Omar Hassan", title: "Keyboardist", image: "/images/team/omar-hassan.svg" },
    ],
  },
  {
    category: "Mixing & Mastering Engineers",
    members: [
      { name: "Chris Thompson", title: "Head of Mixing & Mastering", image: "/images/team/chris-thompson.svg" },
      { name: "Nina Patel", title: "Mastering Engineer", image: "/images/team/nina-patel.svg" },
    ],
  },
  {
    category: "Sound Engineers",
    members: [
      { name: "Tom Baker", title: "Senior Sound Engineer", image: "/images/team/tom-baker.svg" },
      { name: "Lena Schmidt", title: "Recording Engineer", image: "/images/team/lena-schmidt.svg" },
    ],
  },
  {
    category: "Arrangers Artist",
    members: [
      { name: "Carlos Mendez", title: "Lead Arranger", image: "/images/team/carlos-mendez.svg" },
      { name: "Yuki Tanaka", title: "Orchestral Arranger", image: "/images/team/yuki-tanaka.svg" },
    ],
  },
];

export default function Page() {
  return <TeamClient categories={TEAM_DATA} />;
}
