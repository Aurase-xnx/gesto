import { useState, useEffect } from 'react';
import { api } from '$/utils/api';  // Adjust the import according to your project structure
import { useRouter } from 'next/router';

const AddMenuItem = () => {
  const router = useRouter();
  const restaurantIdString = router.query.id; // Restaurant ID
  const restaurantId = restaurantIdString ? parseInt(restaurantIdString as string, 10) : null;
  console.log('Restaurant ID:', restaurantId);

  const { data: categories } = api.categories.getCategoryByRestaurant.useQuery({ restaurantId: restaurantId || 0 });
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  const { data: types } = api.categoryTypes.getByCategory.useQuery(
    { categoryId: selectedCategoryId || 0 }, // Provide a valid number, like 0, if selectedCategoryId is null
    {
      enabled: !!selectedCategoryId, // Fetch only when categoryId is selected
    }
  );

  const { mutate: createMenuItem } = api.menuItems.create.useMutation();
  const { mutate: createCategory } = api.categories.create.useMutation();
  const { mutate: createType } = api.categoryTypes.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantId === null) {
      console.error('Restaurant ID is missing');
      return;
    }
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      categoryId: Number(formData.get('category')),
      typeId: Number(formData.get('type')),
      restaurantId: restaurantId,
    };

    console.log('Form Data:', data);

    try {
      await createMenuItem(data);
    } catch (error) {
      console.error('Error creating menu item:', error);
    }
  };

  const handleCategoryEdit = async () => {
    router.push(`/restaurants/${restaurantId}/categoryEdit`);
  }

  return (
    <div>
      <h1>Add Menu Item</h1>

      <button onClick={handleCategoryEdit}>Edit categories and types</button>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" required />
        <label htmlFor="description">Description</label>
        <input type="text" name="description" id="description" />
        <label htmlFor="price">Price</label>
        <input type="text" name="price" id="price" required />
        
        <label htmlFor="category">Category</label>
        <select
          name="category"
          id="category"
          onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
          value={selectedCategoryId || ''}
        >
          <option value="">Select a category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        
        <label htmlFor="type">Type</label>
        <select name="type" id="type" disabled={!selectedCategoryId}>
          <option value="">Select a type</option>
          {types?.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        <button type="submit">Add Menu Item</button>
      </form>
    </div>
  );
};

export default AddMenuItem;
