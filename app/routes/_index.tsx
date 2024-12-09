import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "App - Expedient" },
    { name: "description", content: "Expedient App Built with Remix" },
  ];
};

export default function Index() {
  return (
    <div className="p-5">
      <h1 className="text-lg font-semibold mb-5">Dashboard</h1>
      <p className="text-sm">Welcome back Marcel! Let&apos;s close some sales today.</p>
    </div>
  );
}
