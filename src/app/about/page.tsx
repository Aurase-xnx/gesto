import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <div>
        <h1>
          Gesto is THE definitive application for every restaurant owner and
          enjoyer
        </h1>
      </div>
    </main>
  );
}
