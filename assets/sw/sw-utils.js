class SwUtils {
    constructor() {
        // this.nombre = '';
    }

    async eliminarCache(nombreCache, textoInclude) {
        const keys = await caches.keys();
        keys.forEach(key => {
            if (key !== nombreCache && key.includes(textoInclude)) {
                return caches.delete(key);
            }
        });
    }

    actualizarCache(nombreCache, req, res) {
        if (res.ok) {
            return caches.open(nombreCache).then(cache => {
                cache.put(req, res.clone());
                return res.clone();
            });
        } else {
            return res;
        }
    }

}
