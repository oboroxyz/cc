import { HydraCanvas } from "~/components/HydraCanvas";
import type { Route } from "./+types/_index";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Creative Coding" },
    { name: "description", content: "let's create something!" },
  ];
}

export default function Home(_: Route.ComponentProps) {
  return (
    <div className="container max-w-screen-sm mx-auto">
      <h1 className="text-4xl text-center py-12">Creative Coding</h1>
      <HydraCanvas
        className="w-full aspect-square"
        code="b3NjKDUlMkMtMC4xMjYlMkMwLjUxNCkucm90YXRlKCkucGl4ZWxhdGUoKS5vdXQoKQ%3D%3D"
      />
      <ul className="flex flex-col gap-4 py-12 px-6 text-lg">
        <a
          href="/feed"
          className="border rounded-full min-h-10 px-6 py-2 flex items-center justify-center"
        >
          🔍 Explore
        </a>
        <a
          href="/create"
          className="btn border rounded-full min-h-10 px-6 py-2 flex items-center justify-center"
        >
          🆕 Create
        </a>
      </ul>
    </div>
  );
}
