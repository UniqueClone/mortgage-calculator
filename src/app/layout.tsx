import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Irish Mortgage Calculator",
    description: "Calculate your mortgage repayments in Ireland",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div id="root">{children}</div>
            </body>
        </html>
    );
}
