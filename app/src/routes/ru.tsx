import { createFileRoute } from "@tanstack/react-router";

import { localeHead } from "../site/head";
import { SitePage } from "../site/page";

export const Route = createFileRoute("/ru")({
  head: () => localeHead("ru"),
  component: () => <SitePage lang="ru" />,
});
