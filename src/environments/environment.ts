// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import 'zone.js/plugins/zone-error';

export const environment = {
  firebase: {
    projectId: 'made-to-cassie',
    appId: '1:819679326368:web:8bf0a91436ec18a06019c5',
    storageBucket: 'made-to-cassie.appspot.com',
    locationId: 'asia-east2',
    apiKey: 'AIzaSyB0kkt0xQJbdFwd9Fnh1F7x6taE30F76ME',
    authDomain: 'made-to-cassie.firebaseapp.com',
    messagingSenderId: '819679326368',
    measurementId: 'G-WGMMJK9NR3',
  },
  production: false,
  useEmulators: false,
  gtm_id: "G-WGMMJK9NR3",
  stripe: {
    public_key: 'pk_test_51JogSuCGT3ceZF7pYLMW9IZjEOaMGFqz5YOoBaNGTgT8dl72ThRvLgfx1DEFlQPteFpFlwgfpJLPnuJ1X60UCc8m00yEl0F8ra',
  },
  dev: {
    createMessage: "http://localhost:9000/api/createMessage",
    createAdmin: "http://localhost:9000/api/createAdmin",
    paymentIntent: "http://localhost:9000/api/payment_intent",
  },
  api: {
    prdUrl: "https://made-to-server.an.r.appspot.com/",
    baseUrl:  "http://localhost:9000",
    stripeDevUrl: "https://made-to-dev.df.r.appspot.com",
    createMessage: "https://made-to-cassie.df.r.appspot.com/api/createMessage",
    createUser: "https://made-to-cassie.df.r.appspot.com/api/createUser",
    createAdmin: "https://made-to-cassie.df.r.appspot.com/api/createAdmin",
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
