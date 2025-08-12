import React from 'react';
import { Heart } from 'lucide-react';

export default function Hadith() {
  return (
    <>
      <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight text-center pt-5">
        ❤️ في النهاية ❤️
      </h2>

      <div className="w-40 h-1.5 mx-auto mb-8 bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-transparent rounded-full"></div>

      <div className="flex items-center justify-center p-10">
        <div className="shadow-2xl rounded-2xl p-8 max-w-xl w-full border border-blue-600">
          <h1 className="text-2xl md:text-3xl text-center font-bold bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-blue-400 bg-clip-text text-transparent mb-6">
            خرج علينا رسولُ اللهِ صلَّى اللهُ عليه وسلَّم فقال:
          </h1>

          <p className="text-lg md:text-xl text-[#1e3a5f] leading-relaxed text-center mb-4">
            "أبشِروا، أبشِروا! أليس تشهَدونَ أنْ لا إلهَ إلَّا اللهُ، وأنِّي رسولُ اللهِ؟" قالوا: نعم. قال:
            "فإنَّ هذا القرآنَ سببٌ، طرَفُه بيدِ اللهِ، وطرَفُه بأيديكم، فتمسَّكوا به، فإنَّكم لنْ تضلُّوا ولن تهلِكوا بعدَه أبدًا."
          </p>

          <p className="text-center bg-gradient-to-r from-[#1e3a5f] via-blue-600 to-blue-400 bg-clip-text text-transparent font-medium">
            - إسناده حسن على شرط مسلم
          </p>
        </div>
      </div>
    </>
  );
}
