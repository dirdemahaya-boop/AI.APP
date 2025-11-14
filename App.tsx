import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppStep, BusinessInfo, IdeaGenerationInfo, MarketingIdea, MonthlyPlan, Scene, ContentStrategy, ScriptGenerationInfo, ContentPlanInfo } from './types';
import * as geminiService from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';

const marketingTypesWithOptions = [
    { name: 'تسويق المحتوى (الداخلي)', description: 'جذب العملاء عبر إنشاء محتوى قيم ومفيد (مقالات، فيديوهات) يجيب على تساؤلاتهم ويبني الثقة.' },
    { name: 'تسويق العلاقات', description: 'التركيز على بناء ولاء طويل الأمد مع العملاء الحاليين عبر برامج المكافآت والخدمة الاستباقية.' },
    { name: 'التسويق الفيروسي', description: 'إنشاء محتوى فريد ومبتكر (مثل التحديات والفيديوهات المفاجئة) يثير الدهشة ويدفع للمشاركة الطوعية.' },
    { name: 'التسويق الحسي', description: 'خلق تجربة غامرة للعلامة التجارية عبر التأثير على الحواس الخمس لتعزيز الذاكرة العاطفية.' },
    { name: 'التسويق التجريبي', description: 'إشراك العملاء في تجارب حية لا تُنسى مثل الفعاليات التفاعلية أو استخدام الواقع المعزز لتجربة المنتجات.' },
    { name: 'التسويق عبر المؤثرين', description: 'التعاون مع شخصيات مؤثرة على وسائل التواصل الاجتماعي لعرض منتجاتك لجمهورهم الموثوق.' },
    { name: 'التسويق الأخضر (المستدام)', description: 'ترويج المنتجات الصديقة للبيئة وإظهار المسؤولية الاجتماعية لعلامتك التجارية.' },
    { name: 'التسويق المتخصص (Niche)', description: 'استهداف شريحة سوق ضيقة ومحددة جداً بمنتجات و رسائل مصممة خصيصًا لهم.' },
    { name: 'التسويق القصصي', description: 'بناء سرد قصصي حول المنتج أو العلامة التجارية لإنشاء اتصال عاطفي مع الجمهور.' }
];


const ResultsPlaceholder = ({ icon, title }: { icon: React.ReactNode; title: string; }) => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-[450px] p-8 rounded-xl text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
    <div className="text-pastel-yellow mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 mt-2">هنا سيظهر ما تحتاجه</p>
  </div>
);


// ====================================================================================
// Step 1: Ideas View
// ====================================================================================
interface IdeasViewProps {
  businessInfo: BusinessInfo;
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>;
  ideaGenInfo: IdeaGenerationInfo;
  setIdeaGenInfo: React.Dispatch<React.SetStateAction<IdeaGenerationInfo>>;
  marketingIdeas: MarketingIdea[] | null;
  setMarketingIdeas: (ideas: MarketingIdea[] | null) => void;
  showNotification: (message: string) => void;
}
const IdeasView: React.FC<IdeasViewProps> = ({ businessInfo, setBusinessInfo, ideaGenInfo, setIdeaGenInfo, marketingIdeas, setMarketingIdeas, showNotification }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<MarketingIdea | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false);
  const stageDropdownRef = useRef<HTMLDivElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ideaToEdit, setIdeaToEdit] = useState<MarketingIdea | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const [regenerationInstruction, setRegenerationInstruction] = useState('');
  const [isInstructionalRegenerating, setIsInstructionalRegenerating] = useState(false);


  const handleBusinessInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleIdeaGenInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setIdeaGenInfo(prev => ({ ...prev, [name]: value }));
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (stageDropdownRef.current && !stageDropdownRef.current.contains(event.target as Node)) {
            setIsStageDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { budgetAmount, additionalInfo, ...ideaGenInfoToCheck } = ideaGenInfo;
    if (Object.values(businessInfo).some(val => typeof val === 'string' && !val.trim()) || Object.values(ideaGenInfoToCheck).some(val => typeof val === 'string' && !val.trim())) {
      showNotification("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }
    setIsLoading(true);
    setSelectedIdea(null);
    setMarketingIdeas(null);
    try {
      const result = await geminiService.generateIdeas({ ...businessInfo, ...ideaGenInfo });
      setMarketingIdeas(result);
    } catch (error) {
      console.error("Failed to generate ideas:", error);
      showNotification("حدث خطأ أثناء إنشاء الأفكار. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (idea: MarketingIdea) => {
    const textToCopy = `
العنوان: ${idea.title}

الفكرة: ${idea.concept}

الخطاف (أول 3 ثوانٍ): ${idea.hook}

التصور البصري: ${idea.visuals}

دعوة لاتخاذ إجراء: ${idea.cta}
    `.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleOpenEditModal = () => {
    if (selectedIdea) {
        setIdeaToEdit({ ...selectedIdea });
        setIsEditModalOpen(true);
    }
  };
  
  const handleRegenerate = async () => {
    if (!ideaToEdit) return;

    setIsRegenerating(true);
    try {
        const newIdea = await geminiService.regenerateSingleIdea(ideaToEdit, businessInfo);
        const ideaIndex = marketingIdeas?.findIndex(idea => idea.title === selectedIdea?.title) ?? -1;
        
        if (ideaIndex !== -1 && marketingIdeas) {
            const newIdeas = [...marketingIdeas];
            newIdeas[ideaIndex] = newIdea;
            setMarketingIdeas(newIdeas);
            setSelectedIdea(newIdea);
        }
        setIsEditModalOpen(false);
    } catch (error) {
        console.error("Failed to regenerate idea:", error);
        showNotification("فشل في إعادة توليد الفكرة. يرجى المحاولة مرة أخرى.");
    } finally {
        setIsRegenerating(false);
    }
  };

  const handleInstructionalRegenerate = async () => {
    if (!selectedIdea || !regenerationInstruction.trim()) return;

    setIsInstructionalRegenerating(true);
    try {
      const newIdea = await geminiService.regenerateIdeaWithInstruction(
        selectedIdea,
        regenerationInstruction,
        businessInfo
      );
  
      const ideaIndex = marketingIdeas?.findIndex(idea => idea.title === selectedIdea.title) ?? -1;
      
      if (ideaIndex !== -1 && marketingIdeas) {
        const newIdeas = [...marketingIdeas];
        newIdeas[ideaIndex] = newIdea;
        setMarketingIdeas(newIdeas);
        setSelectedIdea(newIdea);
        setRegenerationInstruction(''); // Clear the input
        showNotification("تم تحديث الفكرة بنجاح!");
      }
    } catch (error) {
      console.error("Failed to regenerate idea with instruction:", error);
      showNotification("فشل في إعادة توليد الفكرة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsInstructionalRegenerating(false);
    }
  };


  const stages = ['جديد', 'في مرحلة النمو', 'معروف ومستقر'];

  const CopyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
  const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
  const BackIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>);
  const PencilIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>);

  const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  const MegaphoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.514C18.332 18.885 15.332 24 10.5 24a4.5 4.5 0 01-4.5-4.5v-4.5c0-1.355.683-2.6 1.832-3.317l.436-.25z" />
    </svg>
  );

  const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );

  const PaperPlaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
  
  const FilmIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  );

  const ideaIcons = [
    <LightbulbIcon key="lightbulb" />, 
    <MegaphoneIcon key="megaphone" />, 
    <ChartIcon key="chart" />, 
    <StarIcon key="star" />, 
    <PaperPlaneIcon key="paperplane" />,
    <FilmIcon key="film" />
  ];


  return (
    <>
      <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">توليد الأفكار الإبداعية</h2>
          <p className="mt-2 text-base md:text-lg text-gray-600 dark:text-gray-400">أدخل تفاصيل متجرك والمنتج لإنشاء أفكار تسويقية مخصصة.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Right Column: Inputs */}
        <div className="lg:col-span-2 lg:sticky lg:top-28 self-start">
          <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto pr-2 pb-6">
            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">عرفني على متجرك</h3>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم المتجر</label>
                    <input type="text" name="name" id="name" value={businessInfo.name} onChange={handleBusinessInputChange} className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3" />
                  </div>
                  <div>
                    <label htmlFor="audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">من سيرتدي منتجك؟</label>
                    <input type="text" name="audience" id="audience" value={businessInfo.audience} onChange={handleBusinessInputChange} placeholder="مثال: نساء تتراوح أعمارهن بين 20 و 35 عامًا" className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3" />
                  </div>
                  <div>
                    <label htmlFor="stage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مكان متجرك في السوق</label>
                    <div className="relative" ref={stageDropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsStageDropdownOpen(prev => !prev)}
                            className="flex items-center justify-between w-full text-right rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple sm:text-sm p-3"
                            aria-haspopup="listbox"
                            aria-expanded={isStageDropdownOpen}
                        >
                            <span>{businessInfo.stage}</span>
                            <svg className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isStageDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {isStageDropdownOpen && (
                            <ul className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2 space-y-1 max-h-60 overflow-auto animate-fade-in-fast">
                                {stages.map(stage => (
                                    <li key={stage}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBusinessInfo(prev => ({ ...prev, stage }));
                                                setIsStageDropdownOpen(false);
                                            }}
                                            className={`w-full text-right p-3 text-sm rounded-md transition-all duration-200 border-2 
                                                ${businessInfo.stage === stage 
                                                    ? 'bg-brand-purple/10 text-brand-purple font-semibold border-transparent'
                                                    : 'text-gray-800 dark:text-gray-200 border-transparent hover:border-pastel-yellow'
                                                }`}
                                            role="option"
                                            aria-selected={businessInfo.stage === stage}
                                        >
                                            {stage}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="products" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ما هي المنتجات التي توفرها؟</label>
                    <textarea name="products" id="products" value={businessInfo.products} onChange={handleBusinessInputChange} rows={3} placeholder="مثال: فساتين صيفية خفيفة" className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3"></textarea>
                  </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">لنتعمق بالفكرة اكثر</h3>
                    <div>
                        <label htmlFor="productDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">منتج واحد تحتاج له فكرة</label>
                        <input type="text" name="productDetails" id="productDetails" value={ideaGenInfo.productDetails} onChange={handleIdeaGenInputChange} placeholder="مثال: فستان سهرة أحمر طويل" className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3" />
                    </div>
                    <div>
                        <label htmlFor="event" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">هل هناك مناسبة للتسويق للمنتج؟</label>
                        <input type="text" name="event" id="event" value={ideaGenInfo.event} onChange={handleIdeaGenInputChange} placeholder="مثال: اليوم الوطني، عيد الحب، محتوى يومي" className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اختر طريقة التسويق المناسبة</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {marketingTypesWithOptions.map(option => (
                                <button
                                    key={option.name}
                                    type="button"
                                    onClick={() => setIdeaGenInfo(prev => ({ ...prev, marketingType: option.name }))}
                                    className={`text-right p-3 rounded-lg border-2 transition-all duration-200 text-sm h-full flex flex-col justify-start
                                        ${ideaGenInfo.marketingType === option.name 
                                            ? 'border-pastel-yellow bg-pastel-yellow/10 shadow-md' 
                                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-pastel-yellow/50'
                                        }`}
                                >
                                    <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">{option.name}</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">هل لديك ميزانية للتسويق لهذا المنتج؟</label>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block mb-3">(بعض الأفكار تحتاج ميزانية، وأخرى مجانية. اختيارك يوجه نوع الأفكار المقترحة.)</span>
                        <div className="flex gap-4">
                            <button 
                                type="button"
                                onClick={() => setIdeaGenInfo(prev => ({ ...prev, hasBudget: 'yes' }))}
                                className={`flex-1 text-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 font-medium
                                    ${ideaGenInfo.hasBudget === 'yes' 
                                        ? 'border-pastel-yellow bg-pastel-yellow/10 text-yellow-800 dark:text-pastel-yellow' 
                                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500'}`}
                            >
                                نعم
                            </button>
                            <button 
                                type="button"
                                onClick={() => setIdeaGenInfo(prev => ({ ...prev, hasBudget: 'no' }))}
                                className={`flex-1 text-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 font-medium
                                    ${ideaGenInfo.hasBudget === 'no' 
                                        ? 'border-pastel-yellow bg-pastel-yellow/10 text-yellow-800 dark:text-pastel-yellow' 
                                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500'}`}
                            >
                                لا
                            </button>
                        </div>
                    </div>
                    {ideaGenInfo.hasBudget === 'yes' && (
                      <div className="animate-fade-in-fast">
                          <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الميزانية التقريبية (اختياري)</label>
                          <input type="text" name="budgetAmount" id="budgetAmount" value={ideaGenInfo.budgetAmount || ''} onChange={handleIdeaGenInputChange} placeholder="مثال: 100 دولار أو 150,000 دينار عراقي" className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3" />
                      </div>
                    )}
                    <div>
                        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">هل لديك توجيهات إضافية؟ (اختياري)</label>
                        <textarea name="additionalInfo" id="additionalInfo" value={ideaGenInfo.additionalInfo || ''} onChange={handleIdeaGenInputChange} rows={3} placeholder="مثال: أريد أن تكون الأفكار مرحة وتستهدف الشباب الصغير" className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3"></textarea>
                    </div>
                </div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple disabled:bg-gray-400 dark:disabled:bg-gray-600">
                {isLoading ? <LoadingSpinner /> : 'توليد الأفكار'}
              </button>
            </form>
          </div>
        </div>

        {/* Left Column: Results */}
        <div className="lg:col-span-3 lg:sticky lg:top-28 self-start">
          <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto pr-2 pb-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[450px] space-y-4 animate-fade-in bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <LoadingSpinner className="h-10"/>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  ثواني ويكون {businessInfo.name ? `"${businessInfo.name}"` : 'متجرك'} يملك أعظم فكرة
                </p>
              </div>
            )}

            {!isLoading && marketingIdeas && (
              <div className="w-full space-y-8 animate-fade-in">
                {selectedIdea ? (
                  <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                      <button onClick={() => setSelectedIdea(null)} className="flex items-center text-sm font-medium text-brand-purple hover:text-opacity-80">
                        الرجوع إلى الأفكار <BackIcon />
                      </button>
                      <div className="flex items-center gap-2">
                          <button onClick={() => handleCopy(selectedIdea)} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="نسخ الفكرة">
                            {isCopied ? <CheckIcon /> : <CopyIcon />}
                          </button>
                          <button onClick={handleOpenEditModal} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="تعديل الفكرة">
                              <PencilIcon />
                          </button>
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{selectedIdea.title}</h3>
                    <div className="space-y-5">
                      <div>
                          <h4 className="font-semibold text-brand-purple mb-1">الفكرة الأساسية (Concept)</h4>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{selectedIdea.concept}</p>
                      </div>
                      <div>
                          <h4 className="font-semibold text-brand-purple mb-1">الخطاف (أول 3 ثوانٍ)</h4>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{selectedIdea.hook}</p>
                      </div>
                      <div>
                          <h4 className="font-semibold text-brand-purple mb-1">التصور البصري (مشاهد مقترحة)</h4>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{selectedIdea.visuals}</p>
                      </div>
                      <div>
                          <h4 className="font-semibold text-brand-purple mb-1">دعوة لاتخاذ إجراء (CTA)</h4>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{selectedIdea.cta}</p>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3">هل تريد تعديل شيء؟</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        اكتب تعديلك هنا (مثال: اجعل المشاهد أبسط، غيّر نبرة الصوت لتكون أكثر حماسًا) وسيقوم الذكاء الاصطناعي بإعادة توليد الفكرة بناءً على طلبك.
                        </p>
                        <div className="space-y-4">
                        <textarea
                            value={regenerationInstruction}
                            onChange={(e) => setRegenerationInstruction(e.target.value)}
                            rows={3}
                            className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3"
                            placeholder="اكتب تعديلك هنا..."
                        />
                        <button
                            onClick={handleInstructionalRegenerate}
                            disabled={isInstructionalRegenerating || !regenerationInstruction.trim()}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple disabled:bg-gray-400 dark:disabled:bg-gray-600"
                        >
                            {isInstructionalRegenerating ? <LoadingSpinner /> : 'إعادة التوليد بالتعديل'}
                        </button>
                        </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">أفكارك التسويقية جاهزة!</h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">انقر على أي فكرة لعرض التفاصيل ونسخها.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {marketingIdeas.map((idea, index) => (
                          <button key={index} onClick={() => setSelectedIdea(idea)} className="text-right border border-gray-200 dark:border-gray-700 rounded-lg p-5 sm:p-6 bg-gray-50 dark:bg-gray-800/50 hover:shadow-lg hover:border-brand-purple dark:hover:border-brand-purple hover:-translate-y-1 transition-all duration-300 flex flex-col items-start">
                            {ideaIcons[index % ideaIcons.length]}
                            <div>
                              <h4 className="font-bold text-gray-800 dark:text-gray-200">{idea.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">{idea.concept}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {!isLoading && !marketingIdeas && (
               <ResultsPlaceholder 
                  title="أفكارك الإبداعية"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                />
            )}
            </div>
        </div>
      </div>
      
      {isCopied && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900 py-2 px-5 rounded-full shadow-lg z-50">تم النسخ</div>}
    
      {isEditModalOpen && ideaToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={() => setIsEditModalOpen(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">تعديل وإعادة توليد الفكرة</h3>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">العنوان</label>
                        <input type="text" value={ideaToEdit.title} onChange={e => setIdeaToEdit(prev => prev ? {...prev, title: e.target.value} : null)} className="mt-1 block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-2"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">الفكرة (Concept)</label>
                        <textarea value={ideaToEdit.concept} onChange={e => setIdeaToEdit(prev => prev ? {...prev, concept: e.target.value} : null)} rows={3} className="mt-1 block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-2"></textarea>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">الخطاف (Hook)</label>
                        <textarea value={ideaToEdit.hook} onChange={e => setIdeaToEdit(prev => prev ? {...prev, hook: e.target.value} : null)} rows={2} className="mt-1 block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-2"></textarea>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">التصور البصري (Visuals)</label>
                        <textarea value={ideaToEdit.visuals} onChange={e => setIdeaToEdit(prev => prev ? {...prev, visuals: e.target.value} : null)} rows={4} className="mt-1 block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-2"></textarea>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">دعوة للعمل (CTA)</label>
                        <input type="text" value={ideaToEdit.cta} onChange={e => setIdeaToEdit(prev => prev ? {...prev, cta: e.target.value} : null)} className="mt-1 block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-2"/>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end space-x-3 space-x-reverse">
                    <button onClick={() => setIsEditModalOpen(false)} className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        إلغاء
                    </button>
                    <button onClick={handleRegenerate} disabled={isRegenerating} className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark active:scale-95 transition-all w-32 flex justify-center">
                        {isRegenerating ? <LoadingSpinner /> : 'إعادة التوليد'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};


// ====================================================================================
// Step 2: Strategy View
// ====================================================================================
interface StrategyViewProps {
  contentPlanInfo: ContentPlanInfo;
  setContentPlanInfo: React.Dispatch<React.SetStateAction<ContentPlanInfo>>;
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>;
  strategy: ContentStrategy | null;
  setStrategy: (strategy: ContentStrategy | null) => void;
  monthlyPlan: MonthlyPlan | null;
  setMonthlyPlan: (plan: MonthlyPlan | null) => void;
  showNotification: (message: string) => void;
}
const StrategyView: React.FC<StrategyViewProps> = ({ contentPlanInfo, setContentPlanInfo, setBusinessInfo, strategy, setStrategy, monthlyPlan, setMonthlyPlan, showNotification }) => {
  const [isStrategyLoading, setIsStrategyLoading] = useState(false);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<{ key: string | null, title: string }>({ key: null, title: '' });
  const [editText, setEditText] = useState('');

  const handleContentPlanInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContentPlanInfo(prev => {
        const newState = { ...prev, [name]: value };
        // Sync with businessInfo for other parts of the app
        if (name === 'storeName') {
            setBusinessInfo(b => ({ ...b, name: value }));
        }
        if (name === 'targetAudience') {
            setBusinessInfo(b => ({ ...b, audience: value }));
        }
        if (name === 'focusProducts') {
            setBusinessInfo(b => ({ ...b, products: value }));
        }
        return newState;
    });
  };
  
  const checkContentPlanInfo = () => {
    const { storeName, ...rest } = contentPlanInfo;
    if (!storeName.trim() || Object.values(rest).some(val => typeof val === 'string' && !val.trim())) {
      showNotification("يرجى ملء جميع الحقول المطلوبة أولاً.");
      return false;
    }
    return true;
  };

  const handleGenerateStrategy = async () => {
    if (!checkContentPlanInfo()) return;
    setIsStrategyLoading(true);
    setStrategy(null);
    try {
      const result = await geminiService.generateStrategy(contentPlanInfo);
      setStrategy(result);
    } catch (error) {
      console.error("Failed to generate strategy:", error);
      showNotification("حدث خطأ أثناء إنشاء الاستراتيجية. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsStrategyLoading(false);
    }
  };
  
  const handleGeneratePlan = async () => {
    if (!checkContentPlanInfo()) return;
    setIsPlanLoading(true);
    setMonthlyPlan(null);
    try {
      const result = await geminiService.generateMonthlyPlan(contentPlanInfo);
      setMonthlyPlan(result);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      showNotification("حدث خطأ أثناء إنشاء الخطة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsPlanLoading(false);
    }
  };
  
  const handleOpenEditModal = (key: string, title: string, currentValue: string | string[]) => {
    setEditingSection({ key, title });
    if (Array.isArray(currentValue)) {
      setEditText(currentValue.join('\n'));
    } else {
      setEditText(currentValue);
    }
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSection({ key: null, title: '' });
    setEditText('');
  };
  
  const handleSaveEdit = () => {
    if (!strategy || !editingSection.key) return;

    const keys = editingSection.key.split('.');
    const newStrategy = JSON.parse(JSON.stringify(strategy));
    
    let currentLevel = newStrategy;
    for (let i = 0; i < keys.length - 1; i++) {
        currentLevel = currentLevel[keys[i]];
    }

    const finalKey = keys[keys.length - 1];
    let originalValue = strategy as any;
    keys.forEach(k => { originalValue = originalValue?.[k] });

    if (Array.isArray(originalValue)) {
        currentLevel[finalKey] = editText.split('\n').map(line => line.trim()).filter(line => line);
    } else {
        currentLevel[finalKey] = editText;
    }

    setStrategy(newStrategy);
    handleCloseEditModal();
  };

  const handleDownloadStrategy = () => {
    if (!strategy) return;
    
    const getFormattedList = (items: string[]) => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>استراتيجية المحتوى - ${contentPlanInfo.storeName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
        body { font-family: 'Tajawal', sans-serif; direction: rtl; text-align: right; background-color: #f9fafb; color: #1f2937; padding: 20px; line-height: 1.7; }
        .container { max-width: 800px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); padding: 40px; }
        h1 { color: #AC88E8; font-size: 28px; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 30px; }
        h2 { color: #AC88E8; font-size: 22px; margin-top: 30px; margin-bottom: 15px; }
        p, li { font-size: 16px; color: #374151; }
        ul { list-style-position: inside; padding-right: 0; margin-top: 5px; }
        li { margin-bottom: 8px; }
        .section { margin-bottom: 25px; padding: 20px; border-radius: 8px; background-color: #f8f9fa; }
        strong { color: #111827; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>استراتيجية المحتوى لـ ${contentPlanInfo.storeName}</h1>
        <div class="section"><h2>الرؤية</h2><p>${strategy.vision}</p></div>
        <div class="section"><h2>الأهداف</h2>${getFormattedList(strategy.objectives)}</div>
        <div class="section"><h2>الجمهور المستهدف</h2><p>${strategy.targetAudience}</p></div>
        <div class="section"><h2>الرسائل الأساسية</h2>${getFormattedList(strategy.coreMessages)}</div>
        <div class="section"><h2>قنوات التواصل</h2>${getFormattedList(strategy.channels)}</div>
        <div class="section"><h2>الأسلوب البصري والصوتي</h2><p><strong>النبرة:</strong> ${strategy.style.tone}</p><p><strong>المظهر:</strong> ${strategy.style.visual}</p></div>
        <div class="section"><h2>ملخص خطة المحتوى</h2><p>${strategy.contentPlanOverview}</p></div>
        <div class="section"><h2>مقاييس النجاح</h2>${getFormattedList(strategy.metrics)}</div>
      </div>
    </body>
    </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `استراتيجية-${contentPlanInfo.storeName.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const PencilIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>);
  const DownloadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);

  const StrategyCard: React.FC<{title: string; children: React.ReactNode; onEdit: () => void;}> = ({ title, children, onEdit }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-5 sm:p-6 rounded-lg relative group">
      <button 
        onClick={onEdit}
        className="absolute top-3 left-3 p-2 rounded-full bg-gray-200/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-purple"
        aria-label={`تعديل ${title}`}
      >
        <PencilIcon />
      </button>
      <h4 className="font-bold text-brand-purple mb-3">{title}</h4>
      <div className="text-gray-600 dark:text-gray-400 space-y-2">{children}</div>
    </div>
  );

  const InputField = ({ name, label, placeholder, value, onChange, isTextarea = false, rows = 3 }: { name: string, label: string, placeholder: string, value: string, onChange: (e: any) => void, isTextarea?: boolean, rows?: number }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {isTextarea ? (
        <textarea name={name} id={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder} className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3"></textarea>
      ) : (
        <input type="text" name={name} id={name} value={value} onChange={onChange} placeholder={placeholder} className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3" />
      )}
    </div>
  );

  return (
     <div className="w-full">
        <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">بناء الاستراتيجية وخطة المحتوى</h2>
            <p className="mt-2 text-base md:text-lg text-gray-600 dark:text-gray-400">أجب عن هذه الأسئلة البسيطة لوضع أساس قوي لعلامتك التجارية.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Right Column: Inputs */}
            <div className="lg:col-span-2 lg:sticky lg:top-28 self-start">
              <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto pr-2 pb-6">
                <form className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg space-y-8">
                  <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3">المحور الأول: لنتعرف على علامتك التجارية</h3>
                      <InputField name="storeName" label="ما هو اسم متجرك؟" placeholder="اكتب اسم متجرك هنا" value={contentPlanInfo.storeName} onChange={handleContentPlanInfoChange} />
                      <InputField name="niche" label="ما هو نوع الملابس الأساسي الذي تبيعه؟" placeholder="مثال: ملابس كلاسيكية، ملابس مستدامة، ملابس رياضية" value={contentPlanInfo.niche} onChange={handleContentPlanInfoChange} />
                      <InputField name="coreValue" label="ما الذي يميز متجرك عن غيره؟" placeholder="مثال: الجودة الفائقة، الأسعار المنافسة، التصاميم الفريدة" value={contentPlanInfo.coreValue} onChange={handleContentPlanInfoChange} isTextarea />
                      <InputField name="toneOfVoice" label="كيف تريد أن تتحدث مع جمهورك؟" placeholder="مثال: بشكل رسمي وفخم، ودود وعفوي، ملهم ومحفز" value={contentPlanInfo.toneOfVoice} onChange={handleContentPlanInfoChange} />
                  </div>

                  <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3">المحور الثاني: من هو جمهورك وما هو هدفك؟</h3>
                      <InputField name="targetAudience" label="صف لنا عميلك المثالي؟" placeholder="مثال: الإناث 25-35 سنة، مهتمات بالعمل الحر، مشكلتهن هي صعوبة تنسيق الملابس" value={contentPlanInfo.targetAudience} onChange={handleContentPlanInfoChange} isTextarea />
                      <InputField name="focusProducts" label="ما هي أهم المنتجات التي تريد التركيز عليها هذا الشهر؟" placeholder="حدد 2-3 فئات رئيسية" value={contentPlanInfo.focusProducts} onChange={handleContentPlanInfoChange} />
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ما هو هدفك الأساسي هذا الشهر؟</label>
                          <div className="flex gap-4 mt-2">
                              <button type="button" onClick={() => setContentPlanInfo(prev => ({ ...prev, monthlyGoal: 'awareness' }))} className={`flex-1 text-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 font-medium ${contentPlanInfo.monthlyGoal === 'awareness' ? 'border-pastel-yellow bg-pastel-yellow/10' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'}`}>
                                زيادة الوعي والمتابعين
                              </button>
                              <button type="button" onClick={() => setContentPlanInfo(prev => ({ ...prev, monthlyGoal: 'sales' }))} className={`flex-1 text-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 font-medium ${contentPlanInfo.monthlyGoal === 'sales' ? 'border-pastel-yellow bg-pastel-yellow/10' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'}`}>
                                زيادة المبيعات المباشرة
                              </button>
                          </div>
                      </div>
                      <InputField name="promotions" label="هل تخطط لأي عروض أو إطلاق منتجات جديدة هذا الشهر؟" placeholder="مثال: تخفيضات نهاية الأسبوع، إطلاق مجموعة الصيف" value={contentPlanInfo.promotions} onChange={handleContentPlanInfoChange} />
                  </div>

                   <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3">المحور الثالث: ما هو الأسلوب الذي تفضله؟</h3>
                      <InputField name="visualStyle" label="صف لنا شكل الفيديوهات الذي تتخيله لعلامتك؟" placeholder="مثال: إضاءة طبيعية، ألوان ساطعة، فيديوهات سريعة مثل تيك توك" value={contentPlanInfo.visualStyle} onChange={handleContentPlanInfoChange} />
                      <InputField name="hashtags" label="هل هناك هاشتاغات تستخدمها لتعريف الناس بمتجرك؟" placeholder="مثال: #ملابس_عصرية #ستايل_الموظفات" value={contentPlanInfo.hashtags} onChange={handleContentPlanInfoChange} />
                      <InputField name="inspiration" label="من هي المتاجر أو المؤثرين الذين يعجبك أسلوبهم؟" placeholder="مثال: جمالية زارا، حركة نايكي، أو عفوية أسوس" value={contentPlanInfo.inspiration} onChange={handleContentPlanInfoChange} />
                  </div>

                  {!strategy && !monthlyPlan && !isStrategyLoading && !isPlanLoading && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                          <div className="text-center">
                              <h4 className="font-bold text-gray-800 dark:text-gray-200">اختر ما تريد بناءه</h4>
                          </div>
                          <button type="button" onClick={handleGenerateStrategy} className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark active:scale-95 transition-all">بناء استراتيجية</button>
                          <button type="button" onClick={handleGeneratePlan} className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark active:scale-95 transition-all">بناء خطة محتوى</button>
                      </div>
                  )}
                </form>
              </div>
            </div>

            {/* Left Column: Results */}
            <div className="lg:col-span-3 lg:sticky lg:top-28 self-start">
              <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto pr-2 pb-6">
                {(isStrategyLoading && !strategy) && (
                <div className="flex flex-col items-center justify-center h-full min-h-[500px] space-y-4 animate-fade-in bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                    <LoadingSpinner className="h-10" />
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        ثواني ويكون {contentPlanInfo.storeName ? `"${contentPlanInfo.storeName}"` : 'متجرك'} يملك أعظم استراتيجية
                    </p>
                </div>
                )}
                
                {(isPlanLoading && !monthlyPlan) && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[500px] space-y-4 animate-fade-in bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                        <LoadingSpinner className="h-10" />
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                           ثواني ويكون {contentPlanInfo.storeName ? `"${contentPlanInfo.storeName}"` : 'متجرك'} يملك أعظم خطة
                        </p>
                    </div>
                )}

                {!isStrategyLoading && !isPlanLoading && (strategy || monthlyPlan) && (
                <div className="space-y-8 sm:space-y-10 animate-fade-in">
                    {strategy && (
                        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">استراتيجية المحتوى الخاصة بك</h3>
                            <button onClick={handleDownloadStrategy} className="flex items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark active:scale-95 transition-all">
                                <DownloadIcon /> تحميل
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            <StrategyCard title="الرؤية" onEdit={() => handleOpenEditModal('vision', 'تعديل الرؤية', strategy.vision)}><p>{strategy.vision}</p></StrategyCard>
                            <StrategyCard title="الأهداف" onEdit={() => handleOpenEditModal('objectives', 'تعديل الأهداف', strategy.objectives)}><ul className="list-disc list-inside">{strategy.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul></StrategyCard>
                            <StrategyCard title="الجمهور المستهدف" onEdit={() => handleOpenEditModal('targetAudience', 'تعديل الجمهور المستهدف', strategy.targetAudience)}><p>{strategy.targetAudience}</p></StrategyCard>
                            <StrategyCard title="الرسائل الأساسية" onEdit={() => handleOpenEditModal('coreMessages', 'تعديل الرسائل الأساسية', strategy.coreMessages)}><ul className="list-disc list-inside">{strategy.coreMessages.map((m, i) => <li key={i}>{m}</li>)}</ul></StrategyCard>
                            <StrategyCard title="قنوات التواصل" onEdit={() => handleOpenEditModal('channels', 'تعديل قنوات التواصل', strategy.channels)}><ul className="list-disc list-inside">{strategy.channels.map((c, i) => <li key={i}>{c}</li>)}</ul></StrategyCard>
                            <StrategyCard title="الأسلوب البصري والصوتي" onEdit={() => handleOpenEditModal('style.tone', 'تعديل الأسلوب الصوتي', strategy.style.tone)}><p><span className="font-semibold">النبرة:</span> {strategy.style.tone}</p><p><span className="font-semibold">المظهر:</span> {strategy.style.visual}</p></StrategyCard>
                            <StrategyCard title="ملخص خطة المحتوى" onEdit={() => handleOpenEditModal('contentPlanOverview', 'تعديل ملخص خطة المحتوى', strategy.contentPlanOverview)}><p>{strategy.contentPlanOverview}</p></StrategyCard>
                            <StrategyCard title="مقاييس النجاح" onEdit={() => handleOpenEditModal('metrics', 'تعديل مقاييس النجاح', strategy.metrics)}><ul className="list-disc list-inside">{strategy.metrics.map((m, i) => <li key={i}>{m}</li>)}</ul></StrategyCard>
                        </div>
                        </div>
                    )}

                    {monthlyPlan && (
                        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">خطة المحتوى الشهرية</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            {Object.entries(monthlyPlan).map(([week, ideas]) => (
                            <div key={week} className="bg-gray-50 dark:bg-gray-700/50 p-5 sm:p-6 rounded-lg">
                                <h4 className="font-bold text-brand-purple mb-3">{`الأسبوع ${week.replace('week', '')}`}</h4>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                                {Array.isArray(ideas) && ideas.map((idea, idx) => <li key={idx}>{idea}</li>)}
                                </ul>
                            </div>
                            ))}
                        </div>
                        </div>
                    )}
                    
                    {strategy && !monthlyPlan && (
                        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg text-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">الخطوة التالية: خطة المحتوى</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">حوّل استراتيجيتك إلى واقع مع خطة محتوى شهرية مفصلة وجاهزة للتنفيذ.</p>
                            <button onClick={handleGeneratePlan} disabled={isPlanLoading} className="py-3 px-8 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark active:scale-95 transition-all disabled:bg-gray-400">
                                {isPlanLoading ? <LoadingSpinner /> : 'نعم، قم بإنشاء الخطة'}
                            </button>
                        </div>
                    )}
                    
                    {monthlyPlan && !strategy && (
                        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg text-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">هل تريد بناء استراتيجية متكاملة؟</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">ادعم خطة المحتوى الخاصة بك باستراتيجية قوية تحدد أهدافك ورؤيتك طويلة الأمد.</p>
                            <button onClick={handleGenerateStrategy} disabled={isStrategyLoading} className="py-3 px-8 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark active:scale-95 transition-all disabled:bg-gray-400">
                                {isStrategyLoading ? <LoadingSpinner /> : 'نعم، قم ببناء الاستراتيجية'}
                            </button>
                        </div>
                    )}
                </div>
                )}

                 {!isStrategyLoading && !isPlanLoading && !strategy && !monthlyPlan && (
                    <ResultsPlaceholder 
                        title="استراتيجيتك أو خطتك"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>}
                    />
                )}
                </div>
            </div>
        </div>

        {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={handleCloseEditModal}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editingSection.title}</h3>
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={8}
                            className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3"
                            aria-label="محتوى القسم القابل للتعديل"
                        ></textarea>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">ملاحظة: إذا كان المحتوى عبارة عن قائمة، فضع كل عنصر في سطر جديد.</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end space-x-3 space-x-reverse">
                        <button onClick={handleCloseEditModal} className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            إلغاء
                        </button>
                        <button onClick={handleSaveEdit} className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark active:scale-95 transition-all">
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
            </div>
        )}
     </div>
  );
};


// ====================================================================================
// Step 3: Script View
// ====================================================================================
interface ScriptViewProps {
  businessInfo: BusinessInfo;
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>;
  scriptInfo: ScriptGenerationInfo;
  setScriptInfo: (info: ScriptGenerationInfo) => void;
  script: string | null;
  setScript: (script: string | null) => void;
  showNotification: (message: string) => void;
  scriptType: 'visual' | 'text' | 'both';
  setScriptType: (type: 'visual' | 'text' | 'both') => void;
}
const ScriptView: React.FC<ScriptViewProps> = ({ businessInfo, setBusinessInfo, scriptInfo, setScriptInfo, script, setScript, showNotification, scriptType, setScriptType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [regenerationInstruction, setRegenerationInstruction] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [quickIdea, setQuickIdea] = useState('');

  const handleBusinessInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessInfo({ ...businessInfo, [name]: value });
  };
  
  const handleScriptInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setScriptInfo({ ...scriptInfo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setScript(null);
    try {
      let result;
      if (isQuickMode) {
        if (!quickIdea.trim()) {
          showNotification("يرجى لصق فكرة أولاً.");
          setIsLoading(false);
          return;
        }
        result = await geminiService.generateScriptFromIdea(quickIdea, businessInfo, scriptType);
      } else {
        if (Object.values(scriptInfo).some(val => !val.trim()) || !businessInfo.name.trim()) {
          showNotification("يرجى ملء جميع الحقول المطلوبة.");
          setIsLoading(false);
          return;
        }
        result = await geminiService.generateScript(scriptInfo, businessInfo, scriptType);
      }
      setScript(result);
    } catch (error) {
      console.error("Failed to generate script:", error);
      showNotification("حدث خطأ أثناء إنشاء السكربت. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (!script) return;
    navigator.clipboard.writeText(script).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleRegenerateWithInstruction = async () => {
    if (!script || !regenerationInstruction.trim()) {
      showNotification("لا يوجد سكربت لتعديله أو أن حقل التعديل فارغ.");
      return;
    }
    setIsRegenerating(true);
    try {
      let newScript;
      if (isQuickMode) {
        if (!quickIdea) {
          showNotification("لا يمكن التعديل في الوضع السريع بدون فكرة أصلية.");
          setIsRegenerating(false);
          return;
        }
        newScript = await geminiService.regenerateScriptFromIdeaWithInstruction(script, regenerationInstruction, businessInfo, quickIdea);
      } else {
        newScript = await geminiService.regenerateScriptWithInstruction(script, regenerationInstruction, businessInfo, scriptInfo);
      }
      setScript(newScript);
      setRegenerationInstruction(''); 
      showNotification("تم تحديث السكربت بنجاح!");
    } catch (error) {
      console.error("Failed to regenerate script with instruction:", error);
      showNotification("حدث خطأ أثناء تعديل السكربت. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const CopyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
  const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
  const LightningBoltIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>);
  
  const scriptTypes = [
    { id: 'visual', name: 'مرئي فقط', description: 'سكربت يركز على المشاهد البصرية والحركة، بدون حوار أو تعليق صوتي.' },
    { id: 'text', name: 'نصي فقط', description: 'سكربت يعتمد كليًا على الحوار أو التعليق الصوتي.' },
    { id: 'both', name: 'مرئي ونصي', description: 'سكربت متوازن يجمع بين المشاهد القوية والحوار.' }
  ];

  const InputField = ({ name, label, placeholder, value, onChange, isTextarea = false, rows = 3 }: { name: string, label: string, placeholder: string, value: string, onChange: (e: any) => void, isTextarea?: boolean, rows?: number }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {isTextarea ? (
        <textarea name={name} id={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder} className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3"></textarea>
      ) : (
        <input type="text" name={name} id={name} value={value} onChange={onChange} placeholder={placeholder} className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3" />
      )}
    </div>
  );

  return (
    <>
      <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">كتابة السكربت القصصي</h2>
          <p className="mt-2 text-base md:text-lg text-gray-600 dark:text-gray-400">أجب عن هذه الأسئلة لنبني معاً قصة مؤثرة لمنتجك.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Right Column: Inputs */}
        <div className="lg:col-span-2 lg:sticky lg:top-28 self-start">
          <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto pr-2 pb-6">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      {isQuickMode ? 'الوضع السريع: تحويل فكرة لسكربت' : 'الوضع المفصل: بناء قصة'}
                  </h3>
                  <button
                      type="button"
                      onClick={() => setIsQuickMode(prev => !prev)}
                      className="flex items-center text-sm font-medium text-brand-purple hover:text-opacity-80 transition-colors"
                      title={isQuickMode ? 'العودة للوضع المفصل' : 'التحويل السريع لفكرة إلى سكربت'}
                  >
                      <LightningBoltIcon />
                      <span>{isQuickMode ? 'الوضع المفصل' : 'الوضع السريع'}</span>
                  </button>
              </div>

              {isQuickMode ? (
                <div className="space-y-8 animate-fade-in-fast">
                    <InputField name="name" label="ما هو اسم متجرك؟" placeholder="مثال: أزياء ريم" value={businessInfo.name} onChange={handleBusinessInputChange} />
                    <div>
                        <label htmlFor="quickIdea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            الصق الفكرة هنا
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            انسخ فكرة كاملة من قسم "توليد الأفكار" والصقها هنا لتحويلها مباشرة إلى سكربت.
                        </p>
                        <textarea
                            name="quickIdea"
                            id="quickIdea"
                            value={quickIdea}
                            onChange={(e) => setQuickIdea(e.target.value)}
                            rows={10}
                            className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3"
                            placeholder="مثال:&#10;العنوان: سر الأناقة المخفي&#10;الفكرة: فيديو قصير يكشف أن قطعة ملابس بسيطة يمكن أن تغير المظهر بالكامل..."
                        />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع السكربت المطلوب</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {scriptTypes.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setScriptType(option.id as 'visual' | 'text' | 'both')}
                                    className={`text-right p-4 rounded-lg border-2 transition-all duration-200 h-full flex flex-col justify-start
                                        ${scriptType === option.id
                                            ? 'border-pastel-yellow bg-pastel-yellow/10 shadow-md'
                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-pastel-yellow/50'
                                        }`}
                                >
                                    <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">{option.name}</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
              ) : (
                <div className="space-y-8">
                    <div className="space-y-6">
                        <InputField name="name" label="ما هو اسم متجرك؟" placeholder="مثال: أزياء ريم" value={businessInfo.name} onChange={handleBusinessInputChange} />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3">المحور الأول: لنتعرف على منتجك</h3>
                        <InputField name="productDefined" label="ما هو المنتج الذي تريد كتابة سكربت له؟" placeholder="مثال: قميص قطني أبيض، فستان سهرة" value={scriptInfo.productDefined} onChange={handleScriptInfoChange} />
                        <InputField name="emotionalStory" label="ما هو الشعور الذي تمنحه هذه القطعة لمن يرتديها؟" placeholder="مثال: تمنح شعوراً بالثقة، الراحة المطلقة، أو تعيد للذكريات" value={scriptInfo.emotionalStory} onChange={handleScriptInfoChange} isTextarea />
                        <InputField name="touchDetails" label="صف ملمس المنتج (ناعم، خشن، حريري)؟" placeholder="مثال: حريري، متين، مطاطي، ناعم جداً" value={scriptInfo.touchDetails} onChange={handleScriptInfoChange} />
                        <InputField name="sightDetails" label="صف شكل المنتج وألوانه وتفاصيله المميزة." placeholder="مثال: لونه فريد، قصته استثنائية، به خياطة داخلية مميزة" value={scriptInfo.sightDetails} onChange={handleScriptInfoChange} />
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3">المحور الثاني: من هو عميلك</h3>
                        <InputField name="idealCustomerLifestyle" label="من هو عميلك المثالي وما هو نمط حياته؟" placeholder="مثال: الأمهات العاملات اللاتي يحتجن ملابس أنيقة ومريحة" value={scriptInfo.idealCustomerLifestyle} onChange={handleScriptInfoChange} isTextarea />
                        <InputField name="problemToSolve" label="ما هو التحدي أو المشكلة التي يحلها منتجك لعميلك؟" placeholder="مثال: صعوبة إيجاد ملابس عملية وأنيقة في نفس الوقت" value={scriptInfo.problemToSolve} onChange={handleScriptInfoChange} isTextarea />
                    </div>
                    
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3">المحور الثالث: الهدف من السكربت</h3>
                        <InputField name="videoGoal" label="ما هو الإجراء الذي تريد من المشاهد اتخاذه بعد رؤية الفيديو؟" placeholder="مثال: الشراء المباشر، زيارة صفحة المنتج" value={scriptInfo.videoGoal} onChange={handleScriptInfoChange} />
                        <InputField name="ctaText" label="ما هي العبارة التي ستستخدمها لدعوة المشاهد لاتخاذ هذا الإجراء؟" placeholder="مثال: 'اكتشفي الأناقة الآن'، 'استخدمي كود خصم NEW10'" value={scriptInfo.ctaText} onChange={handleScriptInfoChange} />
                    </div>
                
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">نوع السكربت المطلوب</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {scriptTypes.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setScriptType(option.id as 'visual' | 'text' | 'both')}
                                    className={`text-right p-4 rounded-lg border-2 transition-all duration-200 h-full flex flex-col justify-start
                                        ${scriptType === option.id
                                            ? 'border-pastel-yellow bg-pastel-yellow/10 shadow-md'
                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-pastel-yellow/50'
                                        }`}
                                >
                                    <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">{option.name}</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
              )}
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple disabled:bg-gray-400 dark:disabled:bg-gray-600 mt-8">
                    {isLoading ? <LoadingSpinner /> : 'كتابة السكربت'}
                </button>
            </form>
            </div>
        </div>
        
        {/* Left Column: Results */}
        <div className="lg:col-span-3 lg:sticky lg:top-28 self-start">
           <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto pr-2 pb-6">
            {isLoading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] space-y-4 animate-fade-in bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <LoadingSpinner className="h-10"/>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                ثواني ويكون {businessInfo.name ? `"${businessInfo.name}"` : 'متجرك'} يملك أعظم سكربت
                </p>
            </div>
            )}

            {!isLoading && script && (
                <div className="animate-fade-in space-y-6">
                    <div className="relative bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">السكربت جاهز!</h2>
                            <button onClick={handleCopy} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="نسخ السكربت">
                                {isCopied ? <CheckIcon /> : <CopyIcon />}
                            </button>
                        </div>
                        <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700">{script}</pre>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3">هل تريد تعديل شيء؟</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            هل ترغب في تعديل الشخصية، المكان، أو طريقة التصوير؟ اذكر تعديلاتك هنا وسيقوم الذكاء الاصطناعي بتحديث السكربت.
                        </p>
                        <div className="space-y-4">
                            <textarea
                                value={regenerationInstruction}
                                onChange={(e) => setRegenerationInstruction(e.target.value)}
                                rows={3}
                                className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3"
                                placeholder="مثال: اجعل الحوار باللهجة العامية، غير مكان التصوير إلى مقهى..."
                            />
                            <button
                                onClick={handleRegenerateWithInstruction}
                                disabled={isRegenerating || !regenerationInstruction.trim()}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple disabled:bg-gray-400 dark:disabled:bg-gray-600"
                            >
                                {isRegenerating ? <LoadingSpinner /> : 'إعادة توليد السكربت بالتعديل'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
             {!isLoading && !script && (
                <ResultsPlaceholder 
                    title="السكربت الاحترافي"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                />
            )}
            </div>
        </div>
      </div>
      {isCopied && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900 py-2 px-5 rounded-full shadow-lg z-50">تم النسخ</div>}
    </>
  );
};


// ====================================================================================
// Step 4: Scenario View
// ====================================================================================
interface ScenarioViewProps {
  scriptToUse: string | null;
  scenario: Scene[] | null;
  setScenario: React.Dispatch<React.SetStateAction<Scene[] | null>>;
  businessInfo: BusinessInfo;
  showNotification: (message: string) => void;
}
const ScenarioView: React.FC<ScenarioViewProps> = ({ scriptToUse, scenario, setScenario, businessInfo, showNotification }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [scriptInput, setScriptInput] = useState(scriptToUse || '');

    useEffect(() => {
        setScriptInput(scriptToUse || '');
    }, [scriptToUse]);

    const generateScenarioAndImages = useCallback(async () => {
        if (!scriptInput.trim()) {
            showNotification("يرجى إدخال نص السكربت أولاً.");
            return;
        }
        setIsLoading(true);
        setScenario([]);
        try {
            const initialScenes = await geminiService.generateScenarioFromScript(scriptInput);
            setScenario(initialScenes.map(s => ({ ...s, imageLoading: true })));

            for (const [index, scene] of initialScenes.entries()) {
                try {
                    const imageUrl = await geminiService.generateImage(scene.imagePrompt);
                    setScenario(prev =>
                        prev ? prev.map((s, i) => (i === index ? { ...s, imageUrl, imageLoading: false, imageError: undefined } : s)) : prev
                    );
                } catch (error: any) {
                    console.error(`Failed to generate image for scene ${index}:`, error);
                    let errorMessage = "فشل تحميل الصورة.";
                    if (error.message && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota'))) {
                        errorMessage = "تم تجاوز حد الطلبات. يرجى الانتظار أو التحقق من خطة الفوترة الخاصة بك.";
                    }
                    setScenario(prev =>
                        prev ? prev.map((s, i) => (i === index ? { ...s, imageLoading: false, imageUrl: undefined, imageError: errorMessage } : s)) : prev
                    );
                }
                
                if (index < initialScenes.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }

        } catch (error) {
            console.error("Failed to generate scenario:", error);
            showNotification("حدث خطأ أثناء إنشاء السيناريو. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    }, [scriptInput, setScenario, showNotification]);

    return (
        <div className="w-full">
            <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">تحويل السكربت إلى سيناريو مرئي</h2>
                <p className="mt-2 text-base md:text-lg text-gray-600 dark:text-gray-400">الصق السكربت الخاص بك أو استخدم الذي تم إنشاؤه في الخطوة السابقة.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                 {/* Right Column: Inputs */}
                <div className="lg:col-span-2 lg:sticky lg:top-28 self-start">
                  <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto pr-2 pb-6">
                    <div className="space-y-4 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
                        <div>
                            <label htmlFor="script" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نص السكربت</label>
                            <textarea name="script" id="script" value={scriptInput} onChange={(e) => setScriptInput(e.target.value)} rows={10} className="block w-full rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-purple focus:ring-brand-purple sm:text-sm p-3" placeholder="الصق السكربت هنا..."></textarea>
                        </div>
                        <button onClick={generateScenarioAndImages} disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-brand-purple-dark active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple disabled:bg-gray-400 dark:disabled:bg-gray-600">
                            {isLoading ? <LoadingSpinner /> : 'إنشاء السيناريو المرئي'}
                        </button>
                    </div>
                  </div>
                </div>

                {/* Left Column: Results */}
                <div className="lg:col-span-3 lg:sticky lg:top-28 self-start">
                  <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto pr-2 pb-6">
                    {(isLoading && (!scenario || scenario.length === 0)) && (
                        <div className="flex flex-col items-center justify-center h-full min-h-[500px] space-y-4 animate-fade-in bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                            <LoadingSpinner className="h-12" />
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                ثواني ويكون {businessInfo.name ? `"${businessInfo.name}"` : 'متجرك'} يملك أعظم سيناريو
                            </p>
                        </div>
                    )}

                    {(!isLoading && scenario && scenario.length > 0) && (
                        <div className="animate-fade-in space-y-4">
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">السيناريو جاهز!</h2>
                            </div>
                            {scenario.map((scene, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg items-center animate-fade-in">
                                    <div className="space-y-4">
                                        <p className="font-bold text-brand-purple bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300 px-4 py-1.5 rounded-full inline-block">المشهد {index + 1}</p>
                                        <div><h4 className="font-bold text-gray-800 dark:text-gray-200">النص:</h4><p className="text-gray-600 dark:text-gray-400">"{scene.sentence}"</p></div>
                                        <div><h4 className="font-bold text-gray-800 dark:text-gray-200">وصف المشهد:</h4><p className="text-gray-600 dark:text-gray-400">{scene.sceneDescription}</p></div>
                                    </div>
                                    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg aspect-[16/9] overflow-hidden">
                                        {scene.imageLoading && <LoadingSpinner className="w-10 h-10"/>}
                                        {scene.imageUrl && <img src={scene.imageUrl} alt={`مشهد ${index + 1}`} className="w-full h-full object-cover" />}
                                        {scene.imageError && <div className="text-red-500 p-4 text-center text-sm">{scene.imageError}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && (!scenario || scenario.length === 0) && (
                        <ResultsPlaceholder 
                            title="السيناريو المرئي"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>}
                        />
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// ====================================================================================
// Dashboard View
// ====================================================================================
const DashboardCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center flex flex-col items-center justify-start
               transition-all duration-300 ease-in-out border-2 border-transparent 
               hover:shadow-2xl hover:border-pastel-yellow hover:-translate-y-2 
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastel-yellow focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
  >
    <div className="mb-4 text-pastel-yellow">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm flex-grow">{description}</p>
  </button>
);

const DashboardView: React.FC<{ setStep: (step: AppStep) => void }> = ({ setStep }) => {
  const sections = [
    {
      id: AppStep.Ideas,
      title: 'توليد الأفكار',
      description: 'احصل على أفكار تسويقية مبتكرة لمنتجاتك ومناسباتك القادمة.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    },
    {
      id: AppStep.Strategy,
      title: 'بناء الاستراتيجية',
      description: 'ضع أساسًا قويًا لعلامتك التجارية باستراتيجية محتوى متكاملة.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
    },
    {
      id: AppStep.Script,
      title: 'كتابة السكربت',
      description: 'حوّل أفكارك إلى نصوص وسيناريوهات جذابة جاهزة للتصوير.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    },
    {
      id: AppStep.Scenario,
      title: 'السيناريو المرئي',
      description: 'حوّل السكربت إلى مشاهد مرئية مع صور مقترحة من الذكاء الاصطناعي.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
    },
  ];

  return (
    <div className="animate-fade-in">
        <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">أهلاً بك في الكاتب الذكي</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">اختر إحدى الأدوات أدناه لتبدأ في تحويل أفكارك إلى محتوى تسويقي ناجح.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {sections.map(section => (
                <DashboardCard 
                    key={section.id}
                    title={section.title}
                    description={section.description}
                    icon={section.icon}
                    onClick={() => setStep(section.id)}
                />
            ))}
        </div>
    </div>
  );
};


// ====================================================================================
// Main App Component
// ====================================================================================
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const HamburgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.Dashboard);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; phase: 'in' | 'out' } | null>(null);
  const notificationTimer = useRef<{ fadeOut?: number, remove?: number }>({});

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light' || savedTheme === 'dark') {
                return savedTheme;
            }
        }
    } catch (e) { console.error(e) }
    return 'light';
  });

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(() => {
    const defaults = { name: '', audience: '', stage: 'جديد', products: '' };
    try {
        const saved = localStorage.getItem('businessInfo');
        return saved ? JSON.parse(saved) : defaults;
    } catch (error) {
        console.error("Failed to parse businessInfo from localStorage", error);
        return defaults;
    }
  });

  const [contentPlanInfo, setContentPlanInfo] = useState<ContentPlanInfo>(() => {
    const defaults: ContentPlanInfo = {
      storeName: '',
      niche: '',
      coreValue: '',
      toneOfVoice: '',
      targetAudience: '',
      focusProducts: '',
      monthlyGoal: 'awareness',
      promotions: '',
      visualStyle: '',
      hashtags: '',
      inspiration: '',
    };
    try {
        const saved = localStorage.getItem('contentPlanInfo');
        const savedBusinessInfo = localStorage.getItem('businessInfo');
        const businessInfo = savedBusinessInfo ? JSON.parse(savedBusinessInfo) : {};
        const initialState = saved ? { ...defaults, ...JSON.parse(saved) } : defaults;

        if (!saved && savedBusinessInfo) {
          initialState.storeName = businessInfo.name || '';
          initialState.targetAudience = businessInfo.audience || '';
          initialState.focusProducts = businessInfo.products || '';
        }

        return initialState;
    } catch (error) {
        console.error("Failed to parse contentPlanInfo from localStorage", error);
        return defaults;
    }
  });

  const [ideaGenInfo, setIdeaGenInfo] = useState<IdeaGenerationInfo>(() => {
    const defaults: IdeaGenerationInfo = { productDetails: '', event: '', marketingType: marketingTypesWithOptions[0].name, hasBudget: 'no', budgetAmount: '', additionalInfo: '' };
    try {
        const saved = localStorage.getItem('ideaGenInfo');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Validate that the saved marketing type is in the new list
            if (!marketingTypesWithOptions.some(t => t.name === parsed.marketingType)) {
                parsed.marketingType = defaults.marketingType; // Reset to default if not found
            }
            return { ...defaults, ...parsed };
        }
        return defaults;
    } catch (error) {
        console.error("Failed to parse ideaGenInfo from localStorage", error);
        return defaults;
    }
  });
  const [strategy, setStrategy] = useState<ContentStrategy | null>(() => {
    try {
        const saved = localStorage.getItem('strategy');
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error("Failed to parse strategy from localStorage", error);
        return null;
    }
  });
  const [marketingIdeas, setMarketingIdeas] = useState<MarketingIdea[] | null>(() => {
    try {
        const saved = localStorage.getItem('marketingIdeas');
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error("Failed to parse marketingIdeas from localStorage", error);
        return null;
    }
  });
  const [monthlyPlan, setMonthlyPlan] = useState<MonthlyPlan | null>(() => {
    try {
        const saved = localStorage.getItem('monthlyPlan');
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error("Failed to parse monthlyPlan from localStorage", error);
        return null;
    }
  });
  const [script, setScript] = useState<string | null>(() => {
    try {
        return localStorage.getItem('script');
    } catch(e) { console.error(e) }
    return null;
  });
  const [scenario, setScenario] = useState<Scene[] | null>(() => {
    try {
        const saved = localStorage.getItem('scenario');
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error("Failed to parse scenario from localStorage", error);
        return null;
    }
  });
  const [scriptType, setScriptType] = useState<'visual' | 'text' | 'both'>(() => {
    try {
        const saved = localStorage.getItem('scriptType');
        if (saved === 'visual' || saved === 'text' || saved === 'both') {
            return saved;
        }
    } catch(e) { console.error(e); }
    return 'both';
  });
  const [scriptInfo, setScriptInfo] = useState<ScriptGenerationInfo>(() => {
    const defaults: ScriptGenerationInfo = { productDefined: '', emotionalStory: '', touchDetails: '', sightDetails: '', idealCustomerLifestyle: '', problemToSolve: '', videoGoal: '', ctaText: '' };
    try {
        const saved = localStorage.getItem('scriptInfo');
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch (error) {
        console.error("Failed to parse scriptInfo from localStorage", error);
        return defaults;
    }
  });

  
  const navItems = [
    { id: AppStep.Dashboard, name: 'الرئيسية' },
    { id: AppStep.Ideas, name: 'توليد الأفكار' },
    { id: AppStep.Strategy, name: 'بناء الاستراتيجية' },
    { id: AppStep.Script, name: 'كتابة السكربت' },
    { id: AppStep.Scenario, name: 'السيناريو المرئي' },
  ];

  useEffect(() => { localStorage.setItem('businessInfo', JSON.stringify(businessInfo)); }, [businessInfo]);
  useEffect(() => { localStorage.setItem('contentPlanInfo', JSON.stringify(contentPlanInfo)); }, [contentPlanInfo]);
  useEffect(() => { localStorage.setItem('ideaGenInfo', JSON.stringify(ideaGenInfo)); }, [ideaGenInfo]);
  useEffect(() => { strategy ? localStorage.setItem('strategy', JSON.stringify(strategy)) : localStorage.removeItem('strategy'); }, [strategy]);
  useEffect(() => { marketingIdeas ? localStorage.setItem('marketingIdeas', JSON.stringify(marketingIdeas)) : localStorage.removeItem('marketingIdeas'); }, [marketingIdeas]);
  useEffect(() => { monthlyPlan ? localStorage.setItem('monthlyPlan', JSON.stringify(monthlyPlan)) : localStorage.removeItem('monthlyPlan'); }, [monthlyPlan]);
  useEffect(() => { script ? localStorage.setItem('script', script) : localStorage.removeItem('script'); }, [script]);
  useEffect(() => { scenario ? localStorage.setItem('scenario', JSON.stringify(scenario)) : localStorage.removeItem('scenario'); }, [scenario]);
  useEffect(() => { localStorage.setItem('scriptType', scriptType); }, [scriptType]);
  useEffect(() => { localStorage.setItem('scriptInfo', JSON.stringify(scriptInfo)); }, [scriptInfo]);


  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // FIX: Reworked notification logic to correctly handle multiple timers, preventing race conditions and a cryptic compiler error. Improved UX by increasing notification duration.
  const showNotification = useCallback((message: string) => {
    // Clear any existing timers to prevent overlapping notifications
    if (notificationTimer.current.fadeOut) {
      clearTimeout(notificationTimer.current.fadeOut);
    }
    if (notificationTimer.current.remove) {
        clearTimeout(notificationTimer.current.remove);
    }

    setNotification({ message, phase: 'in' });

    // Set a timer to start the fade-out animation
    notificationTimer.current.fadeOut = window.setTimeout(() => {
      setNotification((prev) => (prev ? { ...prev, phase: 'out' } : null));

      // Set another timer to remove the notification from the DOM after fading out
      notificationTimer.current.remove = window.setTimeout(() => {
        setNotification(null);
      }, 500); // Corresponds to fade-out animation duration
    }, 3000); // Notification visible for 3 seconds before fading
  }, []);

  const renderContent = () => {
    switch (step) {
      case AppStep.Dashboard:
        return <DashboardView setStep={setStep} />;
      case AppStep.Ideas:
        return <IdeasView businessInfo={businessInfo} setBusinessInfo={setBusinessInfo} ideaGenInfo={ideaGenInfo} setIdeaGenInfo={setIdeaGenInfo} marketingIdeas={marketingIdeas} setMarketingIdeas={setMarketingIdeas} showNotification={showNotification} />;
      case AppStep.Strategy:
        return <StrategyView contentPlanInfo={contentPlanInfo} setContentPlanInfo={setContentPlanInfo} setBusinessInfo={setBusinessInfo} strategy={strategy} setStrategy={setStrategy} monthlyPlan={monthlyPlan} setMonthlyPlan={setMonthlyPlan} showNotification={showNotification} />;
      case AppStep.Script:
        return <ScriptView businessInfo={businessInfo} setBusinessInfo={setBusinessInfo} script={script} setScript={setScript} showNotification={showNotification} scriptType={scriptType} setScriptType={setScriptType} scriptInfo={scriptInfo} setScriptInfo={setScriptInfo} />;
      case AppStep.Scenario:
        return <ScenarioView scriptToUse={script} scenario={scenario} setScenario={setScenario} businessInfo={businessInfo} showNotification={showNotification} />;
      default:
        return <div>خطأ</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
        {notification && (
            <div 
                className={`fixed top-5 left-1/2 z-[100] flex items-center p-4 max-w-sm w-full rounded-lg shadow-lg text-sm font-medium
                            bg-white dark:bg-gray-800 border border-pastel-yellow
                            ${notification.phase === 'in' ? 'animate-slide-in-down' : 'animate-fade-out'}`} 
                role="alert"
            >
                <div className="text-red-500 dark:text-red-300 ml-3">
                  <ErrorIcon />
                </div>
                <p className="text-gray-800 dark:text-gray-200">{notification.message}</p>
            </div>
      )}
        {/* --- Mobile Menu --- */}
        <div 
            className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMenuOpen(false)}
        ></div>
        <aside className={`fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">القائمة</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <CloseIcon />
                </button>
            </div>
            <nav className="p-2">
                <ul className="space-y-1">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => {
                                    setStep(item.id);
                                    setIsMenuOpen(false);
                                }}
                                className={`w-full text-right block py-2.5 px-4 rounded-lg font-medium transition-colors ${step === item.id ? 'bg-brand-purple/10 text-brand-purple' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>


        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-30">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                 <div className="flex items-center space-x-2 space-x-reverse">
                    <button 
                        onClick={toggleTheme} 
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                     <button 
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                        aria-label="Open menu"
                    >
                        <HamburgerIcon />
                    </button>
                </div>

                <div className="text-right">
                  {step === AppStep.Dashboard ? (
                    <>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">الكاتب الذكي</h1>
                      <p className="hidden md:block mt-1 text-sm sm:text-md text-gray-500 dark:text-gray-400">حوّل أفكارك إلى محتوى تسويقي ناجح</p>
                    </>
                  ) : (
                    <button onClick={() => setStep(AppStep.Dashboard)} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-brand-purple transition-colors">
                      <BackArrowIcon />
                      <span className="font-bold text-lg">العودة للرئيسية</span>
                    </button>
                  )}
                </div>
            </div>
        </header>
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;