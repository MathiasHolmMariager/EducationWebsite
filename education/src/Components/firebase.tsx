import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-538eUMDzrW9ti-ST77QWWT6_0CFsf2A",
  authDomain: "education-5a01d.firebaseapp.com",
  projectId: "education-5a01d",
  storageBucket: "education-5a01d.appspot.com",
  messagingSenderId: "148908742335",
  appId: "1:148908742335:web:9961517f5754e0bc3d580a",
  measurementId: "G-00GXR5JVG1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export default app;
