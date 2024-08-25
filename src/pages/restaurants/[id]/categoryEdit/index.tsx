import { useState } from "react";
import { api } from "$/utils/api";
import { useRouter } from "next/router";

export default function CategoryEdit() {
    const router = useRouter();
    const idParam = router.query.id;

    if (typeof idParam !== 'string') {
        return <div>Error: Invalid restaurant ID</div>;
    }
    
    const id = parseInt(idParam, 10); 

    const { data: categories , refetch} = api.categories.getCategoryByRestaurant.useQuery({ restaurantId: id });
    const { mutate: createCategory } = api.categories.create.useMutation({
        onSuccess: () => refetch(), // Refetch categories after creating a new one
    });

    const { mutate: updateCategory } = api.categories.updateCategoryById.useMutation({
        onSuccess: () => refetch(), // Refetch categories after updating
      });
      
    const { mutate: deleteCategory } = api.categories.deleteCategoryById.useMutation({
    onSuccess: () => refetch(), // Refetch categories after deleting
    });
    const { mutate: createType } = api.categoryTypes.create.useMutation({
        onSuccess: () => refetch(), // Refetch categories after creating a new type
    });

    const { mutate: updateType } = api.categoryTypes.update.useMutation({
    onSuccess: () => refetch(), // Refetch categories after updating a type
    });

    const { mutate: deleteType } = api.categoryTypes.delete.useMutation({
    onSuccess: () => refetch(), // Refetch categories after deleting a type
    });

    const [newCategoryName, setNewCategoryName] = useState('');
  const [newTypeName, setNewTypeName] = useState('');

  // State to handle editing
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingType, setEditingType] = useState<{ categoryId: number; typeId: number | null }>({ categoryId: 0, typeId: null });
  const [editingTypeName, setEditingTypeName] = useState('');


  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    createCategory({ name: newCategoryName, restaurant: id });
    setNewCategoryName(''); // Clear input after submission
  };

  // Handle creating a new type
  const handleCreateType = (categoryId: number) => {
    if (!newTypeName.trim()) return;

    createType({ name: newTypeName, restaurant: id });
    setNewTypeName(''); // Clear input after submission
  };

  // Handle editing a category
  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory && editingCategoryName.trim()) {
      updateCategory({ id: editingCategory, name: editingCategoryName });
      setEditingCategory(null);
      setEditingCategoryName('');
    }
  };

  // Handle editing a type
  const handleUpdateType = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType.typeId && editingTypeName.trim()) {
      updateType({ id: editingType.typeId, name: editingTypeName });
      setEditingType({ categoryId: 0, typeId: null });
      setEditingTypeName('');
    }
  };

  // Handle category edit
  const startEditing = (categoryId: number, categoryName: string) => {
    setEditingCategory(categoryId);
    setEditingCategoryName(categoryName);
  };

  return (
    <div>
      <h1>Manage Categories and Types</h1>

      {/* Form to create a new category */}
      <form onSubmit={handleCreateCategory}>
        <label htmlFor="new-category-name">New Category</label>
        <input
          type="text"
          id="new-category-name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button type="submit">Create Category</button>
      </form>

      {/* Display list of categories and their types */}
      <h2>Existing Categories</h2>
      <ul>
        {categories?.map((category) => (
          <li key={category.id}>
            {/* Category */}
            {editingCategory === category.id ? (
              <form onSubmit={handleUpdateCategory}>
                <input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingCategory(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <span>{category.name}</span>
                <button onClick={() => { setEditingCategory(category.id); setEditingCategoryName(category.name); }}>Edit</button>
                <button onClick={() => deleteCategory({ id: category.id })}>Delete</button>
              </>
            )}

            {/* Types associated with the category */}
            <ul>
              {categoryTypes?.map((type) => (
                <li key={type.id}>
                  {editingType.typeId === type.id ? (
                    <form onSubmit={handleUpdateType}>
                      <input
                        type="text"
                        value={editingTypeName}
                        onChange={(e) => setEditingTypeName(e.target.value)}
                      />
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditingType({ categoryId: 0, typeId: null })}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      <span>{type.name}</span>
                      <button onClick={() => setEditingType({ categoryId: category.id, typeId: type.id }) || setEditingTypeName(type.name)}>Edit</button>
                      <button onClick={() => deleteType({ id: type.id })}>Delete</button>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {/* Form to add a new type to this category */}
            <form onSubmit={(e) => { e.preventDefault(); handleCreateType(category.id); }}>
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="New Type Name"
              />
              <button type="submit">Add Type</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
};

