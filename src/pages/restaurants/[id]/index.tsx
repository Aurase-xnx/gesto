import { api } from "$/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Restaurant() {
    const router = useRouter();

    // Safely parse the id from the query params
    const idParam = router.query.id;

    // If the id is undefined or an array, handle that case
    if (typeof idParam !== 'string') {
        return <div>Error: Invalid restaurant ID</div>;
    }

    const id = parseInt(idParam, 10); // Convert the id to a number
    const { data: restaurant, error, isLoading } = api.restaurant.getRestaurantById.useQuery({ id });

    return (
        <div className="p-20">
            <h1>Restaurant's details</h1>
            <div>
                {restaurant ? (
                    <div>
                        <h2>{restaurant.name}</h2>
                        <p>{restaurant.address}</p>
                        <p>{restaurant.phone}</p>
                    </div>
                ) : (
                    <p>{id}</p>
                )}
                </div>
        </div>
    );
}