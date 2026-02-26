import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 실제 Firebase 설정값
const firebaseConfig = {
  apiKey: "AIzaSyBxVptmoeHw56bHAb_dm2mAn1T_KkSpBBQ",
  authDomain: "er-449e9.firebaseapp.com",
  projectId: "er-449e9",
  storageBucket: "er-449e9.firebasestorage.app",
  messagingSenderId: "841263293917",
  appId: "1:841263293917:web:116d249f3d0f89ca278234",
  measurementId: "G-YJ620TJS02"
};

// 다른 모듈에서 __firebase_config를 참조할 때를 위한 호환 처리
if (typeof window !== "undefined") window.__firebase_config = firebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 애플리케이션용 추가 상수
const appId = "er-449e9";
const FIXED_TERMINATED_VENDORS = ['JB(2DAY)', '가나다다', '더팩토리', '미베', '베트남', '블루진', '사과나무', '세종', '정도', '카이저'];
const USER_ACCOUNTS = [
  { id: 'djcrow', password: '12345', name: '정진수', role: 'manager', domain: 'fairplay142.com' },
  { id: 'dongil.yeom', password: '12345', name: '염동일', role: 'manager', domain: 'fairplay142.com' },
];

export { app, auth, db, appId, FIXED_TERMINATED_VENDORS, USER_ACCOUNTS };
