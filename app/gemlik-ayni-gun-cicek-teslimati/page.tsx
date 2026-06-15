import type { Metadata } from "next";
import LandingPage from "@/components/seo/LandingPage";
import { getLandingPage } from "@/lib/seo/landingPages";

const data = getLandingPage("gemlik-ayni-gun-cicek-teslimati")!;

export const metadata: Metadata = {
  title: { absolute: data.title },
  description: data.description,
  alternates: { canonical: `/${data.slug}` },
  openGraph: {
    title: data.title,
    description: data.description,
    url: `/${data.slug}`,
    type: "website",
  },
};

export default function Page() {
  return <LandingPage data={data} />;
}
