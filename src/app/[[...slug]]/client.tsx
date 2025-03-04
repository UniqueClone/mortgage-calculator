"use client";

import dynamic from "next/dynamic";

const App = dynamic<{}>(() => import("../../App").then((mod) => mod.default), {
    ssr: false,
});

export function ClientOnly() {
    return <App />;
}
