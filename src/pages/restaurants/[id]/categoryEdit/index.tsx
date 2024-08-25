import { useState } from "react";
import { api } from "$/utils/api";
import { useRouter } from "next/router";
import { cp } from "fs";

export default function CategoryEdit() {
    const router = useRouter();
    const idParam = router.query.id;

    if (typeof idParam !== 'string') {
        return <div>Error: Invalid restaurant ID</div>;
    }
    const restaurantId = parseInt(idParam, 10); 

    const { data: categories, refetch } = api.categories.getCategoryWithTypesByRestaurant.useQuery({ restaurantId });
  const createCategory = api.categories.createCategory.useMutation();
  const updateCategory = api.categories.updateCategory.useMutation();
  const deleteCategory = api.categories.deleteCategoryAndTypes.useMutation();
  const createCategoryType = api.categories.createCategoryType.useMutation();
  const updateCategoryType = api.categories.updateCategoryType.useMutation();
  const deleteCategoryType = api.categories.deleteCategoryType.useMutation();


  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [newCategoryTypeName, setNewCategoryTypeName] = useState<{ [key: number]: string }>({});
  const [editingCategoryTypeId, setEditingCategoryTypeId] = useState<number | null>(null);
  const [editedCategoryTypeName, setEditedCategoryTypeName] = useState('');
  const [showTypeInput, setShowTypeInput] = useState<{ [key: number]: boolean }>({});

  const handleCreateCategory = async () => {
    await createCategory.mutateAsync({ name: newCategoryName, restaurantId });
    setNewCategoryName('');
    refetch();
  };

  const handleUpdateCategory = async (id: number, name: string) => {
    await updateCategory.mutateAsync({ id, name });
    setEditingCategoryId(null);
    refetch();
  };

  const handleDeleteCategory = async (id: number) => {
    await deleteCategory.mutateAsync({ id });
    refetch();
  };

  const handleCreateCategoryType = async (categoryId: number) => {
    const typeName = newCategoryTypeName[categoryId];
    if (typeName) {
      await createCategoryType.mutateAsync({ name: typeName, categoryId });
      setNewCategoryTypeName({ ...newCategoryTypeName, [categoryId]: '' });
      setShowTypeInput({ ...showTypeInput, [categoryId]: false });
      refetch();
    }
  };

  const handleUpdateCategoryType = async (id: number, name: string) => {
    await updateCategoryType.mutateAsync({ id, name });
    setEditingCategoryTypeId(null);
    refetch();
  };

  const handleDeleteCategoryType = async (id: number) => {
    await deleteCategoryType.mutateAsync({ id });
    refetch();
  };

  // Sorting categories alphabetically
  const sortedCategories = categories?.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <h1>Manage Categories</h1>
      <div>
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button onClick={handleCreateCategory}>Create Category</button>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {sortedCategories?.map((category) => (
          <div key={category.id} style={{ flex: '1', textAlign: 'center' }}>
            {/* Category Editing */}
            {editingCategoryId === category.id ? (
              <>
                <input
                  type="text"
                  value={editedCategoryName}
                  onChange={(e) => setEditedCategoryName(e.target.value)}
                />
                <button onClick={() => handleUpdateCategory(category.id, editedCategoryName)}>Save</button>
                <button onClick={() => setEditingCategoryId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <div>
                  <span>{category.name}</span>
                  <button onClick={() => { setEditingCategoryId(category.id); setEditedCategoryName(category.name); }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                </div>
              </>
            )}

            {/* Category Types List */}
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {category.categoryTypes.map((type) => (
                <li key={type.id}>
                  {editingCategoryTypeId === type.id ? (
                    <>
                      <input
                        type="text"
                        value={editedCategoryTypeName}
                        onChange={(e) => setEditedCategoryTypeName(e.target.value)}
                      />
                      <button onClick={() => handleUpdateCategoryType(type.id, editedCategoryTypeName)}>Save</button>
                      <button onClick={() => setEditingCategoryTypeId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span>{type.name}</span>
                      <button onClick={() => { setEditingCategoryTypeId(type.id); setEditedCategoryTypeName(type.name); }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteCategoryType(type.id)}>Delete</button>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {/* Add New Category Type */}
            {showTypeInput[category.id] ? (
              <div>
                <input
                  type="text"
                  placeholder="New Category Type Name"
                  value={newCategoryTypeName[category.id] || ''}
                  onChange={(e) => setNewCategoryTypeName({ ...newCategoryTypeName, [category.id]: e.target.value })}
                />
                <button onClick={() => handleCreateCategoryType(category.id)}>Add</button>
                <button onClick={() => setShowTypeInput({ ...showTypeInput, [category.id]: false })}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setShowTypeInput({ ...showTypeInput, [category.id]: true })}>+</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};