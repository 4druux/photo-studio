import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Layout, 
  Image as ImageIcon, 
  Settings, 
  ArrowLeft,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageUploader from '../components/admin/ImageUploader';
import DragDropBuilder from '../components/admin/DragDropBuilder';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadedImages, setUploadedImages] = useState([]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'upload', label: 'Upload Images', icon: Upload },
    { id: 'builder', label: 'Page Builder', icon: Layout },
    { id: 'gallery', label: 'Manage Gallery', icon: ImageIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Total Images', value: '156', icon: ImageIcon, color: 'bg-blue-500' },
    { label: 'Page Views', value: '2,847', icon: Users, color: 'bg-green-500' },
    { label: 'Bookings', value: '23', icon: Calendar, color: 'bg-purple-500' },
    { label: 'Revenue', value: '$4,250', icon: BarChart3, color: 'bg-orange-500' },
  ];

  const handleImagesUploaded = (newImages) => {
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Site</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Welcome back, Admin
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-teal-100 text-teal-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-lg shadow-sm p-6"
                        >
                          <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-600">
                                {stat.label}
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {stat.value}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {[
                        { action: 'New booking received', time: '2 hours ago', type: 'booking' },
                        { action: 'Image uploaded to gallery', time: '4 hours ago', type: 'upload' },
                        { action: 'Page updated', time: '1 day ago', type: 'edit' },
                        { action: 'New contact message', time: '2 days ago', type: 'message' },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 py-2">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'booking' ? 'bg-green-500' :
                            activity.type === 'upload' ? 'bg-blue-500' :
                            activity.type === 'edit' ? 'bg-yellow-500' :
                            'bg-purple-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Upload Images</h2>
                  <ImageUploader onImagesUploaded={handleImagesUploaded} />
                </div>
              )}

              {activeTab === 'builder' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Page Builder</h2>
                  <DragDropBuilder />
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Manage Gallery</h2>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="px-4 py-2 bg-white text-gray-900 rounded-md mr-2">
                                Edit
                              </button>
                              <button className="px-4 py-2 bg-red-500 text-white rounded-md">
                                Delete
                              </button>
                            </div>
                          </div>
                          {image.caption && (
                            <p className="mt-2 text-sm text-gray-600">{image.caption}</p>
                          )}
                        </div>
                      ))}
                      
                      {uploadedImages.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-gray-500">
                          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No images uploaded yet. Use the Upload Images tab to add some!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Site Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Site Title
                            </label>
                            <input
                              type="text"
                              defaultValue="Antika Studio"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Contact Email
                            </label>
                            <input
                              type="email"
                              defaultValue="info@antikastudio.com"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Gallery Settings
                        </h3>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-2" />
                            <span className="text-sm text-gray-700">
                              Enable image captions
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-2" />
                            <span className="text-sm text-gray-700">
                              Allow image downloads
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm text-gray-700">
                              Require approval for new uploads
                            </span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
                          Save Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;