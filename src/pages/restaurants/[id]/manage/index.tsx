import { useState } from "react";
import { api } from "$/utils/api";
import { useRouter } from "next/router";

export default function Restaurant() {
    const router = useRouter();
    const idParam = router.query.id;

    // Check if the id is a valid string, otherwise handle the error
    if (typeof idParam !== 'string') {
        return <div>Error: Invalid restaurant ID</div>;
    }

    const id = parseInt(idParam, 10); // Convert the id to a number

    // Fetch the restaurant data using tRPC query
    const { data: restaurant, error, isLoading } = api.restaurant.getRestaurantById.useQuery({ id });

    // Local state to manage form inputs
    const [name, setName] = useState(restaurant?.name || "");
    const [address, setAddress] = useState(restaurant?.address || "");
    const [phone, setPhone] = useState(restaurant?.phone || "");

    // Handle form submission
    const updateRestaurantMutation = api.restaurant.updateRestaurantById.useMutation();

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateRestaurantMutation.mutateAsync({
                id,
                name,
                address,
                phone,
            });

            // Optionally, redirect or show a success message
            router.push(`/restaurants/${id}`);
        } catch (error) {
            console.error("Failed to update the restaurant", error);
        }
    };

    // Update the local state when data is loaded
    useState(() => {
        if (restaurant) {
            setName(restaurant.name);
            setAddress(restaurant.address);
            setPhone(restaurant.phone);
        }
    },);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="p-20">
            <h1>Manage Restaurant</h1>
            <button>Edit the menu</button>
            <button>Edit the restaurant</button>
            <button>Inventory</button>
        </div>
    );
}
