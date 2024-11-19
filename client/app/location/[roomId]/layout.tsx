import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shared Location",
  description: "Visitor can easily view host location.",
  openGraph: {
    title: "Shared Location",
    description: "Visitor can easily view host location.",
    images: [
      {
        url: "/public/location.png",
        width: 800,
        height: 600,
        alt: "Home",
      },
    ],
  },
};

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
