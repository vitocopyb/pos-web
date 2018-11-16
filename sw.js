importScripts('assets/sw/sw-config.js');
importScripts('assets/sw/sw-utils.js');

const swConfig = new SwConfig();
const swUtils = new SwUtils();

// --------------------------------------------------------------------------
// Estos valores se deben modificar cada vez que se publique en produccion
modoProduccion = true;
versionCache = '1.0.79';

// --------------------------------------------------------------------------
// asigna version a los nombres de los caches
swConfig.STATIC_CACHE = swConfig.STATIC_CACHE.replace(/{VERSION}/ig, versionCache);
swConfig.DYNAMIC_CACHE = swConfig.DYNAMIC_CACHE.replace(/{VERSION}/ig, versionCache);
swConfig.INMUTABLE_CACHE = swConfig.INMUTABLE_CACHE.replace(/{VERSION}/ig, versionCache);

// --------------------------------------------------------------------------
// hace el cache de los archivos dependiendo del ambiente
if (modoProduccion) {
    swConfig.APP_SHELL_VERSIONADOS = [
        'runtime.a66f828dca56eeb90e02.js',
        'styles.a63b94cf5d399b7f71eb.css',
        'polyfills.7a0e6866a34e280f48e7.js',
        'main.dbd65a8fa8b28e090f53.js'
    ];
} else {
    // -- desarrollo --
    swConfig.APP_SHELL_VERSIONADOS = [
        'runtime.js',
        'polyfills.js',
        'styles.js',
        'vendor.js',
        'main.js'
    ];
}

//-----------------------------------------------------------
// SW: INSTALL
//-----------------------------------------------------------
self.addEventListener('install', e => {
    // abre el cache y almacena los archivos
    const staticCacheVersionados = caches.open(swConfig.STATIC_CACHE).then(cache => cache.addAll(swConfig.APP_SHELL_VERSIONADOS));
    const staticCache = caches.open(swConfig.STATIC_CACHE).then(cache => cache.addAll(swConfig.APP_SHELL));
    const inmutableCache = caches.open(swConfig.INMUTABLE_CACHE).then(cache => cache.addAll(swConfig.APP_SHELL_INMUTABLE));

    // espera que termine la promesa para avanzar al siguiente evento
    e.waitUntil(Promise.all([staticCacheVersionados, staticCache, inmutableCache]));
});

//-----------------------------------------------------------
// SW: ACTIVATE
//-----------------------------------------------------------
self.addEventListener('activate', event => {
    const activateStatic = swUtils.eliminarCache(swConfig.STATIC_CACHE, 'static');
    const activateDynamic = swUtils.eliminarCache(swConfig.DYNAMIC_CACHE, 'dynamic');
    const activateInmutable = swUtils.eliminarCache(swConfig.INMUTABLE_CACHE, 'inmutable');

    // espera que termine la promesa para avanzar al siguiente evento
    event.waitUntil(Promise.all([activateStatic, activateDynamic, activateInmutable]));
});

//-----------------------------------------------------------
// SW: FETCH
//-----------------------------------------------------------
self.addEventListener('fetch', e => {
    let respuesta;

    if (
        e.request.url.includes('/api')
        || e.request.url.includes('/sockjs-node/info')
        || e.request.url.includes('/?0.')
    ) {
        // hace una peticion y retorna el recurso desde internet
        respuesta = fetch(e.request).then(res => {
            return res.clone();
        }).catch(error => {
            return new Response('Ocurrió un error en la red', {
                'status': 408,
                'headers': {
                    'Content-Type': 'text/plain'
                }
            });
        });
    } else {
        // Estratregia: CACHE WITH NETWORK FALLBACK
        // revisa primero si el recurso esta en el cache, sino lo pide a internet y actualiza el cache
        respuesta = caches.match(e.request).then(res => {
            if (res) {
                return res;
            } else {
                return fetch(e.request).then(newRes => {
                    return swUtils.actualizarCache(swConfig.DYNAMIC_CACHE, e.request, newRes);
                });
            }
        });
    }

    e.respondWith(respuesta);
});

// --------------------------------------------------------------
// SYNC: Recuperamos la conexion a internet
// self.addEventListener('sync', event => {
//     console.log('Tenemos conexion, enviamos la informacion');
//     console.log(event);
//     console.log(event.tag);
// });
