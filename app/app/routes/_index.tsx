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
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="container max-w-screen-sm mx-auto flex flex-col flex-1 min-h-0">
        <h1 className="text-4xl text-center py-8 shrink-0">Creative Coding</h1>
        <div className="flex-1 min-h-0 px-4">
          <HydraCanvas
            className="w-full h-full max-h-[50vh]"
            code="b3NjKDUlMkMtMC4xMjYlMkMwLjUxNCkucm90YXRlKCkucGl4ZWxhdGUoKS5vdXQoKQ%3D%3D"
          />
        </div>
        <ul className="flex flex-col gap-4 py-8 px-6 text-lg shrink-0">
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
    </div>
  );
}
