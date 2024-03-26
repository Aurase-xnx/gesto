import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-10 text-white">
      <div>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn m-1">
            Click
          </div>
          <ul
            tabIndex={0}
            className="menup-2 dropdown-content z-[1] w-52 rounded-box bg-base-100 shadow"
          >
            <li>
              <Link href="">Item 1</Link>
            </li>
            <li>
              <Link href="">Item 2</Link>
            </li>
          </ul>
        </div>
        <h1>Restaurants</h1>
      </div>
    </main>
  );
}
