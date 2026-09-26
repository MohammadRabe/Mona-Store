import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Heart, Menu, Minus, Moon, Plus, Search, ShoppingBag, SlidersHorizontal, Sparkles, Star, Sun, X } from 'lucide-react';
import { productsApi } from './services/productsApi';

const copy = {
  en: { announcement: 'A little treat: free shipping on orders over LE 750', navNew: 'NEW IN', navMakeup: 'MAKEUP', navSkin: 'SKINCARE', navBrands: 'BRANDS', navJournal: 'JOURNAL', search: 'Search your beauty...', eyebrow: 'YOUR DAILY BEAUTY RITUAL', titleA: 'A little more', titleB: 'you, every day.', heroBody: 'Thoughtful beauty, picked just for you. Discover the little things that make you glow.', shop: 'SHOP THE EDIT', discover: 'DISCOVER MORE', handcrafted: 'THE GOOD STUFF', collection: 'Your new favorites', collectionBody: 'A few lovely things, chosen with care.', all: 'VIEW ALL', allCategory: 'All products', makeup: 'Makeup', skincare: 'Skincare', sort: 'Featured', best: 'Best rated', priceLow: 'Price: low to high', priceHigh: 'Price: high to low', reviews: 'reviews', add: 'Add to bag', added: 'Added to bag', emptyTitle: 'Your bag is waiting', emptyBody: 'A little glow-up is just around the corner.', subtotal: 'Subtotal', checkout: 'CHECK OUT', cartTitle: 'Your bag', free: 'You’re LE 750 away from free shipping', freeHit: 'You’ve unlocked free shipping', wishlist: 'Saved for you', results: 'lovely finds', noProducts: 'Nothing here just yet.', loading: 'Finding your favorites…', currency: 'LE', brandNote: 'GOOD BEAUTY, GOOD MOOD', newsletter: 'A little note from us?', newsletterBody: 'Fresh arrivals, beauty notes & a treat on your birthday.', email: 'Your email address', join: 'JOIN US', footerNote: 'Beauty should feel like you.', outOfStock: 'In stock', quickSearch: 'Try “blush” or “serum”', sale: 'ON SELECTED GOODIES', error: 'Couldn’t load products. Please try again.', details: 'PRODUCT DETAILS', shade: 'Shade / size', quantity: 'Quantity', continue: 'BACK TO ALL BEAUTY', delivery: 'Fast delivery across Egypt', productDescription: 'A lovely everyday essential, selected for its beautiful finish and easy-to-love feel. Add a little joy to your daily ritual.', zoom: 'Move over the image to explore details' },
  ar: { announcement: 'هدية صغيرة: شحن مجاني للطلبات فوق ٧٥٠ ج.م', navNew: 'وصل حديثاً', navMakeup: 'المكياج', navSkin: 'العناية بالبشرة', navBrands: 'الماركات', navJournal: 'المجلة', search: 'ابحثي عن جمالك...', eyebrow: 'طقوس جمالك اليومية', titleA: 'أنتِ، بأجمل', titleB: 'إطلالاتك كل يوم.', heroBody: 'جمالك يستحق عناية خاصة. اكتشفي التفاصيل الصغيرة التي تمنحكِ إشراقتك.', shop: 'اكتشفي المجموعة', discover: 'اكتشفي المزيد', handcrafted: 'اختياراتنا المميزة', collection: 'قطعكِ المفضلة الجديدة', collectionBody: 'تفاصيل جميلة، اختيرت بكل عناية.', all: 'عرض الكل', allCategory: 'كل المنتجات', makeup: 'المكياج', skincare: 'العناية بالبشرة', sort: 'الأكثر تميزاً', best: 'الأعلى تقييماً', priceLow: 'السعر: من الأقل للأعلى', priceHigh: 'السعر: من الأعلى للأقل', reviews: 'تقييماً', add: 'أضيفي للسلة', added: 'أُضيف للسلة', emptyTitle: 'سلتكِ بانتظارك', emptyBody: 'خطوتكِ التالية نحو الإشراقة تبدأ من هنا.', subtotal: 'المجموع', checkout: 'إتمام الشراء', cartTitle: 'سلة التسوق', free: 'أضيفي منتجات بقيمة ٧٥٠ ج.م لشحن مجاني', freeHit: 'لقد حصلتِ على شحن مجاني', wishlist: 'اختياراتكِ المحفوظة', results: 'منتجات جميلة', noProducts: 'لا توجد منتجات هنا بعد.', loading: 'نبحث عن اختياراتكِ المفضلة...', currency: 'ج.م', brandNote: 'جمالٌ أجمل، ومزاجٌ أروع', newsletter: 'رسالة صغيرة منّا إليكِ؟', newsletterBody: 'أحدث المنتجات، نصائح جمالية، وهدية في يوم ميلادك.', email: 'بريدكِ الإلكتروني', join: 'انضمي إلينا', footerNote: 'جمالكِ... على طريقتكِ.', outOfStock: 'متوفر', quickSearch: 'جرّبي «بلاشر» أو «سيروم»', sale: 'على اختيارات مميزة', error: 'تعذر تحميل المنتجات. حاولي مجدداً.', details: 'تفاصيل المنتج', shade: 'الدرجة / الحجم', quantity: 'الكمية', continue: 'العودة لكل المنتجات', delivery: 'توصيل سريع لجميع أنحاء مصر', productDescription: 'اختيار مثالي لإطلالتك اليومية، بلمسة جميلة وإحساس ناعم يدوم. أضيفي لمسة من السعادة إلى روتينكِ اليومي.', zoom: 'حرّكي المؤشر على الصورة لمشاهدة التفاصيل' },
};

const imageUrl = (product, width = 780) => `https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=${width}&q=85`;
const formatPrice = (price, lang) => `${lang === 'ar' ? new Intl.NumberFormat('ar-EG').format(price) : new Intl.NumberFormat('en-EG').format(price)} ${lang === 'ar' ? 'ج.م' : 'LE'}`;

function ProductLens({ product, className = '', onOpen }) {
  const [point, setPoint] = useState(null);
  const move = (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPoint({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, px: ((event.clientX - bounds.left) / bounds.width) * 100, py: ((event.clientY - bounds.top) / bounds.height) * 100 });
  };
  return <div className={`lens-image ${className}`} role="button" tabIndex={0} aria-label="Open full-size product image" onClick={onOpen} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(); } }} onPointerMove={move} onPointerLeave={() => setPoint(null)}><img src={imageUrl(product, 1200)} alt={product.name.en} loading="lazy" />{point && <span className="image-lens" style={{ left: point.x, top: point.y, backgroundImage: `url(${imageUrl(product, 1500)})`, backgroundPosition: `${point.px}% ${point.py}%` }} />}</div>;
}

function ProductCard({ product, lang, favorite, onFavorite, onAdd, onOpen, added }) {
  const t = copy[lang];
  return <article className="product-card" role="link" tabIndex={0} onClick={() => onOpen(product)} onKeyDown={(event) => { if (event.target === event.currentTarget && event.key === 'Enter') onOpen(product); }}>
    <div className="product-image-wrap" style={{ '--product-tint': product.color }}>
      <img className="product-image" src={imageUrl(product)} alt={product.name[lang]} loading="lazy" />
      {product.badge && <span className="product-badge">{product.badge === 'NEW' ? 'JUST IN' : product.badge}</span>}
      <button className={`favorite-button ${favorite ? 'is-favorite' : ''}`} onClick={(event) => { event.stopPropagation(); onFavorite(product.id); }} aria-label="Save to wishlist"><Heart size={17} fill={favorite ? 'currentColor' : 'none'} /></button>
    </div>
    <div className="product-info"><div className="product-brand">{product.brand}</div><div className="product-title-row"><h3>{product.name[lang]}</h3><div className="product-price">{product.oldPrice && <del>{formatPrice(product.oldPrice, lang)}</del>}<span>{formatPrice(product.price, lang)}</span></div></div><div className="product-meta"><span>{lang === 'ar' ? product.shadeAr : product.shade}</span><span className="rating"><Star size={12} fill="currentColor" /> {product.rating} <span className="review-count">({product.reviews})</span></span></div></div>
    <button className={`quick-add ${added ? 'quick-added' : ''}`} onClick={(event) => { event.stopPropagation(); onAdd(product); }}><span>{added ? <><Check size={15} /> {t.added}</> : <><Plus size={15} /> {t.add}</>}</span></button>
  </article>;
}

function ProductDetail({ product, products, lang, onAdd, onOpen, onBack, favorite, onFavorite }) {
  const [quantity, setQuantity] = useState(1);
  const [imageOpen, setImageOpen] = useState(false);
  const t = copy[lang];
  const description = t.productDescription;
  useEffect(() => {
    if (!imageOpen) return;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setImageOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [imageOpen]);
  return <div className="product-detail-page">
    <button className="back-link" onClick={onBack}><ArrowLeft size={15} /> {t.continue}</button>
    <div className="detail-layout">
      <div className="detail-gallery"><div className="detail-image-frame"><ProductLens product={product} className="detail-lens" onOpen={() => setImageOpen(true)} /></div></div>
      <div className="detail-copy"><span className="product-brand">{product.brand}</span><h1>{product.name[lang]}</h1><div className="detail-rating"><span className="rating"><Star size={14} fill="currentColor" /> {product.rating}</span><span>({product.reviews} {t.reviews})</span></div><div className="detail-price">{product.oldPrice && <del>{formatPrice(product.oldPrice, lang)}</del>}<strong>{formatPrice(product.price, lang)}</strong></div><p className="detail-description">{description}</p><div className="detail-shade"><span>{t.shade}</span><strong>{lang === 'ar' ? product.shadeAr : product.shade}</strong></div><div className="detail-actions"><button className={`detail-favorite ${favorite ? 'is-favorite' : ''}`} onClick={() => onFavorite(product.id)} aria-label="Save to wishlist"><Heart size={19} fill={favorite ? 'currentColor' : 'none'} /></button><button className="detail-add" onClick={() => onAdd(product, quantity)}><ShoppingBag size={16} /> {t.add} · {formatPrice(product.price * quantity, lang)}</button><div className="detail-quantity"><button onClick={() => setQuantity((count) => Math.max(1, count - 1))} aria-label="Decrease quantity"><Minus size={14} /></button><span>{quantity}</span><button onClick={() => setQuantity((count) => count + 1)} aria-label="Increase quantity"><Plus size={14} /></button></div></div><div className="detail-delivery"><Sparkles size={15} /><span>{t.delivery}</span></div><div className="detail-accordions"><details open><summary>{t.details}<Plus size={14} /></summary><p>{description}</p></details><details><summary>{lang === 'ar' ? 'التوصيل والإرجاع' : 'Delivery & returns'}<Plus size={14} /></summary><p>{t.delivery}</p></details></div></div>
    </div>
    {imageOpen && <div className="image-lightbox" role="presentation" onClick={() => setImageOpen(false)}><button className="image-lightbox-close" onClick={() => setImageOpen(false)} aria-label={lang === 'ar' ? 'إغلاق الصورة' : 'Close image'}><X size={22} /></button><img src={imageUrl(product, 1800)} alt={product.name[lang]} onClick={(event) => event.stopPropagation()} /></div>}
    <section className="related-section"><span className="eyebrow">{lang === 'ar' ? 'اختيارات أخرى لكِ' : 'A FEW MORE LOVELY THINGS'}</span><h2>{lang === 'ar' ? 'قد تعجبكِ أيضاً' : 'You might also love'}<span className="heading-period">.</span></h2><div className="related-grid">{products.filter((item) => item.id !== product.id).slice(0, 4).map((item) => <button key={item.id} className="related-card" onClick={() => onOpen(item)}><img src={imageUrl(item, 420)} alt={item.name[lang]} /><span className="product-brand">{item.brand}</span><b>{item.name[lang]}</b><span>{formatPrice(item.price, lang)}</span></button>)}</div></section>
  </div>;
}

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('mona-lang') || 'en');
  const [dark, setDark] = useState(() => localStorage.getItem('mona-theme-v2') !== 'light');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [justAdded, setJustAdded] = useState('');
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProductId, setActiveProductId] = useState(() => window.location.pathname.match(/^\/products\/([^/]+)/)?.[1] || '');
  const t = copy[lang];
  const isArabic = lang === 'ar';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    localStorage.setItem('mona-lang', lang);
  }, [lang, isArabic]);
  useEffect(() => {
    const syncProductPath = () => setActiveProductId(window.location.pathname.match(/^\/products\/([^/]+)/)?.[1] || '');
    window.addEventListener('popstate', syncProductPath);
    return () => window.removeEventListener('popstate', syncProductPath);
  }, []);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('mona-theme-v2', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => { const controller = new AbortController(); productsApi.list({ signal: controller.signal }).then(setProducts).catch((e) => { if (e.name !== 'AbortError') setError(true); }).finally(() => setLoading(false)); return () => controller.abort(); }, []);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 2300); return () => clearTimeout(id); }, [toast]);

  const visibleProducts = useMemo(() => {
    let list = [...products];
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (query.trim()) list = list.filter((p) => `${p.name.en} ${p.name.ar} ${p.brand} ${p.category} ${p.shade} ${p.shadeAr}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'best') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'priceLow') list.sort((a, b) => a.price - b.price);
    if (sort === 'priceHigh') list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, sort, query]);
  const savedProducts = products.filter((p) => favorites.includes(p.id));
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const activeProduct = products.find((product) => product.id === activeProductId);

  const addToCart = (product, quantity = 1) => {
    setCart((current) => { const found = current.find((item) => item.id === product.id); return found ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) : [...current, { ...product, quantity }]; });
    setJustAdded(product.id); setToast(t.added); setSavedOpen(false); setTimeout(() => setJustAdded(''), 1400);
  };
  const openProduct = (product) => { window.history.pushState({ monaProduct: true }, '', `/products/${product.id}`); setActiveProductId(product.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const backToShop = () => { window.history.pushState({}, '', '/'); setActiveProductId(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const changeQuantity = (id, delta) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  const showCategory = (next) => { if (activeProductId) { window.history.pushState({}, '', '/'); setActiveProductId(''); } setCategory(next); setShowAll(false); setQuery(''); setMenuOpen(false); window.requestAnimationFrame(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })); };
  const categoryOptions = [{ id: 'all', label: t.allCategory }, { id: 'makeup', label: t.makeup }, { id: 'skincare', label: t.skincare }];
  const resultList = query || category !== 'all' || showAll ? visibleProducts : visibleProducts.slice(0, 4);
  const suggestionProducts = query.trim() ? products.filter((p) => `${p.name.en} ${p.name.ar} ${p.brand} ${p.category} ${p.shade} ${p.shadeAr}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 5) : [];

  return <div className={`app-shell ${isArabic ? 'arabic' : ''}`}>
    <header className="site-header">
      <button className="mobile-menu icon-button" onClick={() => setMenuOpen((v) => !v)} aria-label="Open menu">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
      <a className="wordmark" href={activeProductId ? '/' : '#top'} aria-label="Mona Store home">mona<span>.</span><small>STORE</small></a>
      <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`}>
        <button onClick={() => showCategory('all')}>{t.navNew}</button><button onClick={() => showCategory('makeup')}>{t.navMakeup}</button><button onClick={() => showCategory('skincare')}>{t.navSkin}</button>
      </nav>
      <div className="header-actions">
        <button className={`icon-button search-trigger ${searchOpen ? 'action-active' : ''}`} onClick={() => setSearchOpen((v) => !v)} aria-label="Search"><Search size={19} /></button>
        <button className="icon-button wishlist-trigger" onClick={() => setSavedOpen(true)} aria-label={t.wishlist}><Heart size={19} /><i>{favorites.length || ''}</i></button>
        <button className="icon-button theme-trigger" onClick={() => setDark((v) => !v)} aria-label="Toggle dark mode">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        <button className="language-button" onClick={() => setLang(isArabic ? 'en' : 'ar')}>{isArabic ? 'EN' : 'عربي'}</button>
        <button className="icon-button bag-trigger" onClick={() => setCartOpen(true)} aria-label={t.cartTitle}><ShoppingBag size={19} /><i>{itemCount || ''}</i></button>
      </div>
    </header>
    {searchOpen && <div className="search-bar"><Search size={18} /><input autoFocus placeholder={t.search} value={query} onChange={(e) => { if (activeProductId) { window.history.pushState({}, '', '/'); setActiveProductId(''); } setQuery(e.target.value); setCategory('all'); setShowAll(true); }} onKeyDown={(e) => { if (e.key === 'Escape') setSearchOpen(false); if (e.key === 'Enter' && suggestionProducts[0]) { openProduct(suggestionProducts[0]); setSearchOpen(false); } }} /><span>{query ? `${suggestionProducts.length} ${t.results}` : t.quickSearch}</span><button onClick={() => { setSearchOpen(false); setQuery(''); setShowAll(false); }} aria-label="Close search"><X size={17} /></button>{query.trim() && <div className="search-suggestions" role="listbox">{suggestionProducts.length ? suggestionProducts.map((product) => <button type="button" className="search-suggestion" key={product.id} role="option" onClick={() => { openProduct(product); setSearchOpen(false); setQuery(''); }}><img src={imageUrl(product, 100)} alt="" /><span><small>{product.brand}</small><b>{product.name[lang]}</b></span><strong>{formatPrice(product.price, lang)}</strong></button>) : <p className="search-no-suggestions">{t.noProducts}</p>}</div>}</div>}
    <main id="top">
      {activeProductId ? (activeProduct ? <ProductDetail key={activeProduct.id} product={activeProduct} products={products} lang={lang} onAdd={addToCart} onOpen={openProduct} onBack={backToShop} favorite={favorites.includes(activeProduct.id)} onFavorite={(id) => setFavorites((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id])} /> : <div className="products-empty"><p>{loading ? t.loading : t.noProducts}</p><button className="text-link" onClick={backToShop}>{t.continue}<ArrowRight size={14} /></button></div>) : <>
      <section className="hero">
        <div className="hero-copy"><p className="hero-brand">.mona store</p><h1>{t.titleA}<br /><em>{t.titleB}</em></h1><p>{t.heroBody}</p><button className="primary-button" onClick={() => showCategory('all')}>{t.shop}<ArrowRight size={15} /></button></div>
        <div className="hero-image"><img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1300&q=90" alt="A calm, sunlit beauty moment" /></div>
      </section>
      <section className="shop-section" id="shop"><div className="section-heading"><div><h2>{t.collection}<span className="heading-period">.</span></h2></div><button className="text-link" onClick={() => showCategory('all')}>{t.all}<ArrowUpRight size={15} /></button></div>
        <div className="shop-toolbar"><div className="category-tabs">{categoryOptions.map((option) => <button className={category === option.id ? 'selected-tab' : ''} key={option.id} onClick={() => setCategory(option.id)}>{option.label}<span>{option.id === 'all' ? products.length : products.filter((p) => p.category === option.id).length}</span></button>)}</div><label className="sort-select"><SlidersHorizontal size={14} /><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">{t.sort}</option><option value="best">{t.best}</option><option value="priceLow">{t.priceLow}</option><option value="priceHigh">{t.priceHigh}</option></select><ChevronDown size={13} /></label></div>
        {loading ? <div className="products-empty"><div className="loading-mark">✳</div><p>{t.loading}</p></div> : error ? <div className="products-empty"><p>{t.error}</p><button className="text-link" onClick={() => location.reload()}>{t.discover}<ArrowRight size={14} /></button></div> : resultList.length ? <div className="product-grid">{resultList.map((product) => <ProductCard key={product.id} product={product} lang={lang} favorite={favorites.includes(product.id)} onFavorite={(id) => setFavorites((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id])} onAdd={addToCart} onOpen={openProduct} added={justAdded === product.id} />)}</div> : <div className="products-empty"><div className="empty-flower">✳</div><p>{t.noProducts}</p><button className="text-link" onClick={() => { setCategory('all'); setQuery(''); }}>{t.all}<ArrowRight size={14} /></button></div>}
        {visibleProducts.length > 4 && !query && category === 'all' && !showAll && <button className="load-more" onClick={() => setShowAll(true)}>{t.all}<ArrowDown size={14} /></button>}
      </section>
      </>}
    </main>
    <footer className="site-footer"><a className="wordmark footer-logo" href="/">mona<span>.</span><small>STORE</small></a><span>© MONA STORE 2025</span><a href="#top">INSTAGRAM ↗</a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer">FACEBOOK ↗</a></footer>
    {toast && <div className="toast"><Check size={15} /> {toast}</div>}
    {(cartOpen || savedOpen) && <div className="drawer-backdrop" onClick={() => { setCartOpen(false); setSavedOpen(false); }}><aside className="side-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">{cartOpen ? 'A FEW GOOD THINGS' : 'YOUR LITTLE WISH LIST'}</span><h2>{cartOpen ? t.cartTitle : t.wishlist}<span className="heading-period">.</span></h2></div><button className="icon-button" onClick={() => { setCartOpen(false); setSavedOpen(false); }} aria-label="Close"><X size={19} /></button></div>{cartOpen && <div className="shipping-note"><span>✳</span>{subtotal >= 750 ? t.freeHit : t.free}<div className="shipping-track"><i style={{ width: `${Math.min(subtotal / 750 * 100, 100)}%` }} /></div></div>}<div className="drawer-items">{(cartOpen ? cart : savedProducts.map((p) => ({ ...p, quantity: 1 }))).map((item) => <div className={`drawer-item ${!cartOpen ? 'saved-product-row' : ''}`} key={item.id} onClick={!cartOpen ? () => { setSavedOpen(false); openProduct(item); } : undefined} onKeyDown={!cartOpen ? (event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setSavedOpen(false); openProduct(item); } } : undefined} role={!cartOpen ? 'link' : undefined} tabIndex={!cartOpen ? 0 : undefined}><img src={imageUrl(item, 190)} alt="" /><div className="drawer-item-copy"><span className="product-brand">{item.brand}</span><b>{item.name[lang]}</b><span>{formatPrice(item.price, lang)}</span>{cartOpen && <div className="quantity"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Remove one"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label="Add one"><Plus size={13} /></button></div>}</div><button className="remove-item" aria-label="Remove item" onClick={(event) => { event.stopPropagation(); cartOpen ? setCart((c) => c.filter((x) => x.id !== item.id)) : setFavorites((c) => c.filter((x) => x !== item.id)); }}><X size={14} /></button></div>)}{(cartOpen ? cart : savedProducts).length === 0 && <div className="drawer-empty"><div className="empty-flower">✳</div><h3>{cartOpen ? t.emptyTitle : t.wishlist}</h3><p>{cartOpen ? t.emptyBody : t.noProducts}</p><button className="primary-button" onClick={() => { setCartOpen(false); setSavedOpen(false); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}>{t.shop}<ArrowRight size={14} /></button></div>}</div>{cartOpen && cart.length > 0 && <div className="drawer-footer"><div><span>{t.subtotal}</span><strong>{formatPrice(subtotal, lang)}</strong></div><small>Shipping & taxes calculated at checkout.</small><button className="checkout-button" onClick={() => setToast(isArabic ? 'ستكون تجربة الدفع متاحة قريباً.' : 'Checkout is coming soon.')}>{t.checkout}<ArrowRight size={15} /></button></div>}</aside></div>}
  </div>;
}
