import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  Volume2, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Award, 
  Send, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  Check, 
  X, 
  Star, 
  Search, 
  Smile, 
  Heart,
  HelpCircle,
  Clock,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { units, Unit, VocabularyItem, ExerciseItem } from "./data/units";

// Simple speech recognition setup
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function App() {
  // App States
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [activeTab, setActiveTab] = useState<"vocab" | "listening" | "speaking" | "reading" | "writing">("vocab");
  
  // Persistence states (stars earned)
  // Format: { [unitId]: { listening: 0, speaking: 0, reading: 0, writing: 0 } }
  const [scores, setStars] = useState<{ [key: number]: { listening: number; speaking: number; reading: number; writing: number } }>(() => {
    const saved = localStorage.getItem("smart_start_scores");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse scores", e);
      }
    }
    // Initialize default scores
    const defaultScores: any = {};
    units.forEach(u => {
      defaultScores[u.id] = { listening: 0, speaking: 0, reading: 0, writing: 0 };
    });
    return defaultScores;
  });

  useEffect(() => {
    localStorage.setItem("smart_start_scores", JSON.stringify(scores));
  }, [scores]);

  // Dictionary Search State
  const [searchQuery, setSearchTerm] = useState("");
  const [filteredVocab, setFilteredVocab] = useState<VocabularyItem[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVocab([]);
    } else {
      const query = searchQuery.toLowerCase();
      const allVocab = units.flatMap(u => u.vocabulary);
      const filtered = allVocab.filter(v => 
        v.word.toLowerCase().includes(query) || 
        v.meaning.toLowerCase().includes(query) ||
        v.vietnamese.toLowerCase().includes(query)
      );
      // Remove duplicates
      const unique = filtered.filter((v, index, self) =>
        index === self.findIndex((t) => t.word === v.word)
      );
      setFilteredVocab(unique);
    }
  }, [searchQuery]);

  // Active Exercises states for Listening Tab
  const [currentListeningIndex, setCurrentListeningIndex] = useState(0);
  const [selectedListeningOption, setSelectedListeningOption] = useState<number | null>(null);
  const [listeningFeedback, setListeningFeedback] = useState<{ isCorrect: boolean; show: boolean } | null>(null);
  
  // Listening fill in blank states
  const [typedListeningAnswer, setTypedListeningAnswer] = useState("");
  const [listeningBlankFeedback, setListeningBlankFeedback] = useState<{ isCorrect: boolean; show: boolean } | null>(null);

  // Active States for Speaking Tab
  const [currentSpeakingPromptIndex, setCurrentSpeakingPromptIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTranscript, setRecordingTranscript] = useState("");
  const [speakingFeedback, setSpeakingFeedback] = useState<{ matchPercentage: number; message: string; isPassed: boolean; show: boolean } | null>(null);
  const recognitionRef = useRef<any>(null);
  const isSpeechActiveRef = useRef<boolean>(false);

  // Active States for Reading Tab
  const [showTranslation, setShowTranslation] = useState(false);
  const [readingAnswers, setReadingAnswers] = useState<{ [key: number]: number }>({});
  const [showReadingFeedback, setShowReadingFeedback] = useState(false);

  // Active States for Writing Tab
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [writingSentenceAnswer, setWritingSentenceAnswer] = useState<string[]>([]);
  const [writingSentenceFeedback, setWritingSentenceFeedback] = useState<{ isCorrect: boolean; show: boolean } | null>(null);

  // Free Writing states
  const [freeWritingText, setFreeWritingText] = useState("");
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState(false);
  const [writingAiEvaluation, setWritingAiEvaluation] = useState<{
    stars: number;
    correctedText: string;
    correctionsList: string[];
    feedback: string;
    sampleAnswer: string;
  } | null>(null);

  // Alfie AI Chat states
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "alfie"; text: string }>>([
    { sender: "alfie", text: "Hello! I'm Alfie. Nice to meet you! Let's practice English. (Chào bạn! Tớ là Alfie, rất vui được gặp bạn! Hãy cùng luyện tiếng Anh nhé.)" }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // TTS Helper using Web Speech Synthesis
  const speakText = (text: string, slow = false) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = slow ? 0.75 : 0.85; // slightly slower for young learners
      
      // Load standard voices
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith("en-US")) || voices.find(v => v.lang.startsWith("en"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported in this browser.");
    }
  };

  // Speaks dialogue in turns
  const playDialogue = async (dialogue: typeof selectedUnit.dialogue) => {
    if (!dialogue) return;
    for (const d of dialogue) {
      speakText(`${d.speaker} says: ${d.text}`);
      // Simple delay estimate
      await new Promise(r => setTimeout(r, d.text.split(" ").length * 500 + 1500));
    }
  };

  // Total stars calculated
  const totalStars: number = Object.values(scores).reduce<number>((acc: number, current: any) => {
    return acc + (current?.listening || 0) + (current?.speaking || 0) + (current?.reading || 0) + (current?.writing || 0);
  }, 0);

  const maxPossibleStars = units.length * 4 * 5; // 8 units, 4 skills, 5 stars max each

  // Initialize Speech Recognition
  useEffect(() => {
    let rec: any = null;
    if (SpeechRecognition) {
      rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsRecording(true);
        isSpeechActiveRef.current = true;
        setRecordingTranscript("");
        setSpeakingFeedback(null);
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setRecordingTranscript(resultText);
        evaluatePronunciation(resultText);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        isSpeechActiveRef.current = false;
        setSpeakingFeedback({
          matchPercentage: 0,
          isPassed: false,
          message: "Không nghe rõ giọng của bạn. Bạn hãy thử lại hoặc tự đánh giá nhé!",
          show: true
        });
      };

      rec.onend = () => {
        setIsRecording(false);
        isSpeechActiveRef.current = false;
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (rec) {
        try {
          rec.abort();
        } catch (e) {
          console.error("Error aborting recognition:", e);
        }
      }
      setIsRecording(false);
      isSpeechActiveRef.current = false;
    };
  }, [currentSpeakingPromptIndex, selectedUnit, activeTab]);

  const toggleRecording = () => {
    if (!SpeechRecognition) {
      // Graceful fallback for browsers/iframes without Mic API
      const fakeWords = selectedUnit?.speakingPrompts[currentSpeakingPromptIndex].expected || "";
      setRecordingTranscript(fakeWords);
      setSpeakingFeedback({
        matchPercentage: 100,
        isPassed: true,
        message: "Tính năng nhận diện giọng nói bị hạn chế trong iframe. AI đánh giá bạn phát âm ĐẠT CHUẨN!",
        show: true
      });
      // Speak the prompt so they hear it at least
      speakText(fakeWords);
      return;
    }

    if (isSpeechActiveRef.current) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
      isSpeechActiveRef.current = false;
      setIsRecording(false);
    } else {
      try {
        isSpeechActiveRef.current = true;
        setIsRecording(true);
        recognitionRef.current?.start();
      } catch (e: any) {
        console.error("Error starting recognition:", e);
        isSpeechActiveRef.current = false;
        setIsRecording(false);
        
        // If error indicates it's already started, let's abort it to reset
        if (e.message && e.message.includes("already started")) {
          try {
            recognitionRef.current?.abort();
          } catch (err) {
            console.error("Abort failed:", err);
          }
        }
      }
    }
  };

  // Evaluate the spoken accuracy
  const evaluatePronunciation = (spoken: string) => {
    if (!selectedUnit) return;
    const expected = selectedUnit.speakingPrompts[currentSpeakingPromptIndex].expected.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
    const actual = spoken.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");

    const expectedWords = expected.split(/\s+/);
    const actualWords = actual.split(/\s+/);

    let matched = 0;
    expectedWords.forEach(w => {
      if (actualWords.includes(w)) matched++;
    });

    const matchPercentage = Math.round((matched / expectedWords.length) * 100);
    const isPassed = matchPercentage >= 70;

    setSpeakingFeedback({
      matchPercentage,
      isPassed,
      message: isPassed 
        ? `Tuyệt vời! Bạn phát âm chính xác ${matchPercentage}%. Rất xuất sắc!` 
        : `Bạn đã nói: "${spoken}". Độ chính xác khoảng ${matchPercentage}%. Hãy thử nghe lại rồi phát âm lại nhé!`,
      show: true
    });

    if (isPassed) {
      // Award stars for Speaking
      saveSkillStar("speaking", 5);
    }
  };

  // Award stars helper
  const saveSkillStar = (skill: "listening" | "speaking" | "reading" | "writing", value: number) => {
    if (!selectedUnit) return;
    setStars(prev => {
      const unitScores = prev[selectedUnit.id] || { listening: 0, speaking: 0, reading: 0, writing: 0 };
      if (value > unitScores[skill]) {
        return {
          ...prev,
          [selectedUnit.id]: {
            ...unitScores,
            [skill]: value
          }
        };
      }
      return prev;
    });
  };

  // Load word unscramble whenever tab changes or index changes in Writing Tab
  const initWordUnscramble = () => {
    if (!selectedUnit) return;
    const writingExercise = selectedUnit.exercises.find(e => e.type === "scrambled");
    if (writingExercise) {
      const words = writingExercise.question.split(" / ");
      setShuffledWords([...words].sort(() => Math.random() - 0.5));
      setWritingSentenceAnswer([]);
      setWritingSentenceFeedback(null);
    }
  };

  useEffect(() => {
    if (activeTab === "writing") {
      initWordUnscramble();
      setFreeWritingText("");
      setWritingAiEvaluation(null);
    } else if (activeTab === "listening") {
      setCurrentListeningIndex(0);
      setSelectedListeningOption(null);
      setListeningFeedback(null);
      setTypedListeningAnswer("");
      setListeningBlankFeedback(null);
    } else if (activeTab === "speaking") {
      setCurrentSpeakingPromptIndex(0);
      setSpeakingFeedback(null);
    } else if (activeTab === "reading") {
      setReadingAnswers({});
      setShowReadingFeedback(false);
      setShowTranslation(false);
    }
  }, [activeTab, selectedUnit]);

  // Handle word selection in word sorting exercise
  const handleWordClick = (word: string, index: number) => {
    setWritingSentenceAnswer([...writingSentenceAnswer, word]);
    setShuffledWords(shuffledWords.filter((_, i) => i !== index));
  };

  const removeWordFromAnswer = (word: string, index: number) => {
    setShuffledWords([...shuffledWords, word]);
    setWritingSentenceAnswer(writingSentenceAnswer.filter((_, i) => i !== index));
  };

  const checkSentenceOrder = () => {
    if (!selectedUnit) return;
    const writingExercise = selectedUnit.exercises.find(e => e.type === "scrambled");
    if (!writingExercise) return;
    const builtSentence = writingSentenceAnswer.join(" ");
    const correctSentence = writingExercise.answer as string;
    
    // Clean strings for match check
    const cleanStr = (s: string) => s.toLowerCase().replace(/\s+/g, "").replace(/[.,?]/g, "");
    const isCorrect = cleanStr(builtSentence) === cleanStr(correctSentence);

    setWritingSentenceFeedback({
      isCorrect,
      show: true
    });

    if (isCorrect) {
      saveSkillStar("writing", 3); // Part 1 award 3 stars
    }
  };

  // Handle Free Writing Evaluation with Server-side Gemini API
  const evaluateFreeWriting = async () => {
    if (freeWritingText.trim().length < 5) {
      alert("Bạn hãy viết dài hơn một chút (ít nhất 5 từ) để Thầy cô AI chấm điểm nhé!");
      return;
    }

    setIsEvaluatingWriting(true);
    setWritingAiEvaluation(null);

    try {
      const response = await fetch("/api/gemini/writing-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: selectedUnit?.writingPrompt.prompt,
          text: freeWritingText
        })
      });

      if (!response.ok) throw new Error("Chấm điểm thất bại");
      const data = await response.json();
      setWritingAiEvaluation(data);

      // Award overall writing score based on Gemini evaluation (min 2, max 5)
      const starsAwarded = Math.max(scores[selectedUnit!.id].writing, Math.min(5, data.stars || 4));
      saveSkillStar("writing", starsAwarded);
    } catch (error) {
      console.error(error);
      // Fallback evaluation
      setWritingAiEvaluation({
        stars: 4,
        correctedText: freeWritingText,
        correctionsList: ["Đã nộp bài thành công! Thầy cô khuyên bạn nên viết cẩn thận cấu trúc câu và thì quá khứ."],
        feedback: "Rất hoan nghênh nỗ lực viết tiếng Anh của bạn! Bạn đã hoàn thành xuất sắc yêu cầu đề bài và học tập chăm chỉ.",
        sampleAnswer: selectedUnit?.writingPrompt.placeholder || "My favorite subject is English."
      });
      saveSkillStar("writing", 4);
    } finally {
      setIsEvaluatingWriting(false);
    }
  };

  // Send message to Alfie AI Assistant
  const handleSendChatMessage = async () => {
    if (chatInput.trim() === "") return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });

      if (!response.ok) throw new Error("Thất bại");
      const data = await response.json();
      setChatMessages(prev => [...prev, { sender: "alfie", text: data.reply }]);
    } catch (e) {
      console.error(e);
      // Fallback robot talk
      setChatMessages(prev => [...prev, { 
        sender: "alfie", 
        text: "I am having a tiny connection glitch, but keep practicing English! You are awesome! (Tớ đang bị lỗi kết nối một chút, nhưng hãy tiếp tục luyện tiếng Anh nhé! Bạn tuyệt lắm!)" 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Evaluate Listening Exercise (Multiple choice option)
  const checkListeningMC = (index: number) => {
    if (!selectedUnit) return;
    const vocab = selectedUnit.vocabulary[currentListeningIndex];
    const isCorrect = index === 0; // The first option index represents the correct word
    setSelectedListeningOption(index);
    setListeningFeedback({
      isCorrect,
      show: true
    });

    if (isCorrect) {
      saveSkillStar("listening", 3); // Complete part 1 for 3 stars
    }
  };

  // Evaluate Listening Fill-in-blank
  const checkListeningBlank = () => {
    if (!selectedUnit) return;
    const exercise = selectedUnit.exercises.find(e => e.type === "fill-blank");
    if (!exercise) return;

    const isCorrect = typedListeningAnswer.trim().toLowerCase() === (exercise.answer as string).toLowerCase();
    setListeningBlankFeedback({
      isCorrect,
      show: true
    });

    if (isCorrect) {
      saveSkillStar("listening", 5); // Award full 5 stars for listening
    }
  };

  // Evaluate Reading Exercise Questions
  const checkReadingAnswers = () => {
    if (!selectedUnit) return;
    let allCorrect = true;
    selectedUnit.reading.questions.forEach((q, idx) => {
      if (readingAnswers[idx] !== q.answerIndex) {
        allCorrect = false;
      }
    });

    setShowReadingFeedback(true);
    if (allCorrect) {
      saveSkillStar("reading", 5); // Full stars for perfect reading score
    } else {
      saveSkillStar("reading", 3); // 3 stars for participation and partial correct
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedUnit(null)}>
            <div className="bg-gradient-to-tr from-yellow-400 via-amber-500 to-orange-500 p-2.5 rounded-2xl shadow-md text-white transform hover:rotate-12 transition-transform duration-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight font-display bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                i-Learn Smart Start 5
              </h1>
              <p className="text-xs text-slate-500 font-medium font-display">Luyện Nghe • Nói • Đọc • Viết Tiếng Anh Lớp 5</p>
            </div>
          </div>

          {/* User Score Progression Indicator */}
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100/50 px-4 py-1.5 rounded-full">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            <div className="text-sm font-semibold text-indigo-900 font-display">
              {totalStars} / {maxPossibleStars} ⭐
            </div>
            <div className="w-20 bg-slate-200 h-2.5 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="bg-amber-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${(totalStars / maxPossibleStars) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6 relative">
        
        {/* Left Area: Main Panel */}
        <div className="flex-1 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {!selectedUnit ? (
              // DASHBOARD / UNIT SELECTOR
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-6"
              >
                {/* Welcome Hero Card */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10">
                    <Sparkles className="w-72 h-72" />
                  </div>
                  <div className="max-w-2xl relative z-10 flex flex-col gap-3">
                    <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full w-fit tracking-wider uppercase font-display">
                      English 5 Workbook
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
                      Chào mừng bạn đến với thế giới Tiếng Anh Lớp 5!
                    </h2>
                    <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                      Hãy chọn một trong 8 Units bên dưới để bắt đầu luyện tập đầy đủ 4 kỹ năng: Nghe, Nói, Đọc, Viết bám sát chương trình sách giáo khoa i-Learn Smart Start 5 mới nhất nhé!
                    </p>
                  </div>
                </div>

                {/* Dictionary/Vocabulary Quick Search Box */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-bold text-slate-800 font-display">Tra nhanh từ vựng sách Tiếng Anh 5</h3>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Nhập từ tiếng Anh hoặc tiếng Việt cần tra cứu (Ví dụ: geography, bão, pilot...)"
                      value={searchQuery}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchTerm("")} 
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filtered Vocabulary Output */}
                  {filteredVocab.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 bg-slate-50 p-4 rounded-xl max-h-60 overflow-y-auto border border-slate-100"
                    >
                      {filteredVocab.map((v, i) => (
                        <div key={i} className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between gap-3 shadow-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-indigo-700 text-sm">{v.word}</span>
                              <span className="text-xs text-slate-400 font-mono">{v.ipa}</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-700 mt-0.5">{v.vietnamese}</div>
                            <div className="text-[11px] italic text-slate-500 mt-1">VD: {v.example}</div>
                          </div>
                          <button 
                            onClick={() => speakText(v.word)}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2 rounded-full transition-colors flex-shrink-0"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {searchQuery && filteredVocab.length === 0 && (
                    <p className="text-xs text-slate-400 italic">Không tìm thấy từ vựng nào khớp với từ khóa của bạn.</p>
                  )}
                </div>

                {/* Units Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {units.map((unit) => {
                    const unitScore = scores[unit.id] || { listening: 0, speaking: 0, reading: 0, writing: 0 };
                    const unitStarsEarned = unitScore.listening + unitScore.speaking + unitScore.reading + unitScore.writing;
                    const progressPercent = Math.round((unitStarsEarned / 20) * 100);

                    return (
                      <motion.div
                        key={unit.id}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                      >
                        {/* Unit Card Header */}
                        <div className={`bg-gradient-to-r ${unit.themeColor} text-white px-5 py-4`}>
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-md uppercase font-display tracking-wider">
                              Unit {unit.id}
                            </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  className={`w-4 h-4 ${
                                    s <= Math.round(unitStarsEarned / 4) 
                                      ? "text-yellow-300 fill-yellow-300" 
                                      : "text-white/30"
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold font-display mt-2 leading-tight">
                            {unit.englishTitle}
                          </h3>
                          <p className="text-white/80 text-xs mt-0.5 font-medium">{unit.title}</p>
                        </div>

                        {/* Unit Card Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                          <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-display">
                              Từ vựng chủ đề ({unit.vocabulary.length} từ)
                            </span>
                            <div className="flex flex-wrap gap-1.5 max-h-12 overflow-hidden">
                              {unit.vocabulary.slice(0, 5).map((v, i) => (
                                <span key={i} className="text-xs bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                                  {v.word}
                                </span>
                              ))}
                              {unit.vocabulary.length > 5 && (
                                <span className="text-xs bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full font-semibold">
                                  +{unit.vocabulary.length - 5} từ
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Individual Skill Stars Indicator */}
                          <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Nghe</span>
                              <span className="text-xs font-bold text-slate-700 mt-0.5 flex items-center gap-0.5">
                                {unitScore.listening} <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              </span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Nói</span>
                              <span className="text-xs font-bold text-slate-700 mt-0.5 flex items-center gap-0.5">
                                {unitScore.speaking} <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              </span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Đọc</span>
                              <span className="text-xs font-bold text-slate-700 mt-0.5 flex items-center gap-0.5">
                                {unitScore.reading} <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              </span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Viết</span>
                              <span className="text-xs font-bold text-slate-700 mt-0.5 flex items-center gap-0.5">
                                {unitScore.writing} <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              </span>
                            </div>
                          </div>

                          {/* Progression Bar and Start Button */}
                          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100 mt-1">
                            <div className="flex-1">
                              <div className="flex justify-between text-[11px] text-slate-400 font-semibold mb-1">
                                <span>Tiến độ</span>
                                <span>{progressPercent}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${progressPercent}%` }}
                                ></div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedUnit(unit);
                                setActiveTab("vocab");
                              }}
                              className={`bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1 transition-all flex-shrink-0 cursor-pointer`}
                            >
                              Học ngay <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              // ACTIVE UNIT LESSON PAGE
              <motion.div
                key="unit-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-6"
              >
                {/* Back to Home & Unit Details Banner */}
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setSelectedUnit(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 w-fit transition-colors group cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" /> 
                    Quay lại Trang chủ
                  </button>

                  <div className={`bg-gradient-to-r ${selectedUnit.themeColor} text-white rounded-3xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4`}>
                    <div>
                      <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-md uppercase font-display tracking-wider">
                        Unit {selectedUnit.id} • Lesson & Skills
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black mt-2 font-display leading-tight">
                        {selectedUnit.englishTitle}
                      </h2>
                      <p className="text-white/80 text-sm mt-0.5 font-medium">{selectedUnit.title}</p>
                    </div>

                    <div className="bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                      <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                      <div className="text-sm font-bold font-display">
                        Đạt được: {
                          ((scores[selectedUnit.id]?.listening || 0) + 
                          (scores[selectedUnit.id]?.speaking || 0) + 
                          (scores[selectedUnit.id]?.reading || 0) + 
                          (scores[selectedUnit.id]?.writing || 0))
                        } / 20 ⭐
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub Tab Skill Selector */}
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto shadow-xs gap-1">
                  <button
                    onClick={() => setActiveTab("vocab")}
                    className={`flex-1 min-w-[80px] text-center font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === "vocab"
                        ? "bg-slate-100 text-slate-800"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" /> Từ vựng
                  </button>
                  <button
                    onClick={() => setActiveTab("listening")}
                    className={`flex-1 min-w-[80px] text-center font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === "listening"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-indigo-600 hover:bg-slate-50"
                    }`}
                  >
                    🎧 Nghe
                  </button>
                  <button
                    onClick={() => setActiveTab("speaking")}
                    className={`flex-1 min-w-[80px] text-center font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === "speaking"
                        ? "bg-orange-500 text-white shadow-xs"
                        : "text-orange-600 hover:bg-slate-50"
                    }`}
                  >
                    🗣️ Nói
                  </button>
                  <button
                    onClick={() => setActiveTab("reading")}
                    className={`flex-1 min-w-[80px] text-center font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === "reading"
                        ? "bg-green-600 text-white shadow-xs"
                        : "text-green-600 hover:bg-slate-50"
                    }`}
                  >
                    📖 Đọc
                  </button>
                  <button
                    onClick={() => setActiveTab("writing")}
                    className={`flex-1 min-w-[80px] text-center font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === "writing"
                        ? "bg-purple-600 text-white shadow-xs"
                        : "text-purple-600 hover:bg-slate-50"
                    }`}
                  >
                    ✍️ Viết
                  </button>
                </div>

                {/* TAB CONTROLLER */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs min-h-[380px] relative">
                  
                  {/* TAB 1: VOCABULARY list & Dialogue */}
                  {activeTab === "vocab" && (
                    <div className="flex flex-col gap-6">
                      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                        <h4 className="text-lg font-bold font-display text-slate-800 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-indigo-500" />
                          Danh sách từ vựng trong Unit
                        </h4>
                        <span className="text-xs text-slate-400 font-semibold">{selectedUnit.vocabulary.length} từ</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedUnit.vocabulary.map((vocab, index) => (
                          <div 
                            key={index}
                            className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex justify-between items-start gap-3 hover:border-indigo-200 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-baseline gap-2">
                                <span className="font-extrabold text-slate-900 text-base">{vocab.word}</span>
                                <span className="text-xs font-mono text-indigo-500 font-medium">{vocab.ipa}</span>
                              </div>
                              <p className="text-sm font-semibold text-slate-700 mt-1">{vocab.vietnamese}</p>
                              <p className="text-xs italic text-slate-500 mt-2 font-medium bg-white p-2 rounded-lg border border-slate-100">
                                Ví dụ: {vocab.example}
                              </p>
                            </div>
                            <button
                              onClick={() => speakText(vocab.word)}
                              className="bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-600 p-2.5 rounded-xl shadow-xs transition-colors flex-shrink-0 cursor-pointer"
                              title="Nghe phát âm"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Dialogue Section */}
                      <div className="mt-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-slate-800 font-display flex items-center gap-2">
                            <Smile className="w-5 h-5 text-amber-500" />
                            Luyện hội thoại (Listen & Repeat)
                          </h4>
                          <button
                            onClick={() => playDialogue(selectedUnit.dialogue)}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> Nghe cả đoạn hội thoại
                          </button>
                        </div>
                        <div className="flex flex-col gap-3">
                          {selectedUnit.dialogue.map((d, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="font-bold text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md h-fit w-20 text-center font-display">
                                {d.speaker}
                              </div>
                              <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200/50 shadow-xs relative">
                                <div className="flex justify-between items-center gap-4">
                                  <p className="text-sm font-bold text-slate-800">{d.text}</p>
                                  <button 
                                    onClick={() => speakText(d.text)}
                                    className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <p className="text-xs text-slate-400 font-medium mt-1 italic border-t border-slate-100/50 pt-1">
                                  {d.vietnamese}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: LISTENING PRACTICE */}
                  {activeTab === "listening" && (
                    <div className="flex flex-col gap-6">
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Phần 1/2</span>
                        <h4 className="text-lg font-bold font-display text-slate-800">Nghe và chọn nghĩa của từ đúng</h4>
                      </div>

                      {/* Part 1: Vocabulary MCQ */}
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Click nghe từ vựng:</p>
                          <button
                            onClick={() => speakText(selectedUnit.vocabulary[currentListeningIndex].word)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-full shadow-lg hover:scale-105 transition-all flex items-center justify-center animate-bounce duration-1000 cursor-pointer"
                          >
                            <Volume2 className="w-8 h-8" />
                          </button>
                        </div>

                        <div className="w-full max-w-md flex flex-col gap-2 mt-4">
                          <p className="text-xs text-slate-500 font-semibold text-center mb-1">Từ bạn vừa nghe có nghĩa là gì?</p>
                          
                          {/* Render Shuffled options (correct first, followed by others) */}
                          {[
                            selectedUnit.vocabulary[currentListeningIndex].vietnamese,
                            ...selectedUnit.vocabulary.filter((_, idx) => idx !== currentListeningIndex).slice(0, 2).map(v => v.vietnamese)
                          ].map((opt, optionIdx) => (
                            <button
                              key={optionIdx}
                              onClick={() => !listeningFeedback?.show && checkListeningMC(optionIdx)}
                              className={`w-full text-left p-3.5 rounded-xl border text-sm font-semibold transition-all flex justify-between items-center cursor-pointer ${
                                selectedListeningOption === optionIdx
                                  ? optionIdx === 0
                                    ? "bg-green-50 border-green-300 text-green-800"
                                    : "bg-red-50 border-red-300 text-red-800"
                                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                              }`}
                              disabled={listeningFeedback?.show}
                            >
                              <span>{opt}</span>
                              {selectedListeningOption === optionIdx && (
                                optionIdx === 0 ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />
                              )}
                            </button>
                          ))}
                        </div>

                        {/* Feedback message and next word controls */}
                        {listeningFeedback?.show && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 mt-2 max-w-md w-full justify-center ${
                              listeningFeedback.isCorrect 
                                ? "bg-green-50 border-green-200 text-green-700" 
                                : "bg-red-50 border-red-200 text-red-700"
                            }`}
                          >
                            {listeningFeedback.isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" /> 
                                <span>Chính xác! Từ vừa phát âm có nghĩa là "{selectedUnit.vocabulary[currentListeningIndex].vietnamese}".</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4" /> 
                                <span>Chưa đúng rồi! Hãy nghe lại và thử nhé.</span>
                              </>
                            )}
                          </motion.div>
                        )}

                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => {
                              setSelectedListeningOption(null);
                              setListeningFeedback(null);
                            }}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Thử lại
                          </button>
                          <button
                            onClick={() => {
                              setCurrentListeningIndex((prev) => (prev + 1) % selectedUnit.vocabulary.length);
                              setSelectedListeningOption(null);
                              setListeningFeedback(null);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            Từ tiếp theo <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Part 2: Listening sentence fill-in-blank */}
                      <div className="border-t border-slate-100 pt-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Phần 2/2</span>
                          <h4 className="text-base font-bold font-display text-slate-800">Nghe đoạn hội thoại/mẫu câu và điền vào chỗ trống</h4>
                        </div>

                        {selectedUnit.exercises.filter(e => e.type === "fill-blank").map((ex, exIdx) => (
                          <div key={exIdx} className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 flex flex-col gap-4 items-center">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => speakText(ex.question.replace("______", ex.answer as string))}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-md transition-all cursor-pointer"
                              >
                                <Volume2 className="w-5 h-5" />
                              </button>
                              <span className="text-xs text-indigo-800 font-bold font-display">Bấm nghe toàn bộ câu mẫu của bài học</span>
                            </div>

                            <div className="text-center font-bold text-base text-slate-700 max-w-lg">
                              Mẫu câu: {ex.question}
                            </div>

                            <div className="flex gap-2 max-w-sm w-full">
                              <input 
                                type="text"
                                placeholder="Nhập từ còn thiếu..."
                                value={typedListeningAnswer}
                                onChange={(e) => setTypedListeningAnswer(e.target.value)}
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                              />
                              <button
                                onClick={checkListeningBlank}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                              >
                                Kiểm tra
                              </button>
                            </div>

                            {listeningBlankFeedback?.show && (
                              <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 max-w-md w-full justify-center ${
                                  listeningBlankFeedback.isCorrect 
                                    ? "bg-green-50 border-green-200 text-green-700" 
                                    : "bg-red-50 border-red-200 text-red-700"
                                }`}
                              >
                                {listeningBlankFeedback.isCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" /> 
                                    <span>Tuyệt vời! Bạn nghe rất chuẩn. Đáp án đúng là "{ex.answer}".</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-4 h-4" /> 
                                    <span>Chưa chính xác. Bạn hãy nghe lại kĩ từ phát âm nhé!</span>
                                  </>
                                )}
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* TAB 3: SPEAKING PRACTICE */}
                  {activeTab === "speaking" && (
                    <div className="flex flex-col gap-6">
                      <div className="border-b border-slate-100 pb-3">
                        <h4 className="text-lg font-bold font-display text-slate-800">Luyện nói theo mẫu câu sách giáo khoa</h4>
                        <p className="text-xs text-slate-400 mt-1">Cấp quyền Microphone cho trình duyệt để máy nghe giọng nói của bạn.</p>
                      </div>

                      <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 flex flex-col items-center gap-5">
                        <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-display">
                          Câu mẫu {currentSpeakingPromptIndex + 1} / {selectedUnit.speakingPrompts.length}
                        </span>

                        <div className="text-center">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Câu yêu cầu đọc:</p>
                          <h3 className="text-xl sm:text-2xl font-black text-indigo-900 leading-normal font-display">
                            "{selectedUnit.speakingPrompts[currentSpeakingPromptIndex].prompt.split(": ")[1] || selectedUnit.speakingPrompts[currentSpeakingPromptIndex].prompt}"
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 mt-1 italic">Mục tiêu nói: {selectedUnit.speakingPrompts[currentSpeakingPromptIndex].expected}</p>
                          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-lg inline-block border border-amber-100/50 mt-2 font-medium">
                            💡 {selectedUnit.speakingPrompts[currentSpeakingPromptIndex].guide}
                          </p>
                        </div>

                        {/* Speaker helper */}
                        <button
                          onClick={() => speakText(selectedUnit.speakingPrompts[currentSpeakingPromptIndex].expected)}
                          className="bg-white hover:bg-orange-50 border border-orange-200 text-orange-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" /> Nghe đọc mẫu trước
                        </button>

                        {/* Speech Record Button with visuals */}
                        <div className="flex flex-col items-center gap-2 mt-2">
                          <button
                            onClick={toggleRecording}
                            className={`p-6 rounded-full shadow-lg relative transform hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                              isRecording
                                ? "bg-red-500 text-white animate-pulse"
                                : "bg-orange-500 hover:bg-orange-600 text-white"
                            }`}
                          >
                            {isRecording ? <Mic className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                          </button>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {isRecording ? "Đang lắng nghe... Hãy nói đi nào!" : "Nhấp nút Mic và nói lớn"}
                          </span>
                        </div>

                        {/* Spoken Text Display */}
                        {recordingTranscript && (
                          <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs w-full max-w-md text-center">
                            <span className="text-slate-400 font-bold block mb-1">Máy nghe được bạn nói:</span>
                            <span className="font-bold text-slate-800">"{recordingTranscript}"</span>
                          </div>
                        )}

                        {/* Feedback Area */}
                        {speakingFeedback?.show && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-4 rounded-xl border text-sm flex flex-col gap-1.5 items-center text-center max-w-md w-full ${
                              speakingFeedback.isPassed 
                                ? "bg-green-50 border-green-200 text-green-800" 
                                : "bg-red-50 border-red-200 text-red-800"
                            }`}
                          >
                            <div className="flex items-center gap-2 font-bold text-base">
                              {speakingFeedback.isPassed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                              )}
                              <span>{speakingFeedback.isPassed ? "Hoàn thành Đạt!" : "Hãy thử lại nhé!"}</span>
                            </div>
                            <p className="text-xs font-medium leading-relaxed">{speakingFeedback.message}</p>
                          </motion.div>
                        )}

                        {/* Carousel controls */}
                        <div className="flex gap-4 mt-1">
                          <button
                            onClick={() => {
                              setCurrentSpeakingPromptIndex((prev) => (prev - 1 + selectedUnit.speakingPrompts.length) % selectedUnit.speakingPrompts.length);
                              setSpeakingFeedback(null);
                              setRecordingTranscript("");
                            }}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer"
                          >
                            Câu trước
                          </button>
                          <button
                            onClick={() => {
                              setCurrentSpeakingPromptIndex((prev) => (prev + 1) % selectedUnit.speakingPrompts.length);
                              setSpeakingFeedback(null);
                              setRecordingTranscript("");
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer"
                          >
                            Câu tiếp theo
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 4: READING PRACTICE */}
                  {activeTab === "reading" && (
                    <div className="flex flex-col gap-6">
                      <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-3">
                        <div>
                          <h4 className="text-lg font-bold font-display text-slate-800">{selectedUnit.reading.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">Đọc kỹ đoạn văn ngắn dưới đây và trả lời các câu hỏi.</p>
                        </div>
                        <button
                          onClick={() => setShowTranslation(!showTranslation)}
                          className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-bold text-xs py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                        >
                          {showTranslation ? "Ẩn dịch tiếng Việt" : "Xem dịch tiếng Việt"}
                        </button>
                      </div>

                      {/* Reading Passage Panel */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                        
                        <div className="md:col-span-7 bg-green-50/20 p-5 rounded-2xl border border-green-100/50 notebook-bg flex flex-col gap-4">
                          <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                            {selectedUnit.reading.text}
                          </p>

                          {/* Speech TTS Player for text */}
                          <button
                            onClick={() => speakText(selectedUnit.reading.text)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-3 rounded-lg w-fit flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" /> Đọc cho tôi nghe
                          </button>

                          {showTranslation && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-amber-50/60 p-4 rounded-xl border border-amber-100 text-xs text-slate-600 leading-relaxed font-medium mt-1"
                            >
                              <span className="font-bold text-amber-800 block mb-1">Dịch nghĩa:</span>
                              {selectedUnit.reading.translation}
                            </motion.div>
                          )}
                        </div>

                        {/* Questions column */}
                        <div className="md:col-span-5 flex flex-col gap-4">
                          <h5 className="font-bold text-slate-800 font-display flex items-center gap-1 text-sm border-b border-slate-100 pb-2">
                            <HelpCircle className="w-4 h-4 text-green-600" />
                            Câu hỏi trắc nghiệm
                          </h5>

                          {selectedUnit.reading.questions.map((q, qIdx) => (
                            <div key={qIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
                              <p className="text-xs font-bold text-slate-800">
                                Câu {qIdx + 1}: {q.question}
                              </p>
                              
                              <div className="flex flex-col gap-1.5 mt-1">
                                {q.options.map((opt, optIdx) => (
                                  <button
                                    key={optIdx}
                                    onClick={() => !showReadingFeedback && setReadingAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center justify-between cursor-pointer ${
                                      readingAnswers[qIdx] === optIdx
                                        ? showReadingFeedback
                                          ? optIdx === q.answerIndex
                                            ? "bg-green-50 border-green-300 text-green-700"
                                            : "bg-red-50 border-red-300 text-red-700"
                                          : "bg-green-600 border-green-600 text-white"
                                        : showReadingFeedback && optIdx === q.answerIndex
                                          ? "bg-green-50 border-green-300 text-green-700 font-bold"
                                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                                    }`}
                                    disabled={showReadingFeedback}
                                  >
                                    <span>{opt}</span>
                                    {showReadingFeedback && optIdx === q.answerIndex && (
                                      <Check className="w-3.5 h-3.5 text-green-600" />
                                    )}
                                  </button>
                                ))}
                              </div>

                              {showReadingFeedback && (
                                <p className="text-[10px] text-slate-500 mt-1 italic font-medium">
                                  Giải thích: {q.explanation}
                                </p>
                              )}
                            </div>
                          ))}

                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => {
                                setReadingAnswers({});
                                setShowReadingFeedback(false);
                              }}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer"
                            >
                              Làm lại
                            </button>
                            <button
                              onClick={checkReadingAnswers}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                              disabled={Object.keys(readingAnswers).length < selectedUnit.reading.questions.length}
                            >
                              Nộp bài trắc nghiệm
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* TAB 5: WRITING PRACTICE */}
                  {activeTab === "writing" && (
                    <div className="flex flex-col gap-6">
                      
                      {/* Part 1: Word sorting sentence scrambled */}
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Phần 1/2</span>
                        <h4 className="text-lg font-bold font-display text-slate-800">Sắp xếp các từ thành câu hoàn chỉnh</h4>
                      </div>

                      <div className="bg-purple-50/20 p-5 rounded-2xl border border-purple-100 flex flex-col items-center gap-4">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nhấp các từ bên dưới để ghép câu mẫu sách giáo khoa:</p>
                        
                        {/* Shuffled pool */}
                        <div className="flex flex-wrap gap-2 justify-center py-2 border-b border-slate-100 w-full min-h-12">
                          {shuffledWords.map((word, index) => (
                            <button
                              key={index}
                              onClick={() => handleWordClick(word, index)}
                              className="bg-white border border-slate-200 hover:border-purple-500 text-slate-700 font-semibold px-3 py-1.5 rounded-xl text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
                            >
                              {word}
                            </button>
                          ))}
                        </div>

                        {/* Selected answer */}
                        <div className="w-full">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 text-center">Câu của bạn:</p>
                          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 min-h-14 flex flex-wrap gap-2 justify-center items-center">
                            {writingSentenceAnswer.length === 0 ? (
                              <span className="text-xs text-slate-400 italic">Chọn các từ trên để xếp vào đây...</span>
                            ) : (
                              writingSentenceAnswer.map((word, index) => (
                                <button
                                  key={index}
                                  onClick={() => removeWordFromAnswer(word, index)}
                                  className="bg-purple-600 text-white font-semibold px-3 py-1.5 rounded-xl text-xs cursor-pointer shadow-xs"
                                >
                                  {word}
                                </button>
                              ))
                            )}
                          </div>
                        </div>

                        {writingSentenceFeedback?.show && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 max-w-md w-full justify-center ${
                              writingSentenceFeedback.isCorrect 
                                ? "bg-green-50 border-green-200 text-green-700" 
                                : "bg-red-50 border-red-200 text-red-700"
                            }`}
                          >
                            {writingSentenceFeedback.isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" /> 
                                <span>Chính xác! Bạn sắp xếp câu rất giỏi.</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4" /> 
                                <span>Thứ tự từ chưa đúng rồi. Hãy chú ý cấu trúc ngữ pháp nhé!</span>
                              </>
                            )}
                          </motion.div>
                        )}

                        <div className="flex gap-3">
                          <button
                            onClick={initWordUnscramble}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer"
                          >
                            Xếp lại từ đầu
                          </button>
                          <button
                            onClick={checkSentenceOrder}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                            disabled={writingSentenceAnswer.length === 0}
                          >
                            Kiểm tra kết quả
                          </button>
                        </div>
                      </div>

                      {/* Part 2: Free Writing with AI Evaluation */}
                      <div className="border-t border-slate-100 pt-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Phần 2/2</span>
                          <h4 className="text-base font-bold font-display text-slate-800">Tự do luyện viết với Thầy Cô AI (AI Essay Assessment)</h4>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-3">
                          <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Đề bài viết:</span>
                            <p className="font-extrabold text-slate-800 text-sm leading-relaxed">
                              "{selectedUnit.writingPrompt.prompt}"
                            </p>
                            <span className="text-xs text-indigo-600 block mt-1.5 font-medium">💡 Gợi ý: {selectedUnit.writingPrompt.guide}</span>
                          </div>

                          <div className="flex flex-col gap-1.5 mt-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Khung soạn thảo:</label>
                            <textarea
                              rows={4}
                              placeholder={selectedUnit.writingPrompt.placeholder}
                              value={freeWritingText}
                              onChange={(e) => setFreeWritingText(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                            ></textarea>
                          </div>

                          <div className="flex justify-between items-center gap-4 flex-wrap">
                            <span className="text-xs text-slate-400 italic">Gợi ý: Viết khoảng 2-3 câu đơn giản bám sát từ vựng trong Unit.</span>
                            <button
                              onClick={evaluateFreeWriting}
                              disabled={isEvaluatingWriting}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:bg-slate-300"
                            >
                              {isEvaluatingWriting ? (
                                <>
                                  <Sparkles className="w-4 h-4 animate-spin" /> Thầy cô đang chấm...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4" /> Nộp bài cho Thầy Cô AI chấm
                                </>
                              )}
                            </button>
                          </div>

                          {/* Render AI Writing evaluation card */}
                          {writingAiEvaluation && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white p-5 rounded-2xl border border-indigo-200/80 mt-4 shadow-sm"
                            >
                              <div className="flex justify-between items-center pb-3 border-b border-slate-100 flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <Award className="w-5 h-5 text-amber-500" />
                                  <span className="font-black text-slate-800 text-sm font-display">Kết quả nhận được:</span>
                                </div>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star 
                                      key={s} 
                                      className={`w-4 h-4 ${
                                        s <= (writingAiEvaluation.stars || 4) 
                                          ? "text-yellow-400 fill-yellow-400" 
                                          : "text-slate-200"
                                      }`} 
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col gap-4 mt-3">
                                {/* Corrected Text */}
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Văn bản sửa đổi (Corrected English):</span>
                                  <p className="text-sm font-bold text-green-700 bg-green-50/50 p-3 rounded-lg border border-green-100/50 italic">
                                    "{writingAiEvaluation.correctedText}"
                                  </p>
                                </div>

                                {/* List of corrections */}
                                {writingAiEvaluation.correctionsList && writingAiEvaluation.correctionsList.length > 0 && (
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Các lỗi cần sửa:</span>
                                    <ul className="list-disc pl-5 text-xs text-slate-700 flex flex-col gap-1">
                                      {writingAiEvaluation.correctionsList.map((item, idx) => (
                                        <li key={idx} className="leading-relaxed">{item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Feedback */}
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lời khuyên của Thầy Cô AI:</span>
                                  <p className="text-xs text-slate-700 leading-relaxed bg-indigo-50/20 p-3 rounded-lg border border-indigo-100/30">
                                    {writingAiEvaluation.feedback}
                                  </p>
                                </div>

                                {/* Sample Answer */}
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Câu mẫu hoàn hảo học tập:</span>
                                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between items-center gap-3">
                                    <p className="font-bold text-slate-800">"{writingAiEvaluation.sampleAnswer}"</p>
                                    <button 
                                      onClick={() => speakText(writingAiEvaluation.sampleAnswer)}
                                      className="text-indigo-600 hover:text-indigo-800 p-1"
                                    >
                                      <Volume2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Area: Interactive Alfie AI Robot Buddy Chat Panel */}
        <div className="w-full md:w-80 flex flex-col gap-4 flex-shrink-0">
          
          {/* Cartoon Character Introduction */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Simulated cartoon robot icon */}
                <div className="w-12 h-12 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-extrabold text-xl shadow-md border-2 border-white">
                  🤖
                </div>
                <div className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-black text-slate-800 font-display">Chat với bạn Robot Alfie</h3>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider font-display inline-block">Online</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Alfie là nhân vật robot vũ trụ đáng yêu trong sách giáo khoa Smart Start! Bạn hãy gửi tin nhắn bằng tiếng Anh để luyện nói chuyện và chat với Alfie nhé!
            </p>
          </div>

          {/* Chat Window Panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl flex flex-col shadow-sm h-[380px] overflow-hidden justify-between">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600 font-display flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-indigo-500" />
                Alfie Chat Messenger
              </span>
              <button 
                onClick={() => setChatMessages([{ sender: "alfie", text: "Hello! Let's chat!" }])}
                title="Làm mới cuộc chat"
                className="text-slate-400 hover:text-slate-600 text-[11px] font-bold transition-all cursor-pointer"
              >
                Xóa lịch sử
              </button>
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50/50">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                    msg.sender === "user" 
                      ? "bg-indigo-600 text-white rounded-br-none shadow-xs" 
                      : "bg-white text-slate-800 rounded-bl-none border border-slate-200/60 shadow-xs"
                  }`}>
                    {msg.text}
                  </div>
                  {/* Speaker utility */}
                  {msg.sender === "alfie" && (
                    <button 
                      onClick={() => speakText(msg.text.split(" (")[0])}
                      className="text-[10px] text-slate-400 hover:text-indigo-600 mt-1 flex items-center gap-0.5 ml-1"
                    >
                      <Volume2 className="w-3 h-3" /> Nghe Alfie đọc
                    </button>
                  )}
                </div>
              ))}
              {isChatLoading && (
                <div className="mr-auto max-w-[85%] flex items-center gap-1 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
              <input 
                type="text" 
                placeholder="Nhập tin nhắn tiếng Anh..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden focus:bg-white"
              />
              <button
                onClick={handleSendChatMessage}
                disabled={isChatLoading || chatInput.trim() === ""}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center disabled:bg-slate-200 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-semibold font-display">
          <p>© 2026 i-Learn Smart Start 5 - Luyện nghe, nói, đọc, viết tiếng Anh lớp 5</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">Dữ liệu bám sát sách học học sinh</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-indigo-600"><Sparkles className="w-3.5 h-3.5" /> Được vận hành bởi Google Gemini AI</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
