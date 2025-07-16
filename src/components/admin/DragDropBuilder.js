import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Plus, 
  Trash2, 
  Move,
  Edit3,
  Save
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const DragDropBuilder = () => {
  const [elements, setElements] = useState([
    {
      id: 'element-1',
      type: 'text',
      content: 'Welcome to Our Studio',
      style: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }
    },
    {
      id: 'element-2',
      type: 'image',
      content: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      style: { width: '300px', height: '200px' }
    },
    {
      id: 'element-3',
      type: 'text',
      content: 'Professional photography services for all occasions',
      style: { fontSize: '16px', color: '#6b7280' }
    }
  ]);

  const [editingElement, setEditingElement] = useState(null);
  const [newElementType, setNewElementType] = useState('text');
  const fileInputRef = useRef(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setElements(items);
    toast.success('Element repositioned!');
  };

  const addElement = () => {
    const newElement = {
      id: `element-${Date.now()}`,
      type: newElementType,
      content: newElementType === 'text' ? 'New text element' : '',
      style: newElementType === 'text' 
        ? { fontSize: '16px', color: '#1f2937' }
        : { width: '200px', height: '150px' }
    };

    if (newElementType === 'image') {
      fileInputRef.current?.click();
      return;
    }

    setElements([...elements, newElement]);
    toast.success('Element added!');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newElement = {
        id: `element-${Date.now()}`,
        type: 'image',
        content: imageUrl,
        style: { width: '300px', height: '200px' }
      };
      setElements([...elements, newElement]);
      toast.success('Image added!');
    }
  };

  const removeElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
    toast.success('Element removed!');
  };

  const updateElement = (id, updates) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const startEditing = (element) => {
    setEditingElement({ ...element });
  };

  const saveEdit = () => {
    if (editingElement) {
      updateElement(editingElement.id, editingElement);
      setEditingElement(null);
      toast.success('Element updated!');
    }
  };

  const cancelEdit = () => {
    setEditingElement(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Page Builder</h3>
        
        <div className="flex items-center space-x-4">
          <select
            value={newElementType}
            onChange={(e) => setNewElementType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="text">Text Element</option>
            <option value="image">Image Element</option>
            <option value="container">Container</option>
          </select>
          
          <button
            onClick={addElement}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Element</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Drag and Drop Area */}
      <div className="bg-white p-6 rounded-lg shadow-md min-h-96">
        <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center">
          <Move className="w-4 h-4 mr-2" />
          Drag elements to reorder
        </h4>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="page-elements">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-4 min-h-64 p-4 border-2 border-dashed rounded-lg transition-colors ${
                  snapshot.isDraggingOver 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-300'
                }`}
              >
                {elements.map((element, index) => (
                  <Draggable key={element.id} draggableId={element.id} index={index}>
                    {(provided, snapshot) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group relative bg-gray-50 border rounded-lg p-4 transition-all ${
                          snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        {/* Drag Handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="absolute top-2 left-2 p-1 bg-gray-200 rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Move className="w-4 h-4 text-gray-600" />
                        </div>

                        {/* Element Controls */}
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditing(element)}
                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeElement(element.id)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Element Content */}
                        <div className="mt-6">
                          {element.type === 'text' && (
                            <div
                              style={element.style}
                              className="cursor-pointer"
                              onClick={() => startEditing(element)}
                            >
                              {element.content}
                            </div>
                          )}
                          
                          {element.type === 'image' && (
                            <img
                              src={element.content}
                              alt="Element"
                              style={element.style}
                              className="rounded cursor-pointer object-cover"
                              onClick={() => startEditing(element)}
                            />
                          )}
                          
                          {element.type === 'container' && (
                            <div
                              style={element.style}
                              className="border-2 border-dashed border-gray-300 rounded p-4 min-h-24 cursor-pointer"
                              onClick={() => startEditing(element)}
                            >
                              <div className="text-center text-gray-500">
                                <Square className="w-8 h-8 mx-auto mb-2" />
                                Container Element
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {elements.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Square className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No elements yet. Add some elements to get started!</p>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Edit Modal */}
      {editingElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Element</h3>
            
            <div className="space-y-4">
              {editingElement.type === 'text' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={editingElement.content}
                      onChange={(e) => setEditingElement({
                        ...editingElement,
                        content: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Font Size
                      </label>
                      <input
                        type="text"
                        value={editingElement.style.fontSize || '16px'}
                        onChange={(e) => setEditingElement({
                          ...editingElement,
                          style: { ...editingElement.style, fontSize: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        value={editingElement.style.color || '#000000'}
                        onChange={(e) => setEditingElement({
                          ...editingElement,
                          style: { ...editingElement.style, color: e.target.value }
                        })}
                        className="w-full h-10 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {editingElement.type === 'image' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width
                    </label>
                    <input
                      type="text"
                      value={editingElement.style.width || '200px'}
                      onChange={(e) => setEditingElement({
                        ...editingElement,
                        style: { ...editingElement.style, width: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height
                    </label>
                    <input
                      type="text"
                      value={editingElement.style.height || '150px'}
                      onChange={(e) => setEditingElement({
                        ...editingElement,
                        style: { ...editingElement.style, height: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropBuilder;