import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faImage, faTrash } from '@fortawesome/free-solid-svg-icons';

const CATEGORIES = ['Athletics', 'Aesthetic', 'Life'];

const CATEGORY_CONFIG = {
  Athletics: { 
    gradient: 'from-[#915EFF] to-[#6B4EE6]',
    accent: '#915EFF',
    description: 'The grind, game days, and athletic moments'
  },
  Aesthetic: { 
    gradient: 'from-[#00CEA8] to-[#00A896]',
    accent: '#00CEA8',
    description: 'Style, fashion, and visual vibes'
  },
  Life: { 
    gradient: 'from-[#BF61FF] to-[#915EFF]',
    accent: '#BF61FF',
    description: 'Travel, friends, and everyday moments'
  }
};

const revokeObjectUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

const MoodBoardSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    category: 'Athletics',
    label: '',
    imageFile: null,
    previewUrl: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchMoodBoard();
  }, []);

  const fetchMoodBoard = async () => {
    try {
      const response = await axios.get('/api/moodboard');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching mood board:', error);
      toast.error('Failed to fetch mood board');
    } finally {
      setLoading(false);
    }
  };

  // Filter items by category
  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const getCategoryGradient = (category) => {
    return CATEGORY_CONFIG[category]?.gradient || 'from-gray-500 to-gray-600';
  };

  const getCategoryAccent = (category) => {
    return CATEGORY_CONFIG[category]?.accent || '#888';
  };

  const resetUploadForm = () => {
    revokeObjectUrl(uploadForm.previewUrl);
    const fileInput = document.getElementById('mood-image-upload');
    if (fileInput) fileInput.value = '';
    setUploadForm({
      category: 'Athletics',
      label: '',
      imageFile: null,
      previewUrl: null,
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    revokeObjectUrl(uploadForm.previewUrl);
    const previewUrl = URL.createObjectURL(file);
    setUploadForm((prev) => ({
      ...prev,
      imageFile: file,
      previewUrl,
    }));
  };

  const handleUpload = async () => {
    if (!uploadForm.label) {
      toast.error('Give this moment a name!');
      return;
    }
    if (!uploadForm.imageFile) {
      toast.error('Select an image first');
      return;
    }

    const data = new FormData();
    data.append('category', uploadForm.category);
    data.append('label', uploadForm.label);
    data.append('image', uploadForm.imageFile);

    try {
      setIsUploading(true);
      await axios.post('/api/moodboard', data);
      toast.success('Added to your board!');
      fetchMoodBoard();
      resetUploadForm();
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error('Upload failed. Try again!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (publicId, label) => {
    if (!confirm(`Delete "${label}"?`)) return;

    try {
      await axios.delete(`/api/moodboard/${publicId}`);
      toast.success('Removed from board');
      fetchMoodBoard();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#915EFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Mood Board
          </h2>
          <p className="text-secondary text-sm mt-2">
            Your visual story. Curate moments that define you beyond the code.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#915EFF] to-[#00CEA8] text-white font-medium hover:brightness-110 transition-all shadow-lg shadow-[#915EFF]/20"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Moment
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-white">{items.length}</p>
          <p className="text-xs text-secondary mt-1 uppercase tracking-wider">Total Moments</p>
        </div>
        {CATEGORIES.map((cat) => {
          const count = items.filter(i => i.category === cat).length;
          const config = CATEGORY_CONFIG[cat];
          return (
            <div
              key={cat}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center"
              style={{ borderColor: `${config.accent}30` }}
            >
              <p className="text-3xl font-bold text-white">{count}</p>
              <p className="text-xs text-secondary mt-1 flex items-center justify-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: config.accent }}
                />
                <span className="uppercase tracking-wider">{cat}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Category Filter */}
      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === 'All'
              ? 'bg-gradient-to-r from-[#915EFF] to-[#7a4ee6] text-white'
              : 'text-secondary hover:text-white'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#915EFF] to-[#7a4ee6] text-white'
                  : 'text-secondary hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4" style={{ columnGap: '16px' }}>
          {filteredItems.map((item) => (
            <div
              key={item.publicId}
              className="relative mb-4 inline-block w-full overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0f] group hover:border-white/10 transition-all"
              style={{ breakInside: 'avoid' }}
            >
              <img
                src={item.imageUrl}
                alt={item.label}
                className="w-full h-auto block"
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-white font-medium text-sm">{item.label}</p>
                      <span className="text-[11px] text-white/50 uppercase tracking-widest mt-1 block">
                        {item.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(item.publicId, item.label)}
                      className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm text-white/70 flex items-center justify-center hover:bg-red-500/80 hover:text-white transition-colors"
                      aria-label="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-[#915EFF]/20 to-[#00CEA8]/20 border border-white/10">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#915EFF] to-[#00CEA8]" />
          </div>
          <p className="text-white/80 font-medium text-lg">No moments yet</p>
          <p className="text-secondary text-sm mt-2">
            {activeCategory === 'All' 
              ? 'Start building your visual story' 
              : `Add some ${activeCategory.toLowerCase()} content`}
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-[#915EFF] to-[#00CEA8] text-white font-medium hover:brightness-110 transition-all"
          >
            Add Your First Moment
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0d14] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Add a Moment</h3>
                <p className="text-secondary text-sm mt-1">Capture what defines you</p>
              </div>
              <button 
                onClick={() => { setShowUploadModal(false); resetUploadForm(); }}
                className="w-8 h-8 rounded-full bg-white/5 text-secondary hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Image</label>
                <div
                  className="relative w-full aspect-[4/5] bg-white/5 border-2 border-dashed border-white/20 rounded-2xl overflow-hidden cursor-pointer hover:border-[#915EFF]/50 transition-all"
                  onClick={() => document.getElementById('mood-image-upload').click()}
                >
                  {uploadForm.previewUrl ? (
                    <img
                      src={uploadForm.previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary">
                      <FontAwesomeIcon icon={faImage} className="text-5xl mb-3 text-white/20" />
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs text-secondary/60 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
                <input
                  id="mood-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-3">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const config = CATEGORY_CONFIG[cat];
                    const isSelected = uploadForm.category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setUploadForm((prev) => ({ ...prev, category: cat }))}
                        className={`py-3 px-2 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                          isSelected
                            ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                            : 'bg-white/5 text-secondary hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <span 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: isSelected ? '#fff' : config.accent }}
                        />
                        <span className="text-xs">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Caption</label>
                <input
                  type="text"
                  value={uploadForm.label}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, label: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-secondary/50 focus:border-[#915EFF]/50 focus:outline-none"
                  placeholder="Game day, NYC vibes, Studio session..."
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowUploadModal(false); resetUploadForm(); }}
                  className="flex-1 px-5 py-3 rounded-xl bg-white/5 text-secondary hover:text-white border border-white/10 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-[#915EFF] to-[#7a4ee6] text-white font-semibold hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {isUploading ? 'Uploading...' : 'Add to Board'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodBoardSection;
