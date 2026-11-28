const C='family-v29', FILES=['./','index.html','config.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim()});
// 自分のファイルは毎回サーバーから最新を取る（オフラインのときだけ保存版を使う）
self.addEventListener('fetch',e=>{
  const same=new URL(e.request.url).origin===location.origin;
  e.respondWith(fetch(e.request, same?{cache:'no-store'}:{}).then(r=>{ if(same&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))} return r }).catch(()=>caches.match(e.request)));
});
// 通知をタップしたらアプリを前に出す
self.addEventListener('notificationclick',e=>{ e.notification.close(); e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{ for(const c of cs){ if('focus' in c) return c.focus() } return clients.openWindow('./') })) });
