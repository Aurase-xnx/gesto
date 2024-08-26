import { useState } from 'react';
import { api } from '$/utils/api'; // Adjust the import according to your project structure
import { useRouter } from 'next/router';

const AddMenuItem = () => {
  const router = useRouter();
    const idParam = router.query.id;

    if (typeof idParam !== 'string') {
        return <div>Error: Invalid restaurant ID</div>;
    }
    const restaurantId = parseInt(idParam, 10); 
  console.log('Restaurant ID:', restaurantId);

  const { data: categories } = api.categories.getCategoryByRestaurant.useQuery({ restaurantId: restaurantId || 0 });
  const { data: menuItems, refetch: refetchMenuItems } = api.menuItems.getByRestaurant.useQuery({ restaurantId: restaurantId || 0 });

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<any>(null);

  const { data: types } = api.categoryTypes.getByCategory.useQuery(
    { categoryId: selectedCategoryId || 0 },
    {
      enabled: !!selectedCategoryId, // Fetch only when categoryId is selected
    }
  );

  const { mutate: createMenuItem } = api.menuItems.create.useMutation({
    onSuccess: () => refetchMenuItems(), // Refetch menu items after adding a new one
  });

  const { mutate: updateMenuItem } = api.menuItems.update.useMutation({
    onSuccess: () => {
      refetchMenuItems();
      setEditItem(null); // Hide the edit form after successful update
    },
  });

  const { mutate: deleteMenuItem } = api.menuItems.delete.useMutation({
    onSuccess: () => refetchMenuItems(), // Refetch menu items after deleting one
  });

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
      categoryTypeId: formData.get('type') ? Number(formData.get('type')) : null, // or null if you prefer
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
  };

  const handleEdit = (item: any) => {
    setEditItem(item); // Set the item to be edited
    setSelectedCategoryId(item.categoryId); // Pre-select the category
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      id: editItem.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      categoryId: Number(formData.get('category')),
      categoryTypeId: formData.get('type') ? Number(formData.get('type')) : null, // or null if you prefer
      restaurantId: restaurantId,
    };

    console.log('Edit Data:', data);

    try {
      await updateMenuItem(data);
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const handleDelete = async (menuItemId: number) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItem({ id: menuItemId });
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

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

      <h2>Existing Menu Items</h2>
      <table
        border={0}
        style={{
          marginTop: '20px',
          width: '100%',
          borderCollapse: 'collapse', // Ensures borders do not double up
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Type</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
        {menuItems?.sort((a, b) => a.id - b.id).map((item) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.description}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.price.toFixed(2)}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.category.name}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.categoryType?.name || 'N/A'}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editItem && (
        <div>
          <h2>Edit Menu Item</h2>
          <form onSubmit={handleSave}>
            <input type="hidden" name="id" value={editItem.id} />
            <label htmlFor="edit-name">Name</label>
            <input type="text" name="name" id="edit-name" defaultValue={editItem.name} required />
            <label htmlFor="edit-description">Description</label>
            <input type="text" name="description" id="edit-description" defaultValue={editItem.description} />
            <label htmlFor="edit-price">Price</label>
            <input type="text" name="price" id="edit-price" defaultValue={editItem.price} required />

            <label htmlFor="edit-category">Category</label>
            <select
              name="category"
              id="edit-category"
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

            <label htmlFor="edit-type">Type</label>
            <select name="type" id="edit-type" disabled={!selectedCategoryId}>
              <option value="">Select a type</option>
              {types?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>

            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditItem(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddMenuItem;
