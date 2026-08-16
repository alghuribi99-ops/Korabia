import { createFileRoute } from "@tanstack/react-router";

import { localeHead } from "../site/head";
import { SitePage } from "../site/page";

export const Route = createFileRoute("/es")({
  head: () => localeHead("es"),
  component: () => <SitePage lang="es" />,
});
