import { useState, useEffect } from 'react';
import { api } from '$/utils/api';  // Adjust the import according to your project structure
import { useRouter } from 'next/router';

const AddMenuItem = () => {
  const router = useRouter();
  const { id } = router.query; // Restaurant ID
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [newCategory, setNewCategory] = useState(false);
  const [newType, setNewType] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch categories
  const fetchCategories = api.category.getAll.useQuery();
  const createCategory = api.categories.create.useMutation();
  const createType = api.types.create.useMutation();
  const fetchTypes = api.types.getByCategory.useQuery(category, { enabled: !!category });
  const createMenuItem = api.menuItems.create.useMutation();

  useEffect(() => {
    if (fetchCategories.data) {
      setCategories(fetchCategories.data);
    }
  }, [fetchCategories.data]);

  useEffect(() => {
    if (fetchTypes.data) {
      setTypes(fetchTypes.data);
    }
  }, [fetchTypes.data]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    setCategory(value);

    // If the user selects "Add New Category" or types in a new category
    if (value === 'new' || !categories.some((cat: { id: number; name: string }) => cat.name === value)) {
      setNewCategory(true);
      setTypes([]); // Reset types when a new category is being created
      setType('');
    } else {
      setNewCategory(false);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    setType(value);

    // If the user selects "Add New Type" or types in a new type
    if (value === 'new' || !types.some((type: { id: number; name: string }) => type.name === value)) {
      setNewType(true);
    } else {
      setNewType(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let categoryId = category;
      let typeId = type;

      // If creating a new category
      if (newCategory) {
        const createdCategory = await createCategory.mutateAsync({ name: category });
        categoryId = createdCategory.id;
      }

      // If creating a new type
      if (newType) {
        const createdType = await createType.mutateAsync({ name: type, categoryId });
        typeId = createdType.id;
      }

      await createMenuItem.mutateAsync({
        id: Number(id),
        name,
        price: Number(price),
        description,
        categoryId: categoryId,
        typeId: typeId || null,
      });

      setSuccess('Menu item added successfully!');
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');
      setType('');
      setNewCategory(false);
      setNewType(false);
    } catch (err) {
      setError('Failed to add menu item. Please try again.');
    }
  };

  return (
    <div>
      <h1>Add Menu Item</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description (optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          {newCategory ? (
            <input
              type="text"
              id="new-category"
              value={category}
              onChange={handleCategoryChange}
              required
              placeholder="Enter new category"
            />
          ) : (
            <select id="category" value={category} onChange={handleCategoryChange} required>
              <option value="">Select Category</option>
              {categories.map((cat: { id: number; name: string }) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              <option value="new">Add New Category</option>
            </select>
          )}
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          {newType ? (
            <input
              type="text"
              id="new-type"
              value={type}
              onChange={handleTypeChange}
              required
              placeholder="Enter new type"
            />
          ) : (
            <select id="type" value={type} onChange={handleTypeChange} required>
              <option value="">Select Type</option>
              {types.map((typeOption: { id: number; name: string }) => (
                <option key={typeOption.id} value={typeOption.id}>
                  {typeOption.name}
                </option>
              ))}
              <option value="new">Add New Type</option>
            </select>
          )}
        </div>
        <button type="submit">Add Menu Item</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default AddMenuItem;
