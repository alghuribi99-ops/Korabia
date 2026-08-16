import { createFileRoute } from "@tanstack/react-router";

import { localeHead } from "../site/head";
import { SitePage } from "../site/page";

export const Route = createFileRoute("/ko")({
  head: () => localeHead("ko"),
  component: () => <SitePage lang="ko" />,
});
