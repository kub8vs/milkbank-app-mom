import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Stethoscope, Beaker, User, ArrowRight, Lock } from "lucide-react";

const MEDICAL_QUESTIONS = [
  "Czy choruje Pani lub jest nosicielem wirusa HIV, HBV lub HCV?",
  "Czy w ciągu ostatnich 12 miesięcy chorowała Pani na kiłę?",
  "Czy w ciągu ostatnich 6 miesięcy chorowała Pani na gruźlicę?",
  "Czy obecnie przechodzi Pani jakąkolwiek infekcję z gorączką?",
  "Czy w ciągu ostatnich 2 tygodni miała Pani objawy opryszczki na piersiach?",
  "Czy w ciągu ostatnich 6 miesięcy wykonywała Pani tatuaż lub piercing?",
  "Czy w ciągu ostatnich 6 miesięcy przechodziła Pani zabieg akupunktury?",
  "Czy w ciągu ostatnich 12 miesięcy miała Pani przetaczaną krew?",
  "Czy w ciągu ostatnich 12 miesięcy przechodziła Pani operację?",
  "Czy pali Pani papierosy lub stosuje produkty z nikotyną?",
  "Czy spożywa Pani regularnie alkohol?",
  "Czy stosuje Pani jakiekolwiek środki odurzające?",
  "Czy spożywa Pani więcej niż 3 filiżanki kawy dziennie?",
  "Czy przyjmuje Pani na stałe leki (np. przeciwdepresyjne)?",
  "Czy w ciągu ostatnich 7 dni przyjmowała Pani antybiotyk?",
  "Czy stosuje Pani leki przeciwbólowe (np. Ibuprofen, Aspiryna)?",
  "Czy stosuje Pani dietę wegańską bez suplementacji B12?",
  "Czy w otoczeniu ktoś choruje na chorobę zakaźną?",
  "Czy przebywała Pani w UK łącznie powyżej 6 msc w latach 1980-96?",
  "Czy podróżowała Pani do krajów tropikalnych w ciągu 6 msc?",
  "Czy Pani własne dziecko rozwija się prawidłowo?",
  "Czy Pani dziecko ukończyło już 6. miesiąc życia?",
  "Czy używa Pani sterylnego laktatora?",
  "Czy wyraża Pani zgodę na bezpłatne badania krwi?",
  "Czy wyraża Pani zgodę na badanie bakteriologiczne mleka?"
];

const MedicalSurvey = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState<"personal" | "questions" | "summary">("personal");
  const [personalData, setPersonalData] = useState({ imie: "", nazwisko: "", pesel: "" });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (personalData.imie && personalData.nazwisko && personalData.pesel.length === 11) {
      setStage("questions");
    } else {
      alert("Proszę podać poprawne dane (PESEL musi mieć 11 cyfr)");
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    if (currentQuestion < MEDICAL_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAllData(newAnswers);
    }
  };

  const submitAllData = async (finalAnswers: any) => {
    try {
      await fetch('http://192.168.1.86:3000/api/zapisz-ankiete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          matka_id: 1, 
          ...personalData,
          odpowiedzi: finalAnswers 
        })
      });
      setStage("summary");
    } catch (e) {
      console.error(e);
      setStage("summary");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          
          {/* ETAP 1: DANE OSOBOWE */}
          {stage === "personal" && (
            <motion.div key="p" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-pink-600">
                  <User size={32} />
                </div>
                <h2 className="text-2xl font-black">Witaj w Banku Mleka</h2>
                <p className="text-slate-500">Zanim zaczniemy, potrzebujemy Twoich danych do dokumentacji medycznej.</p>
              </div>

              <form onSubmit={handlePersonalSubmit} className="space-y-4">
                <input 
                  type="text" placeholder="Imię" required
                  className="w-full p-4 rounded-2xl bg-slate-100 border-none focus:ring-2 ring-pink-500"
                  value={personalData.imie} onChange={e => setPersonalData({...personalData, imie: e.target.value})}
                />
                <input 
                  type="text" placeholder="Nazwisko" required
                  className="w-full p-4 rounded-2xl bg-slate-100 border-none focus:ring-2 ring-pink-500"
                  value={personalData.nazwisko} onChange={e => setPersonalData({...personalData, nazwisko: e.target.value})}
                />
                <input 
                  type="number" placeholder="PESEL" required
                  className="w-full p-4 rounded-2xl bg-slate-100 border-none focus:ring-2 ring-pink-500"
                  value={personalData.pesel} onChange={e => setPersonalData({...personalData, pesel: e.target.value})}
                />
                <button type="submit" className="w-full py-4 bg-pink-500 text-white rounded-3xl font-bold flex items-center justify-center gap-2">
                  Przejdź do ankiety <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {/* ETAP 2: 25 PYTAŃ */}
          {stage === "questions" && (
            <motion.div key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-pink-500 h-full transition-all" style={{ width: `${(currentQuestion / MEDICAL_QUESTIONS.length) * 100}%` }} />
              </div>
              <div className="text-center space-y-6">
                <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">Pytanie {currentQuestion + 1} z {MEDICAL_QUESTIONS.length}</span>
                <h3 className="text-2xl font-bold leading-tight">{MEDICAL_QUESTIONS[currentQuestion]}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleAnswer("TAK")} className="py-8 rounded-3xl border-2 border-slate-200 font-black text-xl hover:border-pink-500 hover:bg-pink-50">TAK</button>
                  <button onClick={() => handleAnswer("NIE")} className="py-8 rounded-3xl border-2 border-slate-200 font-black text-xl hover:border-pink-500 hover:bg-pink-50">NIE</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ETAP 3: PODSUMOWANIE */}
          {stage === "summary" && (
            <motion.div key="s" className="text-center space-y-6">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-green-600">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-2xl font-black">Dane zapisane bezpiecznie</h2>
              <div className="bg-amber-50 p-6 rounded-3xl text-left space-y-4 border border-amber-100">
                <div className="flex gap-2 text-amber-700 font-bold"><Lock size={18}/> Procedura medyczna:</div>
                <p className="text-sm text-amber-800">Twoje zgłoszenie zostało przesłane do kliniki. **Konieczna jest wizyta na badanie krwi**. Skontaktujemy się z Tobą telefonicznie.</p>
              </div>
              <button onClick={onComplete} className="w-full py-4 bg-slate-900 text-white rounded-3xl font-bold">Zakończ i wejdź do aplikacji</button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default MedicalSurvey;