/* Transcription du prospectus fourni le 18 septembre 2026. Voir VALIDATION.md. */
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const catalog=[];
function item(name,category,description,prices,image='',extra={}){catalog.push({id:slug(category+' '+name),name,category,description,prices,image:image?'../assets/products/'+image+'.webp':'',...extra})}
const tomato=[
 ['Marguerita',''],['Reine','jambon, champignons'],['Orientale','merguez, oignons, poivrons, olives, œuf'],
 ['Diva','jambon, chorizo, champignons, gorgonzola'],['Campagnarde','lardons, champignons, raclette'],['Chef','merguez, œuf'],['3 jambons','jambon, lardons, chorizo'],['4 fromages','gorgonzola, chèvre, bleu d’Auvergne'],['4 saisons','jambon, champignons, artichauts, olives'],['Fruits de mer','fruits de mer, ail, persil'],['Napolitaine','anchois, câpres, olives'],['Bolognaise','bœuf haché, champignons, œuf'],['Texane','bœuf haché, chorizo, poivrons, champignons'],['Savoyarde','jambon, pommes de terre, chèvre'],['Raclette','jambon, pommes de terre, raclette'],['Calzone soufflée','jambon, œuf'],['Américaine','viande hachée, boursin, œuf'],['Vénicienne','jambon, poivrons, oignons, chèvre'],['Hawaïenne','jambon, ananas'],['Bourguignonne','viande hachée, pommes de terre, oignons'],['Harlem','champignons, viande hachée, merguez'],['Neptune','thon, oignons, poivrons, olives, œuf'],['Poulet','poulet, champignons, chèvre'],['Chorizo','chorizo, merguez'],['Végétarienne','champignons, poivrons, artichauts, oignons, pommes de terre, olives'],['Royale extra','jambon, champignons, olives, chorizo, poivrons'],['Cannibale','viande hachée, poulet, merguez']
];
const cream=[['Rimini','4 fromages'],['Torino','jambon, pommes de terre, raclette'],['Venesia','saumon fumé'],['Milano','jambon, pommes de terre, chèvre'],['Indiana','poulet, poivrons, oignons'],['Fermière','poulet, pommes de terre, chèvre'],['Buffalo','bœuf haché, pommes de terre, raclette'],['Exotique','poulet, ananas'],['Juventus','lardons, chorizo, pommes de terre, oignons doux'],['Alsacienne','jambon, pommes de terre, oignons, reblochon'],['Tartiflette','lardons, pommes de terre, oignons, reblochon'],['Suprême','viande hachée, lardons, merguez'],['Chèvre miel','chèvre, miel'],['Chicken','poulet, champignons, boursin, pommes de terre, oignons']];
for(const [base,rows] of [['Tomate',tomato],['Crème',cream]])for(const [n,d] of rows)item(n,'Pizzas',(base==='Tomate'?'Sauce tomate':'Crème fraîche')+', fromage'+(d?', '+d:''),n==='Marguerita'?{Junior:8,Senior:13,Méga:17}:{Junior:10,Senior:17,Méga:23},n==='Calzone soufflée'?'pizza-calzone-coupee':'pizza-'+slug(n),{base});
const menus=[
 ['Midi',12.9,'1 pizza Junior + 1 boisson 33 cl + 1 dessert (hors glace).','De 11h à 14h30',1,'Junior','midi'],
 ['Solo',18.9,'1 pizza Senior + 5 wings ou 5 nuggets + 1 boisson 33 cl.','Pour une grande faim',1,'Senior','solo'],
 ['Duo',25,'2 pizzas Senior + 1 Coca-Cola 1,5 L.','À deux',2,'Senior','duo'],
 ['Andiamo',25,'3 pizzas Junior au choix + 1 Coca-Cola 1,5 L.','À partager',3,'Junior','andiamo'],
 ['Promo',35,'3 pizzas Super au choix + 1 Coca-Cola 1,5 L.','À partager',3,'Senior','promo'],
 ['Kids Cheese',7.5,'1 cheeseburger + frites + Capri-Sun.','Pour les petits',0,'','kids-cheese'],
 ['Kids Nuggets',7.5,'5 nuggets + frites + Capri-Sun.','Pour les petits',0,'','kids-nuggets']
];
for(const [n,p,d,label,count,size,code] of menus)item('Menu '+n,'Menus',d,{Menu:p},'',{label,count,size,code});
for(const [n,p,d,img] of [
 ['Montagnard',10,'Steak maison, salade, tomates, lardons, oignons, raclette, emmental, sauce maison','burger-montagnard'],
 ['Double bacon',11.5,'2 steaks maison, salade, tomates, bacon, oignons, cheddar, sauce maison','burger-double-bacon'],
 ['Méga',11.5,'2 steaks maison, salade, tomates, bacon, œuf, oignons, cheddar, emmental, sauce barbecue','burger-mega'],
 ['Mexicain',11.5,'Steak, salade, tomates, oignons, chorizo, cheddar, sauce chili','burger-mexicain'],
 ['Chèvre miel',11.5,'2 steaks maison, salade, tomates, oignons, chèvre, miel, noix',''],
 ['Crispy',11.5,'Escalope de poulet, salade, tomates, oignons, cheddar, sauce maison','burger-crispy']
])item(n,'Burgers gourmets',d,{Menu:p},img,{included:'Frites + 1 boisson 33 cl incluses',drink:true});
for(const [n,p,d,img] of [['Cheese',8,'Steak, cheddar, crudités','cheese-steak'],['Double cheese',9,'2 steaks, 2 cheddars, crudités','double-cheese'],['Fish',8.9,'Poisson pané, cheddar, crudités','fish-burger'],['Chicken',8.9,'Poulet pané, cheddar, crudités','chicken-burger']])item(n,'Burgers classiques',d,{Prix:p},img);
for(const [n,p,d,img] of [
 ['Kebab',9,'Viande kebab, salade, tomates, oignons',''],['Chicken',9,'Poulet curry, cheddar, salade, tomates, oignons',''],['Forever',9.5,'3 steaks maison, chèvre, miel, raclette, salade, tomates, oignons caramélisés','sandwich-forever'],['Escalope boursin',9.9,'Escalope, boursin, cheddar, salade, tomates, oignons caramélisés','sandwich-escalope-boursin'],['Mixte',10.9,'Escalope, 2 steaks maison, sauce fromagère, emmental, cheddar, salade, tomates, oignons caramélisés','sandwich-mixte'],['4 fromages',10.9,'Escalope de poulet, boursin, emmental, chèvre, sauce fromagère, salade, tomates, oignons caramélisés','sandwich-4-fromages'],['Crousty',9.9,'2 steaks maison, œuf, cheddar, bacon, salade, tomates, oignons caramélisés','sandwich-crousty']
])item(n,'Sandwichs','Pain maison. '+d,{Prix:p},img,{included:'Avec frites'});
item('Tacos','Tacos','Garnis de frites et de sauce fromagère.',{M:10,L:11},'tacos-1-viande',{taco:true});
for(const [n,d,img] of [
 ['Bolognaise','sauce tomate, bœuf mijoté, oignons, céleri','bolognaise'],['Arrabiata','sauce tomate, piment, ail, filet d’huile d’olive','arrabiata'],['Pesto','pesto de basilic, pignons, poulet','pesto'],['Salmone','crème, saumon fumé, persil, ail, parmesan','salmone'],['Carbonara','crème, lardons de veau, jaune d’œuf, parmesan','carbonara'],['Alfredo','crème, émincé de poulet, champignons, parmesan','alfredo-v2'],['4 fromages','crème, gorgonzola, chèvre, parmesan','4-fromages']
])item('Pasta '+n,'Pâtes','Penne, '+d,{Prix:10.9},'pasta-'+img);
for(const [n,d] of [['Cesara','Salade, tomates cerises, roquette, croûtons, poulet, œuf dur, sauce César'],['Chèvre chaud','Salade, tomates cerises, chèvre, miel, croûtons, pignons'],['Niçoise','Carotte, concombre, betterave, roquette, œuf dur, sauce vinaigrette'],['Saumon','Saumon, sauce balsamique, sauce vinaigre, avocat, citron']])item(n,'Salades',d,{Prix:9});
for(const [n,p,q,img] of [['Mozza sticks',4,8.9,'mozza-sticks-x5'],['Nuggets',4,8.9,'chicken-nuggets-x5'],['Tenders',5,10.9,'chicken-tenders-x5'],['Chicken wings',4,8.9,'chicken-wings-x5'],['Nems poulet',4,8.9,'']])item(n,'Tex Mex','À partager… ou pas.',{'5 pièces':p,'10 pièces':q},img);
item('Frites classiques','Tex Mex','',{Portion:3},'frites-classique');item('Potatoes','Tex Mex','',{Portion:3.5},'potatoes');
for(const [n,p,img] of [['Tiramisu',3.9,'tiramisu'],['Cookies',3.9,'cookies'],['Cheesecake',3.9,'cheese-cake'],['Tarte au Daim',3.5,'tarteaux-daims']])item(n,'Desserts','',{Prix:p},img);
item('Häagen-Dazs','Glaces','Deux formats au prospectus. Contenances et parfums à confirmer.',{'Petit pot':4,'Grand pot':8.5});
for(const [n,p,d] of [['Canette 33 cl',2,'Parfum à préciser lors de votre appel.'],['Freeze',3.5,'Parfum à confirmer.'],['Cristaline 50 cl',1.5,'Eau plate'],['Boisson 1,5 L',3.5,'Parfum à préciser lors de votre appel.'],['Boisson 2 L',4.5,'Parfum à préciser lors de votre appel.']])item(n,'Boissons',d,{Prix:p});
const categories=['Tous','Pizzas','Menus','Burgers gourmets','Burgers classiques','Sandwichs','Tacos','Pâtes','Salades','Tex Mex','Desserts','Glaces','Boissons'];
const supplements={Cheddar:1,Emmental:1,Raclette:1,Boursin:1,Lardons:1.5,Bacon:1.5};
