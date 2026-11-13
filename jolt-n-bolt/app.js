/* Jolt 'N Bolt independent concept storefront
   Static, GitHub Pages-compatible site. DoorDash remains checkout source of truth.
   This file contains menu REFERENCE data, not a live inventory feed. */
(() => {
  'use strict';
  const ORDER_URL = 'https://order.online/store/~40102287/?hideModal=true';
  const IMG = 'assets/images/';
  const products = [
    {id:'vietnamese',name:'Vietnamese Iced Coffee',category:'Coffee & Tea',desc:'Strong espresso sweetened with condensed milk. A bold, comforting classic.',image:'vietnamese-coffee.webp',price:null,featured:true,badge:'Café favorite',custom:'drink'},
    {id:'brioche',name:'Avocado, Egg & Cheddar on Brioche',category:'Breakfast',desc:'Scrambled egg, melty cheddar and sliced avocado on warm brioche, with a mini fruit cup.',image:'breakfast-sandwich.webp',price:9.63,featured:true,badge:'Morning favorite',custom:'none'},
    {id:'acai',name:'Açai Bowl',category:'Bowls',desc:'Açaí and banana blended with almond milk, finished with granola, fruit, coconut and chia.',image:'acai-bowl.webp',price:null,featured:true,badge:'Fresh pick',custom:'none'},
    {id:'berry',name:'Berry Blast',category:'Smoothies',desc:'A bright and fruity smoothie from the café’s natural-fruit menu.',image:'berry-smoothie.webp',price:10.73,featured:true,badge:'Popular',custom:'none'},
    {id:'iced-latte',name:'Iced Latte',category:'Coffee & Tea',desc:'Espresso and milk poured over ice for a cool, smooth coffee break.',image:'iced-latte.webp',price:null,badge:'Coffee break',custom:'drink'},
    {id:'cold-brew',name:'Cold-Brew Iced Coffee',category:'Coffee & Tea',desc:'A slow, smooth, refreshing cold brew poured over ice.',image:'caramel-coffee.webp',price:null,badge:'Classic',custom:'drink'},
    {id:'chicken-pesto',name:'Grilled Chicken Pesto',category:'Lunch',desc:'Chicken breast, mozzarella, tomato, pesto and basil on ciabatta with a side salad.',image:'grilled-sandwich.webp',price:13.15,badge:'Lunch favorite',custom:'none'},
    {id:'bacon-ciabatta',name:'Bacon, Egg & Muenster on Ciabatta',category:'Breakfast',desc:'Scrambled eggs, Muenster and crisp bacon on ciabatta, served with a mini fruit cup.',image:'breakfast-sandwich.webp',price:9.85,badge:'Breakfast',custom:'none'},
    {id:'detox-green',name:'Detox Green Smoothie',category:'Smoothies',desc:'A refreshing green smoothie from the café’s power-boost lineup.',image:'iced-matcha.webp',price:12.05,badge:'Fresh energy',custom:'none'},
    {id:'superfruit',name:'Superfruit Max',category:'Smoothies',desc:'A fruity pick from the natural smoothie collection.',image:'berry-smoothie.webp',price:10.73,badge:'Smoothie',custom:'none'},
    {id:'lox',name:'Salmon LOX Bagel with Avocado',category:'Breakfast',desc:'Smoked salmon, avocado, cream cheese, tomato, capers, microgreens and lemon on a bagel.',image:'grilled-sandwich.webp',price:10.95,badge:'Savory bite',custom:'none'},
    {id:'chipotle',name:'Chipotle Turkey Sub',category:'Lunch',desc:'Turkey, bacon, cheddar, tomato and greens with chipotle aioli on a toasted sub.',image:'grilled-sandwich.webp',price:13.70,badge:'Lunch',custom:'none'},
    {id:'orange',name:'Orange Juice',category:'Juice',desc:'An easy, citrusy pick from the fresh juice collection.',image:'berry-smoothie.webp',price:8.53,badge:'Juice',custom:'none'},
    {id:'tropical',name:'Tropical Haven',category:'Smoothies',desc:'A refreshing, tropical-inspired smoothie from Jolt ’N Bolt’s menu.',image:'berry-smoothie.webp',price:10.73,badge:'Tropical',custom:'none'},
    {id:'blt',name:'BLT with Avocado',category:'Lunch',desc:'The classic bacon, lettuce and tomato favorite with avocado.',image:'grilled-sandwich.webp',price:13.15,badge:'Lunch',custom:'none'},
    {id:'matcha-bowl',name:'Matcha Bowl',category:'Bowls',desc:'A vibrant bowl from the café’s bowls menu.',image:'acai-bowl.webp',price:null,badge:'Bright bowl',custom:'none'},
    {id:'morning-detox',name:'Morning Detox',category:'Juice',desc:'A fresh juice selection to kick-start the day.',image:'iced-matcha.webp',price:10.95,badge:'Fresh juice',custom:'none'},
    {id:'pesto',name:'Teriyaki Chicken Power Bowl',category:'Bowls',desc:'A satisfying bowl from the café’s hearty lunch menu.',image:'acai-bowl.webp',price:13.81,badge:'Power lunch',custom:'none'}
  ];
  const byId = new Map(products.map(p=>[p.id,p]));
  const featuredIds=['vietnamese','brioche','acai','berry'];
  const favoritesKey='jnb-demo-favorites-v1';
  const studioKey='jnb-demo-studio-v1';
  const $=selector=>document.querySelector(selector);
  let filter='All', search='', favoritesOnly=false, showAll=false;
  let lastFocus=null, toastTimer=null;
  function storageRead(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
  function storageWrite(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{/* private browsing */}}
  let favorites=new Set(storageRead(favoritesKey,[]).filter(x=>byId.has(x)));
  const heartSvg='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.8 4.9a5.6 5.6 0 0 0-7.9 0L12 5.8l-.9-.9a5.6 5.6 0 1 0-7.9 7.9L12 21l8.8-8.2a5.6 5.6 0 0 0 0-7.9Z"/></svg>';
  const priceOf=p=>p.price===null?'Check price':`$${p.price.toFixed(2)}`;
  const priceHtml=p=>p.price===null?'Check price':`$${p.price.toFixed(2)} <small>ref.</small>`;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function cardHtml(p){
    const saved=favorites.has(p.id);
    return `<article class="product-card">
      <div class="product-card__image" data-view="${p.id}" tabindex="0" role="button" aria-label="View details for ${esc(p.name)}"><img src="${IMG}${p.image}" alt="Illustrative concept image for ${esc(p.name)}" loading="lazy"/><span class="product-card__pill">${esc(p.badge)}</span></div>
      <button type="button" class="product-card__favorite" data-favorite="${p.id}" aria-label="${saved?'Remove':'Save'} ${esc(p.name)} ${saved?'from':'to'} favorites" aria-pressed="${saved}">${heartSvg}</button>
      <div class="product-card__body"><div class="product-card__category">${esc(p.category)}</div><h3 class="product-card__name">${esc(p.name)}</h3><p class="product-card__description">${esc(p.desc)}</p><div class="product-card__bottom"><span class="product-card__price">${priceHtml(p)}</span><button type="button" class="quickview-link" data-view="${p.id}">View details ↗</button></div></div></article>`;
  }
  function renderFeatured(){ $('#featured-grid').innerHTML=featuredIds.map(id=>cardHtml(byId.get(id))).join(''); }
  function renderMenu(){
    let list=products.filter(p=>(filter==='All'||p.category===filter)&&(!favoritesOnly||favorites.has(p.id))&&(!search||`${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(search)));
    const total=list.length;
    const limit=(filter==='All'&&!favoritesOnly&&!search&&!showAll)?8:100;
    list=list.slice(0,limit);
    $('#menu-grid').innerHTML=list.length?list.map(cardHtml).join(''):'<div class="empty-state"><strong>Nothing found… yet.</strong><p>Try another search or category.</p><button type="button" class="btn btn--outline-dark" id="reset-search">Show all items ↗</button></div>';
    $('#menu-status').textContent=`${total} ${total===1?'item':'items'} ${favoritesOnly?'saved':filter==='All'?'in this preview':`in ${filter}`}${search?` matching “${search}”`:''}`;
    $('#menu-more-wrap').hidden=filter!=='All'||favoritesOnly||!!search||total<=8;
    $('#menu-more').innerHTML=showAll?'Show fewer items <span aria-hidden="true">↑</span>':'Show more menu items <span aria-hidden="true">↓</span>';
    $('#category-tabs').querySelectorAll('[data-filter]').forEach(btn=>{const active=btn.dataset.filter===filter&&!favoritesOnly;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});
    $('#favorites-trigger').setAttribute('aria-pressed',String(favoritesOnly));
    $('#fav-count').textContent=favorites.size;
    $('#fav-count').hidden=favorites.size===0;
  }
  function setFilter(next){filter=next;favoritesOnly=false;showAll=false;renderMenu();$('#menu').scrollIntoView({behavior:'smooth',block:'start'});}
  function toast(message){const el=$('#toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,2400)}
  function toggleFavorite(id){favorites.has(id)?favorites.delete(id):favorites.add(id);storageWrite(favoritesKey,[...favorites]);renderFeatured();renderMenu();toast(favorites.has(id)?'Added to saved favorites':'Removed from favorites')}
  function displayModal(id){const p=byId.get(id);if(!p)return;lastFocus=document.activeElement;$('#modal-photo').src=IMG+p.image;$('#modal-photo').alt=`Illustrative concept image for ${p.name}`;$('#modal-category').textContent=p.category.toUpperCase();$('#modal-title').textContent=p.name;$('#modal-price').textContent=p.price===null?'Final price on DoorDash':`${priceOf(p)} reference price · confirm on DoorDash`;$('#modal-description').textContent=p.desc;const hasOptions=p.custom==='drink';$('#modifier-preview').hidden=!hasOptions;$('#modifier-options').innerHTML=hasOptions?'<div class="modifier-options" role="group" aria-label="Sample drink size"><button type="button" aria-pressed="false">Small</button><button type="button" aria-pressed="true">Medium</button><button type="button" aria-pressed="false">Large</button></div>':'';$('#modal-order').href=ORDER_URL;$('#modal-availability-text').textContent='Check actual availability and pickup time on DoorDash';$('#product-modal').hidden=false;document.body.style.overflow='hidden';$('.product-modal').focus()}
  function closeModal(){if($('#product-modal').hidden)return;$('#product-modal').hidden=true;document.body.style.overflow='';lastFocus?.focus?.()}
  function updateMobile(open){$('#mobile-nav').hidden=!open;$('#mobile-toggle').setAttribute('aria-expanded',String(open));$('#mobile-toggle').setAttribute('aria-label',open?'Close menu':'Open menu')}
  function updateStatus(){ // Do not call this a real-time inventory or ordering status.
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
    const hour=Number(parts.find(x=>x.type==='hour')?.value||0),minute=Number(parts.find(x=>x.type==='minute')?.value||0);
    const within=(hour*60+minute)>=450&&(hour*60+minute)<880;
    const label=within?'Within usual online ordering hours':'Outside usual online ordering hours';
    document.querySelector('.hero__micro').setAttribute('title',`${label}. DoorDash confirms live availability.`);
  }
  // Event delegation allows saved items / category changes to re-render without broken controls.
  document.addEventListener('click',event=>{
    const view=event.target.closest('[data-view]');if(view){displayModal(view.dataset.view);return;}
    const favorite=event.target.closest('[data-favorite]');if(favorite){toggleFavorite(favorite.dataset.favorite);return;}
    const category=event.target.closest('[data-category]');if(category){setFilter(category.dataset.category);return;}
    const tab=event.target.closest('[data-filter]');if(tab){setFilter(tab.dataset.filter);return;}
    if(event.target.closest('[data-close-modal]')){closeModal();return;}
    if(event.target.closest('#reset-search')){filter='All';search='';favoritesOnly=false;showAll=false;$('#menu-search').value='';renderMenu();return;}
    const modifier=event.target.closest('.modifier-options button');if(modifier){modifier.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===modifier)));}
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){closeModal();updateMobile(false);return;}
    const view=event.target.closest('[data-view]');if(view&&(event.key==='Enter'||event.key===' ')){event.preventDefault();displayModal(view.dataset.view);return;}
    if(!$('#product-modal').hidden&&event.key==='Tab'){
      const eligible=[...$('.product-modal').querySelectorAll('button:not([hidden]),a[href],input')].filter(el=>!el.closest('[hidden]'));
      if(!eligible.length)return;
      const first=eligible[0],last=eligible[eligible.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
  });
  $('#category-tabs').addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){const tabs=[...$('#category-tabs').querySelectorAll('button')];const pos=tabs.indexOf(document.activeElement);if(pos===-1)return;event.preventDefault();const next=tabs[(pos+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];next.focus();setFilter(next.dataset.filter);}});
  $('#menu-search').addEventListener('input',event=>{search=event.target.value.toLowerCase().trim();showAll=true;renderMenu();});
  $('#menu-more').addEventListener('click',()=>{showAll=!showAll;renderMenu();});
  $('#search-trigger').addEventListener('click',()=>{$('#menu').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('#menu-search').focus(),250)});
  $('#favorites-trigger').addEventListener('click',()=>{favoritesOnly=!favoritesOnly;filter='All';showAll=true;renderMenu();$('#menu').scrollIntoView({behavior:'smooth'})});
  $('#mobile-toggle').addEventListener('click',()=>updateMobile($('#mobile-nav').hidden));
  $('#mobile-nav').querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>updateMobile(false)));
  function initStudio(){
    const params=new URLSearchParams(location.search);const defaults={title:'Brighter days.',copy:'The first sip, the best bite, the little pause that makes your day. Coffee, tea & fresh favorites made for your everyday.'};
    const saved=storageRead(studioKey,defaults);
    function apply(data){$('#hero-title em').textContent=data.title||defaults.title;$('#hero-description').textContent=data.copy||defaults.copy;}
    apply(saved);
    if(!params.has('studio'))return;
    $('#studio-panel').hidden=false;$('#studio-title').value=saved.title;$('#studio-copy').value=saved.copy;
    $('#studio-save').addEventListener('click',()=>{const data={title:$('#studio-title').value.trim().slice(0,60)||defaults.title,copy:$('#studio-copy').value.trim().slice(0,260)||defaults.copy};storageWrite(studioKey,data);apply(data);toast('Preview text saved on this device')});
    $('#studio-reset').addEventListener('click',()=>{storageWrite(studioKey,defaults);$('#studio-title').value=defaults.title;$('#studio-copy').value=defaults.copy;apply(defaults);toast('Preview text reset')});
    $('#studio-close').addEventListener('click',()=>$('#studio-panel').hidden=true);
  }
  $('#year').textContent=String(new Date().getFullYear());
  renderFeatured();renderMenu();updateStatus();initStudio();
})();
