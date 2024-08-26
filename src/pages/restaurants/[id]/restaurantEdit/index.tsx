import { useState, useEffect } from "react";
import { api } from "$/utils/api";
import { useRouter } from "next/router";

export default function RestaurantEdit() {
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
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [capacity, setCapacity] = useState(restaurant?.capacity || 0);
    
    // Update the local state when data is loaded
    useEffect(() => {
        if (restaurant) {
            setName(restaurant.name);
            setAddress(restaurant.address);
            setPhone(restaurant.phone);
            setCapacity(restaurant.capacity || 0);
        }
    }, [restaurant]);

    // Mutation to update the restaurant
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
                capacity,
            });

            // Optionally, redirect or show a success message
            router.push(`/restaurants/${id}/manage`);
        } catch (error) {
            console.error("Failed to update the restaurant", error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Edit Restaurant</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Address:
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Phone:
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                <label>
                        Capacity:
                        <input
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(parseInt(e.target.value))}
                        />
                    </label>
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}
