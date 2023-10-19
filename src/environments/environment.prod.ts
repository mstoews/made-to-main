import { CdkTreeNodeOutlet } from "@angular/cdk/tree";

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
  firebase_dev: {
    apiKey: "AIzaSyAoyvHYrm3X8JkcpsPBkjKKyYMvO2yp3H4",
    authDomain: "made-to-dev.firebaseapp.com",
    projectId: "made-to-dev",
    storageBucket: "made-to-dev.appspot.com",
    messagingSenderId: "943801679790",
    appId: "1:943801679790:web:fc1acc16908ea3a4bc123f",
    measurementId: "G-4YP76MJH8S"
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
    get_public_key:"http://localhost:9000/api/get-public-key",
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
