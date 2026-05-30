import React, { useState, useEffect, useRef } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadString, deleteObject } from 'firebase/storage';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  Plus,
  Trash2,
  Edit,
  Camera,
  Upload,
  CheckCircle2,
  Loader2,
  Download,
  ChevronRight,
  X,
  Send,
  Check,
  Sparkles,
  RefreshCcw,
  Zap,
  Menu,
  Sun,
  Moon,
  ArrowLeft
} from 'lucide-react';
import { ShaderAnimation } from './components/ui/shader-animation';

import { auth, db, storage, googleProvider } from './firebase';
import { UserProfile, PromptTemplate, FlowStep, UserPoster } from './types';
import { handleFirestoreError, OperationType } from './lib/firestoreUtils';

// Constants
const ADMIN_EMAILS = ["habibovkomron007@gmail.com"];
const CREDITS_PER_GEN = 10;

// --- Components ---

const Background = ({ theme }: { theme: 'light' | 'dark' }) => (
  <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
    <ShaderAnimation />
    <div className={`absolute inset-0 transition-colors duration-700 backdrop-blur-[2px] ${theme === 'dark' ? 'bg-[#0a0d12]/45' : 'bg-[#f4f7fa]/75'}`}></div>
  </div>
);

const TypewriterCycle = ({ phrases, className }: { phrases: string[], className?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const phrase = phrases[currentIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 1800);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting) {
      if (displayed.length < phrase.length) {
        timeout = setTimeout(() => {
          setDisplayed(phrase.slice(0, displayed.length + 1));
        }, 60);
      } else {
        setIsPaused(true);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 35);
      } else {
        setIsDeleting(false);
        setCurrentIndex((i) => (i + 1) % phrases.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, isPaused, currentIndex, phrases]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
};

interface ToastProps {
  key?: any;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className={`min-w-[260px] max-w-[380px] glow-box rounded-lg p-4 shadow-xl flex items-center gap-3 border-l-4 ${type === 'success' ? 'border-l-[#4fc3f7]' : type === 'error' ? 'border-l-[#ff7b72]' : 'border-l-[#dde3ea]'
      }`}
  >
    <span className={type === 'success' ? 'text-[#1a7aad]' : type === 'error' ? 'text-[#ff7b72]' : 'text-[#dde3ea]'}>
      {type === 'success' ? <CheckCircle2 size={18} /> : type === 'error' ? <X size={18} /> : <Zap size={18} />}
    </span>
    <span className="text-sm text-[#1a2030] dark:text-white">{message}</span>
  </motion.div>
);

function useDraggableAutoScroll(speed = 1, direction = 'left', sets = 2) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const currentX = useRef(0);
  const velocity = useRef(direction === 'left' ? -speed : speed);
  const lastMouseX = useRef(0);
  const lastMouseTime = useRef(0);
  
  useEffect(() => {
    let rafId: number;
    let lastFrameTime = performance.now();

    const animate = (time: number) => {
      const track = trackRef.current;
      if (!track) {
        rafId = requestAnimationFrame(animate);
        return;
      }
      
      const w = track.scrollWidth / sets;
      if (w <= 0) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      const dt = time - lastFrameTime;
      lastFrameTime = time;

      // Prevent huge jumps when tab becomes active again
      if (dt > 100) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      if (!isDragging.current) {
        const targetVelocity = direction === 'left' ? -speed : speed;
        velocity.current += (targetVelocity - velocity.current) * 0.1;
        // Base speed assumes 60fps (16.66ms per frame)
        currentX.current += velocity.current * (dt / 16.66);
      }
      
      if (currentX.current <= -w) {
        currentX.current += w;
      } else if (currentX.current > 0) {
        currentX.current -= w;
      }
      
      track.style.transform = `translateX(${currentX.current}px)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [speed, direction]);

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      isDragging.current = true;
      lastMouseX.current = e.clientX;
      lastMouseTime.current = performance.now();
      velocity.current = 0;
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouseX.current;
      const dt = performance.now() - lastMouseTime.current;
      if (dt > 0) {
        velocity.current = dx / (dt / 16.66);
      }
      currentX.current += dx;
      lastMouseX.current = e.clientX;
      lastMouseTime.current = performance.now();
    },
    onPointerUp: () => {
      isDragging.current = false;
    },
    onPointerLeave: () => {
      isDragging.current = false;
    }
  };

  return { trackRef, handlers };
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  const [adminTab, setAdminTab] = useState<'users' | 'prompts' | 'soloPrompts' | null>(null);
  const [styleType, setStyleType] = useState<'standard' | 'solo'>('standard');
  const [flowStep, setFlowStep] = useState<FlowStep>(0);
  const [toasts, setToasts] = useState<{ id: number, message: string, type: 'success' | 'error' | 'info' }[]>([]);
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const didSeedRef = useRef(false);

  // Flow State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<PromptTemplate | null>(null);
  const [productName, setProductName] = useState('');
  const [promptAddition, setPromptAddition] = useState('');
  const [language, setLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTiles, setGeneratedTiles] = useState<string[]>([]);
  const [genStep, setGenStep] = useState(1);

  // Admin State
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  // Inventory State
  const [userPosters, setUserPosters] = useState<UserPoster[]>([]);
  const [lastVisiblePoster, setLastVisiblePoster] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMorePosters, setHasMorePosters] = useState<boolean>(true);
  const [isLoadingPosters, setIsLoadingPosters] = useState<boolean>(false);
  
  // Draggable Carousels
  const marqueeScroll = useDraggableAutoScroll(0.8, 'left', 4);
  const examplesScroll = useDraggableAutoScroll(0.6, 'left', 4);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [promptImageFile, setPromptImageFile] = useState<File | null>(null);
  const [isUploadingPrompt, setIsUploadingPrompt] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [appLanguage, setAppLanguage] = useState<'English' | 'Russian' | 'Uzbek'>('English');
  const [showCookieBanner, setShowCookieBanner] = useState(() => !localStorage.getItem('cookieConsent'));

  // Synchronize history with flowStep changes
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ flowStep: 0 }, "Step 0");
    }
  }, []);

  useEffect(() => {
    const currentState = window.history.state;
    if (!currentState || currentState.flowStep !== flowStep) {
      window.history.pushState({ flowStep }, `Step ${flowStep}`);
    }
  }, [flowStep]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && typeof event.state.flowStep === 'number') {
        if (isGenerating || isRemovingBg) {
          window.history.pushState({ flowStep }, `Step ${flowStep}`);
          return;
        }
        setFlowStep(event.state.flowStep);
      } else {
        setFlowStep(0);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isGenerating, isRemovingBg, flowStep]);

  const translations = {
    English: {
      heroTitle: <>Product card created<br />before your <span className="bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">coffee cools</span></>,
      backBtn: "Back",
      startBtn: "Start Creating",
      credits: "credits",
      buy: "Buy",
      admin: "Admin",
      exitAdmin: "Exit Admin",
      step1Title: "Step 1 — Upload Product Image",
      step1Desc: "Clear photos with good lighting work best",
      dropImage: "Drop your product image here",
      uploadBtn: "Upload File",
      useCamera: "Use Camera",
      step2Title: "Step 2 — Background Removal",
      step2Desc: "Isolating your product for better results",
      bgRemoved: "✓ BG REMOVED",
      removingBg: "Removing background via Remove.bg API…",
      bgFail: "Background removal failed. Continue with original?",
      continueAnyway: "Continue Anyway",
      continueStyles: "Continue to Styles →",
      step3Title: "Step 3 — Choose Style & Language",
      step3Desc: "Customize the look and feel of your poster",
      langLabel: "Language",
      prodLabel: "Product Name",
      genBtn: "Generate Poster",
      genCost: "Costs 10 credits per generation",
      genTitle: "Generating your poster…",
      genDesc: "Our AI is crafting 4 unique variations for you",
      cookingText: "Magic is happening... your image is being cooked!",
      genSteps: ['Preparing image', 'Sending to Gemini AI', 'Generating 4 variations', 'Splitting into tiles', 'Finalizing'],
      readyTitle: "✦ Your Poster is Ready",
      readyDesc: "Download your favorite variations",
      download: "Download",
      createAnother: "Create Another",
      pricingTitle: "Pricing Plans",
      pricingDesc: "Choose the best plan for your creative needs",
      planBasicImages: "5 creations (4 images) or 10 solo styles",
      planStandardImages: "15 creations (4 images) or 30 solo styles",
      planPremiumImages: "30 creations (4 images) or 60 solo styles",
      mostPopular: "Most Popular",
      contactTelegram: "Contact",
      manualPayment: "Payments are processed manually via Telegram. Credits will be added to your account instantly after confirmation.",
      welcomeBack: "Welcome back",
      signInDesc: "Sign in to start creating beautiful product posters",
      continueGoogle: "Continue with Google",
      terms: "By continuing, you agree to our Terms of Service and Privacy Policy",
      adminDash: "Admin Dashboard",
      newPrompt: "New Prompt",
      userMgmt: "User Management",
      promptLib: "Prompt Library",
      user: "User",
      joined: "Joined",
      actions: "Actions",
      saveTemplate: "Save Template",
      cancel: "Cancel",
      standardPrompts: "Standard Styles (4 images)",
      soloPrompts: "Solo Styles (1 image)",
      editPrompt: "Edit Prompt Template",
      newPromptTitle: "New Prompt Template",
      styleName: "Style Name",
      icon: "Icon",
      description: "Description",
      promptText: "Prompt Text",
      promptAdditionsLabel: "Additions to Prompt (Optional)",
      promptAdditionsPlaceholder: "e.g. Add a red sports car in the background",
      myInventory: "My Inventory",
      inventoryTitle: "Your Posters",
      inventoryDesc: "View and manage your generated posters",
      noPosters: "You haven't generated any posters yet.",
      preview: "Preview",
      delete: "Delete",
      // Marquee
      marquee: ['No studio needed', 'One click generation', 'No design skills needed', 'Cheaper than ever', 'Turn photos into sales', 'Simple and fast'],
      // How It Works
      howItWorksTitle: "How It Works",
      howStep1: "Take a picture",
      howStep2: "Choose a design you like",
      howStep3: "Get a ready high-quality image",
      // Examples
      exploreExamples: "Explore the Examples",
      // Comparison
      compTitle: "Your product deserves better than boring photos.",
      compSub: "Create premium marketplace visuals with AI in seconds.",
      compTraditionalTitle: "Traditional Photography",
      compTraditionalTime: "3 to 7 days",
      compTraditional1: "Studio setup and photographers",
      compTraditional2: "Editing and endless revisions",
      compTraditional3: "Expensive for every product",
      compAiTitle: "Nidu AI",
      compAi1: "No complicated tools",
      compAi2: "Endless styles and concepts",
      compAi3: "Create more while spending less",
      // Free credits
      freeCreditsTitle: "Start free with 15 AI credits",
      freeCreditsDesc: "Enough to create and explore instantly. No card needed.",
      // CTA
      ctaTitle: "One upload is all it takes",
      ctaSub: "Try it free today.",
      ctaBtn: "Give a shot",
      // Footer
      footerTagline: "AI-powered product visuals",
      footerProduct: "Product",
      footerPricing: "Pricing",
      footerExamples: "Examples",
      footerHowItWorks: "How It Works",
      footerCompany: "Company",
      footerPrivacy: "Privacy Policy",
      footerTerms: "Terms of Service",
      footerContact: "Contact",
      footerRights: "All rights reserved.",
      // Cookie
      cookieText: "We use cookies to improve your experience. By using our site, you agree to our use of cookies.",
      cookieAccept: "Accept",
      cookieDecline: "Decline"
    },
    Russian: {
      heroTitle: <>Карточка товара готова,<br />пока ваш <span className="bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">кофе остывает</span></>,
      backBtn: "Назад",
      startBtn: "Начать создание",
      credits: "кредитов",
      buy: "Купить",
      admin: "Админ",
      exitAdmin: "Выйти",
      step1Title: "Шаг 1 — Загрузка фото",
      step1Desc: "Четкие фото с хорошим освещением работают лучше всего",
      dropImage: "Перетащите изображение товара сюда",
      uploadBtn: "Загрузить файл",
      useCamera: "Камера",
      step2Title: "Шаг 2 — Удаление фона",
      step2Desc: "Изолируем ваш товар для лучшего результата",
      bgRemoved: "✓ ФОН УДАЛЕН",
      removingBg: "Удаление фона через Remove.bg API…",
      bgFail: "Не удалось удалить фон. Продолжить с оригиналом?",
      continueAnyway: "Продолжить так",
      continueStyles: "К выбору стиля →",
      step3Title: "Шаг 3 — Стиль и язык",
      step3Desc: "Настройте внешний вид вашего постера",
      langLabel: "Язык текста",
      prodLabel: "Название товара",
      genBtn: "Создать постер",
      genCost: "Стоимость: 10 кредитов",
      genTitle: "Создаем ваш постер…",
      genDesc: "Наш ИИ готовит 4 уникальных варианта для вас",
      cookingText: "Магия в процессе... ваше изображение готовится!",
      genSteps: ['Подготовка изображения', 'Отправка в Gemini AI', 'Генерация 4 вариантов', 'Разделение на части', 'Финализация'],
      readyTitle: "✦ Ваш постер готов",
      readyDesc: "Скачайте понравившиеся варианты",
      download: "Скачать",
      createAnother: "Создать еще",
      pricingTitle: "Тарифные планы",
      pricingDesc: "Выберите подходящий тариф для ваших идей",
      planBasicImages: "5 генераций (по 4 фото) или 10 соло-стилей",
      planStandardImages: "15 генераций (по 4 фото) или 30 соло-стилей",
      planPremiumImages: "30 генераций (по 4 фото) или 60 соло-стилей",
      mostPopular: "Популярный",
      contactTelegram: "Связаться",
      manualPayment: "Оплата обрабатывается вручную через Telegram. Кредиты будут зачислены сразу после подтверждения.",
      welcomeBack: "С возвращением",
      signInDesc: "Войдите, чтобы начать создавать красивые постеры",
      continueGoogle: "Войти через Google",
      terms: "Продолжая, вы соглашаетесь с Условиями использования и Политикой конфиденциальности",
      adminDash: "Панель управления",
      newPrompt: "Новый промпт",
      userMgmt: "Управление пользователями",
      promptLib: "Библиотека промптов",
      user: "Пользователь",
      joined: "Регистрация",
      actions: "Действия",
      saveTemplate: "Сохранить",
      cancel: "Отмена",
      standardPrompts: "Стандартные (4 изображения)",
      soloPrompts: "Соло (1 изображение)",
      editPrompt: "Редактировать шаблон",
      newPromptTitle: "Новый шаблон",
      styleName: "Название стиля",
      icon: "Иконка",
      description: "Описание",
      promptText: "Текст промпта",
      promptAdditionsLabel: "Дополнения к промпту (Необязательно)",
      promptAdditionsPlaceholder: "напр. Добавьте красную машину на фон",
      myInventory: "Мой инвентарь",
      inventoryTitle: "Ваши постеры",
      inventoryDesc: "Просмотр и управление вашими постерами",
      noPosters: "Вы еще не создали ни одного постера.",
      preview: "Просмотр",
      delete: "Удалить",
      marquee: ['Студия не нужна', 'Генерация в один клик', 'Навыки дизайна не нужны', 'Дешевле, чем когда-либо', 'Превратите фото в продажи', 'Просто и быстро'],
      howItWorksTitle: "Как это работает",
      howStep1: "Сфотографируйте товар",
      howStep2: "Выберите понравившийся дизайн",
      howStep3: "Получите готовое изображение высокого качества",
      exploreExamples: "Посмотрите примеры",
      compTitle: "Ваш товар заслуживает лучшего, чем скучные фото.",
      compSub: "Создавайте премиальные визуалы для маркетплейсов с ИИ за секунды.",
      compTraditionalTitle: "Традиционная фотография",
      compTraditionalTime: "от 3 до 7 дней",
      compTraditional1: "Студия и фотографы",
      compTraditional2: "Редактирование и бесконечные правки",
      compTraditional3: "Дорого для каждого товара",
      compAiTitle: "Nidu AI",
      compAi1: "Никаких сложных инструментов",
      compAi2: "Бесконечные стили и концепции",
      compAi3: "Создавайте больше, тратя меньше",
      freeCreditsTitle: "Начните бесплатно с 15 AI-кредитами",
      freeCreditsDesc: "Достаточно, чтобы создать и попробовать. Карта не нужна.",
      ctaTitle: "Одна загрузка — это всё, что нужно",
      ctaSub: "Попробуйте бесплатно сегодня.",
      ctaBtn: "Попробовать",
      footerTagline: "Визуалы для товаров на основе ИИ",
      footerProduct: "Продукт",
      footerPricing: "Тарифы",
      footerExamples: "Примеры",
      footerHowItWorks: "Как это работает",
      footerCompany: "Компания",
      footerPrivacy: "Политика конфиденциальности",
      footerTerms: "Условия использования",
      footerContact: "Контакты",
      footerRights: "Все права защищены.",
      cookieText: "Мы используем файлы cookie для улучшения вашего опыта. Используя наш сайт, вы соглашаетесь с использованием cookie.",
      cookieAccept: "Принять",
      cookieDecline: "Отклонить"
    },
    Uzbek: {
      heroTitle: <>Qahvangiz sovuguncha<br /><span className="bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">mahsulot kartasi</span> tayyor</>,
      backBtn: "Orqaga",
      startBtn: "Yaratishni boshlash",
      credits: "kredit",
      buy: "Sotib olish",
      admin: "Admin",
      exitAdmin: "Chiqish",
      step1Title: "1-qadam — Rasmni yuklash",
      step1Desc: "Yaxshi yoritilgan va aniq rasmlar eng yaxshi natija beradi",
      dropImage: "Mahsulot rasmini shu yerga tashlang",
      uploadBtn: "Faylni yuklash",
      useCamera: "Kameradan foydalanish",
      step2Title: "2-qadam — Fonni olib tashlash",
      step2Desc: "Yaxshi natija uchun mahsulotni fondan ajratish",
      bgRemoved: "✓ FON OLIB TASHLANDI",
      removingBg: "Remove.bg API orqali fon o'chirilmoqda…",
      bgFail: "Fonni o'chirib bo'lmadi. Asl rasm bilan davom etasizmi?",
      continueAnyway: "Baribir davom etish",
      continueStyles: "Uslubni tanlash →",
      step3Title: "3-qadam — Uslub va til",
      step3Desc: "Posteringiz ko'rinishini sozlang",
      langLabel: "Matn tili",
      prodLabel: "Mahsulot nomi",
      genBtn: "Posterni yaratish",
      genCost: "Har bir yaratish uchun 10 kredit",
      genTitle: "Poster yaratilmoqda…",
      genDesc: "Bizning AI siz uchun 4 ta noyob variant tayyorlamoqda",
      cookingText: "Sehrli jarayon... rasmingiz tayyorlanmoqda!",
      genSteps: ['Rasmni tayyorlash', 'Gemini AI ga yuborish', '4 xil variant yaratish', 'Qismlarga ajratish', 'Yakunlash'],
      readyTitle: "✦ Posteringiz tayyor",
      readyDesc: "Yoqqan variantlarni yuklab oling",
      download: "Yuklab olish",
      createAnother: "Yana yaratish",
      pricingTitle: "Tariflar",
      pricingDesc: "Ijodiy ehtiyojlaringiz uchun eng yaxshi rejani tanlang",
      planBasicImages: "5 marta yaratish (4 rasmli) yoki 10 ta solo uslub",
      planStandardImages: "15 marta yaratish (4 rasmli) yoki 30 ta solo uslub",
      planPremiumImages: "30 marta yaratish (4 rasmli) yoki 60 ta solo uslub",
      mostPopular: "Eng ommabop",
      contactTelegram: "Bog'lanish",
      manualPayment: "To'lovlar Telegram orqali qo'lda amalga oshiriladi. Tasdiqlangandan so'ng kreditlar darhol hisobingizga qo'shiladi.",
      welcomeBack: "Xush kelibsiz",
      signInDesc: "Chiroyli mahsulot posterlarini yaratishni boshlash uchun kiring",
      continueGoogle: "Google orqali kirish",
      terms: "Davom etish orqali siz Xizmat ko'rsatish shartlari va Maxfiylik siyosatiga rozilik bildirasiz",
      adminDash: "Admin paneli",
      newPrompt: "Yangi prompt",
      userMgmt: "Foydalanuvchilarni boshqarish",
      promptLib: "Promptlar kutubxonasi",
      user: "Foydalanuvchi",
      joined: "Sana",
      actions: "Amallar",
      saveTemplate: "Saqlash",
      cancel: "Bekor qilish",
      standardPrompts: "Standart (4 ta rasm)",
      soloPrompts: "Yakka (1 ta rasm)",
      editPrompt: "Shablonni tahrirlash",
      newPromptTitle: "Yangi shablon",
      styleName: "Uslub nomi",
      icon: "Ikonka",
      description: "Tavsif",
      promptText: "Prompt matni",
      promptAdditionsLabel: "Promptga qo'shimchalar (Ixtiyoriy)",
      promptAdditionsPlaceholder: "masalan, orqa fonga qizil avtomobil qo'shing",
      myInventory: "Mening inventarim",
      inventoryTitle: "Sizning posterlaringiz",
      inventoryDesc: "Yaratilgan posterlaringizni ko'rish va boshqarish",
      noPosters: "Siz hali hech qanday poster yaratmadingiz.",
      preview: "Ko'rish",
      delete: "O'chirish",
      marquee: ['Studiya kerak emas', 'Bir bosish bilan yaratish', 'Dizayn ko\'nikmasi kerak emas', 'Har qachongidan arzon', 'Rasmlarni sotuvga aylantiring', 'Oddiy va tez'],
      howItWorksTitle: "Qanday ishlaydi",
      howStep1: "Mahsulotni suratga oling",
      howStep2: "Yoqqan dizaynni tanlang",
      howStep3: "Tayyor yuqori sifatli rasmni oling",
      exploreExamples: "Namunalarni ko'ring",
      compTitle: "Mahsulotingiz zerikarli rasmlardan yaxshiroqqa loyiq.",
      compSub: "AI yordamida bir necha soniyada premium marketplace vizuallari yarating.",
      compTraditionalTitle: "An'anaviy fotografiya",
      compTraditionalTime: "3 dan 7 kungacha",
      compTraditional1: "Studiya va fotograflar",
      compTraditional2: "Tahrirlash va cheksiz tuzatishlar",
      compTraditional3: "Har bir mahsulot uchun qimmat",
      compAiTitle: "Nidu AI",
      compAi1: "Murakkab vositalar kerak emas",
      compAi2: "Cheksiz uslub va konseptlar",
      compAi3: "Kam sarflab ko'proq yarating",
      freeCreditsTitle: "15 ta bepul AI kredit bilan boshlang",
      freeCreditsDesc: "Yaratish va sinash uchun yetarli. Karta kerak emas.",
      ctaTitle: "Bitta yuklash — bu yetarli",
      ctaSub: "Bugun bepul sinab ko'ring.",
      ctaBtn: "Sinab ko'rish",
      footerTagline: "AI asosidagi mahsulot vizuallari",
      footerProduct: "Mahsulot",
      footerPricing: "Tariflar",
      footerExamples: "Namunalar",
      footerHowItWorks: "Qanday ishlaydi",
      footerCompany: "Kompaniya",
      footerPrivacy: "Maxfiylik siyosati",
      footerTerms: "Xizmat shartlari",
      footerContact: "Aloqa",
      footerRights: "Barcha huquqlar himoyalangan.",
      cookieText: "Biz tajribangizni yaxshilash uchun cookie fayllaridan foydalanamiz. Saytimizdan foydalanib, siz cookie ishlatishga rozilik bildirasiz.",
      cookieAccept: "Qabul qilish",
      cookieDecline: "Rad etish"
    }
  };

  const t = translations[appLanguage];

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              credits: 15,
              createdAt: new Date(),
              isAdmin: ADMIN_EMAILS.includes(firebaseUser.email || '')
            };
            await setDoc(userRef, newProfile);
            setProfile(newProfile);
          } else {
            setProfile({ uid: firebaseUser.uid, ...snap.data() } as UserProfile);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } else {
        setUser(null);
        setProfile(null);
        setAdminTab(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchFirstPagePosters = async () => {
    if (!user) return;
    setIsLoadingPosters(true);
    try {
      const q = query(
        collection(db, 'posters'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(12)
      );
      const snap = await getDocs(q);
      const list: UserPoster[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as UserPoster);
      });
      setUserPosters(list);
      
      const last = snap.docs[snap.docs.length - 1] || null;
      setLastVisiblePoster(last);
      setHasMorePosters(snap.docs.length === 12);
    } catch (error) {
      console.error('Error fetching posters:', error);
    } finally {
      setIsLoadingPosters(false);
    }
  };

  const fetchNextPagePosters = async () => {
    if (!user || !lastVisiblePoster || isLoadingPosters) return;
    setIsLoadingPosters(true);
    try {
      const q = query(
        collection(db, 'posters'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisiblePoster),
        limit(12)
      );
      const snap = await getDocs(q);
      const list: UserPoster[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as UserPoster);
      });
      setUserPosters(prev => [...prev, ...list]);
      
      const last = snap.docs[snap.docs.length - 1] || null;
      setLastVisiblePoster(last);
      setHasMorePosters(snap.docs.length === 12);
    } catch (error) {
      console.error('Error fetching next page of posters:', error);
    } finally {
      setIsLoadingPosters(false);
    }
  };

  useEffect(() => {
    if (user) {
      const qPrompts = query(collection(db, 'prompts'));
      const unsubPrompts = onSnapshot(qPrompts, (snap) => {
        const pList: PromptTemplate[] = [];
        snap.forEach(d => pList.push({ id: d.id, ...d.data() } as PromptTemplate));
        setPrompts(pList);
      }, (error) => {
        console.error('Error fetching prompts:', error);
      });

      fetchFirstPagePosters();

      return () => { unsubPrompts(); };
    }
  }, [user]);

  useEffect(() => {
    if (user && prompts.length === 0 && !didSeedRef.current) {
      const seedDefaults = async () => {
        const ABSTRACT_PROMPT = `Scene Composition:
Create a single 2x2 grid image (4 images in one frame) in ultra-realistic 2K resolution (2048x2048). The overall mood is modern, elegant, and minimalist, designed for a luxury e-commerce landing page. Each of the four cards features a central title at the top in a sophisticated, wide-set sans-serif font displaying the [PRODUCT NAME].

General Aesthetics & Hierarchy:
All four cards utilize professional studio lighting with soft shadows and realistic highlights. Background colors are matte and chosen to create high contrast with the [PRODUCT NAME]. A subtle, metallic-finish brand logo placeholder is integrated into the bottom corner of each card.

Top Left: Variation 1 - Pure Aesthetic Display
Concept: A "hero" shot focused entirely on the product's form.
Composition: The [PRODUCT NAME] is placed at a dynamic three-quarter angle.
Surface & Environment: It rests on a premium, tactile surface. Background is a calm, soft-focus gradient.
Text & Graphics: Only the [PRODUCT NAME] title at the top and the brand logo at the bottom.

Top Right: Variation 2 - Lifestyle & Information
Concept: Demonstrating scale and usage through human interaction.
Composition: A human element visible to show the [PRODUCT NAME] in a natural context.
Text & Graphics: 3-4 thin, elegant indicator lines with minimal icons.

Bottom Left: Variation 3 - Dynamic Floating Presentation
Concept: A futuristic, gravity-defying floating view.
Composition: The [PRODUCT NAME] is suspended in mid-air.
Text & Graphics: Detailed information callouts connected by precise thin lines.

Bottom Right: Variation 4 - Creative Artistic Composition
Concept: An abstract, high-fashion arrangement.
Composition: The [PRODUCT NAME] is the centerpiece of a stylized still life with abstract supporting objects.
Text & Graphics: No callouts. Only the [PRODUCT NAME] title at the top and the logo at the bottom.

Final Finish: Apply ultra-clean layouts, professional-grade depth of field (bokeh), and subtle light bloom for a premium, commercial finish. High resolution. Create in one single image.`;

        const MINIMAL_PROMPT = `Create a single 2x2 grid image (4 images in one frame) in ultra-realistic 2K resolution (2048x2048).
Product: [PRODUCT NAME]
Style: Clean, minimal, professional studio product photography. No artistic or abstract elements. Everything must look physically real, like a commercial catalog photoshoot.
Lighting: Soft diffused studio lighting, natural shadows, accurate reflections. Neutral background (white, light gray, or beige).

GRID STRUCTURE:
Top Left (Studio Shot 1): Clean product focus, no text.
Top Right (Studio Shot 2 with Info): Different angle, 2-3 minimal feature labels with thin lines.
Bottom Left (Studio Shot 3 with Info): Third angle, 2-3 different feature labels.
Bottom Right (Real-Life Usage - ALWAYS): Product used naturally in real environment. Clean, aesthetic, realistic.

STRICT RULES: Keep exact real-world proportions. No floating objects. No exaggerated glow. No abstract decorations. Product must remain identical across all 4 images.

FINAL OUTPUT: One single image with 4 clean sections. Highly detailed, ultra sharp, realistic product photography quality.`;

        const defaults = [
          { name: 'Abstract', icon: '✦', description: 'Modern, elegant with artistic composition', promptText: ABSTRACT_PROMPT },
          { name: 'Minimalistic', icon: '◻', description: 'Clean studio photography', promptText: MINIMAL_PROMPT },
          { name: 'Studio Solo', icon: '✦', description: 'Single high-quality studio portrait', promptText: MINIMAL_PROMPT.replace('2x2 grid image (4 images in one frame)', 'single product image'), isSolo: true }
        ];

        for (const p of defaults) {
          try {
            await addDoc(collection(db, 'prompts'), p);
          } catch (e) {
            console.error('Error seeding prompt:', e);
          }
        }
      };

      // Only seed if we are sure it's empty after initial load
      const timeout = setTimeout(() => {
        if (prompts.length === 0 && profile?.isAdmin && !didSeedRef.current) {
          didSeedRef.current = true;
          seedDefaults();
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [user, prompts.length, profile?.isAdmin]);

  useEffect(() => {
    if (adminTab === 'users') {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snap) => {
        const uList: UserProfile[] = [];
        snap.forEach(d => uList.push({ uid: d.id, ...d.data() } as UserProfile));
        setAllUsers(uList);
      }, (error) => {
        console.error('Error fetching all users:', error);
      });
      return () => unsubscribe();
    }
  }, [adminTab]);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      addToast('Signed in successfully', 'success');
    } catch (error: any) {
      addToast('Sign in failed: ' + error.message, 'error');
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      addToast('Signed out', 'info');
      setFlowStep(0);
    } catch (error: any) {
      addToast('Sign out failed', 'error');
    }
  };

  // --- Flow Logic ---

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImage(dataUrl);
      setFlowStep(2);
      removeBackground(file, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeBackground = async (file: File, fallbackDataUrl: string) => {
    if (isRemovingBg) return;
    setIsRemovingBg(true);
    setBgError(false);
    try {
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1] || '');
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/removebg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_b64: base64Image })
      });

      if (!res.ok) {
        throw new Error(`Remove.bg proxy error: Status ${res.status}`);
      }
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = () => {
        setProcessedImage(reader.result as string);
        setIsRemovingBg(false);
        addToast('Background removed!', 'success');
      };
      reader.readAsDataURL(blob);
    } catch (e: any) {
      console.error(e);
      setIsRemovingBg(false);
      setBgError(true);
      setProcessedImage(fallbackDataUrl); // Fallback
    }
  };

  const deletePoster = async (posterId: string) => {
    if (!user) return;
    try {
      const poster = userPosters.find(p => p.id === posterId);
      if (!poster) return;
      // Delete images from storage
      for (const tileUrl of poster.tiles) {
        try {
          const fileRef = ref(storage, tileUrl);
          await deleteObject(fileRef);
        } catch(e) { console.error('Failed to delete image', e); }
      }
      // Delete document
      await deleteDoc(doc(db, 'posters', posterId));
      addToast(t.delete + ' successful', 'success');
    } catch (e: any) {
      addToast('Error deleting poster: ' + e.message, 'error');
    }
  };

  const startGeneration = async () => {
    if (isGenerating) return;
    if (!selectedStyle || !profile) return;
    const cost = selectedStyle.isSolo ? 5 : CREDITS_PER_GEN;
    if (profile.credits < cost) {
      addToast(`Insufficient credits. You need ${cost} credits.`, 'error');
      return;
    }

    setIsGenerating(true);
    setFlowStep(4);
    setGenStep(1);

    const uploadedRefs: any[] = [];
    try {
      let prompt = selectedStyle.promptText.replace('[PRODUCT NAME]', productName || 'Product');
      if (language !== 'English') {
        prompt += `\n\nmake the details info in ${language}`;
      }
      if (promptAddition) {
        prompt += `\n\nAdditions to prompt: ${promptAddition}`;
      }

      const finalDataUrl = processedImage || uploadedImage || '';
      
      // Flatten the image to remove transparency (alpha channel) and convert to valid JPEG
      const flattenedImageB64 = await new Promise<string>((resolve) => {
        const img = new Image();
        if (finalDataUrl.startsWith('http')) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            
            // Limit max dimension to 1024px to prevent large payloads that cause Gemini API 400 error
            const MAX_DIM = 1024;
            let width = img.width;
            let height = img.height;
            if (width > MAX_DIM || height > MAX_DIM) {
              if (width > height) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              } else {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, width, height);
              const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.85);
              resolve(jpegDataUrl.split(',')[1]);
            } else {
              resolve(finalDataUrl.split(',')[1] || '');
            }
          } catch (e) {
            console.error('Canvas conversion error:', e);
            resolve(finalDataUrl.split(',')[1] || '');
          }
        };
        img.onerror = (err) => {
          console.error('Image load error for canvas flattening:', err);
          resolve(finalDataUrl.split(',')[1] || '');
        };
        img.src = finalDataUrl;
      });

      setGenStep(2);
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          image_b64: flattenedImageB64
        })
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Proxy error: Status ${res.status}`);
      }

      const result = await res.json();
      setGenStep(3);
      const response = result;
      let generatedImageB64 = '';

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.mimeType?.startsWith('image/')) {
            generatedImageB64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!generatedImageB64) throw new Error('No image generated');

      setGenStep(4);
      let tiles: string[] = [];
      if (selectedStyle.isSolo) {
        tiles = [generatedImageB64];
      } else {
        // Split image into 4 tiles
        tiles = await splitImage(generatedImageB64);
      }
      setGeneratedTiles(tiles);

      // Upload tiles to Storage in parallel
      const posterId = Date.now().toString();
      const uploadPromises = tiles.map(async (tile, i) => {
        const tileRef = ref(storage, `users/${profile.uid}/posters/${posterId}_tile_${i}.webp`);
        uploadedRefs.push(tileRef);
        await uploadString(tileRef, tile, 'data_url');
        return getDownloadURL(tileRef);
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      const newPosterDoc = {
        userId: profile.uid,
        tiles: uploadedUrls,
        productName: productName || 'Product',
        promptName: selectedStyle.name
      };

      const docRef = await addDoc(collection(db, 'posters'), {
        ...newPosterDoc,
        createdAt: serverTimestamp()
      });

      setUserPosters(prev => [{ id: docRef.id, createdAt: { toDate: () => new Date() }, ...newPosterDoc } as any, ...prev]);

      // Deduct credits
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, { credits: profile.credits - cost });
      setProfile(prev => prev ? { ...prev, credits: prev.credits - cost } : null);

      setGenStep(5);
      setFlowStep(5);
      addToast('Poster generated successfully!', 'success');
    } catch (error: any) {
      console.error(error);
      // Clean up any successfully uploaded tiles to prevent orphaned files on network disruption
      if (uploadedRefs.length > 0) {
        for (const tileRef of uploadedRefs) {
          try {
            await deleteObject(tileRef);
          } catch (delErr) {
            console.error('Failed to cleanup file:', tileRef.fullPath, delErr);
          }
        }
      }
      addToast('Generation failed: ' + error.message, 'error');
      setFlowStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  const splitImage = (dataURL: string): Promise<string[]> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const hw = img.width / 2, hh = img.height / 2;
        const positions = [[0, 0], [hw, 0], [0, hh], [hw, hh]];
        const tiles = positions.map(([sx, sy]) => {
          const c = document.createElement('canvas');
          c.width = hw; c.height = hh;
          c.getContext('2d')?.drawImage(img, sx, sy, hw, hh, 0, 0, hw, hh);
          return c.toDataURL('image/webp', 0.8);
        });
        resolve(tiles);
      };
      img.src = dataURL;
    });
  };

  const downloadTile = async (tile: string, index: number) => {
    try {
      if (tile.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = tile;
        a.download = `poster-tile-${index + 1}.jpg`;
        a.click();
        return;
      }
      const response = await fetch(tile);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `poster-tile-${index + 1}.jpg`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed', e);
      window.open(tile, '_blank');
    }
  };

  // --- Admin Logic ---

  const adjustCredits = async (uid: string, amount: number) => {
    const userRef = doc(db, 'users', uid);
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const currentCredits = snap.data().credits || 0;
        await updateDoc(userRef, { credits: Math.max(0, currentCredits + amount) });
        addToast('Credits updated', 'success');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const savePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    setIsUploadingPrompt(true);

    let imageUrl = editingPrompt?.imageUrl || '';

    try {
      if (promptImageFile) {
        const fileRef = ref(storage, `prompts/${Date.now()}_${promptImageFile.name}`);
        await uploadBytes(fileRef, promptImageFile);
        imageUrl = await getDownloadURL(fileRef);
      }

      const data: any = {
        name: (form.elements.namedItem('name') as HTMLInputElement).value,
        icon: (form.elements.namedItem('icon') as HTMLInputElement).value,
        description: (form.elements.namedItem('description') as HTMLInputElement).value,
        promptText: (form.elements.namedItem('promptText') as HTMLTextAreaElement).value,
        isSolo: (form.elements.namedItem('isSolo') as HTMLInputElement).checked
      };

      if (imageUrl) {
        data.imageUrl = imageUrl;
      }

      if (editingPrompt) {
        await updateDoc(doc(db, 'prompts', editingPrompt.id), data);
        addToast('Prompt updated', 'success');
      } else {
        await addDoc(collection(db, 'prompts'), data);
        addToast('Prompt created', 'success');
      }
      setIsPromptModalOpen(false);
      setEditingPrompt(null);
      setPromptImageFile(null);
    } catch (error) {
      handleFirestoreError(error, editingPrompt ? OperationType.UPDATE : OperationType.CREATE, 'prompts');
    } finally {
      setIsUploadingPrompt(false);
    }
  };

  const deletePrompt = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        await deleteDoc(doc(db, 'prompts', id));
        addToast('Prompt deleted', 'info');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `prompts/${id}`);
      }
    }
  };

  // --- Render Helpers ---


  return (
    <div className="relative z-10 min-h-screen bg-transparent text-[#1a2030] dark:text-white font-['DM_Sans']">
      <Background theme={theme} />

      {/* Navigation */}
      <nav className="sticky top-0 z-[100] flex items-center justify-between px-4 md:px-8 py-2 md:py-4 bg-white/60 dark:bg-black/40 backdrop-blur-xl border-b border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 glow-box-sm rounded-full text-[#1a2030] dark:text-white hover:text-[#1a7aad] dark:hover:text-[#4fc3f7] transition-all flex items-center justify-center mr-1"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
            onClick={() => { setFlowStep(0); setAdminTab(null); }}
          >
            <img src="/logo.png" alt="Nidu AI" className="h-6 md:h-8 object-contain drop-shadow-[0_0_8px_rgba(79,195,247,0.35)]" />
            <span className="font-['Orbitron'] text-lg md:text-lg font-extrabold tracking-tighter bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">
              Nidu AI
            </span>
            {profile && (
              <span className="md:hidden ml-2 font-['Orbitron'] text-[10px] font-bold text-[#1a7aad] dark:text-[#4fc3f7] bg-[#4fc3f7]/10 px-2 py-0.5 rounded-full border border-[#4fc3f7]/20">
                {profile.credits} cr
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center glow-box-sm rounded-lg p-1 border border-[#dde3ea] dark:border-white/20/40">
            {(['English', 'Russian', 'Uzbek'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setAppLanguage(lang)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${appLanguage === lang ? 'bg-[#4fc3f7]/15 text-[#1a7aad]' : 'text-[#6b7a8d] hover:text-[#0d1520]'
                  }`}
              >
                {lang === 'English' ? 'EN' : lang === 'Russian' ? 'RU' : 'UZ'}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Nav Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1 md:gap-2 glow-box-sm px-2 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-medium">
            <Sparkles size={14} className="text-[#1a7aad]" />
            <span>{profile?.credits ?? 0} {t.credits}</span>
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="ml-2 text-[#1a7aad] hover:underline flex items-center gap-1"
            >
              <Plus size={12} />
              {t.buy}
            </button>
          </div>

          {profile?.isAdmin && (
            <>
              <button
                onClick={() => { setAdminTab(adminTab === 'prompts' ? null : 'prompts'); setFlowStep(0); }}
                className={`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all ${adminTab === 'prompts' ? 'btn-glossy text-[#1a7aad]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}`}
              >
                <Sparkles size={14} />
                {t.promptLib}
              </button>
              <button
                onClick={() => { setAdminTab(adminTab === 'soloPrompts' ? null : 'soloPrompts'); setFlowStep(0); }}
                className={`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all ${adminTab === 'soloPrompts' ? 'btn-glossy text-[#1a7aad]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}`}
              >
                <Sparkles size={14} />
                {appLanguage === 'English' ? 'Solo Prompts' : appLanguage === 'Russian' ? 'Соло промпты' : 'Yakka prompstlar'}
              </button>
              <button
                onClick={() => { setAdminTab(adminTab === 'users' ? null : 'users'); setFlowStep(0); }}
                className={`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all ${adminTab === 'users' ? 'btn-glossy text-[#1a7aad]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}`}
              >
                <ShieldCheck size={14} />
                {adminTab === 'users' ? t.exitAdmin : t.admin}
              </button>
            </>
          )}

          <button
            onClick={() => {
              if (!user) {
                signIn();
              } else {
                setFlowStep(6);
                setAdminTab(null);
              }
            }}
            className={`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all ${flowStep === 6 ? 'btn-glossy text-[#1a7aad]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}`}
          >
            <LayoutDashboard size={14} />
            {t.myInventory}
          </button>

          <button
            onClick={signOut}
            className="p-2 text-[#6b7a8d] hover:text-[#0d1520] transition-colors"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-[#1a2030] dark:text-white"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile Menu Dropdown Modal */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-4 z-[200] w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#dde3ea]/80 dark:border-white/10 p-5 flex flex-col gap-4 text-left"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#dde3ea]/50 dark:border-white/10">
              <span className="font-['Orbitron'] text-sm font-extrabold tracking-tighter bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">
                Nidu AI
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-[#6b7a8d] hover:text-[#0d1520] transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="font-['Orbitron'] text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-[#1a7aad] transition-colors">{t.howItWorksTitle}</a>
              <a href="#examples" onClick={() => setIsMobileMenuOpen(false)} className="font-['Orbitron'] text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-[#1a7aad] transition-colors">{t.exploreExamples}</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="font-['Orbitron'] text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-[#1a7aad] transition-colors">{t.pricingTitle}</a>
            </div>
            
            <div className="pt-2 border-t border-[#dde3ea]/50 dark:border-white/10">
              <p className="text-[9px] font-bold text-[#6b7a8d] uppercase tracking-wider mb-2">Language</p>
              <div className="grid grid-cols-3 gap-1.5">
                {(['English', 'Russian', 'Uzbek'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      setAppLanguage(lang);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border ${appLanguage === lang ? 'bg-[#4fc3f7]/15 text-[#1a7aad] border-[#4fc3f7]/30' : 'bg-white/5 dark:bg-white/10 border-[#dde3ea] dark:border-white/20 text-[#6b7a8d]'
                      }`}
                  >
                    {lang === 'English' ? 'EN' : lang === 'Russian' ? 'RU' : 'UZ'}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 pt-4 pb-0 md:pt-12 md:pb-2">
        <AnimatePresence mode="wait">
          {adminTab ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              {adminTab === 'users' && (
                <>
                  {/* Admin Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="font-['Orbitron'] text-xl font-bold">{t.adminDash}</h2>
                  </div>

                  {/* Users Table */}
                  <section className="glow-box rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <LayoutDashboard size={18} className="text-[#1a7aad]" />
                        {t.userMgmt}
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[11px] uppercase tracking-wider text-[#6b7a8d] border-b border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30">
                            <th className="px-6 py-4 font-medium">{t.user}</th>
                            <th className="px-6 py-4 font-medium">{t.credits}</th>
                            <th className="px-6 py-4 font-medium">{t.joined}</th>
                            <th className="px-6 py-4 font-medium">{t.actions}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dde3ea]/30">
                          {allUsers.map(u => (
                            <tr key={u.uid} className="hover:bg-[#4fc3f7]/12 transition-colors">
                              <td className="px-6 py-4">
                                <div className="font-medium">{u.name || '—'}</div>
                                <div className="text-xs text-[#6b7a8d]">{u.email}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="bg-[#4fc3f7]/12 text-[#1a7aad] px-2.5 py-1 rounded-full text-xs font-bold">
                                  {u.credits}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-[#6b7a8d]">
                                {u.createdAt instanceof Date ? u.createdAt.toLocaleDateString() : (u.createdAt as any)?.toDate?.().toLocaleDateString() || '—'}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => adjustCredits(u.uid, 10)}
                                    className="p-1.5 glow-box-sm rounded hover:border-[#4fc3f7] transition-all text-[#1a7aad] text-[10px] font-bold"
                                    title="+10 Credits"
                                  >
                                    +10
                                  </button>
                                  <button
                                    onClick={() => adjustCredits(u.uid, -10)}
                                    className="p-1.5 glow-box-sm rounded hover:border-[#ff7b72] transition-all text-[#ff7b72] text-[10px] font-bold"
                                    title="-10 Credits"
                                  >
                                    -10
                                  </button>
                                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                                  <button
                                    onClick={() => adjustCredits(u.uid, 50)}
                                    className="p-1.5 glow-box-sm rounded hover:border-[#4fc3f7] transition-all text-[#1a7aad]"
                                    title="+50 Credits"
                                  >
                                    <Plus size={14} />
                                  </button>
                                  <button
                                    onClick={() => adjustCredits(u.uid, -50)}
                                    className="p-1.5 glow-box-sm rounded hover:border-[#ff7b72] transition-all text-[#ff7b72]"
                                    title="-50 Credits"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              )}

              {(adminTab === 'prompts' || adminTab === 'soloPrompts') && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-['Orbitron'] text-xl font-bold">{adminTab === 'soloPrompts' ? (appLanguage === 'English' ? 'Solo Prompts' : appLanguage === 'Russian' ? 'Соло промпты' : 'Yakka prompstlar') : t.promptLib}</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsPromptModalOpen(true)}
                        className="flex items-center gap-2 btn-glossy text-[#1a7aad] px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                      >
                        <Plus size={16} />
                        {t.newPrompt}
                      </button>
                    </div>
                  </div>

                  {/* Prompts List */}
                  <section className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {prompts.filter(p => adminTab === 'soloPrompts' ? p.isSolo === true : !p.isSolo).map(p => (
                        <div key={p.id} className="glow-box rounded-2xl p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30" />
                              ) : (
                                <span className="text-lg w-12 h-12 flex items-center justify-center glow-box-sm rounded-lg border border-[#dde3ea] dark:border-white/20/40">{p.icon}</span>
                              )}
                              <div>
                                <div className="font-bold">{p.name}</div>
                                <div className="text-xs text-[#6b7a8d]">{p.description}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setEditingPrompt(p); setIsPromptModalOpen(true); }}
                                className="p-2 glow-box-sm rounded-lg hover:text-[#1a7aad] transition-all"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => deletePrompt(p.id)}
                                className="p-2 glow-box-sm rounded-lg hover:text-[#ff7b72] transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="glow-box-sm rounded-lg p-4 text-xs text-[#6b7a8d] line-clamp-4 leading-relaxed font-mono">
                            {p.promptText}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto"
            >
              {/* Back Button and Step Indicator */}
              {flowStep > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12">
                  {/* Back Button */}
                  {flowStep !== 4 && (
                    <button
                      onClick={() => {
                        window.history.back();
                      }}
                      disabled={isRemovingBg}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-['Orbitron'] tracking-wider uppercase border transition-all duration-300 ${
                        isRemovingBg 
                          ? 'opacity-50 cursor-not-allowed border-transparent bg-white/5 text-gray-500' 
                          : 'border-white/10 bg-white/5 hover:bg-[#1a7aad]/20 hover:border-[#4fc3f7]/50 text-gray-300 hover:text-white drop-shadow-[0_0_15px_rgba(79,195,247,0.1)]'
                      }`}
                    >
                      <ArrowLeft size={14} />
                      {t.backBtn}
                    </button>
                  )}
                  {flowStep === 4 && <div className="hidden sm:block w-24" />}

                  {/* Step Indicator */}
                  {flowStep <= 4 ? (
                    <div className="flex items-center gap-3 sm:gap-4">
                      {[1, 2, 3, 4].map(s => (
                        <React.Fragment key={s}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            flowStep === s 
                              ? 'bg-[#4fc3f7]/15 text-[#4fc3f7] border border-[#4fc3f7] shadow-[0_0_15px_rgba(79,195,247,0.4)]' :
                            flowStep > s 
                              ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/40' :
                              'bg-white/5 dark:bg-white/10 text-[#6b7a8d] border border-[#dde3ea] dark:border-white/10'
                          }`}>
                            {flowStep > s ? <CheckCircle2 size={14} /> : s}
                          </div>
                          {s < 4 && (
                            <div className={`w-8 sm:w-12 h-[1px] transition-colors duration-300 ${flowStep > s ? 'bg-[#22c55e]' : 'bg-white/10'}`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div />
                  )}

                  {flowStep !== 4 && <div className="hidden sm:block w-24" />}
                </div>
              )}

              {/* Step Panels */}
              <AnimatePresence mode="wait">
                {flowStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-2 md:py-6 relative w-full h-[320px] sm:h-[240px] md:h-[270px] lg:h-[340px] xl:h-[360px]"
                  >
                    <h1 className="font-['Orbitron'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-tight select-none flex flex-col justify-center items-center h-[220px] sm:h-[150px] md:h-[180px] lg:h-[210px] xl:h-[230px]">
                      {appLanguage === 'English' ? (
                        <>Product card created<br />before your <TypewriterCycle 
                          phrases={['coffee cools', 'WiFi has doubts', 'designer answers', 'lunch arrives', 'meeting starts', 'page loads']} 
                          className="bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(79,195,247,0.3)]"
                        /></>
                      ) : appLanguage === 'Russian' ? (
                        <>Карточка товара будет готова<br />быстрее, чем <TypewriterCycle 
                          phrases={['остынет кофе', 'ответит дизайнер', 'начнется созвон', 'загрузится страница']} 
                          className="bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(79,195,247,0.3)]"
                        /></>
                      ) : (
                        <>Mahsulot kartasi tayyor bo'ladi,<br /><TypewriterCycle 
                          phrases={['qahva soviguncha', 'dizayner javob berguncha', 'majlis boshlanguncha']} 
                          className="bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(79,195,247,0.3)]"
                        /></>
                      )}
                    </h1>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2">
                      <button
                        id="start-creating-btn"
                        onClick={() => {
                          if (!user) {
                            signIn();
                          } else {
                            setFlowStep(1);
                          }
                        }}
                        className="btn-space"
                      >
                        <strong>{t.startBtn.toUpperCase()}</strong>
                        <div id="container-stars">
                          <div id="stars"></div>
                        </div>
                        <div id="glow">
                          <div className="circle"></div>
                          <div className="circle"></div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {flowStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 md:space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="font-['Orbitron'] text-xl md:text-lg font-bold mb-1 md:mb-2">{t.step1Title}</h2>
                      <p className="text-[#6b7a8d] text-xs md:text-sm">{t.step1Desc}</p>
                    </div>

                    <div
                      className="relative group cursor-pointer"
                      onClick={() => document.getElementById('file-input')?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-br from-[#4fc3f7] to-[#dde3ea] rounded-[32px] opacity-10 group-hover:opacity-25 transition-opacity blur-xl" />
                      <div className="relative glow-box border-2 border-dashed border-[#4fc3f7]/25 rounded-[20px] md:rounded-[32px] p-6 md:p-10 text-center space-y-3 md:space-y-6 group-hover:border-[#4fc3f7]/40 transition-all">
                        <div className="w-12 h-12 md:w-20 md:h-20 glow-box-sm rounded-xl md:rounded-2xl flex items-center justify-center mx-auto text-sm md:text-base group-hover:scale-110 transition-transform text-[#4fc3f7]">
                          <Upload size={32} className="md:w-10 md:h-10" />
                        </div>
                        <div>
                          <h3 className="font-['Orbitron'] text-lg md:text-xl font-bold mb-1">{t.dropImage}</h3>
                          <p className="text-[#6b7a8d] text-xs md:text-sm">PNG, JPG, or WEBP up to 10MB</p>
                        </div>
                        <div className="flex gap-2 md:gap-3 justify-center flex-col sm:flex-row">
                          <button
                            onClick={(e) => { e.stopPropagation(); document.getElementById('file-input')?.click(); }}
                            className="btn-glossy text-[#1a7aad] px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2"
                          >
                            <Upload size={14} className="md:w-4 md:h-4" />
                            {t.uploadBtn}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); document.getElementById('camera-input')?.click(); }}
                            className="glow-box-sm text-[#1a2030] px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-bold text-xs md:text-sm border border-[#dde3ea] dark:border-white/20/40 flex items-center justify-center gap-2"
                          >
                            <Camera size={14} className="md:w-4 md:h-4" />
                            {t.useCamera}
                          </button>
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      id="file-input"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <input
                      type="file"
                      id="camera-input"
                      className="hidden"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                    />
                  </motion.div>
                )}

                {flowStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="font-['Orbitron'] text-lg font-bold mb-2">{t.step2Title}</h2>
                      <p className="text-[#6b7a8d] text-sm">{t.step2Desc}</p>
                    </div>

                    <div className="w-full max-w-[200px] md:max-w-sm mx-auto aspect-square glow-box-sm rounded-2xl border border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30 overflow-hidden relative group">
                      <img
                        src={processedImage || uploadedImage || ''}
                        className="w-full h-full object-contain"
                        alt="Preview"
                      />
                      {!isRemovingBg && !bgError && (
                        <div className="absolute top-4 right-4 btn-glossy text-[#1a7aad] text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                          {t.bgRemoved}
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      {isRemovingBg ? (
                        <div className="flex flex-col items-center gap-4">
                          <Loader2 className="animate-spin text-[#1a7aad]" size={32} />
                          <p className="text-[#6b7a8d] text-sm">{t.removingBg}</p>
                        </div>
                      ) : bgError ? (
                        <div className="space-y-4">
                          <p className="text-[#ff7b72] text-sm">{t.bgFail}</p>
                          <button
                            onClick={() => setFlowStep(3)}
                            className="glow-box-sm text-[#1a2030] px-8 py-3 rounded-xl font-bold text-sm border border-[#dde3ea] dark:border-white/20/40"
                          >
                            {t.continueAnyway}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setFlowStep(3)}
                          className="btn-glossy text-[#1a7aad] px-6 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm shadow-lg transition-all"
                        >
                          {t.continueStyles}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {flowStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="font-['Orbitron'] text-lg font-bold mb-2">{t.step3Title}</h2>
                      <p className="text-[#6b7a8d] text-sm mb-4">{t.step3Desc}</p>
                    </div>
                    <div className="flex justify-center gap-4 mb-6">
                      <button
                        onClick={() => { setStyleType('standard'); setSelectedStyle(null); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${styleType === 'standard' ? 'btn-glossy text-[#1a7aad] border-[#4fc3f7]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}`}
                      >
                        ⚡ {translations[appLanguage].standardPrompts || 'Standard Styles (4 images)'} (10 Credits)
                      </button>
                      <button
                        onClick={() => { setStyleType('solo'); setSelectedStyle(null); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${styleType === 'solo' ? 'btn-glossy text-[#1a7aad] border-[#4fc3f7]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}`}
                      >
                        ✦ {translations[appLanguage].soloPrompts || 'Solo Styles (1 image)'} (5 Credits)
                      </button>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {prompts.filter(p => styleType === 'solo' ? p.isSolo === true : !p.isSolo).map(p => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedStyle(p)}
                            className={`group relative text-left transition-all flex flex-col items-center gap-3`}
                          >
                            <div className={`w-full aspect-[4/5] rounded-[24px] overflow-hidden border-2 transition-all shadow-md ${selectedStyle?.id === p.id ? 'border-[#4fc3f7] shadow-[0_0_24px_rgba(79,195,247,0.3)] scale-[1.02]' : 'border-transparent hover:border-[#4fc3f7]/30 hover:shadow-xl'}`}>
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              ) : (
                                <div className="w-full h-full glow-box-sm flex flex-col items-center justify-center gap-2">
                                  <span className="text-4xl">{p.icon}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-center w-full px-1">
                               <span className={`font-['Orbitron'] font-bold text-sm md:text-base transition-colors ${selectedStyle?.id === p.id ? 'text-[#1a7aad]' : 'text-[#1a2030] dark:text-white'}`}>
                                 {p.name}
                               </span>
                               <p className="text-[10px] text-[#6b7a8d] dark:text-[#a0aec0] line-clamp-1 mt-0.5">{p.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#6b7a8d] uppercase tracking-wider">{t.langLabel}</label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full glow-box rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7] transition-colors appearance-none"
                          >
                            <option value="English">🇬🇧 English</option>
                            <option value="Russian">🇷🇺 Russian</option>
                            <option value="Uzbek">🇺🇿 Uzbek</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#6b7a8d] uppercase tracking-wider">{t.prodLabel}</label>
                          <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="e.g. Luxury Perfume"
                            className="w-full glow-box rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7] transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <label className="text-xs font-bold text-[#6b7a8d] uppercase tracking-wider">{t.promptAdditionsLabel}</label>
                        <textarea
                          value={promptAddition}
                          onChange={(e) => setPromptAddition(e.target.value)}
                          placeholder={t.promptAdditionsPlaceholder}
                          className="w-full glow-box rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7] transition-colors resize-none h-20"
                        />
                      </div>
                    </div>

                    <div className="text-center pt-4">
                      <button
                        onClick={startGeneration}
                        disabled={!selectedStyle || isGenerating}
                        className="btn-glossy text-[#1a7aad] px-8 py-3 md:px-10 md:py-4 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed gap-2 md:gap-3 mx-auto"
                      >
                        <Zap size={20} />
                        {t.genBtn}
                      </button>
                      <p className="mt-4 text-[11px] text-[#6b7a8d]">
                        {selectedStyle?.isSolo 
                          ? (appLanguage === 'English' ? 'Costs 5 credits per generation' : appLanguage === 'Russian' ? 'Стоимость: 5 кредитов' : 'Har bir yaratish uchun 5 kredit')
                          : t.genCost}
                      </p>
                    </div>
                  </motion.div>
                )}

                {flowStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-2 md:py-4 space-y-4 md:space-y-6"
                  >
                    <div className="nidu-loader-wrap">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-48 h-48 md:w-64 md:h-64 mx-auto">
                        <g style={{ order: -1 }}>
                          <polygon
                            transform="rotate(45 100 100)"
                            strokeWidth="1"
                            stroke="#17afbd"
                            fill="none"
                            points="70,70 148,50 130,130 50,150"
                            className="loader-bounce"
                          ></polygon>
                          <polygon
                            transform="rotate(45 100 100)"
                            strokeWidth="1"
                            stroke="#07e7fca4"
                            fill="none"
                            points="70,70 148,50 130,130 50,150"
                            className="loader-bounce2"
                          ></polygon>
                          <polygon
                            transform="rotate(45 100 100)"
                            strokeWidth="2"
                            stroke=""
                            fill="#414750"
                            points="70,70 150,50 130,130 50,150"
                          ></polygon>
                          <polygon
                            strokeWidth="2"
                            stroke=""
                            fill="url(#gradiente)"
                            points="100,70 150,100 100,130 50,100"
                          ></polygon>
                          <defs>
                            <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente">
                              <stop style={{ stopColor: '#1e2026', stopOpacity: 1 }} offset="20%"></stop>
                              <stop style={{ stopColor: '#414750', stopOpacity: 1 }} offset="60%"></stop>
                            </linearGradient>
                          </defs>
                          <polygon
                            transform="translate(20, 31)"
                            strokeWidth="2"
                            stroke=""
                            fill="#227f8b"
                            points="80,50 80,75 80,99 40,75"
                          ></polygon>
                          <polygon
                            transform="translate(20, 31)"
                            strokeWidth="2"
                            stroke=""
                            fill="url(#gradiente2)"
                            points="40,-40 80,-40 80,99 40,75"
                          ></polygon>
                          <defs>
                            <linearGradient y2="100%" x2="0%" y1="-17%" x1="10%" id="gradiente2">
                              <stop style={{ stopColor: '#1f474400', stopOpacity: 1 }} offset="20%"></stop>
                              <stop
                                className="loader-animatedStop"
                                style={{ stopColor: '#10c6d354', stopOpacity: 1 }}
                                offset="100%"
                              ></stop>
                            </linearGradient>
                          </defs>
                          <polygon
                            transform="rotate(180 100 100) translate(20, 20)"
                            strokeWidth="2"
                            stroke=""
                            fill="#17afbd"
                            points="80,50 80,75 80,99 40,75"
                          ></polygon>
                          <polygon
                            transform="rotate(0 100 100) translate(60, 20)"
                            strokeWidth="2"
                            stroke=""
                            fill="url(#gradiente3)"
                            points="40,-40 80,-40 80,85 40,110.2"
                          ></polygon>
                          <defs>
                            <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente3">
                              <stop style={{ stopColor: '#10ccd300', stopOpacity: 1 }} offset="20%"></stop>
                              <stop
                                className="loader-animatedStop"
                                style={{ stopColor: '#d3a51054', stopOpacity: 1 }}
                                offset="100%"
                              ></stop>
                            </linearGradient>
                          </defs>
                          <polygon
                            transform="rotate(45 100 100) translate(80, 95)"
                            strokeWidth="2"
                            stroke=""
                            fill="#ffffff"
                            points="5,0 5,5 0,5 0,0"
                            className="loader-particles"
                          ></polygon>
                          <polygon
                            transform="rotate(45 100 100) translate(80, 55)"
                            strokeWidth="2"
                            stroke=""
                            fill="#17afbd"
                            points="6,0 6,6 0,6 0,0"
                            className="loader-particles"
                          ></polygon>
                          <polygon
                            transform="rotate(45 100 100) translate(70, 80)"
                            strokeWidth="2"
                            stroke=""
                            fill="#17afbd"
                            points="2,0 2,2 0,2 0,0"
                            className="loader-particles"
                          ></polygon>
                          <polygon
                            strokeWidth="2"
                            stroke=""
                            fill="#292d34"
                            points="29.5,99.8 100,142 100,172 29.5,130"
                          ></polygon>
                          <polygon
                            transform="translate(50, 92)"
                            strokeWidth="2"
                            stroke=""
                            fill="#1f2127"
                            points="50,50 120.5,8 120.5,35 50,80"
                          ></polygon>
                        </g>
                      </svg>
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <h3 className="font-['Orbitron'] text-xs md:text-sm font-bold tracking-tight bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(79,195,247,0.3)]">{t.cookingText}</h3>
                      <p className="text-[#6b7a8d] text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
                        {selectedStyle?.isSolo 
                          ? (appLanguage === 'English' ? 'Our AI is crafting your custom poster' : appLanguage === 'Russian' ? 'Наш ИИ готовит ваш уникальный постер' : 'Bizning AI siz uchun maxsus poster yaratmoqda')
                          : t.genDesc}
                      </p>
                    </div>
                  </motion.div>
                )}

                {flowStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="font-['Orbitron'] text-lg font-bold mb-2">{t.readyTitle}</h2>
                      <p className="text-[#6b7a8d] text-sm">{t.readyDesc}</p>
                    </div>

                    <div className={generatedTiles.length === 1 ? "max-w-md mx-auto aspect-[4/5] bg-white/5 dark:bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl border border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30 overflow-hidden relative group" : "grid grid-cols-2 gap-2 md:gap-4"}>
                      {generatedTiles.map((tile, i) => (
                        generatedTiles.length === 1 ? (
                          <React.Fragment key={i}>
                            <img src={tile} className="w-full h-full object-cover animate-fade-in" alt="Result Solo" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => downloadTile(tile, i)}
                                className="btn-glossy text-[#1a2030] !bg-white/80 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                              >
                                <Download size={14} />
                                {t.download}
                              </button>
                            </div>
                          </React.Fragment>
                        ) : (
                          <div key={i} className="group relative aspect-square bg-white/5 dark:bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl border border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30 overflow-hidden">
                            <img src={tile} className="w-full h-full object-cover" alt={`Result ${i + 1}`} />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => downloadTile(tile, i)}
                                className="btn-glossy text-[#1a2030] !bg-white/80 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                              >
                                <Download size={14} />
                                {t.download}
                              </button>
                            </div>
                          </div>
                        )
                      ))}
                    </div>

                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => {
                          setFlowStep(0);
                          setUploadedImage(null);
                          setProcessedImage(null);
                          setGeneratedTiles([]);
                        }}
                        className="glow-box-sm text-[#1a2030] px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm border border-[#dde3ea] dark:border-white/20/40 flex items-center gap-2"
                      >
                        <RefreshCcw className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                        {t.createAnother}
                      </button>
                    </div>
                  </motion.div>
                )}

                {flowStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-4 md:mb-8">
                      <h2 className="font-['Orbitron'] text-lg md:text-xl font-bold mb-1 md:mb-2">{t.inventoryTitle}</h2>
                      <p className="text-[#6b7a8d] text-sm">{t.inventoryDesc}</p>
                    </div>

                    {userPosters.length === 0 ? (
                      <div className="text-center py-20 glow-box rounded-3xl">
                        <LayoutDashboard size={48} className="mx-auto text-[#6b7a8d] mb-4 opacity-50" />
                        <p className="text-[#6b7a8d] font-medium">{t.noPosters}</p>
                        <button
                          onClick={() => setFlowStep(0)}
                          className="mt-6 glow-box-sm text-[#1a2030] px-6 py-2 rounded-xl text-sm border border-[#dde3ea] dark:border-white/20/40"
                        >
                          {t.startBtn}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                          {userPosters.map((poster) => (
                            <div key={poster.id} className="glow-box p-3 md:p-4 rounded-2xl md:rounded-3xl space-y-3 md:space-y-4 shadow-xl">
                              <div className="flex justify-between items-center px-2">
                                <div>
                                  <h4 className="font-bold">{poster.productName}</h4>
                                  <p className="text-xs text-[#6b7a8d]">{poster.promptName} • {poster.createdAt?.toDate ? poster.createdAt.toDate().toLocaleDateString() : 'Recent'}</p>
                                </div>
                                <button
                                  onClick={() => deletePoster(poster.id!)}
                                  className="p-2 text-[#6b7a8d] hover:text-[#ff7b72] hover:bg-[#ff7b72]/10 rounded-lg transition-colors"
                                  title={t.delete}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {poster.tiles.map((tile, i) => (
                                  <div key={i} className="group relative aspect-square glow-box-sm rounded-xl overflow-hidden border border-[#dde3ea] dark:border-white/20/40">
                                    <img src={tile} alt={`Tile ${i}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                      <button
                                        onClick={() => setPreviewImage(tile)}
                                        className="glow-box-sm text-[#1a2030] px-3 py-1.5 rounded-md text-xs font-bold w-24 border border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30 hover:bg-[#4fc3f7]/20 hover:text-[#1a7aad]"
                                      >
                                        {t.preview}
                                      </button>
                                      <button
                                        onClick={() => downloadTile(tile, i)}
                                        className="glow-box-sm text-[#1a2030] px-3 py-1.5 rounded-md text-xs font-bold w-24 border border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30 hover:bg-[#4fc3f7]/20 hover:text-[#1a7aad]"
                                      >
                                        {t.download}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        {hasMorePosters && (
                          <div className="flex justify-center mt-6">
                            <button
                              onClick={fetchNextPagePosters}
                              disabled={isLoadingPosters}
                              className="glow-box-sm text-[#1a2030] px-6 py-2.5 rounded-xl text-sm border border-[#dde3ea] dark:border-white/20/40 hover:border-[#4fc3f7] transition-all flex items-center gap-2"
                            >
                              {isLoadingPosters ? (
                                <>
                                  <Loader2 size={16} className="animate-spin text-[#1a7aad]" />
                                  <span>Loading...</span>
                                </>
                              ) : (
                                <span>Load More</span>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ===== LANDING PAGE SECTIONS (only on home) ===== */}
      {flowStep === 0 && !adminTab && (
        <>
          {/* Marquee Carousel */}
          <div className="relative z-10 py-6 md:py-10">
            <div className="marquee-container">
              <div 
                className="marquee-track" 
                ref={marqueeScroll.trackRef} 
                {...marqueeScroll.handlers}
                style={{ touchAction: 'pan-y' }}
              >
                {[...Array(4)].map((_, setIdx) => (
                  <React.Fragment key={setIdx}>
                    {t.marquee.map((text: string, i: number) => (
                      <div className="marquee-item" key={`${setIdx}-${i}`}>
                        <img src="/logo.png" alt="" className="marquee-logo" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* How It Works */}
          <section id="how-it-works" className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
            <h2 className="font-['Orbitron'] text-2xl md:text-3xl font-extrabold tracking-tighter text-center mb-10 md:mb-16">{t.howItWorksTitle}</h2>
            <div className="blob-cards-container">
              {[
                { img: '/step1.png', text: t.howStep1, num: '01', color: 'blue' },
                { img: '/step2.png', text: t.howStep2, num: '02', color: 'cyan' },
                { img: '/step3.png', text: t.howStep3, num: '03', color: 'teal' }
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className={"blob-card " + step.color}
                  >
                    <div className="blob-card-bg">
                      <img src={step.img} alt={step.text} style={{width:'100%',height:'120px',objectFit:'cover',borderRadius:'8px',marginBottom:'12px'}} />
                      <span className="text-xs font-bold text-[#4fc3f7] bg-[#4fc3f7]/10 px-2.5 py-1 rounded-full mb-2 inline-block">{step.num}</span>
                      <h3 className="font-['Orbitron'] text-sm font-bold text-center mt-2">{step.text}</h3>
                    </div>
                  </motion.div>
                  {i < 2 && <div className="connection-line" style={{left:'calc(100% - 0px)'}}></div>}
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* Explore Examples */}
          <section id="examples" className="relative z-10 py-12 md:py-20">
            <h2 className="font-['Orbitron'] text-2xl md:text-3xl font-extrabold tracking-tighter text-center mb-10 md:mb-16 px-4">{t.exploreExamples}</h2>
            <div className="examples-carousel-container">
              <div className="examples-carousel-track" ref={examplesScroll.trackRef} {...examplesScroll.handlers} style={{ touchAction: 'pan-y' }}>
                {[...Array(4)].map((_, setIdx) => (
                  <React.Fragment key={setIdx}>
                    {[1,2,3,4,5,6].map(n => (
                      <div
                        className="example-card example-card-glow"
                        key={String(setIdx)+'-'+String(n)}
                      >
                        <img src={'/example'+n+'.jpg'} alt={'Example '+n} />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section id="comparison" className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="font-['Orbitron'] text-2xl md:text-3xl font-extrabold tracking-tighter mb-3">{t.compTitle}</h2>
              <p className="text-[#6b7a8d] dark:text-gray-300 text-sm md:text-base max-w-xl mx-auto">{t.compSub}</p>
            </div>
            <div className="comparison-split-wrapper">
              <motion.div initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="comparison-split-left">
                <div className="comparison-split-header">
                  <div className="comparison-split-icon comparison-split-icon-red">
                    <Camera size={24} className="text-red-400" />
                  </div>
                  <h3 className="font-['Orbitron'] text-xl font-bold text-red-400">{t.compTraditionalTitle}</h3>
                  <p className="text-red-400/70 text-sm font-medium mt-1">⏱ {t.compTraditionalTime}</p>
                </div>
                <div className="space-y-4 mt-6">
                  {[t.compTraditional1, t.compTraditional2, t.compTraditional3].map((item, i) => (
                    <div key={i} className="comparison-item comparison-item-bad">
                      <div className="comparison-item-icon comparison-item-icon-bad">
                        <X size={12} className="text-red-400" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="comparison-frustration-bar"><div className="comparison-frustration-fill"></div></div>
                <p className="text-red-400/60 text-xs mt-2 text-center">Workflow frustration: HIGH</p>
              </motion.div>
              <div className="comparison-divider">
                <div className="comparison-divider-line"></div>
                <div className="comparison-divider-vs">VS</div>
                <div className="comparison-divider-line"></div>
              </div>
              <motion.div initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="comparison-split-right">
                <div className="comparison-split-header">
                  <div className="comparison-split-icon comparison-split-icon-blue">
                    <Sparkles size={24} className="text-[#4fc3f7]" />
                  </div>
                  <h3 className="font-['Orbitron'] text-xl font-bold bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">{t.compAiTitle}</h3>
                  <p className="text-[#4fc3f7]/80 text-sm font-medium mt-1">✦ AI-Powered, instant results</p>
                </div>
                <div className="space-y-4 mt-6">
                  {[t.compAi1, t.compAi2, t.compAi3].map((item, i) => (
                    <div key={i} className="comparison-item comparison-item-good">
                      <div className="comparison-item-icon comparison-item-icon-good">
                        <Check size={12} className="text-[#22c55e]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="comparison-success-bar"><div className="comparison-success-fill"></div></div>
                <p className="text-[#4fc3f7]/60 text-xs mt-2 text-center">Workflow efficiency: INSTANT</p>
              </motion.div>
            </div>
          </section>

          {/* Pricing */}
          <section id="pricing" className="pricing-section relative z-10 py-16 md:py-24 mt-8">
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="font-['Orbitron'] text-2xl md:text-3xl font-extrabold tracking-tighter text-white mb-3">{t.pricingTitle}</h2>
                <p className="text-white/60 text-sm md:text-base">{t.pricingDesc}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: 'Basic', price: '75,000', credits: 50, icon: Sparkles, iconClass: 'text-[#4fc3f7]/70', blobColor: 'rgba(79,195,247,0.3)' },
                  { name: 'Standard', price: '150,000', credits: 150, icon: Zap, iconClass: 'text-yellow-400 animate-pulse', popular: true, saving: 'Save 33%', originalPrice: '225,000', blobColor: 'rgba(79,195,247,0.6)' },
                  { name: 'Premium', price: '250,000', credits: 300, icon: ShieldCheck, iconClass: 'text-green-400', saving: 'Save 44%', originalPrice: '450,000', blobColor: 'rgba(34,197,94,0.4)' }
                ].map((plan, i) => (
                  <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * 0.1 }} className={"pricing-card-animated flex flex-col relative overflow-visible" + (plan.popular ? " popular-animated" : "")}>
                    {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1a7aad] to-[#4fc3f7] text-[#0a0d12] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-[0_0_20px_rgba(79,195,247,0.5)] z-20">{t.mostPopular}</div>}
                    <div className="pricing-card-border-wrap relative overflow-hidden w-full h-full flex flex-col flex-1">
                      <div className="pricing-blob" style={{ background: plan.blobColor }}></div>
                      <div className="pricing-inner">
                        <div className="mb-4">
                          <plan.icon size={32} className={plan.iconClass} />
                        </div>
                        <h3 className="font-['Orbitron'] text-2xl font-bold text-white mb-1">{plan.name}</h3>
                        <div className="flex items-center flex-wrap gap-2 mb-6 relative">
                          {plan.originalPrice && <span className="text-sm font-bold text-white/30 line-through">{plan.originalPrice}</span>}
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-[#4fc3f7] drop-shadow-[0_0_8px_rgba(79,195,247,0.6)]">{plan.price}</span>
                            <span className="text-sm text-white/50">UZS</span>
                          </div>
                          {plan.saving && <span className="absolute -top-6 right-0 text-[10px] font-bold text-[#1a7aad] bg-[#4fc3f7] px-2 py-1 rounded-md">{plan.saving}</span>}
                        </div>
                        <div className="space-y-4 mb-6 flex-1">
                          <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={14} className="text-[#4fc3f7]" /><span className="text-white font-bold">{plan.credits} {t.credits}</span></div>
                          <div className="flex items-center gap-3 text-sm text-white/60"><CheckCircle2 size={14} /><span>AI Poster Generation</span></div>
                          <div className="flex items-center gap-3 text-sm text-white/60"><CheckCircle2 size={14} /><span>Background Removal</span></div>
                          <div className="text-xs text-[#4fc3f7] font-semibold border-t border-white/10 pt-3 mt-1 pl-1">
                            <span>
                              {plan.credits === 50 ? t.planBasicImages : plan.credits === 150 ? t.planStandardImages : t.planPremiumImages}
                            </span>
                          </div>
                        </div>
                        <a href={"https://t.me/kxabibov?text=Hello! I want to buy the "+plan.name+" plan ("+plan.credits+" credits) for "+plan.price+" UZS."} target="_blank" rel="noreferrer" className="pricing-cta-btn">
                          <div className="pricing-cta-blob-violet"></div>
                          <div className="pricing-cta-blob-aqua"></div>
                          <Send size={16} className="relative z-10" />
                          <span className="relative z-10">{t.contactTelegram}</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-center mt-8 text-xs text-white/40">{t.manualPayment}</p>
              <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mt-12 md:mt-16">
                <div className="credits-pulse inline-flex items-center gap-4 glow-box rounded-xl px-6 py-3 md:px-8 md:py-4 !bg-white/10 !border-white/15 !backdrop-blur-xl">
                  <Sparkles className="text-[#4fc3f7] flex-shrink-0" size={24} />
                  <div className="text-left">
                    <h3 className="font-['Orbitron'] text-sm md:text-base font-bold text-white mb-0.5">{t.freeCreditsTitle}</h3>
                    <p className="text-white/60 text-[10px] md:text-xs m-0">{t.freeCreditsDesc}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section relative z-10 py-16 md:py-24">
            <div className="relative z-10 text-center px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto space-y-6 py-8"
              >
                <h2 className="font-['Orbitron'] text-2xl md:text-4xl font-extrabold tracking-tighter text-white">
                  {t.ctaTitle}
                </h2>
                <p className="text-white/70 text-sm md:text-base">
                  {t.ctaSub}
                </p>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      if (!user) {
                        signIn();
                      } else {
                        setFlowStep(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="btn-space"
                  >
                    <strong>{t.ctaBtn.toUpperCase()}</strong>
                    <div id="container-stars">
                      <div id="stars"></div>
                    </div>
                    <div id="glow">
                      <div className="circle"></div>
                      <div className="circle"></div>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="site-footer relative z-10 py-12 md:py-16">
            <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2 mb-3">
                    <img src="/logo.png" alt="Nidu AI" className="h-7 object-contain" />
                    <span className="font-['Orbitron'] text-base font-extrabold tracking-tighter text-white">Nidu AI</span>
                  </div>
                  <p className="text-sm leading-relaxed">{t.footerTagline}</p>
                </div>
                <div>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">{t.footerProduct}</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" onClick={(e) => { e.preventDefault(); }}>{t.footerHowItWorks}</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); }}>{t.footerExamples}</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); }}>{t.footerPricing}</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">{t.footerCompany}</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <button 
                        onClick={() => setIsPrivacyModalOpen(true)} 
                        className="hover:text-white transition-colors cursor-pointer text-left text-[#6b7a8d]"
                      >
                        {t.footerPrivacy}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setIsTermsModalOpen(true)} 
                        className="hover:text-white transition-colors cursor-pointer text-left text-[#6b7a8d]"
                      >
                        {t.footerTerms}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                        }} 
                        className="hover:text-white transition-colors cursor-pointer text-left text-[#6b7a8d]"
                      >
                        {t.footerContact}
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">{t.footerContact}</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="https://t.me/kxabibov" target="_blank" rel="noreferrer">Telegram</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <span>© {new Date().getFullYear()} Nidu AI. {t.footerRights}</span>
                <div className="flex items-center gap-1">
                  {(['English', 'Russian', 'Uzbek'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setAppLanguage(lang)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${appLanguage === lang ? 'text-[#4fc3f7]' : 'text-white/40 hover:text-white/70'}`}
                    >
                      {lang === 'English' ? 'EN' : lang === 'Russian' ? 'RU' : 'UZ'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Modals & Toasts */}
      <div className="fixed bottom-8 right-8 z-[1000] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(t => (
            <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
          ))}
        </AnimatePresence>
      </div>

      {/* Prompt Modal */}
      <AnimatePresence>
        {isPromptModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPromptModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glow-box rounded-[32px] p-6 shadow-2xl"
            >
              <h3 className="font-['Orbitron'] text-lg font-bold mb-6">
                {editingPrompt ? t.editPrompt : t.newPromptTitle}
              </h3>
              <form onSubmit={savePrompt} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#6b7a8d] uppercase">{t.styleName}</label>
                    <input name="name" defaultValue={editingPrompt?.name} className="w-full glow-box-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7]" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#6b7a8d] uppercase">{t.icon}</label>
                    <input name="icon" defaultValue={editingPrompt?.icon || '✦'} className="w-full glow-box-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7]" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6b7a8d] uppercase">Reference Image</label>
                  <div className="flex items-center gap-4">
                    {promptImageFile ? (
                      <img src={URL.createObjectURL(promptImageFile)} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30" />
                    ) : editingPrompt?.imageUrl ? (
                      <img src={editingPrompt.imageUrl} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30" />
                    ) : (
                      <div className="w-12 h-12 glow-box-sm rounded-lg flex items-center justify-center border border-[#dde3ea] dark:border-white/20/40">
                        <Camera size={16} className="text-[#6b7a8d]" />
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setPromptImageFile(e.target.files?.[0] || null)}
                      className="text-sm text-[#6b7a8d] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:glow-box-sm file:text-[#1a7aad] hover:file:bg-[#1a1d26] cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6b7a8d] uppercase">{t.description}</label>
                  <input name="description" defaultValue={editingPrompt?.description} className="w-full glow-box-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4fc3f7]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6b7a8d] uppercase">{t.promptText}</label>
                  <textarea name="promptText" defaultValue={editingPrompt?.promptText} className="w-full glow-box-sm rounded-xl px-4 py-3 text-xs font-mono min-h-[200px] focus:outline-none focus:border-[#4fc3f7] leading-relaxed" required />
                </div>
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="isSoloCheckbox"
                    name="isSolo"
                    defaultChecked={editingPrompt ? !!editingPrompt.isSolo : adminTab === 'soloPrompts'}
                    className="w-4 h-4 rounded text-[#4fc3f7] focus:ring-[#4fc3f7] bg-white/5 dark:bg-white/10 border-white/20"
                  />
                  <label htmlFor="isSoloCheckbox" className="text-xs font-bold text-[#6b7a8d] uppercase cursor-pointer">
                    Is Solo Style (Costs 5 credits, single output)
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsPromptModalOpen(false)} className="flex-1 py-4 text-sm font-bold text-[#6b7a8d] hover:text-[#0d1520]">{t.cancel}</button>
                  <button type="submit" disabled={isUploadingPrompt} className="flex-1 btn-glossy text-[#1a7aad] py-4 rounded-2xl font-bold text-sm shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                    {isUploadingPrompt ? <Loader2 size={16} className="animate-spin" /> : t.saveTemplate}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewImage(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-zoom-out"
            />
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={previewImage}
              alt="Preview"
              className="relative max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl z-10"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white z-20"
            >
              <X size={32} />
            </button>
          </div>
        )}
      </AnimatePresence>

      {/* Pricing Modal */}
      <AnimatePresence>
        {isPricingModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPricingModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl glow-box rounded-[40px] p-6 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setIsPricingModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#6b7a8d] hover:text-[#0d1520] transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-12">
                <h2 className="font-['Orbitron'] text-2xl font-bold mb-3">{t.pricingTitle}</h2>
                <p className="text-[#6b7a8d]">{t.pricingDesc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Basic', price: '75,000', credits: 50, color: '#1a7aad', icon: Sparkles, iconClass: 'text-[#4fc3f7]/70' },
                  { name: 'Standard', price: '150,000', credits: 150, color: '#1a7aad', icon: Zap, iconClass: 'text-yellow-400 animate-pulse', popular: true },
                  { name: 'Premium', price: '250,000', credits: 300, color: '#d95050', icon: ShieldCheck, iconClass: 'text-green-400' }
                ].map((plan, i) => (
                  <div
                    key={i}
                    className={`relative glow-box-sm border rounded-[32px] p-6 flex flex-col transition-all hover:scale-[1.02] ${plan.popular ? 'border-[#4fc3f7]/50 shadow-[0_0_40px_rgba(79,195,247,0.15)]' : 'border-[#dde3ea] dark:border-white/20'
                      }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4fc3f7] text-[#0a0d12] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-[0_0_20px_rgba(79,195,247,0.3)]">
                        {t.mostPopular}
                      </div>
                    )}
                    <div className="mb-4">
                      <plan.icon size={32} className={plan.iconClass} />
                    </div>
                    <h3 className="font-['Orbitron'] text-xl font-bold mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-xl font-bold">{plan.price}</span>
                      <span className="text-sm text-[#6b7a8d]">UZS</span>
                    </div>

                    <div className="space-y-4 mb-6 flex-1">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-[#4fc3f7]/10 flex items-center justify-center">
                          <CheckCircle2 size={12} className="text-[#1a7aad]" />
                        </div>
                        <span className="font-bold text-[#1a2030] dark:text-white">{plan.credits} {t.credits}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#6b7a8d]">
                        <div className="w-5 h-5 rounded-full bg-[#4fc3f7]/10 flex items-center justify-center">
                          <CheckCircle2 size={12} />
                        </div>
                        <span>AI Poster Generation</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#6b7a8d]">
                        <div className="w-5 h-5 rounded-full bg-[#4fc3f7]/10 flex items-center justify-center">
                          <CheckCircle2 size={12} />
                        </div>
                        <span>Background Removal</span>
                      </div>
                      <div className="text-xs text-[#1a7aad] dark:text-[#4fc3f7] font-semibold border-t border-[#dde3ea] dark:border-white/10 pt-3 mt-1 pl-1">
                        <span>
                          {plan.credits === 50 ? t.planBasicImages : plan.credits === 150 ? t.planStandardImages : t.planPremiumImages}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`https://t.me/kxabibov?text=Hello! I want to buy the ${plan.name} plan (${plan.credits} credits) for ${plan.price} UZS.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] btn-glossy"
                      style={{ color: plan.color }}
                    >
                      <Send size={16} />
                      {t.contactTelegram}
                    </a>
                  </div>
                ))}
              </div>

              <p className="text-center mt-10 text-xs text-[#6b7a8d]">
                {t.manualPayment}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {isPrivacyModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glow-box rounded-[32px] p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[85vh] text-[#1a2030] dark:text-white"
            >
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#6b7a8d] hover:text-[#0d1520] dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="font-['Orbitron'] text-xl md:text-2xl font-bold mb-6 text-[#1a7aad] dark:text-[#4fc3f7]">{t.footerPrivacy}</h2>
              
              <div className="space-y-4 text-xs md:text-sm leading-relaxed overflow-y-auto max-h-[60vh] pr-2 text-[#1a2030] dark:text-white/80">
                {appLanguage === 'English' ? (
                  <>
                    <p className="font-bold text-[#1a2030] dark:text-white">1. Information We Collect</p>
                    <p>We collect information you provide directly to us when creating an account, including your Google profile name, email address, and profile photo. We also store the product images you upload and the poster visuals generated through the platform.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">2. How We Use Information</p>
                    <p>We use the collected information to power our AI generation models, manage credit allocations, maintain your personal inventory history, and optimize our generation pipelines.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">3. Data Security & Storage</p>
                    <p>Your uploaded media assets, account profiles, and generation history are securely hosted and protected using industry-standard Firebase Authentication and Firestore Security Rules. We do not sell or lease your personal information to third parties.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">4. Contact & Support</p>
                    <p>If you have any questions about this Privacy Policy or your data usage, please reach out to us via support at kxabibov.</p>
                  </>
                ) : appLanguage === 'Russian' ? (
                  <>
                    <p className="font-bold text-[#1a2030] dark:text-white">1. Сбор информации</p>
                    <p>Мы собираем информацию, которую вы предоставляете непосредственно при авторизации, включая имя профиля Google, адрес электронной почты и фотографию профиля. Мы также сохраняем загруженные вами изображения товаров и сгенерированные постеры.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">2. Использование информации</p>
                    <p>Собранные данные используются для работы моделей генерации ИИ, начисления и списания кредитов, ведения истории вашего инвентаря и улучшения качества работы сервиса.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">3. Безопасность и хранение данных</p>
                    <p>Ваши медиафайлы, профиль аккаунта и история генераций надежно защищены с помощью систем Firebase Authentication и Firestore Security Rules. Мы не продаем и не передаем ваши личные данные третьим лицам.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">4. Поддержка пользователей</p>
                    <p>Если у вас возникли вопросы по поводу данной Политики конфиденциальности или использования ваших данных, пожалуйста, свяжитесь с нами.</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-[#1a2030] dark:text-white">1. Biz to'playdigan ma'lumotlar</p>
                    <p>Biz tizimga kirganingizda taqdim etilgan Google profil nomi, elektron pochta manzili va profil rasmini to'playmiz. Shuningdek, siz yuklagan mahsulot rasmlari va AI orqali yaratilgan posterlar saqlanadi.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">2. Ma'lumotlardan foydalanish</p>
                    <p>To'plangan ma'lumotlar AI modellarini ishga tushirish, balansdagi kreditlarni boshqarish, shaxsiy galereyangiz tarixini yuritish va xizmat sifatini yaxshilash uchun qo'llaniladi.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">3. Ma'lumotlar xavfsizligi va saqlanishi</p>
                    <p>Yuklangan fayllaringiz va foydalanuvchi hisobi ma'lumotlari Firebase Authentication hamda Firestore xavfsizlik qoidalari orqali himoyalangan. Shaxsiy ma'lumotlaringiz uchinchi shaxslarga berilmaydi.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">4. Yordam va aloqa</p>
                    <p>Ushbu Maxfiylik siyosati yoki ma'lumotlaringizdan foydalanish bo'yicha savollaringiz bo'lsa, biz bilan bog'laning.</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terms of Service Modal */}
      <AnimatePresence>
        {isTermsModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTermsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glow-box rounded-[32px] p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[85vh] text-[#1a2030] dark:text-white"
            >
              <button
                onClick={() => setIsTermsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#6b7a8d] hover:text-[#0d1520] dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="font-['Orbitron'] text-xl md:text-2xl font-bold mb-6 text-[#1a7aad] dark:text-[#4fc3f7]">{t.footerTerms}</h2>
              
              <div className="space-y-4 text-xs md:text-sm leading-relaxed overflow-y-auto max-h-[60vh] pr-2 text-[#1a2030] dark:text-white/80">
                {appLanguage === 'English' ? (
                  <>
                    <p className="font-bold text-[#1a2030] dark:text-white">1. Agreement to Terms</p>
                    <p>By accessing Nidu AI, you agree to comply with and be bound by these Terms of Service. If you do not agree, you are prohibited from using the generation services.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">2. Credit & Payment System</p>
                    <p>Generation requests consume internal Credits. Credits are purchased via manual transaction through Telegram. All credit consumptions for poster generation tasks are final and non-refundable.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">3. Acceptable Use Policy</p>
                    <p>You agree not to upload any illegal, adult, copyrighted, or offensive material for poster creation. We reserve the right to suspend accounts displaying abusive behavior.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">4. Ownership of Generated Content</p>
                    <p>You retain full copyright and commercial usage rights over the poster designs created using the Nidu AI generator, subject to complete credit payments.</p>
                  </>
                ) : appLanguage === 'Russian' ? (
                  <>
                    <p className="font-bold text-[#1a2030] dark:text-white">1. Согласие с условиями</p>
                    <p>Используя Nidu AI, вы соглашаетесь соблюдать настоящие Условия использования. Если вы не согласны с условиями, использование сервиса генерации запрещено.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">2. Система кредитов и платежи</p>
                    <p>Для создания постеров используются внутренние кредиты. Покупка кредитов осуществляется через поддержку Telegram. Списанные за генерацию кредиты возврату не подлежат.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">3. Правила использования</p>
                    <p>Запрещается загружать незаконный контент, порнографию, материалы, защищенные чужим авторским правом, или агрессивный медиаконтент. Мы оставляем за собой право блокировать нарушителей.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">4. Права на сгенерированный контент</p>
                    <p>Вы владеете всеми коммерческими правами на сгенерированные вами рекламные материалы и постеры, созданные в сервисе Nidu AI.</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-[#1a2030] dark:text-white">1. Shartlarga rozilik</p>
                    <p>Nidu AI xizmatidan foydalanish orqali siz ushbu Foydalanish shartlariga to'liq rozilik bildirasiz. Shartlarga rozi bo'lmasangiz, saytdan foydalanish tavsiya etilmaydi.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">2. Kreditlar va to'lovlar</p>
                    <p>Posterlar yaratish uchun ichki kreditlardan foydalaniladi. Kreditlar Telegram yordam xizmati orqali sotib olinadi. Generatsiya uchun sarflangan kreditlar qaytarib berilmaydi.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">3. Foydalanish qoidalari</p>
                    <p>Tizimga noqonuniy, mualliflik huquqi buzilgan, behayo yoki haqoratli rasmlarni yuklash taqiqlanadi. Qoidalarni buzgan foydalanuvchilar bloklanishi mumkin.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">4. Mualliflik huquqi</p>
                    <p>Nidu AI generatori orqali yaratilgan barcha tayyor posterlar va tijoriy vizuallarga bo'lgan to'liq mualliflik huquqlari sizda qoladi.</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="cookie-banner"
          >
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white/70 text-xs md:text-sm flex-1">{t.cookieText}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { localStorage.setItem('cookieConsent', 'declined'); setShowCookieBanner(false); }}
                  className="px-4 py-2 text-white/50 hover:text-white/80 text-xs font-medium transition-colors"
                >
                  {t.cookieDecline}
                </button>
                <button
                  onClick={() => { localStorage.setItem('cookieConsent', 'accepted'); setShowCookieBanner(false); }}
                  className="px-5 py-2 bg-[#4fc3f7] text-[#0a0d12] rounded-lg text-xs font-bold hover:bg-[#81d4fa] transition-colors"
                >
                  {t.cookieAccept}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
