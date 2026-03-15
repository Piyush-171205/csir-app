import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaEdit, FaTrash, FaPlus, FaSave, FaTimes,
  FaRoad, FaTint, FaBolt, FaTrashAlt, FaLightbulb, FaSchool
} from 'react-icons/fa';
import { complaintCategories } from '../../data/adminData';

const AdminCategoriesPage = ({ t }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(complaintCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '📌',
    color: '#4a90e2',
    description: ''
  });

  const iconOptions = [
    { value: '🛣️', label: 'Road' },
    { value: '💧', label: 'Water' },
    { value: '⚡', label: 'Electricity' },
    { value: '🗑️', label: 'Garbage' },
    { value: '💡', label: 'Streetlight' },
    { value: '🌊', label: 'Drainage' },
    { value: '📚', label: 'Education' },
    { value: '🏥', label: 'Health' },
    { value: '🚌', label: 'Transport' },
    { value: '🏗️', label: 'Infrastructure' }
  ];

  const colorOptions = [
    { value: '#4a90e2', label: 'Blue' },
    { value: '#50c878', label: 'Green' },
    { value: '#f39c12', label: 'Orange' },
    { value: '#e67e22', label: 'Dark Orange' },
    { value: '#9b59b6', label: 'Purple' },
    { value: '#3498db', label: 'Light Blue' },
    { value: '#e74c3c', label: 'Red' },
    { value: '#2c3e50', label: 'Dark Blue' }
  ];

  const handleAddCategory = () => {
    const newId = `cat${categories.length + 1}`;
    setCategories([...categories, { 
      id: newId, 
      ...newCategory,
      count: 0 
    }]);
    setShowAddModal(false);
    setNewCategory({ name: '', icon: '📌', color: '#4a90e2', description: '' });
  };

  const handleEditCategory = () => {
    setCategories(categories.map(c => 
      c.id === selectedCategory.id ? selectedCategory : c
    ));
    setShowEditModal(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = () => {
    setCategories(categories.filter(c => c.id !== selectedCategory.id));
    setShowDeleteModal(false);
    setSelectedCategory(null);
  };

  const getIconComponent = (icon) => {
    switch(icon) {
      case '🛣️': return <FaRoad />;
      case '💧': return <FaTint />;
      case '⚡': return <FaBolt />;
      case '🗑️': return <FaTrashAlt />;
      case '💡': return <FaLightbulb />;
      case '📚': return <FaSchool />;
      default: return <span>{icon}</span>;
    }
  };

  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h2>Manage Complaint Categories</h2>
        <div className="header-actions">
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Category
          </button>
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card glass-card" style={{ borderTopColor: category.color }}>
            <div className="category-icon" style={{ backgroundColor: category.color + '20', color: category.color }}>
              {getIconComponent(category.icon) || category.icon}
            </div>
            <div className="category-content">
              <h3>{category.name}</h3>
              <p className="category-count">{category.count} complaints</p>
            </div>
            <div className="category-actions">
              <button 
                className="icon-btn edit" 
                onClick={() => {
                  setSelectedCategory(category);
                  setShowEditModal(true);
                }}
              >
                <FaEdit />
              </button>
              <button 
                className="icon-btn delete" 
                onClick={() => {
                  setSelectedCategory(category);
                  setShowDeleteModal(true);
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add New Category</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  required
                  placeholder="e.g., Road Damage"
                />
              </div>

              <div className="form-group">
                <label>Icon *</label>
                <select
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                  required
                >
                  {iconOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.value} {opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Color *</label>
                <select
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                  required
                >
                  {colorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="color-preview" style={{ backgroundColor: newCategory.color }}></div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Brief description of this complaint type"
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">Add Category</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Category</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleEditCategory(); }}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={selectedCategory.name}
                  onChange={(e) => setSelectedCategory({...selectedCategory, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Icon</label>
                <select
                  value={selectedCategory.icon}
                  onChange={(e) => setSelectedCategory({...selectedCategory, icon: e.target.value})}
                >
                  {iconOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.value} {opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Color</label>
                <select
                  value={selectedCategory.color}
                  onChange={(e) => setSelectedCategory({...selectedCategory, color: e.target.value})}
                >
                  {colorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Category</h3>
            <p>Are you sure you want to delete category <strong>{selectedCategory.name}</strong>?</p>
            {selectedCategory.count > 0 && (
              <p className="warning">
                This category has {selectedCategory.count} complaints associated with it!
              </p>
            )}
            <div className="modal-actions">
              <button className="delete-btn" onClick={handleDeleteCategory}>Delete</button>
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;