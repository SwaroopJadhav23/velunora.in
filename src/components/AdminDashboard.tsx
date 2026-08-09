import React, { useEffect, useState } from 'react';
import { 
  BarChart2, 
  Tag, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  Upload, 
  Lock, 
  X,
  Menu,
  Percent,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { 
  fetchProducts, 
  saveProduct, 
  deleteProduct, 
  fetchSections, 
  saveSection, 
  deleteSection,
  fetchCoupons, 
  saveCoupon, 
  deleteCoupon, 
  fetchAnalytics, 
  fetchSecuritySettings,
  loginAdmin,
  updateSecuritySettings,
  API_BASE_URL,
  CouponData
} from '../config/api';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'pin' | 'password'>('pin');
  const [authError, setAuthError] = useState('');

  // Password visibility states
  const [showPin, setShowPin] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'sections' | 'coupons' | 'security'>('products');
  const [hoveredAssetKey, setHoveredAssetKey] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Security configuration states
  const [securityConfig, setSecurityConfig] = useState({ pin: '', username: '', password: '' });
  const [newPin, setNewPin] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securitySuccessMessage, setSecuritySuccessMessage] = useState('');
  const [securityErrorMessage, setSecurityErrorMessage] = useState('');
  
  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionLoadingMessage, setActionLoadingMessage] = useState('');

  // Modals & form states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    universe: 'Pokémon',
    price: '',
    originalPrice: '',
    isSpecialOffer: false,
    badge: '',
    description: '',
    floatingDecos: '⭐, ✨'
  });
  const [productImage, setProductImage] = useState<File | null>(null);

  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: '',
    minPurchase: '',
    isActive: true,
    expiryDate: ''
  });

  // Load backend data
  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, coupRes, secRes, analRes, secConfigRes] = await Promise.all([
        fetchProducts(),
        fetchCoupons(),
        fetchSections(),
        fetchAnalytics(),
        fetchSecuritySettings().catch(() => ({ pin: '1234', username: 'admin', password: 'admin123' }))
      ]);
      setProducts(prodRes);
      setCoupons(coupRes);
      setSections(secRes);
      setAnalytics(analRes);
      if (secConfigRes) {
        setSecurityConfig(secConfigRes);
        setNewPin(secConfigRes.pin || '');
        setNewUsername(secConfigRes.username || '');
        setNewPassword(secConfigRes.password || '');
      }
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Auth handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAuthError('');
      const credentials = loginMethod === 'pin' 
        ? { pin } 
        : { username, password };
      
      const response = await loginAdmin(credentials);
      if (response.success) {
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError(response.message || 'Authentication failed. Please try again.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Incorrect credentials. Please try again.');
    }
  };

  // Security credentials update handler
  const handleSecurityUpdate = async (e: React.FormEvent, updateType: 'pin' | 'password') => {
    e.preventDefault();
    setSecuritySuccessMessage('');
    setSecurityErrorMessage('');
    setActionLoadingMessage('Updating secure credentials...');
    setActionLoading(true);
    try {
      const payload = updateType === 'pin'
        ? { pin: newPin }
        : { username: newUsername, password: newPassword };
      
      const response = await updateSecuritySettings(payload);
      if (response.success) {
        setSecuritySuccessMessage(response.message || 'Credentials updated');
        if (response.data) {
          setSecurityConfig(response.data);
          setNewPin(response.data.pin || '');
          setNewUsername(response.data.username || '');
          setNewPassword(response.data.password || '');
        }
      } else {
        setSecurityErrorMessage(response.message || 'Update failed.');
      }
    } catch (err: any) {
      setSecurityErrorMessage(err.message || 'Failed to update credentials.');
    } finally {
      setActionLoading(false);
    }
  };

  // Section Image upload helper
  const handleSectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionName: string, key: string, label: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActionLoadingMessage('Uploading image and updating section asset...');
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('sectionName', sectionName);
      formData.append('key', key);
      formData.append('label', label);
      formData.append('image', file);

      await saveSection(formData);
      alert('Section image updated successfully!');
      loadData();
    } catch (err: any) {
      alert(`Error updating section image: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Section Image reset helper
  const handleSectionImageReset = async (sectionName: string, key: string) => {
    if (!window.confirm('Are you sure you want to reset this slot to the default fallback image?')) return;
    setActionLoadingMessage('Resetting section image to default fallback...');
    setActionLoading(true);
    try {
      await deleteSection(sectionName, key);
      alert('Section image reset to default successfully!');
      loadData();
    } catch (err: any) {
      alert(`Error resetting section image: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Product submission
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoadingMessage(editingProduct ? 'Saving changes to product...' : 'Uploading image and publishing new product plush...');
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('slug', productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      formData.append('universe', productForm.universe);
      formData.append('price', productForm.price);
      if (productForm.originalPrice) {
        formData.append('originalPrice', productForm.originalPrice);
        // Calculate discount percentage automatically
        const price = Number(productForm.price);
        const originalPrice = Number(productForm.originalPrice);
        if (originalPrice > price) {
          const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
          formData.append('discountPercentage', discount.toString());
        }
      }
      formData.append('isSpecialOffer', String(productForm.isSpecialOffer));
      formData.append('badge', productForm.badge);
      formData.append('description', productForm.description);
      formData.append('floatingDecos', productForm.floatingDecos);

      if (productImage) {
        formData.append('image', productImage);
      }

      await saveProduct(formData, editingProduct?.id);
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setProductImage(null);
      setProductForm({
        name: '',
        slug: '',
        universe: 'Pokémon',
        price: '',
        originalPrice: '',
        isSpecialOffer: false,
        badge: '',
        description: '',
        floatingDecos: '⭐, ✨'
      });
      loadData();
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setActionLoadingMessage('Deleting product from catalog...');
    setActionLoading(true);
    try {
      await deleteProduct(id);
      loadData();
    } catch (err: any) {
      alert(`Error deleting product: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Edit product trigger
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      universe: product.universe,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      isSpecialOffer: product.isSpecialOffer,
      badge: product.badge || '',
      description: product.description,
      floatingDecos: product.floatingDecos?.join(', ') || ''
    });
    setIsProductModalOpen(true);
  };

  // Coupon submission
  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoadingMessage('Saving discount coupon code...');
    setActionLoading(true);
    try {
      const coupon: CouponData = {
        code: couponForm.code.toUpperCase(),
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        minPurchase: Number(couponForm.minPurchase || 0),
        isActive: couponForm.isActive,
        expiryDate: couponForm.expiryDate || null
      };

      await saveCoupon(coupon);
      setCouponForm({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchase: '',
        isActive: true,
        expiryDate: ''
      });
      loadData();
    } catch (err: any) {
      alert(`Error saving coupon: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    setActionLoadingMessage('Deleting coupon...');
    setActionLoading(true);
    try {
      await deleteCoupon(id);
      loadData();
    } catch (err: any) {
      alert(`Error deleting coupon: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle coupon status
  const handleToggleCoupon = async (coupon: any) => {
    setActionLoadingMessage('Updating coupon status...');
    setActionLoading(true);
    try {
      await saveCoupon({
        ...coupon,
        isActive: !coupon.isActive
      });
      loadData();
    } catch (err: any) {
      alert(`Error toggling coupon: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Check if image is local upload or remote
  const getImgUrl = (src: string) => {
    if (!src) return '/placeholder.png';
    if (src.startsWith('http') || src.startsWith('/')) {
      return src.startsWith('/') ? `${API_BASE_URL}${src}` : src;
    }
    return src;
  };

  // Render Login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F8FAFF] via-[#F2F6FF] to-[#FAF5FF] px-6">
        <div className="w-full max-w-md bg-white/75 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(124,58,237,0.1)] text-center">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5">
            <Lock size={28} />
          </div>
          <h2 className="font-body text-3xl font-extrabold text-darkText mb-2">Admin Security Gate</h2>
          <p className="font-body text-sm text-darkText/60 mb-6 font-medium">Verify credentials using either your PIN passcode or Admin ID & Password.</p>
          
          {/* Login Method Toggle */}
          <div className="flex bg-bgMain border border-darkText/5 p-1 rounded-full shadow-inner mb-6 w-full">
            <button
              type="button"
              onClick={() => { setLoginMethod('pin'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-full font-body font-bold text-xs transition-all cursor-pointer ${loginMethod === 'pin' ? 'bg-primary text-white shadow-sm' : 'text-darkText/60 hover:text-darkText'}`}
            >
              PIN Passcode
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-full font-body font-bold text-xs transition-all cursor-pointer ${loginMethod === 'password' ? 'bg-primary text-white shadow-sm' : 'text-darkText/60 hover:text-darkText'}`}
            >
              Admin ID & PW
            </button>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {loginMethod === 'pin' ? (
              <div className="relative w-full">
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="Enter PIN (e.g. 1234)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-white border border-darkText/10 rounded-2xl py-4 pl-6 pr-12 text-center text-lg font-bold tracking-widest focus:outline-none focus:border-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-darkText/40 hover:text-darkText focus:outline-none transition-colors p-1 cursor-pointer"
                  aria-label="Toggle PIN visibility"
                >
                  {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Enter Username / ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border border-darkText/10 rounded-2xl py-3.5 px-5 text-sm font-semibold focus:outline-none focus:border-primary/50 text-left"
                />
                <div className="relative w-full">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-darkText/10 rounded-2xl py-3.5 pl-5 pr-12 text-sm font-semibold focus:outline-none focus:border-primary/50 text-left"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-darkText/40 hover:text-darkText focus:outline-none transition-colors p-1 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}
            {authError && <p className="text-xs text-candy font-bold">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-candy to-primary text-white font-body font-bold py-4 rounded-full shadow-[0_6px_20px_rgba(255,111,181,0.25)] hover:shadow-[0_8px_25px_rgba(255,111,181,0.4)] transition-all cursor-pointer text-base"
            >
              Verify & Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sticky Top Header Nav — fixed admin navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[9000] bg-white/75 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-white/40 py-3">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 lg:px-20 flex items-center justify-between gap-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="Velunora Logo"
              className="w-8 h-8 rounded-full object-cover shadow-md shrink-0"
            />
            <span className="font-heading text-lg tracking-tight text-darkText font-bold select-none shrink-0">
              Velunora <span className="text-[10px] bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full ml-1 font-body font-bold">Admin</span>
            </span>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Desktop Only: Exit Admin View Button */}
            <button
              onClick={() => { window.location.href = '/'; }}
              className="hidden md:inline-block text-[10px] md:text-xs font-body font-bold border border-darkText/10 text-darkText/70 hover:text-primary hover:border-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-all shrink-0 cursor-pointer bg-white"
            >
              Exit Admin
            </button>

            {/* Mobile Hamburger toggle button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full border border-darkText/10 flex items-center justify-center text-darkText/70 hover:text-primary hover:border-primary transition-all cursor-pointer bg-white/50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown menu container */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-darkText/5 bg-white/95 backdrop-blur-lg px-6 py-4 flex flex-col gap-2.5 shadow-lg max-h-[calc(100vh-60px)] overflow-y-auto font-body text-xs font-bold mt-3">
            <button 
              onClick={() => { setActiveTab('analytics'); setIsMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${activeTab === 'analytics' ? 'bg-primary text-white shadow-sm' : 'text-darkText/70 hover:bg-darkText/5'}`}
            >
              <BarChart2 size={14} />
              <span>Analytics Dashboard</span>
            </button>
            <button 
              onClick={() => { setActiveTab('products'); setIsMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${activeTab === 'products' ? 'bg-primary text-white shadow-sm' : 'text-darkText/70 hover:bg-darkText/5'}`}
            >
              <Tag size={14} />
              <span>Products Catalog</span>
            </button>
            <button 
              onClick={() => { setActiveTab('sections'); setIsMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${activeTab === 'sections' ? 'bg-primary text-white shadow-sm' : 'text-darkText/70 hover:bg-darkText/5'}`}
            >
              <ImageIcon size={14} />
              <span>Section Image Assets</span>
            </button>
            <button 
              onClick={() => { setActiveTab('coupons'); setIsMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${activeTab === 'coupons' ? 'bg-primary text-white shadow-sm' : 'text-darkText/70 hover:bg-darkText/5'}`}
            >
              <Percent size={14} />
              <span>Discount Coupons</span>
            </button>
            <button 
              onClick={() => { setActiveTab('security'); setIsMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${activeTab === 'security' ? 'bg-primary text-white shadow-sm' : 'text-darkText/70 hover:bg-darkText/5'}`}
            >
              <Lock size={14} />
              <span>Gatekeeper Security</span>
            </button>
            
            <div className="border-t border-darkText/5 my-1.5" />
            
            <button 
              onClick={() => { setIsMenuOpen(false); window.location.href = '/'; }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-candy hover:bg-candy/5 text-left border border-candy/10 bg-candy/5 cursor-pointer w-full font-bold"
            >
              <span>Exit Admin Gate</span>
            </button>
          </div>
        )}
      </nav>

      <div className="min-h-screen bg-bgMain pt-24 pb-16 px-4 md:px-12 lg:px-20">
        <div className="max-w-[1600px] mx-auto">
          {/* Header Dashboard Title */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <h1 className="font-body text-4xl font-extrabold text-darkText leading-tight">Admin Control Room</h1>
              <p className="font-body text-sm text-darkText/60">Configure product catalog, adjust section layouts/images, manage coupons, and track site visitor analytics.</p>
            </div>
          </div>

          {/* Admin Tabs — Desktop Only */}
          <div className="hidden md:flex bg-white/50 backdrop-blur-md border border-darkText/5 p-1 rounded-2xl shadow-sm overflow-x-auto max-w-full mb-8 scrollbar-hide shrink-0 gap-1.5 w-fit">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-body font-bold text-xs transition-all shrink-0 ${activeTab === 'analytics' ? 'bg-primary text-white shadow-md' : 'text-darkText/60 hover:text-darkText hover:bg-darkText/5'}`}
            >
              <BarChart2 size={14} />
              <span>Analytics</span>
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-body font-bold text-xs transition-all shrink-0 ${activeTab === 'products' ? 'bg-primary text-white shadow-md' : 'text-darkText/60 hover:text-darkText hover:bg-darkText/5'}`}
            >
              <Tag size={14} />
              <span>Products</span>
            </button>
            <button 
              onClick={() => setActiveTab('sections')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-body font-bold text-xs transition-all shrink-0 ${activeTab === 'sections' ? 'bg-primary text-white shadow-md' : 'text-darkText/60 hover:text-darkText hover:bg-darkText/5'}`}
            >
              <ImageIcon size={14} />
              <span>Section Images</span>
            </button>
            <button 
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-body font-bold text-xs transition-all shrink-0 ${activeTab === 'coupons' ? 'bg-primary text-white shadow-md' : 'text-darkText/60 hover:text-darkText hover:bg-darkText/5'}`}
            >
              <Percent size={14} />
              <span>Coupons</span>
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-body font-bold text-xs transition-all shrink-0 ${activeTab === 'security' ? 'bg-primary text-white shadow-md' : 'text-darkText/60 hover:text-darkText hover:bg-darkText/5'}`}
            >
              <Lock size={14} />
              <span>Security</span>
            </button>
          </div>


        {loading ? (
          <div className="w-full py-32 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-body font-semibold text-darkText/50">Fetching database settings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {/* TABS CONTAINER */}
            
            {/* 1. ANALYTICS TAB */}
            {activeTab === 'analytics' && analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Stats Cards Row */}
                <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-sky/15 rounded-2xl flex items-center justify-center text-sky">
                      <Users size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-darkText/50 uppercase tracking-wider block">Total Visits</span>
                      <span className="text-3xl font-body font-extrabold text-darkText">{analytics.totalVisits}</span>
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-darkText/50 uppercase tracking-wider block">Unique Visitors</span>
                      <span className="text-3xl font-body font-extrabold text-darkText">{analytics.uniqueVisitors}</span>
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-candy/10 rounded-2xl flex items-center justify-center text-candy">
                      <MousePointerClick size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-darkText/50 uppercase tracking-wider block">Product Clicks</span>
                      <span className="text-3xl font-body font-extrabold text-darkText">{analytics.totalClicks}</span>
                    </div>
                  </div>
                </div>

                {/* Popular Products Clicks */}
                <div className="col-span-12 lg:col-span-6 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-5 sm:p-8 shadow-sm">
                  <h3 className="font-body text-lg font-bold text-darkText mb-6 flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary" />
                    <span>Product Interest Analytics</span>
                  </h3>
                  <div className="flex flex-col gap-4">
                    {analytics.productClicks?.length === 0 ? (
                      <p className="text-sm text-darkText/40 py-8 text-center">No product clicks logged yet.</p>
                    ) : (
                      analytics.productClicks.map((item: any) => (
                        <div key={item._id} className="flex items-center justify-between border-b border-darkText/5 pb-3">
                          <div>
                            <span className="font-body font-bold text-darkText block text-sm">{item.productName || item._id}</span>
                            <span className="text-xs text-darkText/40">slug: {item._id}</span>
                          </div>
                          <span className="bg-primary/5 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/10">
                            {item.clicksCount} Clicks
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Activity Log */}
                <div className="col-span-12 lg:col-span-6 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-5 sm:p-8 shadow-sm">
                  <h3 className="font-body text-lg font-bold text-darkText mb-6 flex items-center gap-2">
                    <Users size={18} className="text-sky" />
                    <span>Live Visitor Stream</span>
                  </h3>
                  <div className="max-h-[350px] overflow-y-auto pr-2 flex flex-col gap-3 font-body">
                    {analytics.recentVisits?.length === 0 ? (
                      <p className="text-sm text-darkText/40 py-8 text-center">No visits logged yet.</p>
                    ) : (
                      analytics.recentVisits.map((visit: any, index: number) => (
                        <div key={visit._id || index} className="text-xs bg-white/40 border border-darkText/[0.02] p-3.5 rounded-2xl flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-4">
                          <div>
                            <span className="font-bold text-darkText block mb-0.5">Page Visit: {visit.path}</span>
                            <span className="text-[10px] text-darkText/40 truncate max-w-[120px] xs:max-w-[200px] block">{visit.userAgent}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-darkText/60 block">{visit.ip}</span>
                            <span className="text-[9px] text-darkText/30">{new Date(visit.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-5 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="font-body text-lg font-bold text-darkText">Catalog Management</h3>
                    <p className="text-xs text-darkText/50">Add or edit bouquet products, mark promotional values, and upload item images.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        slug: '',
                        universe: 'Pokémon',
                        price: '',
                        originalPrice: '',
                        isSpecialOffer: false,
                        badge: '',
                        description: '',
                        floatingDecos: '⭐, ✨'
                      });
                      setIsProductModalOpen(true);
                    }}
                    className="bg-primary hover:bg-primary-dark text-white font-body font-bold text-xs py-3 px-5 rounded-full flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Plus size={14} />
                    <span>Add New Bouquet</span>
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-20 bg-white/20 border border-dashed border-darkText/10 rounded-2xl">
                    <p className="font-body text-darkText/40 mb-2">No products exist in database</p>
                    <p className="text-xs text-darkText/30">Click "Add New Bouquet" to get started!</p>
                  </div>
                ) : (
                  <div>
                    {/* Mobile View: Stacked Vertical Cards */}
                    <div className="flex flex-col gap-4 lg:hidden">
                      {products.map((p) => (
                        <div key={p.id} className="bg-white/40 border border-darkText/5 p-4 rounded-2xl flex flex-col gap-4 relative font-body text-xs font-semibold">
                          {/* Top Row: Image & Name */}
                          <div className="flex gap-4 items-center">
                            <img 
                              src={getImgUrl(p.src)} 
                              alt={p.name} 
                              className="w-14 h-14 object-contain bg-gradient-to-tr from-sky/5 to-candy/5 rounded-xl border border-darkText/5 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="font-body font-bold text-darkText text-sm block truncate">{p.name}</span>
                              <span className="text-[10px] text-darkText/40 block mt-0.5 font-semibold">slug: {p.slug}</span>
                              <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full inline-block mt-2 font-bold uppercase tracking-wider">
                                {p.universe}
                              </span>
                            </div>
                          </div>

                          {/* Middle Row: Pricing & Offer status */}
                          <div className="flex justify-between items-center border-t border-darkText/5 pt-3">
                            <div>
                              <span className="text-darkText/40 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Pricing</span>
                              <span className="text-darkText font-bold text-sm block">₹{p.price}</span>
                              {p.originalPrice && (
                                <span className="text-[10px] text-darkText/30 line-through block">₹{p.originalPrice}</span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-darkText/40 block text-[9px] uppercase font-bold tracking-wider mb-1.5">Offer Status</span>
                              {p.isSpecialOffer ? (
                                <span className="text-[10px] bg-candy/10 text-candy border border-candy/20 px-2.5 py-1 rounded-full font-bold">
                                  % {p.discountPercentage ? `${p.discountPercentage}% Off` : 'Special Offer'}
                                </span>
                              ) : (
                                <span className="text-xs text-darkText/40">-</span>
                              )}
                            </div>
                          </div>

                          {/* Bottom Row: Actions */}
                          <div className="flex gap-2 justify-end border-t border-darkText/5 pt-3">
                            <button 
                              onClick={() => handleEditProduct(p)}
                              className="flex-1 bg-white border border-darkText/10 hover:border-primary/50 text-darkText/70 hover:text-primary font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                              title="Edit"
                            >
                              <Edit3 size={12} />
                              <span>Edit Product</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="w-9 h-9 rounded-xl border border-darkText/10 flex items-center justify-center text-darkText/50 hover:text-candy hover:border-candy hover:bg-candy/5 transition-all cursor-pointer bg-white"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop View: Full Grid Table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-darkText/10 text-xs font-bold uppercase tracking-wider text-darkText/50">
                            <th className="py-4.5 px-4">Image</th>
                            <th className="py-4.5 px-4">Product Name</th>
                            <th className="py-4.5 px-4">Universe</th>
                            <th className="py-4.5 px-4">Pricing</th>
                            <th className="py-4.5 px-4">Offer Status</th>
                            <th className="py-4.5 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-darkText/5 text-sm font-body font-semibold">
                          {products.map((p) => (
                            <tr key={p.id}>
                              <td className="py-4 px-4">
                                <img 
                                  src={getImgUrl(p.src)} 
                                  alt={p.name} 
                                  className="w-12 h-12 object-contain bg-gradient-to-tr from-sky/5 to-candy/5 rounded-xl border border-darkText/5"
                                />
                              </td>
                              <td className="py-4 px-4">
                                <span className="font-body font-bold text-darkText block">{p.name}</span>
                                <span className="text-xs text-darkText/40">slug: {p.slug}</span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                                  {p.universe}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-darkText">₹{p.price}</span>
                                {p.originalPrice && (
                                  <span className="text-xs text-darkText/30 line-through block">₹{p.originalPrice}</span>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                {p.isSpecialOffer ? (
                                  <span className="text-xs bg-candy/10 text-candy border border-candy/20 px-2.5 py-1 rounded-full">
                                    % {p.discountPercentage ? `${p.discountPercentage}% Off` : 'Special Offer'}
                                  </span>
                                ) : (
                                  <span className="text-xs text-darkText/40">-</span>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleEditProduct(p)}
                                    className="w-8 h-8 rounded-full border border-darkText/10 flex items-center justify-center text-darkText/70 hover:text-primary hover:border-primary transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="w-8 h-8 rounded-full border border-darkText/10 flex items-center justify-center text-darkText/70 hover:text-candy hover:border-candy transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. SECTION IMAGES TAB */}
            {activeTab === 'sections' && (
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-5 sm:p-8 shadow-sm">
                <div>
                  <h3 className="font-body text-lg font-bold text-darkText mb-2">Separate Section Images Management</h3>
                  <p className="text-xs text-darkText/50 mb-8">Upload customized placeholder assets for floating elements, mascot cards, and portal icons below separately.</p>
                </div>

                <div className="flex flex-col gap-12 font-body">
                  
                  {/* Hero Section Config Row */}
                  <div className="border-b border-darkText/5 pb-10">
                    <h4 className="font-body font-bold text-lg text-darkText mb-6">1. Hero Section Setup</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Mockup Preview of Hero Section */}
                      <div className="xl:col-span-6 flex flex-col gap-2">
                        <span className="text-xs font-bold text-darkText/40 uppercase tracking-wider">Live Mockup Preview</span>
                        <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-[#F8FAFF] via-[#F2F6FF] to-[#FAF5FF] rounded-[24px] border border-darkText/10 overflow-hidden flex flex-col justify-center items-center p-6 shadow-md select-none">
                          {/* Stars Background layer */}
                          <div className="absolute inset-0 opacity-30 pointer-events-none">
                            <span className="absolute top-[10%] left-[20%] text-xs">⭐</span>
                            <span className="absolute bottom-[20%] left-[30%] text-xs">⭐</span>
                            <span className="absolute top-[25%] right-[25%] text-xs">✨</span>
                            <span className="absolute bottom-[15%] right-[15%] text-xs">⭐</span>
                          </div>
                          
                          {/* Mini Title Content */}
                          <div className="text-center max-w-[65%] pointer-events-none">
                            <span className="text-[7px] bg-white border border-primary/10 px-2 py-0.5 rounded-full text-primary font-bold shadow-sm inline-block mb-1">
                              ✨ Welcome to Velunora ✨
                            </span>
                            <h2 className="text-xs sm:text-sm font-heading font-extrabold text-darkText leading-tight">
                              Collect Your <br />
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-candy to-primary">
                                Favourite Characters.
                              </span>
                            </h2>
                            <p className="text-[6px] text-darkText/60 mt-1 leading-normal">
                              Where Flowers Never Fade — pipe cleaner bouquets & custom fuzzy wire crafts.
                            </p>
                            <div className="flex gap-1 justify-center mt-2">
                              <span className="text-[5px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">Browse</span>
                              <span className="text-[5px] bg-white border border-darkText/10 px-2 py-0.5 rounded-full font-bold">Instagram</span>
                            </div>
                          </div>

                          {/* Floating Characters positions matching actual site roughly */}
                          {[
                            { key: 'char_loopy', label: 'Loopy', style: 'top-[12%] left-[6%]', fallbackImg: '/loopy.png' },
                            { key: 'char_lotso', label: 'Lotso', style: 'bottom-[12%] left-[8%]', fallbackImg: '/lotso.png' },
                            { key: 'char_snorlax', label: 'Snorlax', style: 'top-[8%] right-[8%]', fallbackImg: '/snorlax.png' },
                            { key: 'char_bunny', label: 'Bunny', style: 'bottom-[8%] right-[8%]', fallbackImg: '/bunny.png' },
                            { key: 'char_purple', label: 'Purple Pillow', style: 'top-[38%] right-[20%]', fallbackImg: '/purple_long.png' },
                          ].map((char) => {
                            const savedAsset = sections.find(s => s.sectionName === 'hero' && s.key === char.key);
                            const isHovered = hoveredAssetKey === char.key;
                            return (
                              <div 
                                key={char.key}
                                onMouseEnter={() => setHoveredAssetKey(char.key)}
                                onMouseLeave={() => setHoveredAssetKey(null)}
                                className={`absolute ${char.style} w-[16%] aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-10 ${
                                  isHovered ? 'scale-125 z-20' : 'hover:scale-110'
                                }`}
                              >
                                <div className={`relative w-full h-full rounded-2xl bg-white/40 backdrop-blur-sm border p-1.5 flex items-center justify-center transition-all ${
                                  isHovered ? 'border-primary ring-4 ring-primary/20 shadow-lg' : 'border-white/60 shadow-sm'
                                }`}>
                                  <img 
                                    src={getImgUrl(savedAsset?.imageUrl || char.fallbackImg)} 
                                    alt={char.label} 
                                    className="max-w-full max-h-full object-contain rounded-lg filter drop-shadow-sm"
                                  />
                                  
                                  {/* Small label */}
                                  <div className={`absolute -bottom-4 bg-darkText text-white text-[6px] font-bold px-1 py-0.5 rounded transition-all whitespace-nowrap shadow-sm ${
                                    isHovered ? 'opacity-100' : 'opacity-0 scale-75'
                                  }`}>
                                    {char.label}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Upload controls */}
                      <div className="xl:col-span-6 bg-white/40 border border-darkText/[0.03] p-6 rounded-2xl">
                        <div className="flex flex-col gap-4">
                          {[
                            { key: 'char_loopy', label: 'Loopy Floating', defaultVal: '🌸 Viral Pink Beaver', fallbackImg: '/loopy.png' },
                            { key: 'char_lotso', label: 'Lotso Floating', defaultVal: '🍓 Strawberry Lotso Bear', fallbackImg: '/lotso.png' },
                            { key: 'char_snorlax', label: 'Snorlax Floating', defaultVal: '💤 Lazy Sleepy Snorlax', fallbackImg: '/snorlax.png' },
                            { key: 'char_bunny', label: 'Bunny Floating', defaultVal: '🐰 Dreamy Bow Bunny', fallbackImg: '/bunny.png' },
                            { key: 'char_purple', label: 'Purple Pillow Floating', defaultVal: '🔮 Purple Cat pillow', fallbackImg: '/purple_long.png' },
                          ].map((char) => {
                            const savedAsset = sections.find(s => s.sectionName === 'hero' && s.key === char.key);
                            const isHovered = hoveredAssetKey === char.key;
                            return (
                              <div 
                                key={char.key} 
                                onMouseEnter={() => setHoveredAssetKey(char.key)}
                                onMouseLeave={() => setHoveredAssetKey(null)}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between border-b border-darkText/5 pb-3 gap-4 transition-colors duration-200 rounded-lg p-2 -mx-2 ${
                                  isHovered ? 'bg-primary/5' : ''
                                }`}
                              >
                                <div>
                                  <span className={`font-bold text-xs block transition-colors ${isHovered ? 'text-primary' : 'text-darkText'}`}>
                                    {char.label}
                                  </span>
                                  <span className="text-[10px] text-darkText/40">Tag: {savedAsset?.label || char.defaultVal}</span>
                                </div>
                                <div className="flex items-center gap-3.5">
                                  <img 
                                    src={getImgUrl(savedAsset?.imageUrl || char.fallbackImg)} 
                                    alt={char.label} 
                                    className="w-10 h-10 object-contain bg-white rounded-lg border border-darkText/5"
                                    onError={(e)=>{(e.target as HTMLElement).style.display = 'none'}}
                                  />
                                  <div className="flex items-center gap-2">
                                    <label className="bg-white border border-darkText/10 hover:border-primary/50 text-darkText/70 hover:text-primary font-bold text-[10px] py-2 px-3 rounded-full flex items-center gap-1.5 cursor-pointer transition-all">
                                      <Upload size={10} />
                                      <span>Upload</span>
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={(e) => handleSectionImageUpload(e, 'hero', char.key, savedAsset?.label || char.defaultVal)}
                                      />
                                    </label>
                                    {savedAsset && (
                                      <button 
                                        onClick={() => handleSectionImageReset('hero', char.key)}
                                        className="w-8 h-8 rounded-full border border-darkText/10 flex items-center justify-center text-darkText/50 hover:text-candy hover:border-candy transition-all cursor-pointer bg-white"
                                        title="Reset to default image"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* About Section Config Row */}
                  <div>
                    <h4 className="font-body font-bold text-lg text-darkText mb-6">2. About Section Setup</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Mockup Preview of About Section */}
                      <div className="xl:col-span-6 flex flex-col gap-2">
                        <span className="text-xs font-bold text-darkText/40 uppercase tracking-wider">Live Mockup Preview</span>
                        <div className="relative w-full aspect-[16/10] bg-gradient-to-tr from-candy/5 via-white to-sky/5 rounded-[24px] border border-darkText/10 overflow-hidden flex items-center justify-center p-6 shadow-md select-none">
                          
                          {/* Inner Mascot Card Frame */}
                          <div className="relative w-[50%] aspect-square rounded-[24px] bg-gradient-to-tr from-candy/10 via-white to-sky/10 border border-white p-4 shadow-inner flex items-center justify-center overflow-hidden">
                            {/* Stars decor */}
                            <div className="absolute inset-0 pointer-events-none opacity-20">
                              <span className="absolute top-2 left-4 text-xs">⭐</span>
                              <span className="absolute bottom-4 right-4 text-xs">⭐</span>
                              <span className="absolute top-4 right-8 text-xs">✨</span>
                            </div>

                            {/* Overlapping Mascot Stack */}
                            <div className="relative w-full h-full flex items-center justify-center">
                              {/* Snorlax (mascot_back) */}
                              {(() => {
                                const savedAsset = sections.find(s => s.sectionName === 'about' && s.key === 'mascot_back');
                                const isHovered = hoveredAssetKey === 'mascot_back';
                                return (
                                  <div 
                                    onMouseEnter={() => setHoveredAssetKey('mascot_back')}
                                    onMouseLeave={() => setHoveredAssetKey(null)}
                                    className={`absolute w-[50%] h-[50%] bottom-[44%] left-1/2 -translate-x-1/2 z-10 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                      isHovered ? 'scale-115 z-30 drop-shadow-lg filter' : 'drop-shadow-sm'
                                    }`}
                                  >
                                    <img 
                                      src={getImgUrl(savedAsset?.imageUrl || '/snorlax.png')} 
                                      alt="Mascot Back" 
                                      className={`max-w-full max-h-full object-contain rounded-lg transition-all ${
                                        isHovered ? 'ring-2 ring-primary bg-white/20 p-1' : ''
                                      }`}
                                    />
                                    <div className={`absolute bottom-[-16px] bg-darkText text-white text-[6px] font-bold px-1 py-0.5 rounded transition-all whitespace-nowrap shadow-sm ${
                                      isHovered ? 'opacity-100' : 'opacity-0 scale-75'
                                    }`}>
                                      Back Center
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Loopy (mascot_left) */}
                              {(() => {
                                const savedAsset = sections.find(s => s.sectionName === 'about' && s.key === 'mascot_left');
                                const isHovered = hoveredAssetKey === 'mascot_left';
                                return (
                                  <div 
                                    onMouseEnter={() => setHoveredAssetKey('mascot_left')}
                                    onMouseLeave={() => setHoveredAssetKey(null)}
                                    className={`absolute w-[40%] h-[40%] bottom-[4%] left-[4%] z-20 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                      isHovered ? 'scale-115 z-30 drop-shadow-lg filter' : 'drop-shadow-sm'
                                    }`}
                                  >
                                    <img 
                                      src={getImgUrl(savedAsset?.imageUrl || '/loopy.png')} 
                                      alt="Mascot Left" 
                                      className={`max-w-full max-h-full object-contain rounded-lg transition-all ${
                                        isHovered ? 'ring-2 ring-primary bg-white/20 p-1' : ''
                                      }`}
                                    />
                                    <div className={`absolute bottom-[-16px] bg-darkText text-white text-[6px] font-bold px-1 py-0.5 rounded transition-all whitespace-nowrap shadow-sm ${
                                      isHovered ? 'opacity-100' : 'opacity-0 scale-75'
                                    }`}>
                                      Front Left
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Lotso (mascot_right) */}
                              {(() => {
                                const savedAsset = sections.find(s => s.sectionName === 'about' && s.key === 'mascot_right');
                                const isHovered = hoveredAssetKey === 'mascot_right';
                                return (
                                  <div 
                                    onMouseEnter={() => setHoveredAssetKey('mascot_right')}
                                    onMouseLeave={() => setHoveredAssetKey(null)}
                                    className={`absolute w-[40%] h-[40%] bottom-[4%] right-[4%] z-20 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                      isHovered ? 'scale-115 z-30 drop-shadow-lg filter' : 'drop-shadow-sm'
                                    }`}
                                  >
                                    <img 
                                      src={getImgUrl(savedAsset?.imageUrl || '/lotso.png')} 
                                      alt="Mascot Right" 
                                      className={`max-w-full max-h-full object-contain rounded-lg transition-all ${
                                        isHovered ? 'ring-2 ring-primary bg-white/20 p-1' : ''
                                      }`}
                                    />
                                    <div className={`absolute bottom-[-16px] bg-darkText text-white text-[6px] font-bold px-1 py-0.5 rounded transition-all whitespace-nowrap shadow-sm ${
                                      isHovered ? 'opacity-100' : 'opacity-0 scale-75'
                                    }`}>
                                      Front Right
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                          
                        </div>
                      </div>

                      {/* Right: Upload controls */}
                      <div className="xl:col-span-6 bg-white/40 border border-darkText/[0.03] p-6 rounded-2xl">
                        <div className="flex flex-col gap-4">
                          {[
                            { key: 'mascot_back', label: 'Background Center (Snorlax slot)', defaultVal: 'Mascot Center', fallbackImg: '/snorlax.png' },
                            { key: 'mascot_left', label: 'Front Left Mascot (Loopy slot)', defaultVal: 'Mascot Front Left', fallbackImg: '/loopy.png' },
                            { key: 'mascot_right', label: 'Front Right Mascot (Lotso slot)', defaultVal: 'Mascot Front Right', fallbackImg: '/lotso.png' },
                          ].map((mascot) => {
                            const savedAsset = sections.find(s => s.sectionName === 'about' && s.key === mascot.key);
                            const isHovered = hoveredAssetKey === mascot.key;
                            return (
                              <div 
                                key={mascot.key} 
                                onMouseEnter={() => setHoveredAssetKey(mascot.key)}
                                onMouseLeave={() => setHoveredAssetKey(null)}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between border-b border-darkText/5 pb-3 gap-4 transition-colors duration-200 rounded-lg p-2 -mx-2 ${
                                  isHovered ? 'bg-primary/5' : ''
                                }`}
                              >
                                <div>
                                  <span className={`font-bold text-xs block transition-colors ${isHovered ? 'text-primary' : 'text-darkText'}`}>
                                    {mascot.label}
                                  </span>
                                  <span className="text-[10px] text-darkText/40">Key: {mascot.key}</span>
                                </div>
                                <div className="flex items-center gap-3.5">
                                  <img 
                                    src={getImgUrl(savedAsset?.imageUrl || mascot.fallbackImg)} 
                                    alt={mascot.label} 
                                    className="w-10 h-10 object-contain bg-white rounded-lg border border-darkText/5"
                                    onError={(e)=>{(e.target as HTMLElement).style.display = 'none'}}
                                  />
                                  <div className="flex items-center gap-2">
                                    <label className="bg-white border border-darkText/10 hover:border-primary/50 text-darkText/70 hover:text-primary font-bold text-[10px] py-2 px-3 rounded-full flex items-center gap-1.5 cursor-pointer transition-all">
                                      <Upload size={10} />
                                      <span>Upload</span>
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={(e) => handleSectionImageUpload(e, 'about', mascot.key, mascot.defaultVal)}
                                      />
                                    </label>
                                    {savedAsset && (
                                      <button 
                                        onClick={() => handleSectionImageReset('about', mascot.key)}
                                        className="w-8 h-8 rounded-full border border-darkText/10 flex items-center justify-center text-darkText/50 hover:text-candy hover:border-candy transition-all cursor-pointer bg-white"
                                        title="Reset to default image"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 4. COUPONS TAB */}
            {activeTab === 'coupons' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Create Coupon Card */}
                <div className="col-span-12 lg:col-span-4 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-5 sm:p-8 shadow-sm h-fit">
                  <h3 className="font-body text-lg font-bold text-darkText mb-6">Create Discount Coupon</h3>
                  <form onSubmit={handleCouponSubmit} className="flex flex-col gap-4 font-body text-sm font-semibold">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-darkText/50">Coupon Code (Uppercase)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. WELCOME10"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                        required
                        className="w-full bg-white border border-darkText/10 rounded-2xl py-3.5 px-4 font-bold uppercase tracking-wider focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-darkText/50">Discount Type</label>
                      <select 
                        value={couponForm.discountType}
                        onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                        className="w-full bg-white border border-darkText/10 rounded-2xl py-3.5 px-4 focus:outline-none cursor-pointer"
                      >
                        <option value="percentage">Percentage Off (%)</option>
                        <option value="flat">Flat Amount Off (₹)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-darkText/50">Discount Value</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 10 or 250"
                        value={couponForm.discountValue}
                        onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                        required
                        className="w-full bg-white border border-darkText/10 rounded-2xl py-3.5 px-4 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-darkText/50">Minimum Purchase Amount (₹)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 500 (0 for no limit)"
                        value={couponForm.minPurchase}
                        onChange={(e) => setCouponForm({ ...couponForm, minPurchase: e.target.value })}
                        className="w-full bg-white border border-darkText/10 rounded-2xl py-3.5 px-4 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-dark text-white font-body font-bold py-3.5 rounded-2xl shadow-sm transition-all mt-2"
                    >
                      Save Coupon Code
                    </button>
                  </form>
                </div>

                {/* List Coupons Card */}
                <div className="col-span-12 lg:col-span-8 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-5 sm:p-8 shadow-sm">
                  <h3 className="font-body text-lg font-bold text-darkText mb-6">Active Coupons Catalog</h3>
                  
                  {coupons.length === 0 ? (
                    <p className="text-sm text-darkText/40 py-12 text-center">No coupons configured yet.</p>
                  ) : (
                    <div className="flex flex-col gap-4 font-body">
                      {coupons.map((coupon) => (
                        <div key={coupon._id} className="bg-white/40 border border-darkText/[0.02] p-4.5 rounded-2xl flex justify-between items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="font-body font-extrabold text-sm text-darkText tracking-wider bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded-lg">
                                {coupon.code}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${coupon.isActive ? 'bg-mint/10 text-mint border-mint/20' : 'bg-darkText/10 text-darkText/40 border-darkText/20'}`}>
                                {coupon.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-darkText/60">
                              {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} Off 
                              {coupon.minPurchase > 0 && ` on purchases above ₹${coupon.minPurchase}`}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleCoupon(coupon)}
                              className={`text-[10px] font-bold py-2 px-3 rounded-full cursor-pointer transition-all ${
                                coupon.isActive 
                                  ? 'bg-darkText/5 text-darkText/60 border border-darkText/10 hover:bg-darkText/10' 
                                  : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                              }`}
                            >
                              {coupon.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(coupon._id)}
                              className="w-8 h-8 rounded-full border border-darkText/10 flex items-center justify-center text-darkText/50 hover:text-candy hover:border-candy transition-all cursor-pointer bg-white"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 5. SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Messages notifications */}
                {(securitySuccessMessage || securityErrorMessage) && (
                  <div className="col-span-12 font-body text-center mb-2">
                    {securitySuccessMessage && (
                      <div className="flex items-center justify-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 py-3.5 px-6 rounded-2xl shadow-sm animate-bounce-short">
                        <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                        <span className="font-extrabold text-base text-emerald-800 tracking-wide uppercase">
                          {securitySuccessMessage}
                        </span>
                      </div>
                    )}
                    {securityErrorMessage && (
                      <p className="text-candy bg-candy/10 border border-candy/20 p-3.5 rounded-2xl font-bold">{securityErrorMessage}</p>
                    )}
                  </div>
                )}

                {/* PIN Configuration Card */}
                <div className="col-span-12 lg:col-span-6 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-5 sm:p-8 shadow-sm h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h3 className="font-body text-lg font-bold text-darkText">PIN Security Passcode</h3>
                      <p className="text-xs text-darkText/50">Change the passcode used for quick PIN gates (Currently: {securityConfig.pin ? '•'.repeat(securityConfig.pin.length) : 'None'})</p>
                    </div>
                  </div>

                  <form onSubmit={(e) => handleSecurityUpdate(e, 'pin')} className="flex flex-col gap-4 font-body text-sm font-semibold">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-darkText/50">New PIN Code</label>
                      <div className="relative w-full">
                        <input 
                          type={showNewPin ? "text" : "password"} 
                          placeholder="Enter new PIN code"
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          required
                          className="w-full bg-white border border-darkText/10 rounded-2xl py-3.5 pl-4 pr-12 font-bold text-lg tracking-widest focus:outline-none focus:border-primary/50 text-center"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPin(!showNewPin)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-darkText/40 hover:text-darkText focus:outline-none transition-colors p-1 cursor-pointer"
                          aria-label="Toggle PIN visibility"
                        >
                          {showNewPin ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/95 text-white font-body font-bold py-3.5 rounded-2xl shadow-sm transition-all mt-2 cursor-pointer"
                    >
                      Update PIN Code
                    </button>
                  </form>
                </div>

                {/* ID & Password Configuration Card */}
                <div className="col-span-12 lg:col-span-6 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-5 sm:p-8 shadow-sm h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-candy/10 flex items-center justify-center text-candy">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h3 className="font-body text-lg font-bold text-darkText">Admin ID & Password</h3>
                      <p className="text-xs text-darkText/50">Change the credentials used for Username/Password gates (Current ID: {securityConfig.username || 'admin'})</p>
                    </div>
                  </div>

                  <form onSubmit={(e) => handleSecurityUpdate(e, 'password')} className="flex flex-col gap-4 font-body text-sm font-semibold">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-darkText/50">Admin Username / ID</label>
                      <input 
                        type="text" 
                        placeholder="Enter new Admin ID"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        required
                        className="w-full bg-white border border-darkText/10 rounded-2xl py-3.5 px-4 focus:outline-none focus:border-primary/50 text-left font-bold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-darkText/50">New Password</label>
                      <div className="relative w-full">
                        <input 
                          type={showNewPassword ? "text" : "password"} 
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="w-full bg-white border border-darkText/10 rounded-2xl py-3.5 pl-4 pr-12 focus:outline-none focus:border-primary/50 text-left font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-darkText/40 hover:text-darkText focus:outline-none transition-colors p-1 cursor-pointer"
                          aria-label="Toggle password visibility"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-candy hover:bg-candy/95 text-white font-body font-bold py-3.5 rounded-2xl shadow-sm transition-all mt-2 cursor-pointer"
                    >
                      Update Username & Password
                    </button>
                  </form>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-darkText/20 backdrop-blur-sm p-4 flex justify-center items-start md:items-center">
          <div className="bg-white w-full max-w-2xl rounded-[32px] border border-darkText/5 shadow-xl my-8 p-5 sm:p-8 font-body text-sm font-semibold relative">
            <button 
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-6 right-6 text-darkText/50 hover:text-darkText"
            >
              <X size={20} />
            </button>

            <h3 className="font-body text-2xl font-extrabold text-darkText mb-6">
              {editingProduct ? 'Edit Product Details' : 'Add New Bouquet'}
            </h3>

            <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs text-darkText/50">Product Name</label>
                  <input 
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                    placeholder="Strawberry Lotso Bear"
                    className="bg-bgMain border border-darkText/5 rounded-xl py-3 px-4 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-darkText/50">Universe Category</label>
                  <select
                    value={productForm.universe}
                    onChange={(e) => setProductForm({ ...productForm, universe: e.target.value })}
                    className="bg-bgMain border border-darkText/5 rounded-xl py-3 px-4 focus:outline-none cursor-pointer"
                  >
                    <option value="Pokémon">Pokémon</option>
                    <option value="Sanrio">Sanrio</option>
                    <option value="Anime">Anime</option>
                    <option value="Cute Animals">Cute Animals</option>
                    <option value="Trending">Trending</option>
                    <option value="New Arrivals">New Arrivals</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-darkText/50">Badge Tag (e.g. Best Seller)</label>
                  <input 
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="Best Seller / Cozy Pick"
                    className="bg-bgMain border border-darkText/5 rounded-xl py-3 px-4 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-darkText/50">Sale Price (₹)</label>
                  <input 
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    placeholder="1299"
                    className="bg-bgMain border border-darkText/5 rounded-xl py-3 px-4 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-darkText/50">Original Price (₹ - Optional)</label>
                  <input 
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="1499"
                    className="bg-bgMain border border-darkText/5 rounded-xl py-3 px-4 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox"
                  id="isSpecialOffer"
                  checked={productForm.isSpecialOffer}
                  onChange={(e) => setProductForm({ ...productForm, isSpecialOffer: e.target.checked })}
                  className="w-4.5 h-4.5 accent-primary cursor-pointer"
                />
                <label htmlFor="isSpecialOffer" className="text-xs text-darkText/75 cursor-pointer">
                  Mark as Special Offer / Discounted Item
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-darkText/50">Product Description</label>
                <textarea 
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  required
                  placeholder="Tell customers how soft and premium this plush is!"
                  className="bg-bgMain border border-darkText/5 rounded-xl py-3 px-4 focus:outline-none min-h-[100px] resize-y"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-darkText/50">Floating Decos (Comma-separated Emojis)</label>
                <input 
                  type="text"
                  value={productForm.floatingDecos}
                  onChange={(e) => setProductForm({ ...productForm, floatingDecos: e.target.value })}
                  placeholder="🔥, 🍓, 🧸"
                  className="bg-bgMain border border-darkText/5 rounded-xl py-3 px-4 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-darkText/50">Product Image Upload</label>
                <div className="flex items-center gap-4">
                  {editingProduct && !productImage && (
                    <img 
                      src={getImgUrl(editingProduct.src)} 
                      alt="Current" 
                      className="w-14 h-14 object-contain bg-bgMain rounded-xl border border-darkText/5"
                    />
                  )}
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setProductImage(e.target.files[0]);
                    }}
                    className="w-full bg-bgMain border border-darkText/5 rounded-xl py-3 px-4 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-body font-bold py-4 rounded-xl shadow-sm transition-all mt-4"
              >
                {editingProduct ? 'Save Product Changes' : 'Publish Product to Store'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Action Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-darkText/60 backdrop-blur-sm z-[99999] flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center gap-5 border border-white/40">
            {/* Spinning Loader */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse text-xs">
                ☁️
              </div>
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-darkText text-lg mb-1.5">Processing Request</h3>
              <p className="font-body text-xs font-bold text-darkText/50 leading-relaxed uppercase tracking-wider animate-pulse">
                {actionLoadingMessage}
              </p>
            </div>
            <span className="text-[10px] text-darkText/30 font-body">Please do not refresh or close this tab.</span>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
