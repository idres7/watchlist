const V="watchlist-v2",IMG="watchlist-img-v1",SHELL=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==IMG).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(u.origin===location.origin){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("./index.html"))));return}
 if(u.hostname==="image.tmdb.org"){e.respondWith(caches.open(IMG).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>m))))}
});
self.addEventListener("push",e=>{let d={};try{d=e.data.json()}catch(x){}e.waitUntil(self.registration.showNotification(d.title||"قائمتي",{body:d.body||"",icon:"icon-192.png",badge:"icon-192.png",dir:"rtl",lang:"ar"}))});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>{for(const c of l){if("focus"in c)return c.focus()}return clients.openWindow("./")}))});
