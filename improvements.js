const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const originalNormalize=normalize;
normalize=function(raw){return originalNormalize(raw).map(p=>({...p,rawName:p.name,name:p.name.replace('H?agen dazs','Häagen-Dazs').replace('Tarteaux daims','Tarte au Daim').replace('Suprème','Suprême')})).sort((a,b)=>{
 const classics=['Pizza Marguerita','Pizza Reine','Pizza 4 Fromages','Pizza Orientale'];const rank=p=>classics.includes(p.name)?classics.indexOf(p.name):99;
 return categoryOrder.indexOf(a.category)-categoryOrder.indexOf(b.category)||rank(a)-rank(b)||a.name.localeCompare(b.name,'fr');
})};
productImage=p=>{const slug=imageSlug(p.rawName||p.name);const replacements={'pizza-calzone-soufflee':'pizza-calzone-coupee',badoit:'badoit-bouteille','pasta-alfredo':'pasta-alfredo-v2'};return `assets/products/${replacements[slug]||slug}.webp`};
applyFilters=function(){const q=fold(document.querySelector('#search').value.trim());filtered=products.filter(p=>q?fold(p.name+' '+p.description).includes(q):activeCategory==='Tous'||p.category===activeCategory);visible=12;renderProducts()};
const originalRenderProducts=renderProducts;
function prepareProductImage(img,index){
 const frame=document.createElement('div');
 frame.className='product-image-frame';
 img.replaceWith(frame);frame.append(img);
 img.decoding='async';
 if(index<4)img.loading='eager';
 const ready=async()=>{
  try{await img.decode()}catch{/* The existing fallback still handles load errors. */}
  if(img.naturalWidth&&img.isConnected)frame.classList.add('image-ready');
 };
 img.addEventListener('load',ready);
 if(img.complete&&img.naturalWidth)ready();
}
renderProducts=function(){originalRenderProducts();document.querySelectorAll('.product-card').forEach((card,index)=>{
 prepareProductImage(card.querySelector('.product-image'),index);
 const p=products.find(x=>x.id===card.dataset.id);
 if(p.description==='Une recette généreuse préparée à la commande.')card.querySelector('.product-description').remove();
 if(p.category==='Tacos'||/^Menu (Promo|Andiamo)$/i.test(p.name)){card.querySelector('.add-button').classList.add('configure-button');card.querySelector('.add-button').textContent='Choisir';card.querySelector('.add-button').setAttribute('aria-label','Composer '+p.name)}
 });if(!filtered.length)document.querySelector('.product-grid').innerHTML='<p>Aucun produit trouvé. Essayez un autre nom ou ingrédient.</p>';
 if(document.querySelector('#search').value.trim())document.querySelector('#result-count').textContent=filtered.length+' produits · Toute la carte';
};
const originalAdd=addToCart;
addToCart=function(card){const p=products.find(x=>x.id===card.dataset.id),size=card.dataset.size,taco=p.category==='Tacos';if(!taco&&!/^Menu (Promo|Andiamo)$/i.test(p.name))return originalAdd(card);
 const count=taco?(p.name.includes('2')?2:1):3;
 const choices=taco?['Viande hachée','Cordon bleu','Poulet','Nuggets','Tenders']:products.filter(x=>x.category==='Pizzas').map(x=>x.name);
 document.querySelector('#product-dialog-body').innerHTML=`<h2>${esc(p.name)}</h2><p>${esc(p.description)}</p><form id="options-form">${Array.from({length:count},(_,i)=>`<label>${taco?'Viande':'Pizza'} ${i+1}<select required name="choice${i}"><option value="">Choisir…</option>${choices.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label>`).join('')}<button type="submit" class="button primary">Ajouter · ${euro(p.sizes[size])}</button></form>`;
 document.querySelector('#product-dialog').showModal();document.querySelector('#options-form').onsubmit=e=>{e.preventDefault();const options=[...new FormData(e.target).values()],key=encodeURIComponent(JSON.stringify([p.id,size,options])),existing=cart.find(i=>i.key===key);if(existing)existing.qty++;else cart.push({key,id:p.id,name:p.name,size,price:p.sizes[size],image:productImage(p),category:p.category,qty:1,options});saveCart();document.querySelector('#product-dialog').close();showToast(p.name+' ajouté au panier')};
};
const originalRenderCart=renderCart;
renderCart=function(){originalRenderCart();document.querySelectorAll('.cart-item').forEach((row,index)=>{if(cart[index].options?.length){const details=document.createElement('p');details.className='cart-options';details.textContent=cart[index].options.join(' · ');row.children[1].append(details)}});
 document.querySelector('.total-row span').textContent=mode==='delivery'?'Sous-total hors livraison':'Total estimé';
 document.querySelector('.cart-summary>small').textContent=mode==='delivery'?'Zone desservie, minimum, frais et délai confirmés par téléphone.':'Offre, disponibilité et heure de retrait confirmées par téléphone.';
 document.querySelector('.promo-status').textContent=promoDiscount()?'Réduction estimée : '+euro(promoDiscount()):'Ajoutez deux pizzas pour profiter de l’offre à emporter';
 document.querySelector('.checkout-button').textContent='Voir le récapitulatif';
};
function checkout(){const subtotal=cart.reduce((s,i)=>s+i.qty*i.price,0),discount=promoDiscount();document.querySelector('#checkout-body').innerHTML=`<h2>Votre récapitulatif</h2><p>${mode==='pickup'?'Retrait à la pizzeria':'Livraison à confirmer'}</p><ul>${cart.map(i=>`<li><strong>${i.qty} × ${esc(i.name)}</strong> ${i.size==='Unique'?'':esc(i.size)}${i.options?.length?'<br>'+i.options.map(esc).join(', '):''} — ${euro(i.price*i.qty)}</li>`).join('')}</ul>${discount?`<p>Offre estimée : − ${euro(discount)}</p>`:''}<p class="recap-total">${mode==='delivery'?'Sous-total hors livraison':'Total estimé'} : ${euro(subtotal-discount)}</p><p>Votre commande n’est pas encore envoyée. Appelez la pizzeria pour confirmer les produits, ${mode==='pickup'?'l’offre et l’heure de retrait':'votre adresse, les frais et le délai de livraison'}.</p><a class="button primary" href="tel:0169495959">Appeler le 01 69 49 59 59</a>`;document.querySelector('#checkout-dialog').showModal()}
document.addEventListener('click',e=>{
 if(e.target.closest('.checkout-button')){e.stopImmediatePropagation();checkout()}
 if(e.target.closest('.dialog-close'))e.target.closest('dialog').close();
 if(e.target.closest('[data-offer="pickup"]')){mode='pickup';activeCategory='Pizzas';document.querySelector('#search').value='';saveCart();renderCategories();applyFilters();showToast('Retrait sur place sélectionné')}
 const promo=e.target.closest('[data-promo]');
 if(promo){activeCategory='Tous';document.querySelector('#search').value=promo.dataset.promo;renderCategories();applyFilters();const card=document.querySelector('.product-card');if(card)addToCart(card)}
 if(e.target.closest('[data-category]'))document.querySelector('#search').value='';
},true);
document.querySelector('#search').addEventListener('input',()=>{if(document.querySelector('#search').value.trim()){activeCategory='Tous';renderCategories()}applyFilters()});
let cartReturnFocus;
const originalOpenCart=openCart;
openCart=function(open=true){if(open)cartReturnFocus=document.activeElement;originalOpenCart(open);document.querySelector('.cart-drawer').inert=!open;if(open){setMenu(false);document.querySelector('.cart-close').focus()}else cartReturnFocus?.focus()};
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;if(e.key==='Escape'){if(document.querySelector('.cart-drawer').classList.contains('open'))openCart(false);else{setMenu(false);document.querySelector('.menu-toggle').focus()}}if(e.key==='Tab'&&document.querySelector('.cart-drawer').classList.contains('open')){const buttons=[...document.querySelectorAll('.cart-drawer button:not([disabled])')].filter(n=>n.getClientRects().length),first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
document.querySelector('.cart-drawer').inert=true;
renderCart();
