import { GoogleGenAI } from "@google/genai";

const familyTreeData = `
- Hussain
  - Ali
    - Mohammed
      - Ibrahim (Red Lineage)
        - Mohammed
          - Abdullah
          - Ibrahim
          - Yousef
          - Ahmed
          - Fahad
          - Khalid
        - Ali
          - Nasser
          - Mohammed
          - Saleh
          - Ibrahim
      - Mansour (Green Lineage)
        - Mohammed
          - Nasser
          - Yousef
          - Ibrahim
          - Ali
        - Ali
          - Saleh
          - Ibrahim
          - Abdullah
          - Nasser
          - Abdulaziz
          - Abdulrahman
      - Abdullah (Leads to the main Blue Lineage)
        - Ali (also known as Jarees)
          - Saleh
            - Mohammed
              - Ziyad
              - Abdulmajeed
              - Sulaiman
              - Abdulilah
              - Saleh
              - Abdullah
              - Waleed
              - Badr
            - Abdulrahman
            - Abdullah
            - Abdulaziz
          - Mohammed
            - Sulaiman
            - Yousef
            - Khalid
            - Ali
            - Othman
        - Abdulaziz
          - Abdullah
            - Mohammed
            - Yousef
            - Saleh
            - Abdulrahman
            - Sulaiman
            - Ali
            - Ibrahim
          - Saleh
            - Abdullah
            - Abdulaziz
            - Sulaiman
            - Mohammed
            - Yousef
            - Fahad
            - Abdulrahman
            - Ahmed
            - Khalid
            - Saad
        - Yousef
          - Mohammed
          - Abdullah
          - Osama
          - Essam
          - Faris
          - Hussam
          - Iyad
        - Khalid
          - Abdullah
          - Mohammed
        - Mohammed
          - Abdullah
          - Sulaiman
        - Tariq
          - Abdullah
          - Yousef
          - Ahmed
          - Wael
        - Thamer
          - Abdullah
        - Abdulrahman
          - Sulaiman
            - Abdullah
            - Mohammed
            - Ibrahim
            - Yousef
            - Ayoub
            - Mohannad
            - Faisal
            - Abdulsalam
            - Omar
            - Saleh
            - Adi
            - Malik
            - Monther
            - Asim
`;


export const getRelationship = async (query: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    أنت خبير أنساب دقيق ومفصل ومهمتك هي تحليل شجرة عائلة العريني المقدمة لك فقط.

    **بيانات شجرة العائلة (الهيكل الهرمي):**
    ---
    ${familyTreeData}
    ---

    **قواعد صارمة يجب اتباعها:**
    1.  **الأسماء غير الموجودة:** إذا كان اسم واحد أو أكثر من الأسماء في السؤال غير موجودين في البيانات، يجب أن تكون إجابتك الوحيدة هي: "لا أعلم، لم أتمكن من العثور على أحد الأسماء أو كليهما في شجرة العائلة."
    2.  **استراتيجية البحث والتحقق الصارمة:**
        أ. **أولوية المطابقة الدقيقة:** إذا قدم المستخدم اسمًا متعدد الأجزاء (مثل "عبدالله بن طارق"), فإن أولويتك القصوى هي العثور على هذا الشخص المحدد الذي يتطابق مع هذا النسب بالضبط.
        ب. **التحقق من النسب:** قبل الإجابة، تحقق داخليًا من صحة النسب. ابحث عن الأب ("طارق") وتأكد من أن لديه ابنًا اسمه ("عبدالله"). تتبع النسب إلى الأعلى (الأب، ثم الجد) للتأكد من أنك حددت الشخص الصحيح.
        ج. **التعامل مع الغموض (أهم قاعدة):** إذا كان الاسم الوارد في السؤال (سواء كان اسمًا واحدًا أو جزءًا من اسم متعدد الأجزاء) لا يمكن مطابقته بدقة ويحتمل أن يشير إلى عدة أشخاص، فيجب عليك عدم اختيار واحد منهم بشكل عشوائي. بدلاً من ذلك، قم بإدراج جميع الاحتمالات بوضوح للمستخدم ليختار منها.
            - مثال للرد في حالة الغموض: "يوجد أكثر من شخص بهذا الاسم. الرجاء تحديد من تقصد:
              - إذا كنت تقصد **محمد بن إبراهيم** و **صالح بن علي**، فإن صلة القرابة هي [...].
              - إذا كنت تقصد **محمد بن منصور** و **صالح بن عبد العزيز**، فإن صلة القرابة هي [...]."
            - استخدم دائمًا اسم الأب (والجد إن أمكن) لتوضيح أي شخص تقصده.
    3.  **تنسيق الإجابة الإلزامي (للعلاقات الثنائية):** إذا كان السؤال عن شخصين فقط، يجب أن تتبع إجابتك هذا التنسيق المكون من جزأين بدقة:
        - **السطر الأول:** ابدأ بـ "صلة القرابة:" ثم صف العلاقة بكلمة أو كلمتين (مثال: "أب وابنه" أو "أبناء عمومة").
        - **السطر الثاني:** ابدأ بـ "الاستنتاج:" ثم اشرح كيف توصلت إلى هذه العلاقة عن طريق تتبع النسب بوضوح. (مثال: "لأن كليهما أبناء لـ [اسم الأب] بن [اسم الجد]").
    4.  **الاستعلامات المرنة ومتعددة الأشخاص:** إذا كان السؤال يتضمن أكثر من شخصين أو كان بصيغة طبيعية أكثر، قم بتحليل جميع العلاقات المطلوبة وقدم إجابة مفصلة ومنظمة. استخدم قائمة نقطية لتوضيح كل علاقة على حدة.
        - مثال لسؤال: "ما هي علاقة صالح بن علي بكل من محمد بن إبراهيم وناصر بن علي؟"
        - مثال للرد:
          - **صالح بن علي ومحمد بن إبراهيم:** هما أبناء عمومة من الدرجة الثانية. (مع شرح الاستنتاج)
          - **صالح بن علي وناصر بن علي:** هما أخوان. (مع شرح الاستنتاج)
    5.  **العلاقات البعيدة وإيجاد الرابط المشترك:** إذا كان كلا الاسمين موجودين ولكن لا توجد علاقة قرابة مباشرة وواضحة (مثل أخ, ابن عم مباشر), فلا تقل "لا توجد علاقة". بدلاً من ذلك, مهمتك هي البحث عن أقرب سلف مشترك (جد) يربط بينهما. يجب أن تذكر من هو هذا السلف المشترك وتشرح كيف ينحدر كل شخص منه.

    **سؤال المستخدم:**
    "${query}"

    قم بتحليل السؤال بناءً على القواعد الصارمة والبيانات المقدمة وقدم إجابتك.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching relationship from Gemini API:", error);
    if (error instanceof Error) {
        return `حدث خطأ أثناء معالجة طلبك: ${error.message}`;
    }
    return "حدث خطأ غير متوقع أثناء معالجة طلبك.";
  }
};
