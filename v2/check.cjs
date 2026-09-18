// Run with: node v2/check.cjs
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const context=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname,'catalog.js'),'utf8'),context);
const products=vm.runInContext('catalog',context);
assert.equal(new Set(products.map(p=>p.id)).size,products.length);
assert.equal(products.filter(p=>p.category==='Pizzas').length,41);
assert.equal(products.filter(p=>p.category==='Menus').length,7);
for(const p of products){for(const n of Object.values(p.prices))assert(n>0);if(p.image)assert(fs.existsSync(path.resolve(__dirname,p.image)),p.image)}
const app=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
vm.runInContext(app.slice(app.indexOf('function discountFor('),app.indexOf('function renderCart(')),context);
const pizza=products.find(p=>p.name==='Reine'),m=products.find(p=>p.name==='Marguerita'),menu=products.find(p=>p.name==='Menu Andiamo');
context.rows=[{id:pizza.id,size:'Senior',price:17,qty:2}];
assert.equal(vm.runInContext('discountFor(rows,"pickup")',context),17);
assert.equal(vm.runInContext('discountFor(rows,"delivery")',context),0);
context.rows[0].qty=3;
assert.equal(vm.runInContext('discountFor(rows,"delivery")',context),17);
context.rows=[{id:m.id,size:'Méga',price:17,qty:3},{id:menu.id,size:'Menu',price:25,qty:2},{id:pizza.id,size:'Junior',price:10,qty:2}];
assert.equal(vm.runInContext('discountFor(rows,"pickup")',context),0);
context.rows=[{id:pizza.id,size:'Senior',price:17,qty:1},{id:pizza.id,size:'Méga',price:23,qty:1}];
assert.equal(vm.runInContext('discountFor(rows,"pickup")',context),17);
console.log(`${products.length} fiches, 41 pizzas, 7 menus : tarifs positifs, images et exclusions de remise vérifiés.`);
