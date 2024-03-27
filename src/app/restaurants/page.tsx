import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";
import RestaurantCards from "~/app/_components/restaurant-cards";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col px-16 text-white">
      <div>
        <h1 className="text-3xl">Available restaurants</h1>
        <div className="grid grid-cols-2 ">
          <RestaurantCards></RestaurantCards>
          <RestaurantCards></RestaurantCards>
          <RestaurantCards></RestaurantCards>
          <RestaurantCards></RestaurantCards>
          <RestaurantCards></RestaurantCards>
          <RestaurantCards></RestaurantCards>
        </div>
      </div>
    </main>
  );
}
