import { createFileRoute } from "@tanstack/react-router";

import { getOffers } from "../lib/api/offers.functions";
import { localeHead } from "../site/head";
import { SitePage } from "../site/page";

export const Route = createFileRoute("/en")({
  head: () => localeHead("en"),
  loader: async () => ({ offers: await getOffers() }),
  component: LocalePage,
});

function LocalePage() {
  const { offers } = Route.useLoaderData();
  return <SitePage lang="en" offers={offers} />;
}
