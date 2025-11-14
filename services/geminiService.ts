import { GoogleGenAI, Type } from "@google/genai";
import { BusinessInfo, IdeaGenerationInfo, MarketingIdea, MonthlyPlan, Scene, ContentStrategy, ScriptGenerationInfo, ContentPlanInfo } from '../types';

//if (!process.env.API_KEY) {
//  throw new Error("API_KEY environment variable not set");
//}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
};

const advancedMarketingGuide = `
### دليل المحتوى المتقدم للانتشار الفيروسي (Neuromarketing)

هذا الدليل يدمج بين علم النفس، التسويق العصبي، والتقنيات السينمائية البسيطة لخلق محتوى لا يُنسى لمتاجر الملابس الصغيرة. جميع الأفكار مصممة للتنفيذ باستخدام هاتف ذكي.

**المحور الاستراتيجي: صدمة الوعي والغموض السمعي البصري**
الهدف هو إثارة: الدهشة (Surprise)، الفضول (Curiosity)، والنفور من الخسارة (Loss Aversion).

---

**الجزء الأول: أفكار المحتوى الفيروسي (خطة لـ 4 أسابيع)**

**1. الأسبوع الأول: صدمة "كشف المستور" (The Disclosure Shock)**
*   **فكرة "الصوت الخفي":** اكشف كيف تستخدم بعض المتاجر ترددات صوتية خفية (Subliminal Frequencies) لإثارة شعور بالإلحاح والندرة لدى العملاء.
    *   *التقنية السينمائية:* استخدم مؤثرات صوتية مقلقة (نبضات قلب، ساعة تدق) ثم اكشف عن "السر" العلمي. اختتم بسؤال تفاعلي: "هل تريد معرفة التردد؟ اكتب 'نغمة' في التعليقات."
*   **فكرة "ChatGPT يقرأ مشاعرك":** ادّعِ أن الذكاء الاصطناعي لا يكتب المحتوى عشوائياً، بل يختار كل كلمة بناءً على تحليل بيانات مسح حركة العين (Eye-Tracking) لملايين البشر لـ"برمجة" دماغ المشتري.
    *   *التقنية السينمائية:* استخدم فلاتر بصرية تحاكي شاشة تنظر إليك، مع خطوط حمراء تتبع حركة العين. اختتم بتشويقة: "الآن، كيف تستخدم هذه القوة لصالحك؟"

**2. الأسبوع الثاني: القصة الساخرة واللامنطقية (The Absurd Reality)**
*   **فكرة "التناقض الساخر":** فيديو ساخر بأسلوب فخم يكشف أن "أجواء العلامة التجارية" (The Brand Vibe)، مثل الإضاءة، قد تكون أهم من المنتج نفسه في خلق ارتباط عاطفي.
    *   *التقنية السينمائية:* حاكِ إعلاناً فاخراً (مثل Jacquemus)، ثم اكشف الكواليس البسيطة (شخص يمسك مستشعر دماغ EEG على رأس الموديل). اختتم بعرض خدمة: "هل تريد أن أصمم لك إضاءة دماغية لبراندك؟"
*   **فكرة "المنطق المقلوب":** اعرض لافتة إعلانية بها خطأ لغوي أو منطقي مقصود. اشرح كيف أن هذا "الخطأ البسيط" يوقف الدماغ عن التمرير السريع ويجعل المعلومة اللاواعية تتسرب أسرع.
    *   *التقنية السينمائية:* استخدم خطوطاً وتصاميم قديمة (مثل إعلانات الثمانينات). ابدأ بإيقاع سريع ثم أبطئ عند اللافتة. اختتم بتأكيد: "نحن ننشئ هذه الأخطاء عمداً! علم الأعصاب يثبت ذلك."

**3. الأسبوع الثالث: اختبار العميل (The User Challenge)**
*   **فكرة "تحدي إعلان AI":** تحدى الجمهور مباشرة. اعرض 3 إعلانات (واحد فاشل، واحد تقليدي، وواحد مصمم بتقنيات عصبية). اطلب منهم تخمين أي واحد سيحقق أعلى مبيعات.
    *   *التقنية السينمائية:* مونتاج سريع وعلامات استفهام متحركة. يكون الكشف عن الإعلان الفائز بطيئاً ومصحوباً بشرح صوتي عميق يكشف السر (مثال: "الإعلان الفائز استخدم قانون الألوان الذي يوجه العين مباشرة لزر الشراء!").
*   **فكرة "هكر الدماغ":** فيديو يحاكي شخصاً "يهكر" متجراً إلكترونياً، لكنه يكتشف أن الكلمات المفتاحية المعروضة (مثل "حصرياً"، "الوقت محدود") هي بحد ذاتها "شفرة" برمجية تفك شيفرة الشراء في دماغ العميل.
    *   *التقنية السينمائية:* استخدم مؤثرات بصرية رقمية بأسلوب فيلم Matrix، مع تسليط الضوء على الكلمات المفتاحية باللون الأحمر. اختتم برسالة قوية: "هذه الكلمات ليست مجرد ترويج، بل هي أوامر برمجية لدماغك."

**4. الأسبوع الرابع: الكشف عن الأداة (The Solution Reveal)**
*   **فكرة "التحول الكبير":** اروِ قصة تحولك (أنت كخبير) من باحث قلق في عالم التسويق إلى مسوق لا يُهزم، وكل ذلك بفضل اكتشاف أو إنشاء أداة AI ثورية.
    *   *التقنية السينمائية:* إضاءة درامية، لقطات سريعة ومربكة في البداية، ثم هدوء وسكينة عند استعراض واجهة الأداة. اشرح المنطق العصبي الذي تستخدمه الأداة.
*   **فكرة "التحدي النهائي":** قم بمحاكاة اختبار (حقيقي أو وهمي) تتنافس فيه أداتك الـ AI مع وكالات تسويق كبرى على نفس الميزانية. اعرض النتائج التي تظهر تفوق أداتك في معدلات النقر (CTR) والتحويل (Conversion).
    *   *التقنية السينمائية:* استخدم رسوم بيانية متحركة (Animated Charts) جذابة لإثبات التفوق بشكل مرئي. اختتم بدعوة صريحة وواثقة لتجربة الأداة.

---

**الجزء الثاني: إرشادات التنفيذ الفيروسي**

*   **الإيقاع السريع (Fast Cut):** يجب ألا يتجاوز الفيديو 45 ثانية.
*   **النصوص الواضحة:** معظم المستخدمين يشاهدون بدون صوت. يجب أن يكون النص على الشاشة كبيراً وواضحاً وجذاباً.
*   **الخطاف (Hook) في أول 3 ثوانٍ:** ابدأ بسؤال صادم، أو معلومة غريبة، أو مشهد غير متوقع لجذب الانتباه فوراً وتجاوز "حاجز التمرير السريع".
*   **الجودة على البساطة:** لا تحتاج لمعدات احترافية، لكن اهتم بجودة الصوت (إذا كان هناك تعليق صوتي) ووضوح الصورة. الإضاءة الطبيعية هي صديقك الأول.
*   **الحلقة المفتوحة (Open Loop):** اختتم دائماً الفيديو بسؤال أو طلب يدفع المشاهد للتفاعل (تعليق، مشاركة) ويفتح حلقة من الفضول للمحتوى القادم.
`;


export async function generateStrategy(info: ContentPlanInfo): Promise<ContentStrategy> {
  const model = 'gemini-2.5-pro';
  
  const prompt = `
    أنت مرشد وخبير استراتيجي ودود وعملي لأصحاب المتاجر الصغيرة في مجال الأزياء. مهمتك هي تحليل المعلومات التفصيلية المقدمة وتحويلها إلى استراتيجية محتوى متكاملة، بسيطة، وقابلة للتنفيذ باستخدام هاتف ذكي. يجب أن تكون ردودك باللغة العربية ومشجعة وسهلة الفهم.

    ---

    **معلومات المتجر المفصلة (المدخلات):**

    **1. هوية العلامة التجارية:**
    - اسم المتجر: ${info.storeName}
    - نوع الملابس الأساسي (Niche): ${info.niche}
    - ما يميز المتجر (Core Value): ${info.coreValue}
    - نبرة الصوت مع الجمهور (Tone of Voice): ${info.toneOfVoice}

    **2. الجمهور والأهداف:**
    - العميل المثالي: ${info.targetAudience}
    - المنتجات التي سيتم التركيز عليها: ${info.focusProducts}
    - الهدف الرئيسي للشهر: ${info.monthlyGoal === 'sales' ? 'زيادة المبيعات المباشرة' : 'زيادة الوعي وجذب متابعين جدد'}
    - العروض المخطط لها: ${info.promotions}

    **3. الجانب البصري والإلهام:**
    - الأسلوب البصري المفضل للفيديوهات: ${info.visualStyle}
    - الهاشتاغات المستخدمة: ${info.hashtags}
    - مصادر الإلهام: ${info.inspiration}

    ---

    **المهمة:**
    بناءً على هذه المعلومات الغنية، قم بإنشاء استراتيجية محتوى مخصصة. يجب أن تكون كل نقطة مباشرة، عملية، ومبنية على المدخلات. قم بتغطية النقاط التالية:

    1.  **الرؤية (Vision):** جملة واحدة ملهمة تلخص حلم المتجر بناءً على قيمته الأساسية.
    2.  **الأهداف (Objectives):** قائمة من 2-3 أهداف واضحة ومحددة، مع الأخذ بعين الاعتبار الهدف الشهري المحدد.
    3.  **الجمهور المستهدف (Target Audience):** فقرة قصيرة ومفصلة تصف العميل المثالي بدقة بناءً على المدخلات.
    4.  **الرسائل الأساسية (Core Messages):** قائمة من 3 رسائل قصيرة وقوية تعكس قيمة المتجر وتخاطب الجمهور بنبرة الصوت المحددة.
    5.  **قنوات التواصل (Channels):** اقترح 1-2 من أهم المنصات (مثل Instagram, TikTok) مع تبرير بسيط ومقنع يعتمد على الجمهور والأسلوب البصري.
    6.  **الأسلوب (Style):**
        - **الأسلوب الصوتي (Tone):** قم بتأكيد وتوسيع وصف نبرة الصوت المحددة.
        - **الأسلوب البصري (Visual):** قدم نصائح عملية ومحددة لتطبيق الأسلوب البصري المطلوب باستخدام الهاتف (مثال: "لتحقيق الإضاءة الطبيعية، صوري دائمًا قرب نافذة كبيرة خلال النهار.").
    7.  **ملخص خطة المحتوى (Content Plan Overview):** صف 3 "أعمدة محتوى" رئيسية ومبتكرة تتناسب مع المنتجات والجمهور (مثال: "قصص ما وراء القطعة"، "تحدي التنسيق الأسبوعي"، "كيف تحل [اسم القطعة] مشكلة [مشكلة العميل]").
    8.  **مقاييس النجاح (Metrics):** قائمة بمؤشرات نجاح بسيطة تتوافق مباشرة مع الهدف الشهري (مثال: إذا كان الهدف هو الوعي، تتبع "عدد مرات الظهور" و"نمو المتابعين").
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
        ...generationConfig,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vision: { type: Type.STRING, description: "الرؤية طويلة الأمد للعلامة التجارية." },
            objectives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "قائمة بالأهداف التسويقية المحددة." },
            targetAudience: { type: Type.STRING, description: "وصف تفصيلي للجمهور المستهدف." },
            coreMessages: { type: Type.ARRAY, items: { type: Type.STRING }, description: "الرسائل الرئيسية التي يجب توصيلها." },
            channels: { type: Type.ARRAY, items: { type: Type.STRING }, description: "قنوات التواصل الاجتماعي الموصى بها." },
            style: {
              type: Type.OBJECT,
              properties: {
                tone: { type: Type.STRING, description: "وصف الأسلوب الصوتي ونبرة العلامة التجارية." },
                visual: { type: Type.STRING, description: "وصف للأسلوب البصري والهوية المرئية." }
              },
              required: ["tone", "visual"]
            },
            contentPlanOverview: { type: Type.STRING, description: "ملخص لخطة المحتوى الشهرية المقترحة وأعمدة المحتوى الرئيسية." },
            metrics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "مقاييس النجاح الرئيسية (KPIs) لتتبع الأداء." }
          },
          required: ["vision", "objectives", "targetAudience", "coreMessages", "channels", "style", "contentPlanOverview", "metrics"]
        }
    },
  });

  const text = response.text.trim();
  try {
    const parsed = JSON.parse(text);
    return parsed as ContentStrategy;
  } catch (e) {
    console.error("Failed to parse JSON from Gemini response for strategy:", text);
    throw new Error("Could not generate content strategy. The response was not valid JSON.");
  }
}

export async function generateIdeas(info: BusinessInfo & IdeaGenerationInfo): Promise<MarketingIdea[]> {
  const model = 'gemini-2.5-pro';

  let budgetPromptPart = '';
  if (info.hasBudget === 'yes') {
    if (info.budgetAmount && info.budgetAmount.trim() !== '') {
      budgetPromptPart = `\n- الميزانية المتاحة: ${info.budgetAmount}. يجب أن تكون الأفكار مناسبة لهذه الميزانية.`;
    } else {
      budgetPromptPart = `\n- لديه ميزانية متاحة لكن لم يحدد المبلغ. اقترح أفكارًا قد تتطلب بعض الإنفاق وأفكارًا أخرى مجانية.`;
    }
  } else {
    budgetPromptPart = `\n- لا توجد ميزانية متاحة. يجب أن تكون جميع الأفكار مجانية أو منخفضة التكلفة للغاية.`;
  }

  let additionalInfoPromptPart = '';
  if (info.additionalInfo && info.additionalInfo.trim() !== '') {
    additionalInfoPromptPart = `\n- معلومات إضافية من المستخدم يجب التركيز عليها: "${info.additionalInfo}"`;
  }

  const prompt = `
    أنت خبير استراتيجي في التسويق الفيروسي وصناعة المحتوى، متخصص في الأزياء للشركات الصغيرة. لديك فهم عميق لتقنيات التسويق العصبي (Neuromarketing) وعلم النفس. مهمتك هي تحويل الأفكار العادية إلى محتوى مثير للجدل يحقق انتشاراً واسعاً، مع الحفاظ على بساطة التنفيذ باستخدام هاتف ذكي فقط. يجب أن تكون ردودك باللغة العربية.

    استخدم المرجع التالي لتكون إجاباتك دقيقة، احترافية، ومثيرة للجدل:
    
    **المرجع الأساسي: دليل المحتوى المتقدم للانتشار الفيروسي (Neuromarketing)**
    ${advancedMarketingGuide}

    ---

    الآن، بناءً على هذا المرجع، قم بتحليل المعلومات التالية لمتجر ملابس:

    **معلومات المتجر:**
    - اسم المتجر: ${info.name}
    - الجمهور المستهدف: ${info.audience}
    - مرحلة العمل: ${info.stage}
    - وصف عام للمنتجات: ${info.products}

    **معلومات لتوليد الأفكار:**
    - تفاصيل المنتج المراد التسويق له: ${info.productDetails}
    - الحدث أو المناسبة: ${info.event}
    - **نوع التسويق المطلوب: ${info.marketingType}**
    ${budgetPromptPart}
    ${additionalInfoPromptPart}

    **المهمة:**
    بناءً على كل ما سبق، وخاصةً **نوع التسويق المطلوب** و**المرجع الأساسي**، قم بإنشاء 6 أفكار تسويقية إبداعية ومتنوعة ومناسبة للمعلومات المقدمة.
    يجب أن تكون كل فكرة بمثابة مفهوم متكامل لفيديو قصير (Reel أو TikTok).
    لكل فكرة من الأفكار الست، قدم التفاصيل التالية:
    - **title:** عنوان جذاب ومختصر للفكرة.
    - **concept:** شرح للفكرة الأساسية وما يدور حوله الفيديو.
    - **hook:** وصف لأول 3 ثواني من الفيديو لجذب انتباه المشاهد فورًا.
    - **visuals:** وصف تفصيلي للمشاهد المقترحة، اللقطات، وزوايا الكاميرا.
    - **cta:** دعوة واضحة لاتخاذ إجراء في نهاية الفيديو (مثل "تسوقي الآن" أو "شاركينا رأيك").
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
        ...generationConfig,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marketingIdeas: {
              type: Type.ARRAY,
              description: "مصفوفة من 6 أفكار تسويقية إبداعية، كل منها مفهوم فيديو متكامل.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "عنوان الفكرة التسويقية." },
                  concept: { type: Type.STRING, description: "شرح الفكرة الأساسية للفيديو." },
                  hook: { type: Type.STRING, description: "وصف لأول 3 ثواني من الفيديو (الخطاف)." },
                  visuals: { type: Type.STRING, description: "وصف للمشاهد والتصور البصري." },
                  cta: { type: Type.STRING, description: "دعوة لاتخاذ إجراء في نهاية الفيديو." }
                },
                required: ["title", "concept", "hook", "visuals", "cta"]
              }
            }
          },
          required: ["marketingIdeas"]
        }
    },
  });

  const text = response.text.trim();
  try {
    const parsed = JSON.parse(text);
    return parsed.marketingIdeas as MarketingIdea[];
  } catch (e) {
    console.error("Failed to parse JSON from Gemini response for ideas:", text);
    throw new Error("Could not generate ideas. The response was not valid JSON.");
  }
}


export async function regenerateSingleIdea(editedIdea: MarketingIdea, businessInfo: BusinessInfo): Promise<MarketingIdea> {
  const model = 'gemini-2.5-pro';
  const prompt = `
    أنت مخرج إبداعي ومتخصص في تسويق الأزياء الفيروسي. مهمتك هي أخذ فكرة مبدئية معدلة من قبل المستخدم وتحويلها إلى مفهوم فيديو متكامل ومصقول، مع الأخذ بعين الاعتبار مبادئ التسويق العصبي لجعلها أكثر تأثيراً.
    
    معلومات المتجر:
    - اسم المتجر: ${businessInfo.name}
    - الجمهور المستهدف: ${businessInfo.audience}

    الفكرة المعدلة من قبل المستخدم (يجب أن تبني عليها وتحسنها):
    - العنوان: ${editedIdea.title}
    - المفهوم: ${editedIdea.concept}
    - الخطاف: ${editedIdea.hook}
    - التصور البصري: ${editedIdea.visuals}
    - دعوة للعمل: ${editedIdea.cta}

    المهمة:
    قم بتحسين وتوسيع هذه الفكرة. حافظ على جوهر تعديلات المستخدم، ولكن أضف المزيد من التفاصيل الإبداعية، واقترح لقطات أكثر تحديدًا، واجعل الدعوة للعمل أكثر إقناعًا. يجب أن يكون الناتج النهائي فكرة فيديو احترافية جاهزة للتنفيذ.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
        ...generationConfig,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "العنوان المحسّن للفكرة." },
            concept: { type: Type.STRING, description: "المفهوم الموسع والمحسّن للفيديو." },
            hook: { type: Type.STRING, description: "الخطاف المحسّن والمفصّل." },
            visuals: { type: Type.STRING, description: "التصور البصري المحسّن مع تفاصيل إضافية." },
            cta: { type: Type.STRING, description: "دعوة العمل المحسّنة والأكثر إقناعًا." }
          },
          required: ["title", "concept", "hook", "visuals", "cta"]
        }
    },
  });

  const text = response.text.trim();
  try {
    return JSON.parse(text) as MarketingIdea;
  } catch (e) {
    console.error("Failed to parse JSON from Gemini response for single idea regeneration:", text);
    throw new Error("Could not regenerate idea. The response was not valid JSON.");
  }
}

export async function regenerateIdeaWithInstruction(originalIdea: MarketingIdea, instruction: string, businessInfo: BusinessInfo): Promise<MarketingIdea> {
  const model = 'gemini-2.5-pro';
  const prompt = `
    أنت مخرج إبداعي ومتخصص في تسويق الأزياء الفيروسي. مهمتك هي تحسين فكرة فيديو بناءً على ملاحظات المستخدم، مع تطبيق مبادئ التسويق العصبي.

    معلومات المتجر:
    - اسم المتجر: ${businessInfo.name}
    - الجمهور المستهدف: ${businessInfo.audience}

    الفكرة الأصلية هي:
    - العنوان: ${originalIdea.title}
    - المفهوم: ${originalIdea.concept}
    - الخطاف: ${originalIdea.hook}
    - التصور البصري: ${originalIdea.visuals}
    - دعوة للعمل: ${originalIdea.cta}

    تعليمات المستخدم للتعديل:
    "${instruction}"

    المهمة:
    أعد كتابة الفكرة بناءً على تعليمات المستخدم. حافظ على جوهر الفكرة الأصلية ولكن طبق التعديلات المطلوبة بدقة. اجعل الناتج النهائي فكرة فيديو احترافية محسّنة وجاهزة للتنفيذ.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
        ...generationConfig,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "العنوان المحسّن للفكرة." },
            concept: { type: Type.STRING, description: "المفهوم الموسع والمحسّن للفيديو." },
            hook: { type: Type.STRING, description: "الخطاف المحسّن والمفصّل." },
            visuals: { type: Type.STRING, description: "التصور البصري المحسّن مع تفاصيل إضافية." },
            cta: { type: Type.STRING, description: "دعوة العمل المحسّنة والأكثر إقناعًا." }
          },
          required: ["title", "concept", "hook", "visuals", "cta"]
        }
    },
  });

  const text = response.text.trim();
  try {
    return JSON.parse(text) as MarketingIdea;
  } catch (e) {
    console.error("Failed to parse JSON from Gemini response for instructional idea regeneration:", text);
    throw new Error("Could not regenerate idea with instruction. The response was not valid JSON.");
  }
}

export async function generateMonthlyPlan(info: ContentPlanInfo): Promise<MonthlyPlan> {
  const model = 'gemini-2.5-pro';
  const prompt = `
    أنت مرشد ودود وخبير في التسويق الفيروسي لمتاجر الأزياء الصغيرة. مهمتك هي تحويل المعلومات التفصيلية عن المتجر إلى خطة محتوى شهرية (4 أسابيع) جريئة وعملية، يمكن تصويرها بالكامل باستخدام هاتف ذكي.

    استخدم الدليل المتقدم التالي كمصدر إلهام أساسي لجميع اقتراحاتك:
    ${advancedMarketingGuide}

    ---

    **معلومات المتجر المفصلة (المدخلات):**

    **1. هوية العلامة التجارية:**
    - اسم المتجر: ${info.storeName}
    - نوع الملابس الأساسي (Niche): ${info.niche}
    - ما يميز المتجر (Core Value): ${info.coreValue}
    - نبرة الصوت مع الجمهور (Tone of Voice): ${info.toneOfVoice}

    **2. الجمهور والأهداف:**
    - العميل المثالي: ${info.targetAudience}
    - المنتجات التي سيتم التركيز عليها: ${info.focusProducts}
    - الهدف الرئيسي للشهر: ${info.monthlyGoal === 'sales' ? 'زيادة المبيعات المباشرة' : 'زيادة الوعي وجذب متابعين جدد'}
    - العروض المخطط لها: ${info.promotions}

    **3. الجانب البصري والإلهام:**
    - الأسلوب البصري المفضل للفيديوهات: ${info.visualStyle}
    - الهاشتاغات المستخدمة: ${info.hashtags}
    - مصادر الإلهام: ${info.inspiration}
    
    ---
    
    **المهمة:**
    بناءً على المعلومات أعلاه، قم بإنشاء خطة محتوى شهرية.
    لكل أسبوع، قدم 3 أفكار محتوى مختلفة ومبتكرة لفيديوهات قصيرة (Reels/TikTok) مستوحاة من **الدليل المتقدم** ولكن مخصصة **لهوية المتجر وأهدافه**.
    **صف كل فكرة بوضوح واشرح ببساطة كيف يمكن لصاحب المتجر تصويرها بنفسه باستخدام الهاتف.**

    مثال لفكرة جيدة مخصصة:
    "**فكرة: 'سر الراحة في يوم حافل' (مستوحاة من كشف المستور).**
     **كيفية التصوير:** ابدئي بلقطات سريعة ومُجهِدة ليوم عمل طويل (تكبير على شاشة اللابتوب، صوت نقرات كيبورد سريعة). ثم، انتقال هادئ لك وأنتِ ترتدين [اسم المنتج] وتجلسين باسترخاء. أضيفي موسيقى هادئة ونصاً يقول: 'السر ليس في انتهاء الدوام، بل في ما ترتدينه بعده. [اسم المنتج] مصمم ليمنحك شعور الراحة الذي تستحقينه'."

    الآن، أنشئ الخطة الكاملة لـ 4 أسابيع.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      ...generationConfig,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          week1: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 أفكار محتوى للأسبوع الأول." },
          week2: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 أفكار محتوى للأسبوع الثاني." },
          week3: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 أفكار محتوى للأسبوع الثالث." },
          week4: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 أفكار محتوى للأسبوع الرابع." }
        },
        required: ["week1", "week2", "week3", "week4"]
      }
    },
  });

  const text = response.text.trim();
  try {
    const parsed = JSON.parse(text);
    return parsed as MonthlyPlan;
  } catch (e) {
    console.error("Failed to parse JSON from Gemini response for monthly plan:", text);
    throw new Error("Could not generate monthly plan. The response was not valid JSON.");
  }
}

export async function generateScript(scriptInfo: ScriptGenerationInfo, info: BusinessInfo, scriptType: 'visual' | 'text' | 'both'): Promise<string> {
  const model = 'gemini-2.5-pro';

  let typeInstruction = '';
  switch (scriptType) {
    case 'visual':
      typeInstruction = 'السكربت يجب أن يكون مرئيًا بالكامل. ركز فقط على وصف المشاهد، الحركة، زوايا الكاميرا، والتعبيرات. **لا يجب أن يحتوي السكربت على أي حوار أو تعليق صوتي على الإطلاق.**';
      break;
    case 'text':
      typeInstruction = 'السكربت يجب أن يكون نصيًا بالكامل. ركز فقط على كتابة الحوار أو التعليق الصوتي. **لا تصف أي مشاهد بصرية أو حركات.**';
      break;
    case 'both':
      typeInstruction = 'السكربت يجب أن يكون متوازنًا بين العناصر المرئية والنصية. قدم وصفًا للمشاهد والحركة، بالإضافة إلى أي حوار أو تعليق صوتي ضروري.';
      break;
  }

  const prompt = `
    أنت كاتب سيناريو محترف ومخرج مبدع، متخصص في إنشاء محتوى فيديو قصير يحقق انتشاراً فيروسياً (Reels, TikTok) في مجال الأزياء. لديك فهم عميق للتسويق العصبي (Neuromarketing) وتعرف كيف تترجم الأفكار إلى قصص مرئية مؤثرة باستخدام أدوات بسيطة مثل الهاتف الذكي. يجب أن تكون ردودك باللغة العربية.

    استخدم الدليل التالي كمصدر إلهام لأسلوبك السينمائي:
    ${advancedMarketingGuide}

    ---

    **المهمة:**
    اكتب سيناريو (سكربت) مفصل بناءً على المعلومات القصصية التالية. يجب أن يكون السكربت منظمًا، سهل الفهم، وعمليًا للتصوير بهاتف ذكي.

    **معلومات القصة:**

    **1. لنتعرف على منتجك:**
    - المنتج المحدد: ${scriptInfo.productDefined}
    - الشعور الذي يمنحه: ${scriptInfo.emotionalStory}
    - ملمس المنتج: ${scriptInfo.touchDetails}
    - شكل المنتج وتفاصيله: ${scriptInfo.sightDetails}

    **2. من هو عميلك:**
    - العميل المثالي ونمط حياته: ${scriptInfo.idealCustomerLifestyle}
    - المشكلة التي يحلها المنتج: ${scriptInfo.problemToSolve}

    **3. الهدف من السكربت:**
    - الهدف من الفيديو: ${scriptInfo.videoGoal}
    - النداء النهائي للإجراء (CTA): "${scriptInfo.ctaText}"

    **معلومات العلامة التجارية (لضبط النبرة):**
    - اسم المتجر: ${info.name}
    - الجمهور المستهدف العام: ${info.audience}

    **نوع السكربت المطلوب: ${typeInstruction}**

    **تعليمات كتابة السكربت:**
    1.  **ابنِ قصة:** لا تعرض المنتج فقط، بل اجعله الحل لمشكلة العميل. ابدأ بإظهار "المشكلة" أو "التحدي" الذي يواجهه العميل في حياته اليومية.
    2.  **أظهر التحول:** بيّن كيف أن ارتداء المنتج يغير شعور العميل أو يحل مشكلته، مما ينقله من حالة إلى حالة أفضل.
    3.  **ركز على الحواس:** استخدم التفاصيل الحسية والمرئية التي أعطيت لك لوصف اللقطات بشكل سينمائي. صف ملمس القماش، حركة القطعة، تفاصيل اللون.
    4.  **الهيكل:** نظم السكربت في مشاهد (Scene)، مع وصف للحركة (Action)، الحوار/التعليق الصوتي (Dialogue/Voiceover)، واقتراحات للصوت (Sound).
    5.  **المدة:** اجعل السكربت مناسبًا لمدة فيديو لا تتجاوز 30-45 ثانية.
    6.  **الختام:** يجب أن ينتهي السكربت بالنداء للإجراء (CTA) المحدد.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: generationConfig,
  });

  return response.text.trim();
}

export async function generateScriptFromIdea(idea: string, businessInfo: BusinessInfo, scriptType: 'visual' | 'text' | 'both'): Promise<string> {
  const model = 'gemini-2.5-pro';

  let typeInstruction = '';
  switch (scriptType) {
    case 'visual':
      typeInstruction = 'السكربت يجب أن يكون مرئيًا بالكامل. ركز فقط على وصف المشاهد، الحركة، زوايا الكاميرا، والتعبيرات. **لا يجب أن يحتوي السكربت على أي حوار أو تعليق صوتي على الإطلاق.**';
      break;
    case 'text':
      typeInstruction = 'السكربت يجب أن يكون نصيًا بالكامل. ركز فقط على كتابة الحوار أو التعليق الصوتي. **لا تصف أي مشاهد بصرية أو حركات.**';
      break;
    case 'both':
      typeInstruction = 'السكربت يجب أن يكون متوازنًا بين العناصر المرئية والنصية. قدم وصفًا للمشاهد والحركة، بالإضافة إلى أي حوار أو تعليق صوتي ضروري.';
      break;
  }

  const prompt = `
    أنت كاتب سيناريو محترف ومخرج مبدع، متخصص في تحويل الأفكار التسويقية إلى محتوى فيديو قصير يحقق انتشاراً فيروسياً (Reels, TikTok) في مجال الأزياء.
    مهمتك هي أخذ فكرة تسويقية جاهزة وتحويلها إلى سيناريو (سكربت) مفصل وجاهز للتصوير باستخدام هاتف ذكي.

    استخدم الدليل التالي كمصدر إلهام لأسلوبك السينمائي:
    ${advancedMarketingGuide}

    ---

    **المهمة:**
    اكتب سيناريو (سكربت) مفصل بناءً على الفكرة التسويقية التالية. يجب أن يكون السكربت منظمًا، سهل الفهم، وعمليًا للتصوير بهاتف ذكي.

    **الفكرة التسويقية (المدخلات):**
    ---
    ${idea}
    ---

    **معلومات العلامة التجارية (لضبط النبرة):**
    - اسم المتجر: ${businessInfo.name}
    - الجمهور المستهدف العام: ${businessInfo.audience}

    **نوع السكربت المطلوب: ${typeInstruction}**

    **تعليمات كتابة السكربت:**
    1.  **حلل الفكرة:** استخرج المفهوم الأساسي، الخطاف (Hook)، التصور البصري، ودعوة العمل (CTA) من الفكرة المقدمة.
    2.  **ابنِ قصة مرئية:** حوّل المفهوم إلى قصة قصيرة. لا تكتفِ بسرد الفكرة، بل أظهرها من خلال مشاهد متسلسلة.
    3.  **ابدأ بالخطاف:** تأكد من أن أول 3 ثوانٍ من السكربت تعكس "الخطاف" المذكور في الفكرة لجذب الانتباه فوراً.
    4.  **فصّل المشاهد:** ترجم "التصور البصري" إلى مشاهد محددة (Scenes)، مع وصف للحركة (Action)، والحوار/التعليق الصوتي (Dialogue/Voiceover)، واقتراحات للصوت (Sound).
    5.  **المدة:** اجعل السكربت مناسبًا لمدة فيديو لا تتجاوز 30-45 ثانية.
    6.  **الختام:** يجب أن ينتهي السكربت بدعوة واضحة للعمل (CTA) مستوحاة من الفكرة الأصلية.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: generationConfig,
  });

  return response.text.trim();
}


export async function regenerateScriptWithInstruction(originalScript: string, instruction: string, businessInfo: BusinessInfo, scriptInfo: ScriptGenerationInfo): Promise<string> {
  const model = 'gemini-2.5-pro';
  const prompt = `
    أنت كاتب سيناريو محترف ومخرج مبدع، متخصص في تحسين وتعديل نصوص الفيديو القصير لوسائل التواصل الاجتماعي في مجال الأزياء.
    مهمتك هي أخذ سكربت موجود وتعليمات تعديل من المستخدم، ثم إعادة كتابة السكربت ببراعة لتلبية طلبات المستخدم.

    استخدم الدليل التالي كمصدر إلهام لأسلوبك السينمائي عند التعديل لتعزيز التأثير الفيروسي:
    ${advancedMarketingGuide}
    ---

    **معلومات القصة الأصلية (للسياق):**
    - المنتج: ${scriptInfo.productDefined}
    - الشعور الذي يمنحه: ${scriptInfo.emotionalStory}
    - المشكلة التي يحلها: ${scriptInfo.problemToSolve}
    - العميل المثالي: ${scriptInfo.idealCustomerLifestyle}
    - الهدف من الفيديو: ${scriptInfo.videoGoal}
    - النداء للإجراء: "${scriptInfo.ctaText}"
    
    **معلومات العلامة التجارية الأساسية:**
    - اسم المتجر: ${businessInfo.name}
    - الجمهور المستهدف العام: ${businessInfo.audience}

    **السكربت الأصلي:**
    ---
    ${originalScript}
    ---

    **تعليمات التعديل من المستخدم:**
    "${instruction}"

    **المهمة:**
    أعد كتابة السكربت الأصلي بالكامل مع تطبيق التعديلات المطلوبة في تعليمات المستخدم بدقة. حافظ على هيكل السكربت (مشهد، حركة، حوار، صوت) ولكن قم بتعديل المحتوى بناءً على التعليمات والسياق القصصي الأصلي. يجب أن يكون السكربت الجديد متماسكًا، إبداعيًا، وجاهزًا للتنفيذ.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: generationConfig,
  });

  return response.text.trim();
}

export async function regenerateScriptFromIdeaWithInstruction(originalScript: string, instruction: string, businessInfo: BusinessInfo, originalIdea: string): Promise<string> {
  const model = 'gemini-2.5-pro';
  const prompt = `
    أنت كاتب سيناريو محترف ومخرج مبدع، متخصص في تحسين وتعديل نصوص الفيديو القصير لوسائل التواصل الاجتماعي في مجال الأزياء.
    مهمتك هي أخذ سكربت موجود وتعليمات تعديل من المستخدم، ثم إعادة كتابة السكربت ببراعة لتلبية طلبات المستخدم.

    استخدم الدليل التالي كمصدر إلهام لأسلوبك السينمائي عند التعديل لتعزيز التأثير الفيروسي:
    ${advancedMarketingGuide}
    ---

    **الفكرة التسويقية الأصلية (للسياق):**
    ---
    ${originalIdea}
    ---
    
    **معلومات العلامة التجارية الأساسية:**
    - اسم المتجر: ${businessInfo.name}
    - الجمهور المستهدف العام: ${businessInfo.audience}

    **السكربت الأصلي:**
    ---
    ${originalScript}
    ---

    **تعليمات التعديل من المستخدم:**
    "${instruction}"

    **المهمة:**
    أعد كتابة السكربت الأصلي بالكامل مع تطبيق التعديلات المطلوبة في تعليمات المستخدم بدقة. حافظ على هيكل السكربت (مشهد، حركة، حوار، صوت) ولكن قم بتعديل المحتوى بناءً على التعليمات والسياق القصصي المستوحى من **الفكرة التسويقية الأصلية**. يجب أن يكون السكربت الجديد متماسكًا، إبداعيًا، وجاهزًا للتنفيذ.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: generationConfig,
  });

  return response.text.trim();
}


export async function generateScenarioFromScript(script: string): Promise<Omit<Scene, 'imageUrl' | 'imageLoading' | 'imageError'>[]> {
    const model = 'gemini-2.5-pro';
    const prompt = `
        أنت مخرج فني ومحلل سيناريوهات. مهمتك هي تحليل السيناريو التالي وتقسيمه إلى مشاهد فردية، مع وصف مرئي لكل مشهد وإنشاء موجه (prompt) لتوليد صورة لكل مشهد.
        يجب أن تكون ردودك باللغة العربية.

        السيناريو:
        ---
        ${script}
        ---

        المهمة:
        قم بتحليل السيناريو أعلاه وقم بإخراج مصفوفة من الكائنات (JSON array). كل كائن في المصفوفة يجب أن يمثل مشهدًا واحدًا ويحتوي على الحقول التالية:
        - "sentence": الجملة أو الجزء الرئيسي من النص الذي يصف هذا المشهد.
        - "sceneDescription": وصف مرئي مفصل للمشهد، بما في ذلك الشخصيات، والملابس، والخلفية، والإضاءة، وزاوية الكاميرا.
        - "imagePrompt": موجه (prompt) باللغة الإنجليزية، غني بالتفاصيل ومناسب لتوليد صورة فوتوغرافية واقعية وعالية الجودة باستخدام نموذج تحويل النص إلى صورة. يجب أن يصف الموجه المشهد بدقة. مثال للموجه: "A cinematic, full-body shot of a young woman with long dark hair, wearing a vibrant red silk evening gown, standing on a balcony overlooking a city at twilight. Soft, warm lighting, shallow depth of field, fashion photography style. --ar 9:16"
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            ...generationConfig,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    scenes: {
                        type: Type.ARRAY,
                        description: "مصفوفة من مشاهد السيناريو المقسمة.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                sentence: { type: Type.STRING, description: "الجملة الرئيسية من السكربت للمشهد." },
                                sceneDescription: { type: Type.STRING, description: "وصف تفصيلي للمشهد." },
                                imagePrompt: { type: Type.STRING, description: "موجه باللغة الإنجليزية لتوليد صورة للمشهد." },
                            },
                            required: ["sentence", "sceneDescription", "imagePrompt"],
                        },
                    },
                },
                required: ["scenes"],
            },
        },
    });

    const text = response.text.trim();
    try {
        const parsed = JSON.parse(text);
        return parsed.scenes as Omit<Scene, 'imageUrl' | 'imageLoading' | 'imageError'>[];
    } catch (e) {
        console.error("Failed to parse JSON from Gemini response for scenario generation:", text);
        throw new Error("Could not generate scenario. The response was not valid JSON.");
    }
}

export async function generateImage(prompt: string): Promise<string> {
  const model = 'imagen-4.0-generate-001';
  
  const response = await ai.models.generateImages({
      model,
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '9:16',
      },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } else {
    throw new Error("Image generation failed, no images returned.");
  }
}