import { HydraCanvas } from "../components/HydraCanvas";
import type { Route } from "./+types/feed";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "hydra NFT" },
    { name: "description", content: "hydra! hydra! hydra!" },
  ];
}

export default function Home(_: Route.ComponentProps) {
  return (
    <div className="container max-w-screen-sm mx-auto">
      <h1 className="text-3xl text-center py-12">Feed</h1>
      <div>
        <HydraCanvas
          className="w-full aspect-square"
          code="JTJGJTJGJTIwbGljZW5zZWQlMjB3aXRoJTIwQ0MlMjBCWS1OQy1TQSUyMDQuMCUyMGh0dHBzJTNBJTJGJTJGY3JlYXRpdmVjb21tb25zLm9yZyUyRmxpY2Vuc2VzJTJGYnktbmMtc2ElMkY0LjAlMkYlMEElMkYlMkYlMjBHYWxheHklMjBUcmlwJTBBJTJGJTJGJTIwYnklMjBSYW5nZ2ElMjBQdXJuYW1hJTIwQWppJTBBJTJGJTJGJTIwaHR0cHMlM0ElMkYlMkZyYW5nZ2FwdXJuYW1hYWppMS53aXhzaXRlLmNvbSUyRnBvcnRmb2xpbyUwQXNoYXBlKDElMkMlMjAxKSUwQSUwOS5tdWx0KHZvcm9ub2koMTAwMCUyQyUyMDIpJTBBJTA5JTA5LmJsZW5kKG8wKSUwQSUwOSUwOS5sdW1hKCkpJTBBJTA5LmFkZChzaGFwZSgzJTJDJTIwMC4xMjUpJTBBJTA5JTA5LnJvdGF0ZSgxJTJDJTIwMSklMEElMDklMDkubXVsdCh2b3Jvbm9pKDEwMDAlMkMlMjAxKSUwQSUwOSUwOSUwOS5sdW1hKCkpJTBBJTA5JTA5LnJvdGF0ZSgxLjUpKSUwQSUwOS5zY3JvbGxYKCU1QjAuMSUyQyUyMC0wLjA2MjUlMkMlMjAwLjAwMyUyQyUyMDAuMDAwMDElNUQlMkMlMjAwKSUwQSUwOS5zY3JvbGxZKCU1QjAuMSUyQyUyMC0wLjA2MjUlMkMlMjAwLjAwNSUyQyUyMDAuMDAwMDElNUQlMkMlMjAwKSUwQSUwOS5vdXQoKSUzQg%3D%3D"
        />
        <div>
          Author: aaaaa
          <button>Like</button>
          <button>Comment</button>
          <button>Share</button>
        </div>
      </div>
      <HydraCanvas
        className="w-full aspect-square"
        code="JTJGJTJGJTIwbGljZW5zZWQlMjB3aXRoJTIwQ0MlMjBCWS1OQy1TQSUyMDQuMCUyMGh0dHBzJTNBJTJGJTJGY3JlYXRpdmVjb21tb25zLm9yZyUyRmxpY2Vuc2VzJTJGYnktbmMtc2ElMkY0LjAlMkYlMEElMkYlMkYlMjBDZWxsdWxhciUyMCUyNiUyMEJsb2J1bGFyJTBBJTJGJTJGJTIwYnklMjBNYWhhbGlhJTIwSC1SJTBBJTJGJTJGJTIwSUclM0ElMjBtbV9ocl8lMEFzcGVlZCUyMCUzRCUyMDAuMyUzQiUwQXNoYXBlKDIwJTJDJTIwMC4yJTJDJTIwMC4zKSUwQSUwOS5jb2xvcigwLjUlMkMlMjAwLjglMkMlMjA1MCklMEElMDkuc2NhbGUoKCklMjAlM0QlM0UlMjBNYXRoLnNpbih0aW1lKSUyMCUyQiUyMDElMjAqJTIwMiklMEElMDkucmVwZWF0KCgpJTIwJTNEJTNFJTIwTWF0aC5zaW4odGltZSklMjAqJTIwMTApJTBBJTA5Lm1vZHVsYXRlUm90YXRlKG8wKSUwQSUwOS5zY2FsZSgoKSUyMCUzRCUzRSUyME1hdGguc2luKHRpbWUpJTIwJTJCJTIwMSUyMColMjAxLjUpJTBBJTA5Lm1vZHVsYXRlKG5vaXNlKDIlMkMlMjAyKSklMEElMDkucm90YXRlKDEuMzc0JTJDJTIwLjIpJTBBJTA5Lm91dChvMCklM0IlMEElMkYlMkYlMjAuaW52ZXJ0KDIuNCk%3D"
      />
      <HydraCanvas
        className="w-full aspect-square"
        code="JTJGJTJGJTIwbGljZW5zZWQlMjB3aXRoJTIwQ0MlMjBCWS1OQy1TQSUyMDQuMCUyMGh0dHBzJTNBJTJGJTJGY3JlYXRpdmVjb21tb25zLm9yZyUyRmxpY2Vuc2VzJTJGYnktbmMtc2ElMkY0LjAlMkYlMEElMkYlMkYlMjBHYWxheHklMjBUcmlwJTBBJTJGJTJGJTIwYnklMjBSYW5nZ2ElMjBQdXJuYW1hJTIwQWppJTBBJTJGJTJGJTIwaHR0cHMlM0ElMkYlMkZyYW5nZ2FwdXJuYW1hYWppMS53aXhzaXRlLmNvbSUyRnBvcnRmb2xpbyUwQXNoYXBlKDElMkMlMjAxKSUwQSUwOS5tdWx0KHZvcm9ub2koMTAwMCUyQyUyMDIpJTBBJTA5JTA5LmJsZW5kKG8wKSUwQSUwOSUwOS5sdW1hKCkpJTBBJTA5LmFkZChzaGFwZSgzJTJDJTIwMC4xMjUpJTBBJTA5JTA5LnJvdGF0ZSgxJTJDJTIwMSklMEElMDklMDkubXVsdCh2b3Jvbm9pKDEwMDAlMkMlMjAxKSUwQSUwOSUwOSUwOS5sdW1hKCkpJTBBJTA5JTA5LnJvdGF0ZSgxLjUpKSUwQSUwOS5zY3JvbGxYKCU1QjAuMSUyQyUyMC0wLjA2MjUlMkMlMjAwLjAwMyUyQyUyMDAuMDAwMDElNUQlMkMlMjAwKSUwQSUwOS5zY3JvbGxZKCU1QjAuMSUyQyUyMC0wLjA2MjUlMkMlMjAwLjAwNSUyQyUyMDAuMDAwMDElNUQlMkMlMjAwKSUwQSUwOS5vdXQoKSUzQg%3D%3D"
      />
    </div>
  );
}
