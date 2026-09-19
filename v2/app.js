'use strict';
const $=s=>document.querySelector(s),money=n=>n.toLocaleString('fr-FR',{style:'currency',currency:'EUR'}),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let active='Tous',limit=12,mode='pickup',cart=[],current=null,toastTimer;
const selectedSizes=new Map();
try{mode=localStorage.getItem('andiamo-v2-mode')==='delivery'?'delivery':'pickup'}catch{}
try{const saved=JSON.parse(localStorage.getItem('andiamo-v2-cart')||'[]');if(Array.isArray(saved))cart=saved.filter(i=>catalog.some(p=>p.id===i.id)&&Number.isInteger(i.qty)&&i.qty>0&&i.qty<100&&Number.isFinite(i.price)&&i.price>=0&&Array.isArray(i.options)&&typeof i.key==='string'&&typeof i.name==='string'&&typeof i.size==='string')}catch{}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2500)}
function save(){try{localStorage.setItem('andiamo-v2-cart',JSON.stringify(cart));localStorage.setItem('andiamo-v2-mode',mode)}catch{toast('Panier conservé uniquement pour cette visite.')}renderCart()}
function tabs(){ $('#categories').innerHTML=categories.map(c=>`<button class="${active===c?'active':''}" aria-pressed="${active===c}" data-category="${esc(c)}">${esc(c)}</button>`).join('') }
function render(append=false){
 const q=fold($('#search').value.trim());const all=catalog.filter(p=>(q||active==='Tous'||p.category===active)&&(!q||fold(p.name+' '+p.description+' '+p.category).includes(q)));
 $('#results').textContent=all.length+' recettes & formules';$('#more').hidden=all.length<=limit;
 const start=append?$('#products').querySelectorAll('.product').length:0;
 const html=all.slice(start,limit).map(p=>{const sizes=Object.keys(p.prices),first=selectedSizes.get(p.id)||sizes[0];return `<article class="product" data-id="${p.id}" data-size="${esc(first)}">${p.image?`<div class="photo"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy" decoding="async" width="800" height="600"></div>`:''}<div class="product-body"><span class="eyebrow">${esc(p.category)}${p.base?' · '+p.base:''}</span><h3>${esc(p.name)}</h3>${p.description?`<p>${esc(p.description)}</p>`:''}${p.included?`<p class="included">${esc(p.included)}</p>`:''}${sizes.length>1?`<div class="sizes" aria-label="Format de ${esc(p.name)}">${sizes.map(s=>`<button aria-pressed="${s===first}" class="${s===first?'active':''}" data-size="${esc(s)}">${esc(s)}</button>`).join('')}</div>`:''}<div class="product-bottom"><span class="price">${money(p.prices[first])}</span><button class="${p.count||p.drink||p.taco?'pill':'circle'} add" data-add="${p.id}" aria-label="${p.count||p.drink||p.taco?'Composer':'Ajouter'} ${esc(p.name)}">${p.count||p.drink||p.taco?'Choisir':'+'}</button></div></div></article>`}).join('');
 if(append)$('#products').insertAdjacentHTML('beforeend',html);else $('#products').innerHTML=html||'<p>Aucun résultat. Essayez un autre nom ou ingrédient.</p>';
 $('#products').querySelectorAll('img:not([data-prepared])').forEach(img=>{img.dataset.prepared='true';const ready=async()=>{try{await img.decode()}catch{}if(img.naturalWidth)img.parentElement.classList.add('ready')};img.addEventListener('load',ready);img.addEventListener('error',()=>{img.parentElement.hidden=true},{once:true});if(img.complete)ready()});
}
function renderMenus(){$('#menus').innerHTML=catalog.filter(p=>p.category==='Menus').map(p=>`<article class="menu-card"><span class="eyebrow">${esc(p.label)}</span><h3>${esc(p.name).toUpperCase()}</h3><strong class="price">${money(p.prices.Menu)}</strong><p>${esc(p.description)}</p><button class="pill gold" data-add="${p.id}">${p.count?'Composer mon menu':'Ajouter ce menu'}</button></article>`).join('')}
function selectField(label,name,choices){return `<label class="field">${esc(label)}<select required name="${name}"><option value="">Choisir…</option>${choices.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('')}</select></label>`}
function add(p,size,options=[],extra=0){const key=JSON.stringify([p.id,size,options]),found=cart.find(i=>i.key===key);if(found){if(found.qty>=99)return;found.qty++}else cart.push({key,id:p.id,name:p.name,size,options,price:p.prices[size]+extra,qty:1});save();toast(p.name+' ajouté au panier')}
function choose(p,size=Object.keys(p.prices)[0]){
 if(!p.count&&!p.taco&&!p.drink)return add(p,size);
 current={p,size};$('#option-title').textContent=p.name;$('#option-description').textContent=p.description;
 let fields='';if(p.count){for(let i=1;i<=p.count;i++)fields+=selectField('Pizza '+i+' · '+(p.code==='promo'?'Super / Senior':p.size),'pizza'+i,catalog.filter(x=>x.category==='Pizzas').map(x=>x.name));}
 if(p.code==='midi'||p.code==='solo'||p.drink)fields+='<label class="field">Boisson 33 cl souhaitée<input name="boisson" type="text" required maxlength="60" placeholder="Ex. Coca-Cola — selon disponibilité"></label>';
 if(p.code==='midi')fields+=selectField('Dessert (hors glace)','dessert',catalog.filter(x=>x.category==='Desserts').map(x=>x.name))+'<p class="conditions">Menu Midi valable de 11h à 14h30.</p>';
 if(p.code==='solo')fields+=selectField('Accompagnement','accompagnement',['5 wings','5 nuggets']);
 if(p.taco){fields+=selectField('Viande souhaitée','viande',['Viande hachée','Cordon bleu','Poulet','Nuggets','Tenders']);fields+='<p class="conditions">Le nombre de viandes autorisées par taille est à confirmer par téléphone.</p><fieldset><legend>Suppléments facultatifs</legend>'+Object.entries(supplements).map(([n,price])=>`<label class="check"><input type="checkbox" name="supplement" value="${n}">${n} + ${money(price)}</label>`).join('')+'</fieldset>';}
 $('#option-fields').innerHTML=fields;updateOptionPrice();$('#options').showModal();
}
function updateOptionPrice(){if(!current)return;const extra=[...$('#option-fields').querySelectorAll('input[name=supplement]:checked')].reduce((s,n)=>s+supplements[n.value],0);$('#option-submit').textContent='Ajouter · '+money(current.p.prices[current.size]+extra)}
$('#option-form').addEventListener('submit',e=>{e.preventDefault();if(!current)return;const data=new FormData(e.target);let extra=0;const options=[];for(const [k,v] of data){if(k==='supplement'){extra+=supplements[v]||0;options.push(v+' (+'+money(supplements[v])+')')}else options.push(String(v))}add(current.p,current.size,options,extra);$('#options').close();current=null});
$('#option-fields').addEventListener('change',updateOptionPrice);
// Menus never enter the pizza offer. Junior and Marguerita are excluded.
function discountFor(items,service){const eligible=items.filter(i=>{const p=catalog.find(p=>p.id===i.id);return p?.category==='Pizzas'&&p.name!=='Marguerita'&&['Senior','Méga'].includes(i.size)}).flatMap(i=>Array(i.qty).fill(i.price)).sort((a,b)=>a-b);const free=Math.floor(eligible.length/(service==='pickup'?2:3));return eligible.slice(0,free).reduce((s,p)=>s+p,0)}
function renderCart(){
 $('#count').textContent=cart.reduce((s,i)=>s+i.qty,0);document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===mode);b.setAttribute('aria-pressed',String(b.dataset.mode===mode))});
 $('#cart-offer').textContent=(mode==='pickup'?'À emporter : 1 achetée = la 2e offerte.':'En livraison : 2 achetées = la 3e offerte.')+' Senior / Super et Méga, hors Marguerita. Remise estimée, à signaler et confirmer lors de l’appel.';
 $('#cart-items').innerHTML=cart.map((i,k)=>`<article class="cart-row"><div><h3>${esc(i.name)}</h3><small>${esc(i.size)}${i.options.length?' · '+i.options.map(esc).join(', '):''}</small><div class="qty"><button data-qty="${k}" data-delta="-1" aria-label="Retirer une unité de ${esc(i.name)}">−</button><span>${i.qty}</span><button data-qty="${k}" data-delta="1" aria-label="Ajouter une unité de ${esc(i.name)}">+</button></div></div><strong class="price">${money(i.price*i.qty)}</strong></article>`).join('')||'<p>Votre panier est vide. Choisissez une recette dans la carte.</p>';
 const subtotal=cart.reduce((s,i)=>s+i.qty*i.price,0),discount=discountFor(cart,mode);$('#totals').innerHTML=`<div><span>Sous-total</span><strong>${money(subtotal)}</strong></div>${discount?`<div><span>Offre pizza estimée</span><strong>− ${money(discount)}</strong></div>`:''}<div class="total"><span>Total estimé</span><strong>${money(subtotal-discount)}</strong></div>`;
}
function menu(open){$('#nav').classList.toggle('open',open);$('.menu-toggle').setAttribute('aria-expanded',String(open));$('.menu-toggle').setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu')}
document.addEventListener('click',e=>{
 const cat=e.target.closest('[data-category]');if(cat){active=cat.dataset.category;$('#search').value='';limit=12;tabs();render()}
 const size=e.target.closest('.sizes button');if(size){const card=size.closest('.product'),p=catalog.find(p=>p.id===card.dataset.id);card.dataset.size=size.dataset.size;selectedSizes.set(p.id,size.dataset.size);card.querySelectorAll('.sizes button').forEach(b=>{b.classList.toggle('active',b===size);b.setAttribute('aria-pressed',String(b===size))});card.querySelector('.price').textContent=money(p.prices[size.dataset.size])}
 const addButton=e.target.closest('[data-add]');if(addButton)choose(catalog.find(p=>p.id===addButton.dataset.add),addButton.closest('.product')?.dataset.size);
 if(e.target.closest('#basket')){$('#cart').showModal();menu(false)}
 if(e.target.closest('.close'))e.target.closest('dialog').close();
 const qty=e.target.closest('[data-qty]');if(qty){const i=cart[Number(qty.dataset.qty)];i.qty=Math.min(99,i.qty+Number(qty.dataset.delta));cart=cart.filter(i=>i.qty>0);save()}
 const service=e.target.closest('[data-mode]');if(service){mode=service.dataset.mode;save()}
 const offer=e.target.closest('[data-mode-offer]');if(offer){mode=offer.dataset.modeOffer;active='Pizzas';$('#search').value='';limit=12;catalog.filter(p=>p.category==='Pizzas').forEach(p=>selectedSizes.set(p.id,'Senior'));tabs();render();save();$('#carte').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});toast(mode==='pickup'?'À emporter · taille Senior sélectionnée':'Livraison · taille Senior sélectionnée')}
 if(e.target.closest('.menu-toggle'))menu(!$('#nav').classList.contains('open'));else if(!e.target.closest('header')||e.target.closest('nav a'))menu(false);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')menu(false)});
$('#search').addEventListener('input',()=>{active='Tous';limit=12;tabs();render()});$('#more').addEventListener('click',()=>{const start=$('#products').children.length;limit+=12;render(true);const first=$('#products').children[start];if(first){first.tabIndex=-1;first.focus({preventScroll:true})}});
tabs();renderMenus();render();renderCart();
