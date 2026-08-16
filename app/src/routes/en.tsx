import { createFileRoute } from "@tanstack/react-router";

import { localeHead } from "../site/head";
import { SitePage } from "../site/page";

export const Route = createFileRoute("/en")({
  head: () => localeHead("en"),
  component: () => <SitePage lang="en" />,
});
