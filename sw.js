const modoProduccion = true;
const STATIC_CACHE = 'static-v0.5';
const DYNAMIC_CACHE = 'dynamic-v0.5';
const INMUTABLE_CACHE = 'inmutable-v0.2';
let APP_SHELL_VERSIONADOS = [];

if (modoProduccion) {
    APP_SHELL_VERSIONADOS = [
        'runtime.a66f828dca56eeb90e02.js',
        'styles.ad33b21c3d792ef667d1.css',
        'polyfills.7a0e6866a34e280f48e7.js',
        'main.b31e881fb70bfb60a8c3.js'
    ];
} else {
    // -- desarrollo --
    APP_SHELL_VERSIONADOS = [
        'runtime.js',
        'polyfills.js',
        'styles.js',
        'vendor.js',
        'main.js'
    ];
}

const APP_SHELL = [
    './', // se incluye este path para que funcione la aplicacion en modo offline cuando se accede solo con el nomrbre del dominio, ej: localhost:8080 o localhost:8080/
    './index.html',
    './favicon.ico',
    './manifest.json',
    'assets/icons/icon-72x72.png',
    'assets/icons/icon-96x96.png',
    'assets/icons/icon-128x128.png',
    'assets/icons/icon-144x144.png',
    'assets/icons/icon-152x152.png',
    'assets/icons/icon-192x192.png',
    'assets/icons/icon-384x384.png',
    'assets/icons/icon-512x512.png',
    'assets/shared/img/icono_e-pay.png',
    'assets/shared/img/no-image.jpg',
    'assets/shared/img/no-image-large.png',
    'assets/shared/img/opps.png',
    'assets/shared/img/profile.png',
    'assets/shared/img/todos.jpg',
    'assets/totem-aramark/img/logo-getaway640.png',
    'assets/totem-aramark/video/circuito.mp4',
    'assets/totem-aramark/video/circuito.ogv',
    'assets/totem-aramark/video/circuito.webm'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v41/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
    'https://fonts.gstatic.com/s/materialicons/v41/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fBBc4.woff2',
    'https://fonts.gstatic.com/s/robotoslab/v7/BngRUXZYTXPIvIBgJJSb6u92w7CGwR0.woff2',
    'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2',
    'assets/shared/css/animate.min.css',
    'assets/shared/css/font-awesome.min.css',
    'assets/shared/fonts/fontawesome-webfont.eot',
    'assets/shared/fonts/fontawesome-webfont.svg',
    'assets/shared/fonts/fontawesome-webfont.ttf',
    'assets/shared/fonts/fontawesome-webfont.woff',
    'assets/shared/fonts/fontawesome-webfont.woff2?v=4.7.0',
    'assets/shared/fonts/FontAwesome.otf',
    'assets/shared/plugins/slick/fonts/slick.eot',
    'assets/shared/plugins/slick/fonts/slick.ttf',
    'assets/shared/plugins/slick/fonts/slick.woff',
    'assets/shared/plugins/slick/ajax-loader.gif',
    'assets/shared/plugins/slick/slick-theme.css',
    'assets/shared/plugins/slick/slick.css',
    'assets/shared/plugins/slick/slick.js',
    'assets/totem-aramark/css/material-kit.min.css',
    'assets/totem-aramark/js/bootstrap-material-design.min.js',
    'assets/totem-aramark/js/jquery.min.js',
    'assets/totem-aramark/js/material-kit.min.js',
    'assets/totem-aramark/js/popper.min.js'
];

self.addEventListener('install', e => {
    // abre el cache y almacena los archivos
    const staticCache = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));
    const staticCacheVersionados = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL_VERSIONADOS));
    const inmutableCache = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    // espera que termine la promesa para avanzar al siguiente evento
    e.waitUntil(Promise.all([staticCache, staticCacheVersionados, inmutableCache]));
});

self.addEventListener('activate', event => {
    const activateStatic = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });

    const activateDynamic = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }
        });
    });

    const activateInmutable = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== INMUTABLE_CACHE && key.includes('inmutable')) {
                return caches.delete(key);
            }
        });
    });

    event.waitUntil(Promise.all([activateStatic, activateDynamic, activateInmutable]));
});

self.addEventListener('fetch', e => {
    let respuesta;

    if (
        e.request.url.includes('/api')
        || e.request.url.includes('/sockjs-node/info')
        || e.request.url.includes('/?0.')
    ) {
        // respuesta = manejoApiMensajes( DYNAMIC_CACHE, e.request );
        respuesta = fetch(e.request).then(res => {
            return res.clone();
        }).catch(error => {
            return new Response('Ocurrió un error en la red', { 'status': 408, 'headers': { 'Content-Type': 'text/plain' } });
        });
    } else {
        respuesta = caches.match(e.request).then(res => {
            if (res) {
                // actualizaCacheStatico( STATIC_CACHE, e.request, APP_SHELL_INMUTABLE );
                return res;
            } else {
                return fetch(e.request).then(newRes => {
                    // todo *** eliminar
                    console.log(e.request.url);

                    return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
                });
            }
        });
    }

    e.respondWith(respuesta);

    // console.log('fetch', e.request.url);
    // e.respondWith(fetch(e.request));
});

// --------------------------------------------------------------
// SYNC: Recuperamos la conexion a internet
// self.addEventListener('sync', event => {
//     console.log('Tenemos conexion, enviamos la informacion');
//     console.log(event);
//     console.log(event.tag);

// });


// function obtenerImagenes() {
//     return new Promise((resolve, reject) => {
//         caches.open(DYNAMIC_CACHE).then(cache => {
//             for (let i = 1065; i <= 1080; i++) {
//                 // const url = 'assets/img/'+ i +'.jpg';
//                 const url = 'https://picsum.photos/200/300?image=' + i;
//                 fetch(url).then(res => {
//                     cache.put(url, res);
//                 }).catch(error => console.log(error));
//             }

//             resolve();
//         });
//     });
// }

// Network with cache fallback / update
function manejoApiMensajes(cacheName, req) {
    if (req.clone().method === 'POST' || req.url.includes('/sockjs-node/info')) {
        // // POSTEO de un nuevo mensaje
        // if ( self.registration.sync ) {
        //     return req.clone().text().then( body =>{
        //         // console.log(body);
        //         const bodyObj = JSON.parse( body );
        //         return guardarMensaje( bodyObj );

        //     });
        // } else {
        //     return fetch( req );
        // }
        return fetch(req);
    } else {
        return fetch(req).then(res => {
            if (res.ok) {
                actualizaCacheDinamico(cacheName, req, res.clone());
                return res.clone();
            } else {
                return caches.match(req);
            }
        }).catch(error => {
            return caches.match(req);
        });
    }
}

// Guardar  en el cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {
    if (res.ok) {
        return caches.open(dynamicCache).then(cache => {
            cache.put(req, res.clone());
            return res.clone();
        });
    } else {
        return res;
    }
}

// Cache with network update
function actualizaCacheStatico(staticCache, req, APP_SHELL_INMUTABLE) {
    if (APP_SHELL_INMUTABLE.includes(req.url)) {
        // No hace falta actualizar el inmutable
        // console.log('existe en inmutable', req.url );
    } else {
        // console.log('actualizando', req.url );
        // TODO *** ACA VOY: Revisar porque entra en esta condicion
        return fetch(req)
            .then(res => {
                return actualizaCacheDinamico(staticCache, req, res);
            });
    }
}