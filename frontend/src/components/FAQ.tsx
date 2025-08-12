
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "كيف يمكنني الاشتراك في الدورات؟",
      answer: "يمكنك الاشتراك بسهولة من خلال إنشاء حساب جديد ثم الضغط على زر 'اشترك الآن' وإتمام عملية الدفع."
    },
    {
      question: "هل يمكنني الوصول للدورات بعد الشراء مباشرة؟",
      answer: "نعم، بمجرد إتمام عملية الدفع ستحصل على وصول فوري لجميع الدورات الأربع."
    },
    {
      question: "كم مدة صلاحية الاشتراك؟",
      answer: "الاشتراك صالح لمدة عام كامل من تاريخ الشراء مع إمكانية تجديد الاشتراك."
    },
    {
      question: "هل توجد شهادات إتمام للدورات؟",
      answer: "نعم، ستحصل على شهادة إتمام معتمدة لكل دورة بعد انتهائها بنجاح."
    },
    {
      question: "هل يمكنني مشاهدة الدروس أكثر من مرة؟",
      answer: "بالطبع، يمكنك مشاهدة جميع الدروس عدد غير محدود من المرات خلال فترة الاشتراك."
    },
    {
      question: "كيف يمكنني التواصل مع الدعم الفني؟",
      answer: "يمكنك التواصل معنا عبر البريد الإلكتروني أو واتساب المتاح على الموقع وسنرد عليك في أقرب وقت."
    }
  ];

  return (
    <section id="faq" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight">
            الأسئلة الشائعة
          </h2>
          <div className="w-40 h-1.5 mx-auto mb-8 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-transparent rounded-full"></div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            إجابات على أكثر الأسئلة شيوعاً من طلابنا
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm border px-6"
              >
                <AccordionTrigger 
                  className="text-right text-2xl font-semibold hover:no-underline py-6"
                  style={{ color: '#1e3a5f' }}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-right text-lg  pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
