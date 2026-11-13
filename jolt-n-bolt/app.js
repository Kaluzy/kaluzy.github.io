/* Jolt 'N Bolt independent storefront V2. Checkout and inventory remain on DoorDash. */
(() => {
  'use strict';
  const ORDER_URL='https://order.online/store/~40102287/?hideModal=true';
  const IMG='assets/images/';
  const products=window.JNB_MENU || [];
  const featuredIds=['vietnamese','brioche','acai','berry'];
  const byId=new Map(products.map(p=>[p.id,p]));
  const favoritesKey='jnb-demo-favorites-v1',studioKey='jnb-demo-studio-v1';
  const $=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
  const src=p=>!p.image?'':/^(https?:)?\/\//.test(p.image)?p.image:IMG+p.image;
  const priceOf=p=>p.price==null?'Price varies by selection':`$${p.price.toFixed(2)}`;
  const priceHtml=p=>p.price==null?'<span class="price-varies">Price by size</span>':`<span>$${p.price.toFixed(2)}</span><small>menu ref.</small>`;
  const heartSvg='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.8 4.9a5.6 5.6 0 0 0-7.9 0L12 5.8l-.9-.9a5.6 5.6 0 1 0-7.9 7.9L12 21l8.8-8.2a5.6 5.6 0 0 0 0-7.9Z"/></svg>';
  const lookupTerms=p=>norm([p.name,p.category,p.desc,p.keywords].join(' '));
  let filter='All',search='',favoritesOnly=false,showAll=false;
  let lastFocus=null,toastTimer=null;
  const storageRead=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
  const storageWrite=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val))}catch{/* private browsing */}};
  let favorites=new Set((storageRead(favoritesKey,[])||[]).filter(x=>byId.has(x)));

  function editDistance(a,b){
    if(Math.abs(a.length-b.length)>2)return 3;
    let old=Array.from({length:b.length+1},(_,j)=>j);
    for(let i=1;i<=a.length;i++){const row=[i];for(let j=1;j<=b.length;j++)row[j]=Math.min(row[j-1]+1,old[j]+1,old[j-1]+(a[i-1]===b[j-1]?0:1));old=row;}
    return old[b.length];
  }
  function searchScore(p,query){
    if(!query)return 1;
    const name=norm(p.name),terms=lookupTerms(p),q=norm(query);
    if(name===q)return 1000;
    if(name.startsWith(q))return 850;
    if(name.includes(q))return 700;
    if(terms.includes(q))return 500;
    const words=terms.split(' ').filter(Boolean);
    const tokens=q.split(' ').filter(Boolean);
    const scores=tokens.map(token=>{
      if(words.some(w=>w===token))return 60;
      if(words.some(w=>w.startsWith(token)))return 45;
      if(token.length>=4&&words.some(w=>w.includes(token)))return 30;
      if(token.length>=4&&words.some(w=>editDistance(token,w)<=(token.length>=7?2:1)))return 14;
      return 0;
    });
    return scores.every(Boolean)?scores.reduce((a,b)=>a+b,0):0;
  }
  function matched(){
    const list=products.filter(p=>(filter==='All'||p.category===filter)&&(!favoritesOnly||favorites.has(p.id)));
    if(!search)return list;
    return list.map(p=>({p,score:searchScore(p,search)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).map(x=>x.p);
  }
  function photoCard(p){
    const saved=favorites.has(p.id),image=src(p);
    return `<article class="product-card">
      <div class="product-card__image" data-view="${esc(p.id)}" tabindex="0" role="button" aria-label="View details for ${esc(p.name)}"><img src="${esc(image)}" alt="Representative photo of ${esc(p.name)}" loading="lazy" decoding="async" width="768" height="512" onerror="this.classList.add('photo-unavailable')"/><span class="product-card__pill">${esc(p.badge||'On the menu')}</span></div>
      <button type="button" class="product-card__favorite" data-favorite="${esc(p.id)}" aria-label="${saved?'Remove':'Save'} ${esc(p.name)} ${saved?'from':'to'} favorites" aria-pressed="${saved}">${heartSvg}</button>
      <div class="product-card__body"><div class="product-card__category">${esc(p.category)}</div><h3 class="product-card__name">${esc(p.name)}</h3><p class="product-card__description">${esc(p.desc)}</p>
      <div class="product-card__bottom"><span class="product-card__price">${priceHtml(p)}</span><button type="button" class="quickview-link" data-view="${esc(p.id)}">View details ↗</button></div></div></article>`;
  }
  function textRow(p){
    return `<button type="button" class="directory-item" data-view="${esc(p.id)}" aria-label="Details for ${esc(p.name)}"><span class="directory-item__text"><strong>${esc(p.name)}</strong><small>${esc(p.category)} · ${esc(p.desc)}</small></span><span class="directory-item__right"><strong>${p.price==null?'Select size':`$${p.price.toFixed(2)}`}</strong><span aria-hidden="true">↗</span></span></button>`;
  }
  function renderFeatured(){
    $('#featured-grid').innerHTML=featuredIds.filter(id=>byId.has(id)).map(id=>photoCard(byId.get(id))).join('');
  }
  function renderMenu(){
    const list=matched(),pic=list.filter(p=>p.image),others=list.filter(p=>!p.image);
    const limited=!showAll&&!search&&filter==='All'&&!favoritesOnly;
    const visiblePics=limited?pic.slice(0,8):pic;
    const visibleOthers=limited?others.slice(0,10):others;
    $('#menu-grid').innerHTML=visiblePics.map(photoCard).join('');
    const directory=$('#menu-directory'),entries=$('#directory-items');
    directory.hidden=visibleOthers.length===0;
    entries.innerHTML=visibleOthers.map(textRow).join('');
    $('#menu-empty').hidden=list.length>0;
    $('#menu-status').textContent=`${list.length} ${list.length===1?'item':'items'} ${favoritesOnly?'in saved favorites':filter==='All'?'on our menu preview':`in ${filter}`}${search?` matching “${search}”`:''}`;
    $('#menu-more-wrap').hidden=search!==''||filter!=='All'||favoritesOnly||(pic.length<=8&&others.length<=10);
    $('#menu-more').innerHTML=showAll?'Show fewer items <span aria-hidden="true">↑</span>':'Explore the complete menu <span aria-hidden="true">↓</span>';
    $('#category-tabs').querySelectorAll('[data-filter]').forEach(b=>{let active=b.dataset.filter===filter&&!favoritesOnly;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $('#favorites-trigger').setAttribute('aria-pressed',String(favoritesOnly));
    $('#fav-count').textContent=favorites.size;
    $('#fav-count').hidden=!favorites.size;
    const searchHelp=$('#search-help');
    searchHelp.hidden=!search||list.length>0;
    searchHelp.textContent=search?'No match found. Try “acai”, “matcha”, “smoothie”, “bagel” or a shorter spelling.':'';
  }
  function setFilter(category){filter=category;favoritesOnly=false;showAll=true;search='';$('#menu-search').value='';renderMenu();$('#menu').scrollIntoView({behavior:'smooth',block:'start'});}
  function toast(msg){const el=$('#toast');el.textContent=msg;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,3100);}
  function toggleFavorite(id){if(favorites.has(id))favorites.delete(id);else favorites.add(id);storageWrite(favoritesKey,[...favorites]);renderFeatured();renderMenu();toast(favorites.has(id)?'Saved to favorites':'Removed from favorites');}
  function displayModal(id){
    const p=byId.get(id);if(!p)return;
    lastFocus=document.activeElement;
    const photo=$('#modal-photo'),picture=$('.modal-image'),modal=$('.product-modal');
    const hasPhoto=Boolean(p.image);
    picture.hidden=!hasPhoto;modal.classList.toggle('product-modal--text-only',!hasPhoto);
    if(hasPhoto){photo.src=src(p);photo.alt=`Representative image for ${p.name}`;}
    $('#modal-category').textContent=p.category.toUpperCase();
    $('#modal-title').textContent=p.name;
    $('#modal-price').textContent=p.price==null?'Final price depends on DoorDash selection':`${priceOf(p)} · pickup menu reference`;
    $('#modal-description').textContent=p.desc;
    const options=p.custom==='drink';
    $('#modifier-preview').hidden=!options;
    $('#modifier-options').innerHTML=options?'<div class="modifier-options" role="group" aria-label="Sample size"><button type="button" aria-pressed="false">Small</button><button type="button" aria-pressed="true">Medium</button><button type="button" aria-pressed="false">Large</button></div>':'';
    const linked=Boolean(p.orderUrl);
    $('#modal-order').href=linked?p.orderUrl:ORDER_URL;
    $('#modal-order').dataset.productId=p.id;
    $('#modal-order').querySelector('.order-text').textContent=linked?'Order this item on DoorDash':'Find item in DoorDash menu';
    $('#item-link-note').textContent=linked?'This link opens the specific item on DoorDash.':'DoorDash has not provided a verified item-specific link. This opens the store menu; the item name will be copied when permitted.';
    $('#modal-availability-text').textContent='Check live availability and pickup times in DoorDash.';
    $('#product-modal').hidden=false;document.body.style.overflow='hidden';modal.focus();
  }
  function closeModal(){if($('#product-modal').hidden)return;$('#product-modal').hidden=true;document.body.style.overflow='';lastFocus?.focus?.();}
  function updateMobile(open){$('#mobile-nav').hidden=!open;$('#mobile-toggle').setAttribute('aria-expanded',String(open));$('#mobile-toggle').setAttribute('aria-label',open?'Close menu':'Open menu');}
  function updateStatus(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());const hour=Number(parts.find(x=>x.type==='hour')?.value||0),minute=Number(parts.find(x=>x.type==='minute')?.value||0);const within=hour*60+minute>=450&&hour*60+minute<880;$('.hero__micro').title=(within?'Within':'Outside')+' typical listed pickup hours; DoorDash confirms actual order availability.';}
  document.addEventListener('click',event=>{
    const fav=event.target.closest('[data-favorite]');if(fav){toggleFavorite(fav.dataset.favorite);return;}
    const view=event.target.closest('[data-view]');if(view){displayModal(view.dataset.view);return;}
    const cat=event.target.closest('[data-category]');if(cat){setFilter(cat.dataset.category);return;}
    const tab=event.target.closest('[data-filter]');if(tab){setFilter(tab.dataset.filter);return;}
    if(event.target.closest('[data-close-modal]')){closeModal();return;}
    if(event.target.closest('#reset-search')){filter='All';search='';favoritesOnly=false;showAll=false;$('#menu-search').value='';renderMenu();$('#menu-search').focus();return;}
    const opt=event.target.closest('.modifier-options button');if(opt){opt.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===opt)));}
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){closeModal();updateMobile(false);return;}
    const view=event.target.closest('.product-card__image[data-view]');if(view&&(event.key==='Enter'||event.key===' ')){event.preventDefault();displayModal(view.dataset.view);return;}
    if(!$('#product-modal').hidden&&event.key==='Tab'){
      const buttons=[...$('.product-modal').querySelectorAll('button,a[href],input')].filter(el=>!el.closest('[hidden]'));
      const first=buttons[0],last=buttons[buttons.length-1];if(!first)return;
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  $('#menu-search').addEventListener('input',event=>{search=norm(event.target.value);if(search){filter='All';favoritesOnly=false;}showAll=true;renderMenu();});
  $('#menu-search').addEventListener('keydown',event=>{if(event.key==='Escape'){event.target.value='';search='';renderMenu();}});
  $('#menu-more').addEventListener('click',()=>{showAll=!showAll;renderMenu();});
  $('#search-trigger').addEventListener('click',()=>{$('#menu').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('#menu-search').focus(),200);});
  $('#favorites-trigger').addEventListener('click',()=>{favoritesOnly=!favoritesOnly;filter='All';search='';$('#menu-search').value='';showAll=true;renderMenu();$('#menu').scrollIntoView({behavior:'smooth'});});
  $('#mobile-toggle').addEventListener('click',()=>updateMobile($('#mobile-nav').hidden));
  $('#mobile-nav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>updateMobile(false)));
  $('#modal-order').addEventListener('click',event=>{
    const p=byId.get(event.currentTarget.dataset.productId);if(!p||p.orderUrl)return;
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(p.name).then(()=>toast(`Copied “${p.name}” — find it on DoorDash`)).catch(()=>{});}
  });
  function initStudio(){
    const params=new URLSearchParams(location.search),defaults={title:'Brighter days.',copy:'The first sip, the best bite, the little pause that makes your day. Coffee, tea & fresh favorites made for your everyday.'},saved=storageRead(studioKey,defaults);
    function apply(data){$('#hero-title em').textContent=data.title||defaults.title;$('#hero-description').textContent=data.copy||defaults.copy;}
    apply(saved);if(!params.has('studio'))return;
    $('#studio-panel').hidden=false;$('#studio-title').value=saved.title;$('#studio-copy').value=saved.copy;
    $('#studio-save').addEventListener('click',()=>{const data={title:$('#studio-title').value.trim().slice(0,60)||defaults.title,copy:$('#studio-copy').value.trim().slice(0,260)||defaults.copy};storageWrite(studioKey,data);apply(data);toast('Preview text saved on this device');});
    $('#studio-reset').addEventListener('click',()=>{storageWrite(studioKey,defaults);$('#studio-title').value=defaults.title;$('#studio-copy').value=defaults.copy;apply(defaults);toast('Preview text reset');});
    $('#studio-close').addEventListener('click',()=>$('#studio-panel').hidden=true);
  }
  window.JNB_QA={count:products.length,products,search:(q)=>products.filter(p=>searchScore(p,norm(q))>0),imageIds:products.filter(p=>p.image).map(p=>p.image)};
  $('#year').textContent=String(new Date().getFullYear());renderFeatured();renderMenu();updateStatus();initStudio();
})();
