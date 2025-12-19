import { HydraCanvas } from "../components/HydraCanvas";
import type { Route } from "./+types/_index";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "hydra NFT" },
    { name: "description", content: "hydra! hydra! hydra!" },
  ];
}

export default function Home(_: Route.ComponentProps) {
  return (
    <div className="container max-w-screen-sm mx-auto">
      <h1 className="text-4xl text-center py-12">Creative Coding</h1>
      <HydraCanvas
        className="w-full aspect-square"
        code="JTJGJTJGJTIwbGljZW5zZWQlMjB3aXRoJTIwQ0MlMjBCWS1OQy1TQSUyMDQuMCUyMGh0dHBzJTNBJTJGJTJGY3JlYXRpdmVjb21tb25zLm9yZyUyRmxpY2Vuc2VzJTJGYnktbmMtc2ElMkY0LjAlMkYlMEElMkYlMkYlMjBHYWxheHklMjBUcmlwJTBBJTJGJTJGJTIwYnklMjBSYW5nZ2ElMjBQdXJuYW1hJTIwQWppJTBBJTJGJTJGJTIwaHR0cHMlM0ElMkYlMkZyYW5nZ2FwdXJuYW1hYWppMS53aXhzaXRlLmNvbSUyRnBvcnRmb2xpbyUwQXNoYXBlKDElMkMlMjAxKSUwQSUwOS5tdWx0KHZvcm9ub2koMTAwMCUyQyUyMDIpJTBBJTA5JTA5LmJsZW5kKG8wKSUwQSUwOSUwOS5sdW1hKCkpJTBBJTA5LmFkZChzaGFwZSgzJTJDJTIwMC4xMjUpJTBBJTA5JTA5LnJvdGF0ZSgxJTJDJTIwMSklMEElMDklMDkubXVsdCh2b3Jvbm9pKDEwMDAlMkMlMjAxKSUwQSUwOSUwOSUwOS5sdW1hKCkpJTBBJTA5JTA5LnJvdGF0ZSgxLjUpKSUwQSUwOS5zY3JvbGxYKCU1QjAuMSUyQyUyMC0wLjA2MjUlMkMlMjAwLjAwMyUyQyUyMDAuMDAwMDElNUQlMkMlMjAwKSUwQSUwOS5zY3JvbGxZKCU1QjAuMSUyQyUyMC0wLjA2MjUlMkMlMjAwLjAwNSUyQyUyMDAuMDAwMDElNUQlMkMlMjAwKSUwQSUwOS5vdXQoKSUzQg%3D%3D"
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
