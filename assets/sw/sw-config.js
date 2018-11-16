class SwConfig {
    constructor() {
        this.STATIC_CACHE = 'static-v{VERSION}';
        this.DYNAMIC_CACHE = 'dynamic-v{VERSION}';
        this.INMUTABLE_CACHE = 'inmutable-v{VERSION}';
        
        this.APP_SHELL_VERSIONADOS = [];

        this.APP_SHELL = [
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
            'assets/shared/img/logo-evolpos.png',
            'assets/shared/img/bodenor.jpg',
            'assets/totem-aramark/img/logo-getaway640.png',
            'assets/totem-aramark/video/circuito.mp4',
            'assets/totem-aramark/video/circuito.ogv',
            'assets/totem-aramark/video/circuito.webm',
            'assets/sw/sw-config.js',
            'assets/sw/sw-utils.js'
        ];
        
        this.APP_SHELL_INMUTABLE = [
            'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons',
            'https://fonts.gstatic.com/s/materialicons/v41/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
            'https://fonts.gstatic.com/s/materialicons/v41/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
            'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fBBc4.woff2',
            'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2',
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
    }
}
