import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react"; // Utiliser usePage pour récupérer les props

const Item = () => {
    const { categoryId } = usePage().props; // Récupérer l'ID depuis Inertia
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!categoryId) return; // Vérifier si l'ID existe avant de fetch

        fetch(`/menu/${categoryId}/items`)
            .then((response) => response.json())
            .then((data) => setItems(data))
            .catch((error) => console.error("Error fetching items:", error));
    }, [categoryId]);

    return (
        <div>
            <h1>Items for Category ID: {categoryId}</h1>
            {items.length > 0 ? (
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No items available for this category.</p>
            )}
        </div>
    );
};

export default Item;
