export interface VocabularyItem {
  word: string;
  ipa: string;
  meaning: string;
  vietnamese: string;
  example: string;
  audioText?: string;
}

export interface DialogueItem {
  speaker: string;
  text: string;
  vietnamese: string;
}

export interface ReadingPassage {
  title: string;
  text: string;
  translation: string;
  questions: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }[];
}

export interface ExerciseItem {
  id: string;
  type: "fill-blank" | "multiple-choice" | "scrambled" | "matching";
  question: string;
  options?: string[];
  answer: string | number | string[]; // Match index, string, or list
  explanation: string;
}

export interface Unit {
  id: number;
  title: string;
  englishTitle: string;
  themeColor: string;
  vocabulary: VocabularyItem[];
  patterns: string[];
  dialogue: DialogueItem[];
  reading: ReadingPassage;
  exercises: ExerciseItem[];
  speakingPrompts: {
    prompt: string;
    expected: string;
    guide: string;
  }[];
  writingPrompt: {
    prompt: string;
    guide: string;
    placeholder: string;
  };
}

export const units: Unit[] = [
  {
    id: 1,
    title: "Trường học",
    englishTitle: "School",
    themeColor: "from-blue-500 to-indigo-600",
    vocabulary: [
      { word: "geography", ipa: "/dʒiˈɒɡrəfi/", meaning: "môn địa lý", vietnamese: "môn địa lý", example: "I like geography because I learn about countries." },
      { word: "history", ipa: "/ˈhɪstəri/", meaning: "môn lịch sử", vietnamese: "môn lịch sử", example: "He learns about the past in history class." },
      { word: "science", ipa: "/ˈsaɪəns/", meaning: "môn khoa học", vietnamese: "môn khoa học", example: "We do experiments in science class." },
      { word: "I.T.", ipa: "/ˌaɪ ˈtiː/", meaning: "môn tin học", vietnamese: "môn tin học", example: "I always use computers in I.T. class." },
      { word: "Vietnamese", ipa: "/ˌvjetnəˈmiːz/", meaning: "môn tiếng Việt", vietnamese: "môn tiếng Việt", example: "She likes studying Vietnamese stories." },
      { word: "ethics", ipa: "/ˈeθɪks/", meaning: "môn đạo đức", vietnamese: "môn đạo đức", example: "We learn how to be good citizens in ethics class." },
      { word: "solving problems", ipa: "/ˈsɒlvɪŋ ˈprɒbləmz/", meaning: "giải bài tập/vấn đề", vietnamese: "giải toán, giải quyết vấn đề", example: "I like math because I like solving problems." },
      { word: "doing experiments", ipa: "/ˈduːɪŋ ɪkˈsperɪmənts/", meaning: "làm thí nghiệm", vietnamese: "làm thí nghiệm", example: "They often do experiments in science class." },
      { word: "always", ipa: "/ˈɔːlweɪz/", meaning: "luôn luôn (100%)", vietnamese: "luôn luôn", example: "I always do my homework after school." },
      { word: "usually", ipa: "/ˈjuːʒuəli/", meaning: "thường xuyên (80%)", vietnamese: "thường xuyên", example: "He usually learns about the past in history." },
      { word: "sometimes", ipa: "/ˈsʌmtaɪmz/", meaning: "thỉnh thoảng (50%)", vietnamese: "thỉnh thoảng", example: "We sometimes play sports in P.E. class." },
      { word: "never", ipa: "/ˈnevə(r)/", meaning: "không bao giờ (0%)", vietnamese: "không bao giờ", example: "I never miss my English class." }
    ],
    patterns: [
      "Which subject do you like? - I like science.",
      "Which subject does he like? - He likes English.",
      "Why do you like math? - Because I like solving problems.",
      "I always use computers in I.T. class."
    ],
    dialogue: [
      { speaker: "Alfie", text: "I'm so excited, Tom! Is school fun?", vietnamese: "Tớ hào hứng quá, Tom ơi! Đi học có vui không?" },
      { speaker: "Tom", text: "Yes, it is.", vietnamese: "Có chứ, vui lắm." },
      { speaker: "Alfie", text: "Which subject do you like?", vietnamese: "Cậu thích môn học nào?" },
      { speaker: "Tom", text: "I like science. It's really fun.", vietnamese: "Tớ thích môn khoa học. Nó thực sự rất vui." },
      { speaker: "Alfie", text: "Why do you like science?", vietnamese: "Tại sao cậu lại thích môn khoa học?" },
      { speaker: "Tom", text: "Because I like doing experiments!", vietnamese: "Vì tớ thích làm thí nghiệm!" }
    ],
    reading: {
      title: "Steven's School Timetable",
      text: "Steven is a student in New Zealand. He has many interesting classes. On Monday at 9 a.m., Steven's math class starts. After that, he has English at 10:45 a.m. On Wednesdays, he always uses computers in I.T. class at 10:45 a.m. On Fridays, his favorite science class starts at 9 a.m. He says science is great because they usually do experiments.",
      translation: "Steven là một học sinh ở New Zealand. Bạn ấy có nhiều lớp học thú vị. Vào thứ Hai lúc 9 giờ sáng, lớp Toán của Steven bắt đầu. Sau đó, bạn ấy học tiếng Anh lúc 10:45 sáng. Vào thứ Tư, bạn ấy luôn sử dụng máy tính trong lớp Tin học lúc 10:45 sáng. Vào thứ Sáu, lớp Khoa học yêu thích của bạn ấy bắt đầu lúc 9 giờ sáng. Bạn ấy nói môn khoa học rất tuyệt vì họ thường xuyên làm thí nghiệm.",
      questions: [
        {
          question: "When does Steven's math class start on Mondays?",
          options: ["At 9 a.m.", "At 10:45 a.m.", "At 12:30 p.m.", "At 2:15 p.m."],
          answerIndex: 0,
          explanation: "Steven's math class starts at 9 a.m. on Monday according to the timetable."
        },
        {
          question: "What subject does Steven study on Wednesdays at 10:45 a.m.?",
          options: ["Science", "History", "I.T.", "English"],
          answerIndex: 2,
          explanation: "On Wednesdays, he has I.T. class at 10:45 a.m."
        },
        {
          question: "Why does Steven like science class?",
          options: ["Because he plays soccer", "Because they usually do experiments", "Because he draws pictures", "Because it is easy"],
          answerIndex: 1,
          explanation: "Steven likes science because they usually do experiments."
        }
      ]
    },
    exercises: [
      {
        id: "u1_ex1",
        type: "multiple-choice",
        question: "Which subject does he ____? - He likes English.",
        options: ["like", "likes", "liking", "liked"],
        answer: 0,
        explanation: "In questions with 'does', we use the bare infinitive verb 'like'."
      },
      {
        id: "u1_ex2",
        type: "fill-blank",
        question: "Why do you like math? - _________ I like solving problems.",
        answer: "Because",
        explanation: "We answer 'Why' questions starting with 'Because'."
      },
      {
        id: "u1_ex3",
        type: "scrambled",
        question: "always / use / class / I / computers / in / I.T. / .",
        answer: "I always use computers in I.T. class.",
        explanation: "Subject + Adverb of frequency + Verb + Object + Prepositional phrase."
      }
    ],
    speakingPrompts: [
      {
        prompt: "Nói môn học yêu thích của bạn: 'I like science.'",
        expected: "I like science",
        guide: "Cố gắng phát âm rõ âm đuôi /s/ trong từ 'science'."
      },
      {
        prompt: "Giải thích lý do bạn thích toán: 'Because I like solving problems.'",
        expected: "Because I like solving problems",
        guide: "Phát âm rõ 'solving' và 'problems' có âm /z/ ở cuối."
      }
    ],
    writingPrompt: {
      prompt: "Hãy viết 2-3 câu bằng tiếng Anh giới thiệu về tên của bạn, môn học yêu thích của bạn ở trường và lý do tại sao bạn thích nó.",
      guide: "Gợi ý: My name's... My favorite subject is... because I like...",
      placeholder: "My name's Minh. My favorite subject is I.T. because I like using computers."
    }
  },
  {
    id: 2,
    title: "Các ngày lễ",
    englishTitle: "Holidays",
    themeColor: "from-orange-500 to-red-600",
    vocabulary: [
      { word: "Halloween", ipa: "/ˌhæləʊˈiːn/", meaning: "Lễ Halloween (31/10)", vietnamese: "Lễ hội Halloween", example: "My favorite holiday is Halloween." },
      { word: "Lunar New Year", ipa: "/ˌluːnə njuː ˈjɪə/", meaning: "Tết Nguyên Đán", vietnamese: "Tết Nguyên Đán", example: "We get lucky money on Lunar New Year." },
      { word: "Christmas", ipa: "/ˈkrɪsməs/", meaning: "Lễ Giáng Sinh (25/12)", vietnamese: "Giáng Sinh", example: "When's Christmas? It's on December twenty-fifth." },
      { word: "Teachers' Day", ipa: "/ˈtiːtʃəz deɪ/", meaning: "Ngày Nhà Giáo", vietnamese: "Ngày Nhà giáo Việt Nam", example: "We give flowers to our teachers on Teachers' Day." },
      { word: "Children's Day", ipa: "/ˈtʃɪldrənz deɪ/", meaning: "Ngày Quốc tế Thiếu nhi", vietnamese: "Ngày Quốc tế Thiếu nhi", example: "Children get toys on Children's Day." },
      { word: "December twenty-fifth", ipa: "/dɪˈsembə ˌtwenti ˈfɪfθ/", meaning: "Ngày 25 tháng 12", vietnamese: "ngày 25 tháng 12", example: "Christmas Day is on December twenty-fifth." },
      { word: "blow up the balloons", ipa: "/bləʊ ʌp ðə bəˈluːnz/", meaning: "thổi bong bóng", vietnamese: "thổi bong bóng", example: "Could you blow up the balloons for the party?" },
      { word: "invite friends", ipa: "/ɪnˈvaɪt frendz/", meaning: "mời bạn bè", vietnamese: "mời bạn bè", example: "I want to invite friends to my New Year's party." },
      { word: "give lucky money", ipa: "/ɡɪv ˈlʌki ˈmʌni/", meaning: "lì xì", vietnamese: "tặng tiền lì xì", example: "Grandparents give lucky money to kids." },
      { word: "watch the lion dance", ipa: "/wɒtʃ ðə ˈlaɪən dɑːns/", meaning: "xem múa lân", vietnamese: "xem múa lân", example: "We love to watch the lion dance on Tet." }
    ],
    patterns: [
      "What's your favorite holiday? - It's Halloween.",
      "When's Christmas Day? - It's on December twenty-fifth.",
      "Could you blow up the balloons? - Yes, sure.",
      "What do people do to celebrate Christmas? - They put up a Christmas tree."
    ],
    dialogue: [
      { speaker: "Ben", text: "Today is Children's Day! What's your favorite holiday, Lucy?", vietnamese: "Hôm nay là Ngày Thiếu nhi! Ngày lễ yêu thích của chị là gì vậy Lucy?" },
      { speaker: "Lucy", text: "It's Christmas because I get lots of presents from Santa!", vietnamese: "Đó là Giáng Sinh vì chị nhận được rất nhiều quà từ ông già Noel!" },
      { speaker: "Ben", text: "When is Christmas Day?", vietnamese: "Ngày Giáng Sinh là khi nào vậy chị?" },
      { speaker: "Lucy", text: "It's on December twenty-fifth.", vietnamese: "Nó vào ngày 25 tháng 12." }
    ],
    reading: {
      title: "Holidays in Vietnam",
      text: "Nghi lives in Vietnam. Her favorite holiday is Lunar New Year (Tet). It is usually in January or February. Before Tet, her family cleans their house and paints the walls red. Red is a lucky color. On Lunar New Year, everyone wears new clothes. Children get lucky money from parents and grandparents. They also watch the lion dance and eat a lot of delicious food.",
      translation: "Nghi sống ở Việt Nam. Ngày lễ yêu thích của cô ấy là Tết Nguyên Đán. Nó thường vào tháng Một hoặc tháng Hai. Trước Tết, gia đình cô ấy dọn dẹp nhà cửa và sơn tường màu đỏ. Màu đỏ là một màu may mắn. Vào ngày Tết, mọi người đều mặc quần áo mới. Trẻ em được nhận tiền lì xì từ bố mẹ và ông bà. Họ cũng xem múa lân và ăn rất nhiều món ăn ngon.",
      questions: [
        {
          question: "What is Nghi's favorite holiday?",
          options: ["Christmas", "Lunar New Year", "Halloween", "Teachers' Day"],
          answerIndex: 1,
          explanation: "The passage says 'Her favorite holiday is Lunar New Year (Tet).'"
        },
        {
          question: "Why does Nghi's family paint their walls red?",
          options: ["Because red is beautiful", "Because red is a lucky color", "Because red is cheap", "Because they like red apples"],
          answerIndex: 1,
          explanation: "The passage mentions: 'Red is a lucky color' so they paint the walls red."
        },
        {
          question: "Who gives lucky money to children?",
          options: ["Teachers", "Friends", "Parents and grandparents", "Santa Claus"],
          answerIndex: 2,
          explanation: "Children get lucky money from parents and grandparents."
        }
      ]
    },
    exercises: [
      {
        id: "u2_ex1",
        type: "multiple-choice",
        question: "When's Lunar New Year? - It's ____ February.",
        options: ["on", "in", "at", "under"],
        answer: 1,
        explanation: "We use 'in' before months of the year (e.g., in February)."
      },
      {
        id: "u2_ex2",
        type: "multiple-choice",
        question: "Could you ____ some candy, please? - Yes, sure.",
        options: ["buy", "buying", "buys", "bought"],
        answer: 0,
        explanation: "After modal verb 'Could you', we use the base form of the verb 'buy'."
      },
      {
        id: "u2_ex3",
        type: "fill-blank",
        question: "Christmas Day is on December _________________ (ngày 25).",
        answer: "twenty-fifth",
        explanation: "December 25th is written as 'December twenty-fifth'."
      }
    ],
    speakingPrompts: [
      {
        prompt: "Hỏi ngày lễ yêu thích: 'What's your favorite holiday?'",
        expected: "What is your favorite holiday",
        guide: "Phát âm rõ âm cuối /s/ trong 'What's'."
      },
      {
        prompt: "Nhận lời giúp đỡ thổi bóng: 'Yes, sure.'",
        expected: "Yes sure",
        guide: "Phát âm rõ âm /ʃ/ trong từ 'sure'."
      }
    ],
    writingPrompt: {
      prompt: "Hãy viết 2-3 câu giới thiệu ngày lễ yêu thích của bạn (ví dụ: Tết, Noel, Halloween), ngày lễ đó diễn ra khi nào và bạn thường làm gì vào ngày đó.",
      guide: "Gợi ý: My favorite holiday is... It is on... We put up.../ We watch...",
      placeholder: "My favorite holiday is Lunar New Year. It is in January or February. We get lucky money."
    }
  },
  {
    id: 3,
    title: "Bạn bè và tôi",
    englishTitle: "My Friends and I",
    themeColor: "from-green-500 to-teal-600",
    vocabulary: [
      { word: "slowly", ipa: "/ˈsləʊli/", meaning: "chậm chạp (trạng từ)", vietnamese: "một cách chậm chạp", example: "He walks slowly because he is tired." },
      { word: "fast", ipa: "/fɑːst/", meaning: "nhanh (trạng từ)", vietnamese: "một cách nhanh chóng", example: "She runs very fast and wins the race." },
      { word: "well", ipa: "/wel/", meaning: "tốt, hay (trạng từ)", vietnamese: "một cách tốt đẹp", example: "Bill sings well." },
      { word: "hard", ipa: "/hɑːd/", meaning: "mạnh, chăm chỉ", vietnamese: "mạnh, chăm chỉ", example: "Tom kicks the ball hard." },
      { word: "noisy", ipa: "/ˈnɔɪzi/", meaning: "ồn ào (tính từ)", vietnamese: "ồn ào", example: "The stadium was very noisy during the game." },
      { word: "delicious", ipa: "/dɪˈlɪʃəs/", meaning: "ngon miệng", vietnamese: "ngon miệng", example: "The cake my mom made was delicious." },
      { word: "baked cupcakes", ipa: "/beɪkt ˈkʌpkeɪks/", meaning: "đã nướng bánh cupcake", vietnamese: "đã nướng bánh", example: "I baked cupcakes yesterday." },
      { word: "planted flowers", ipa: "/ˈplɑːntɪd ˈflaʊəz/", meaning: "đã trồng hoa (quá khứ)", vietnamese: "đã trồng hoa", example: "She planted some flowers in the garden last Sunday." },
      { word: "went camping", ipa: "/went ˈkæmpɪŋ/", meaning: "đã đi cắm trại (quá khứ của go)", vietnamese: "đã đi cắm trại", example: "We went camping in the forest last week." },
      { word: "sang karaoke", ipa: "/sæŋ ˌkæriˈəʊki/", meaning: "đã hát karaoke (quá khứ của sing)", vietnamese: "đã hát karaoke", example: "They sang karaoke at the sleepover." }
    ],
    patterns: [
      "Tom kicks the ball hard.",
      "Where were you last night? - I was at the movie theater.",
      "The movie was scary.",
      "I planted some flowers yesterday.",
      "I went camping last week."
    ],
    dialogue: [
      { speaker: "Alfie", text: "How was your weekend, Tom?", vietnamese: "Cuối tuần của cậu thế nào, Tom?" },
      { speaker: "Tom", text: "It was great! I stayed at home and baked cupcakes.", vietnamese: "Nó rất tuyệt! Tớ đã ở nhà và nướng bánh cupcakes." },
      { speaker: "Alfie", text: "Cool! Were you alone?", vietnamese: "Tuyệt quá! Cậu có ở một mình không?" },
      { speaker: "Tom", text: "No, my grandparents visited us. We had a great time.", vietnamese: "Không, ông bà tớ đã đến chơi. Chúng tớ đã có khoảng thời gian rất vui." }
    ],
    reading: {
      title: "Our Weekend Fun",
      text: "Last weekend, my friends and I had a busy time. On Saturday, we had a sleepover at Betty's house. Her mom baked delicious chocolate cookies for us. We sang karaoke very loudly and played paper crafts. On Sunday morning, my family went camping near a beautiful lake. It was very quiet there, and we saw some fish. What did you do last weekend?",
      translation: "Cuối tuần trước, bạn bè và tôi đã có một khoảng thời gian bận rộn. Vào thứ Bảy, chúng tôi đã ngủ qua đêm tại nhà của Betty. Mẹ bạn ấy đã nướng bánh quy sô-cô-la rất ngon cho chúng tôi. Chúng tôi đã hát karaoke rất to và làm thủ công bằng giấy. Vào sáng Chủ Nhật, gia đình tôi đã đi cắm trại gần một cái hồ xinh đẹp. Ở đó rất yên tĩnh, và chúng tôi đã nhìn thấy vài chú cá. Bạn đã làm gì vào cuối tuần trước?",
      questions: [
        {
          question: "Where did they have a sleepover?",
          options: ["At Betty's house", "At school", "At the library", "In the forest"],
          answerIndex: 0,
          explanation: "The passage states: 'On Saturday, we had a sleepover at Betty's house.'"
        },
        {
          question: "What did Betty's mom bake for them?",
          options: ["Cupcakes", "Chocolate cookies", "Bread", "A big cake"],
          answerIndex: 1,
          explanation: "Her mom baked delicious chocolate cookies for them."
        },
        {
          question: "How was the camping site near the lake on Sunday?",
          options: ["Noisy", "Busy", "Quiet", "Scary"],
          answerIndex: 2,
          explanation: "The text mentions: 'It was very quiet there, and we saw some fish.'"
        }
      ]
    },
    exercises: [
      {
        id: "u3_ex1",
        type: "multiple-choice",
        question: "Where ____ you last night? - I was at home.",
        options: ["was", "were", "are", "did"],
        answer: 1,
        explanation: "We use 'were' with the subject 'you' in the past simple tense."
      },
      {
        id: "u3_ex2",
        type: "multiple-choice",
        question: "She sings very ____. Everyone loves her voice.",
        options: ["good", "well", "badly", "slowly"],
        answer: 1,
        explanation: "'well' is the adverb of manner of 'good', modifying the verb 'sings'."
      },
      {
        id: "u3_ex3",
        type: "fill-blank",
        question: "My family ______ camping near a lake last Sunday. (quá khứ của go)",
        answer: "went",
        explanation: "The past form of the irregular verb 'go' is 'went'."
      }
    ],
    speakingPrompts: [
      {
        prompt: "Nói câu: 'Tom kicks the ball hard.'",
        expected: "Tom kicks the ball hard",
        guide: "Phát âm rõ phụ âm cuối /d/ trong 'hard' và /s/ trong 'kicks'."
      },
      {
        prompt: "Nói về hoạt động quá khứ: 'I stayed at home yesterday.'",
        expected: "I stayed at home yesterday",
        guide: "Phát âm rõ 'stayed' (phát âm đuôi /d/) và 'yesterday'."
      }
    ],
    writingPrompt: {
      prompt: "Hãy viết 2-3 câu kể về những việc bạn đã làm vào cuối tuần trước bằng thì quá khứ đơn.",
      guide: "Gợi ý: Last weekend, I visited... I watched TV... I went...",
      placeholder: "Last weekend, I stayed at home and studied. I also played soccer with my brother."
    }
  },
  {
    id: 4,
    title: "Du lịch",
    englishTitle: "Travel",
    themeColor: "from-teal-500 to-cyan-600",
    vocabulary: [
      { word: "mountain", ipa: "/ˈmaʊntən/", meaning: "ngọn núi", vietnamese: "ngọn núi", example: "We climbed a high mountain on our vacation." },
      { word: "lake", ipa: "/leɪk/", meaning: "hồ nước", vietnamese: "hồ nước", example: "They swam in the cold lake." },
      { word: "river", ipa: "/ˈrɪvə(r)/", meaning: "sông", vietnamese: "sông", example: "We rode a boat on the river." },
      { word: "beach", ipa: "/biːtʃ/", meaning: "bãi biển", vietnamese: "bãi biển", example: "I went to the beach to see the ocean." },
      { word: "forest", ipa: "/ˈfɒrɪst/", meaning: "khu rừng", vietnamese: "khu rừng", example: "We walked through a dark forest." },
      { word: "South Korea", ipa: "/ˌsaʊθ kəˈriːə/", meaning: "Hàn Quốc", vietnamese: "Hàn Quốc", example: "I went to South Korea last summer." },
      { word: "helicopter", ipa: "/ˈhelɪkɒptə(r)/", meaning: "máy bay trực thăng", vietnamese: "trực thăng", example: "We got to the island by helicopter." },
      { word: "speedboat", ipa: "/ˈspiːdbəʊt/", meaning: "tàu cao tốc", vietnamese: "tàu cao tốc", example: "He went to the beach by speedboat." },
      { word: "Singapore", ipa: "/ˌsɪŋəˈpɔː(r)/", meaning: "Singapore", vietnamese: "Singapore", example: "Singapore is a very beautiful country." },
      { word: "watched a soccer game", ipa: "/wɒtʃt ə ˈsɒkə ɡeɪm/", meaning: "đã xem trận bóng đá", vietnamese: "đã xem trận bóng đá", example: "I went to Laos and watched a soccer game." }
    ],
    patterns: [
      "I didn't go to the river. I went to the beach.",
      "I went to South Korea last month.",
      "Did you sing karaoke? - Yes, I did. / No, I didn't.",
      "How did you get there? - We went by helicopter."
    ],
    dialogue: [
      { speaker: "Nick", text: "How was your vacation, Tom?", vietnamese: "Chuyến du lịch của cậu thế nào, Tom?" },
      { speaker: "Tom", text: "We went to Singapore! It was exciting.", vietnamese: "Gia đình tớ đã đến Singapore! Nó thực sự rất hào hứng." },
      { speaker: "Nick", text: "How did you get there?", vietnamese: "Nhà cậu đi đến đó bằng phương tiện gì?" },
      { speaker: "Tom", text: "We went by plane. But in Singapore, we went in a helicopter over the city!", vietnamese: "Nhà tớ đi bằng máy bay. Nhưng ở Singapore, nhà tớ đã đi bằng trực thăng bay ngắm toàn thành phố!" }
    ],
    reading: {
      title: "Trang's Vacation in Da Nang",
      text: "Trang went to Da Nang with her brother last month. They traveled by minibus. In Da Nang, they ate lots of delicious seafood and swam in the ocean. They visited the famous Dragon Bridge at night and saw the wonderful lights and fire! They also went to Ba Na Hills by cable car. It was cold there and they stayed for one night. Trang loved her vacation very much.",
      translation: "Trang đã đi Đà Nẵng với anh trai vào tháng trước. Họ di chuyển bằng xe buýt nhỏ. Ở Đà Nẵng, họ ăn rất nhiều hải sản ngon và tắm biển. Họ đã ghé thăm Cầu Rồng nổi tiếng vào ban đêm và ngắm nhìn ánh sáng cùng màn phun lửa tuyệt vời! Họ cũng đi cáp treo lên Bà Nà Hills. Ở đó trời lạnh và họ đã ở lại một đêm. Trang yêu thích chuyến đi của mình rất nhiều.",
      questions: [
        {
          question: "How did Trang and her brother travel to Da Nang?",
          options: ["By plane", "By minibus", "By train", "By speedboat"],
          answerIndex: 1,
          explanation: "The text says: 'They traveled by minibus.'"
        },
        {
          question: "What did they see at the Dragon Bridge at night?",
          options: ["Monkeys", "Lights and fire", "Dolphins", "A big boat"],
          answerIndex: 1,
          explanation: "They saw the famous Dragon Bridge at night and saw the wonderful lights and fire."
        },
        {
          question: "How long did they stay in Ba Na Hills?",
          options: ["For one night", "For one week", "For two nights", "For four days"],
          answerIndex: 0,
          explanation: "The passage mentions: 'they stayed for one night' in Ba Na Hills."
        }
      ]
    },
    exercises: [
      {
        id: "u4_ex1",
        type: "multiple-choice",
        question: "How ____ you get to the island? - We went by ferry.",
        options: ["do", "did", "does", "are"],
        answer: 1,
        explanation: "For past actions, we use the auxiliary verb 'did' in questions."
      },
      {
        id: "u4_ex2",
        type: "multiple-choice",
        question: "I didn't ____ to the mountain. I went to the forest.",
        options: ["go", "went", "going", "goes"],
        answer: 0,
        explanation: "After 'didn't', we must use the bare infinitive form 'go'."
      },
      {
        id: "u4_ex3",
        type: "fill-blank",
        question: "Did you swim in the lake? - No, I _________.",
        answer: "didn't",
        explanation: "The negative short answer for 'Did you...?' is 'No, I didn't.'"
      }
    ],
    speakingPrompts: [
      {
        prompt: "Nói phương thức di chuyển: 'We went by helicopter.'",
        expected: "We went by helicopter",
        guide: "Phát âm rõ từ 'helicopter' có trọng âm rơi vào âm tiết đầu tiên."
      },
      {
        prompt: "Phủ định hoạt động quá khứ: 'I didn't go to the river.'",
        expected: "I didn't go to the river",
        guide: "Phát âm rõ 'didn't' (/ˈdɪdnt/) và 'river' (/ˈrɪvə(r)/)."
      }
    ],
    writingPrompt: {
      prompt: "Hãy viết 2-3 câu kể về một chuyến du lịch của bạn trong quá khứ (Bạn đã đi đâu, đi bằng gì và đã làm gì ở đó).",
      guide: "Gợi ý: Last summer, I went to... with... We went by... I ate/saw...",
      placeholder: "Last summer, I went to Nha Trang beach with my family. We went by train. We swam in the sea."
    }
  },
  {
    id: 5,
    title: "Sức khỏe",
    englishTitle: "Health",
    themeColor: "from-rose-500 to-red-600",
    vocabulary: [
      { word: "the flu", ipa: "/ðə fluː/", meaning: "bệnh cúm", vietnamese: "bệnh cúm", example: "He has a high fever because he has the flu." },
      { word: "a toothache", ipa: "/ə ˈtuːθeɪk/", meaning: "đau răng", vietnamese: "đau răng", example: "She has a toothache, she should see a dentist." },
      { word: "a stomachache", ipa: "/ə ˈstʌməkeɪk/", meaning: "đau bụng", vietnamese: "đau bụng, đau dạ dày", example: "I have a stomachache because I ate too much fast food." },
      { word: "a headache", ipa: "/ə ˈhedeɪk/", meaning: "đau đầu", vietnamese: "đau đầu", example: "You should get some rest if you have a headache." },
      { word: "terrible", ipa: "/ˈterəbl/", meaning: "tồi tệ, khủng khiếp", vietnamese: "tồi tệ, kinh khủng", example: "I feel terrible today. I think I am sick." },
      { word: "weak", ipa: "/wiːk/", meaning: "yếu ớt", vietnamese: "yếu ớt, mệt mỏi", example: "He feels weak and sleepy." },
      { word: "see a dentist", ipa: "/siː ə ˈdentɪst/", meaning: "khám nha sĩ", vietnamese: "đi khám nha sĩ", example: "You should see a dentist if you have a toothache." },
      { word: "stay up late", ipa: "/steɪ ʌp leɪt/", meaning: "thức khuya", vietnamese: "thức khuya", example: "You shouldn't stay up late because it is bad for your health." },
      { word: "do exercise", ipa: "/duː ˈeksəsaɪz/", meaning: "tập thể dục", vietnamese: "tập thể dục", example: "We should do exercise everyday to stay healthy." },
      { word: "eat fast food", ipa: "/iːt fɑːst fuːd/", meaning: "ăn đồ ăn nhanh", vietnamese: "ăn thức ăn nhanh", example: "You shouldn't eat fast food because it has too much oil." }
    ],
    patterns: [
      "What's wrong? - I have a stomachache.",
      "How do you feel? - I feel weak. - That's too bad.",
      "You should see a dentist. You shouldn't stay up late.",
      "What should I do to be healthy? - You should do exercise. You shouldn't eat fast food."
    ],
    dialogue: [
      { speaker: "Alfie", text: "Hey Tom, what's wrong? You don't look well.", vietnamese: "Chào Tom, có chuyện gì thế? Trông cậu không được khỏe." },
      { speaker: "Tom", text: "I have a stomachache. It hurts a lot.", vietnamese: "Tớ bị đau bụng. Đau lắm cậu ạ." },
      { speaker: "Alfie", text: "Oh, that's too bad. Did you eat anything bad?", vietnamese: "Ôi, tiếc quá. Cậu có ăn gì bậy bạ không?" },
      { speaker: "Tom", text: "I ate too many candies last night.", vietnamese: "Tối qua tớ ăn nhiều kẹo quá." },
      { speaker: "Alfie", text: "You should drink some warm water and see a doctor.", vietnamese: "Cậu nên uống một ít nước ấm và đi khám bác sĩ đi nhé." }
    ],
    reading: {
      title: "How to Be Healthy at School",
      text: "In science class last week, Peter learned how to be healthy at school. His teacher said that students should eat lots of vegetables and fresh fruit. They shouldn't eat fast food or sweet candy because it is bad for their bodies and teeth. Also, they should do exercise and play outside during breaks. Peter and his classmates try to wash their hands before meals and never skip breakfast.",
      translation: "Trong giờ khoa học tuần trước, Peter đã học cách sống khỏe mạnh ở trường. Giáo viên của cậu ấy nói rằng học sinh nên ăn nhiều rau và trái cây tươi. Họ không nên ăn thức ăn nhanh hoặc kẹo ngọt vì nó có hại cho cơ thể và răng. Ngoài ra, họ nên tập thể dục và chơi đùa ngoài trời trong các giờ giải lao. Peter và các bạn cùng lớp cố gắng rửa tay trước bữa ăn và không bao giờ bỏ bữa sáng.",
      questions: [
        {
          question: "What did Peter learn about in science class?",
          options: ["How to build robots", "How to be healthy at school", "How to draw animals", "How to speak English"],
          answerIndex: 1,
          explanation: "The text states: 'Peter learned how to be healthy at school.'"
        },
        {
          question: "What shouldn't students eat according to the teacher?",
          options: ["Vegetables", "Fresh fruit", "Fast food or sweet candy", "Rice and fish"],
          answerIndex: 2,
          explanation: "They shouldn't eat fast food or sweet candy because it's bad for their health."
        },
        {
          question: "When should students wash their hands?",
          options: ["Before meals", "After sleeping", "During class", "Never"],
          answerIndex: 0,
          explanation: "They try to wash their hands before meals."
        }
      ]
    },
    exercises: [
      {
        id: "u5_ex1",
        type: "multiple-choice",
        question: "You have a toothache. You ____ see a dentist.",
        options: ["should", "shouldn't", "mustn't", "are"],
        answer: 0,
        explanation: "We use 'should' to give positive medical advice."
      },
      {
        id: "u5_ex2",
        type: "multiple-choice",
        question: "You ____ stay up late. It makes you feel sleepy.",
        options: ["should", "shouldn't", "can", "are"],
        answer: 1,
        explanation: "We use 'shouldn't' to advise against bad habits like staying up late."
      },
      {
        id: "u5_ex3",
        type: "fill-blank",
        question: "What's ________? - I have a headache.",
        answer: "wrong",
        explanation: "The pattern 'What's wrong?' is used to ask someone about their health issue."
      }
    ],
    speakingPrompts: [
      {
        prompt: "Nói lời khuyên sức khỏe: 'You shouldn't stay up late.'",
        expected: "You should not stay up late",
        guide: "Phát âm rõ 'shouldn't' và 'late' có âm chặn /t/ cuối."
      },
      {
        prompt: "Trả lời câu hỏi sức khỏe: 'I have a headache.'",
        expected: "I have a headache",
        guide: "Phát âm từ 'headache' (/ˈhedeɪk/) có âm cuối phát âm là /k/."
      }
    ],
    writingPrompt: {
      prompt: "Hãy viết 2-3 câu đưa ra lời khuyên cho một người bạn đang bị ốm hoặc mệt mỏi.",
      guide: "Gợi ý: You have the flu. You should get some rest. You shouldn't play computer games.",
      placeholder: "You have a toothache. You should see a dentist. You shouldn't eat sweet candy."
    }
  },
  {
    id: 6,
    title: "Đồ ăn thức uống",
    englishTitle: "Food and Drinks",
    themeColor: "from-amber-500 to-yellow-600",
    vocabulary: [
      { word: "sugar", ipa: "/ˈʃʊɡə(r)/", meaning: "đường", vietnamese: "đường ngọt", example: "I need a little sugar for my tea." },
      { word: "butter", ipa: "/ˈbʌtə(r)/", meaning: "bơ", vietnamese: "bơ lạt", example: "We need some butter to make the cake." },
      { word: "flour", ipa: "/ˈflaʊə(r)/", meaning: "bột mì", vietnamese: "bột mì", example: "He needs a lot of flour to bake bread." },
      { word: "chocolate chips", ipa: "/ˈtʃɒklət tʃɪps/", meaning: "sô-cô-la hạt nút", vietnamese: "sô-cô-la hạt nút", example: "She needs a few chocolate chips for the cookies." },
      { word: "soda", ipa: "/ˈsəʊdə/", meaning: "nước ngọt có ga", vietnamese: "nước ngọt có ga", example: "Would you like some lemon soda?" },
      { word: "smoothie", ipa: "/ˈsmuːði/", meaning: "sinh tố", vietnamese: "sinh tố trái cây", example: "Let's make banana smoothies!" },
      { word: "hamburger", ipa: "/ˈhæmbɜːɡə(r)/", meaning: "bánh kẹp thịt", vietnamese: "bánh mì kẹp thịt", example: "Will you bring hamburgers to the picnic?" },
      { word: "cereal", ipa: "/ˈsɪəriəl/", meaning: "ngũ cốc", vietnamese: "ngũ cốc ăn sáng", example: "They usually eat cereal with milk for breakfast." },
      { word: "a little", ipa: "/ə ˈlɪtl/", meaning: "một ít (dùng với danh từ không đếm được)", vietnamese: "một ít (không đếm được)", example: "I need a little milk." },
      { word: "a few", ipa: "/ə fjuː/", meaning: "một vài (dùng với danh từ đếm được số nhiều)", vietnamese: "một vài (đếm được)", example: "She needs a few apples." }
    ],
    patterns: [
      "I need a little butter.",
      "Let's make smoothies. - OK. I'll bring milk.",
      "Will you bring hamburgers? - Yes, I will. / No, I won't.",
      "What do people in the USA usually eat for breakfast? - They usually eat cereal with milk."
    ],
    dialogue: [
      { speaker: "Lucy", text: "Dad, I want to make a cake. What do we need?", vietnamese: "Bố ơi, con muốn làm bánh ngọt. Chúng ta cần những gì ạ?" },
      { speaker: "Dad", text: "Well, we need a lot of flour, and a little butter.", vietnamese: "À, chúng ta cần nhiều bột mì, và một ít bơ." },
      { speaker: "Lucy", text: "Do we have sugar?", vietnamese: "Chúng ta có đường không bố?" },
      { speaker: "Dad", text: "No, we don't. We need some sugar and a few chocolate chips.", vietnamese: "Không, chúng ta hết rồi. Chúng ta cần một ít đường và một vài hạt sô-cô-la nút." }
    ],
    reading: {
      title: "Meals in the UK",
      text: "Michelle is from the UK. At home, her family usually eats bread and eggs for breakfast. Her brother never eats cereal because he doesn't like milk. For lunch, Michelle usually eats a chicken or ham sandwich at school. Dinner is her favorite meal. Her mom usually cooks meat and vegetables. After dinner, they eat delicious cakes or sweet cookies. In the evening, her dad loves drinking coffee.",
      translation: "Michelle đến từ Vương quốc Anh. Ở nhà, gia đình cô ấy thường ăn bánh mì và trứng vào bữa sáng. Em trai cô ấy không bao giờ ăn ngũ cốc vì cậu ấy không thích sữa. Vào bữa trưa, Michelle thường ăn một chiếc bánh sandwich thịt gà hoặc giăm bông ở trường. Bữa tối là bữa ăn yêu thích của cô ấy. Mẹ cô ấy thường nấu thịt và rau. Sau bữa tối, họ ăn bánh ngọt hoặc bánh quy ngọt rất ngon. Vào buổi tối, bố cô ấy thích uống cà phê.",
      questions: [
        {
          question: "What does Michelle's family usually eat for breakfast?",
          options: ["Bread and eggs", "Cereal with milk", "Soup", "Rice and fish"],
          answerIndex: 0,
          explanation: "The text says 'her family usually eats bread and eggs for breakfast.'"
        },
        {
          question: "Why doesn't Michelle's brother eat cereal?",
          options: ["Because he doesn't like sugar", "Because he doesn't like milk", "Because he likes soup", "Because it is expensive"],
          answerIndex: 1,
          explanation: "He never eats cereal because he doesn't like milk."
        },
        {
          question: "What is Michelle's favorite meal of the day?",
          options: ["Breakfast", "Lunch", "Dinner", "Brunch"],
          answerIndex: 2,
          explanation: "The passage mentions: 'Dinner is her favorite meal.'"
        }
      ]
    },
    exercises: [
      {
        id: "u6_ex1",
        type: "multiple-choice",
        question: "I need a ____ butter. (Butter is uncountable)",
        options: ["little", "few", "many", "lot"],
        answer: 0,
        explanation: "We use 'a little' with uncountable nouns like butter or sugar."
      },
      {
        id: "u6_ex2",
        type: "multiple-choice",
        question: "She needs a ____ chocolate chips. (Chocolate chips are countable)",
        options: ["little", "few", "much", "any"],
        answer: 1,
        explanation: "We use 'a few' with plural countable nouns like chocolate chips or apples."
      },
      {
        id: "u6_ex3",
        type: "fill-blank",
        question: "Will you bring some cupcakes? - Yes, I _________.",
        answer: "will",
        explanation: "The positive short answer to 'Will you...?' is 'Yes, I will.'"
      }
    ],
    speakingPrompts: [
      {
        prompt: "Nói câu yêu cầu nguyên liệu: 'I need a little sugar.'",
        expected: "I need a little sugar",
        guide: "Phát âm từ 'sugar' có âm đầu /ʃ/ giống như 'she'."
      },
      {
        prompt: "Rủ rê làm sinh tố: 'Let's make smoothies!'",
        expected: "Let's make smoothies",
        guide: "Chú ý phát âm đuôi /z/ trong từ 'smoothies'."
      }
    ],
    writingPrompt: {
      prompt: "Hãy viết 2-3 câu giới thiệu những gì gia đình bạn thường ăn vào bữa sáng (hoặc bữa trưa, bữa tối).",
      guide: "Gợi ý: For breakfast, my family usually eats... My mom drinks... I eat...",
      placeholder: "For breakfast, my family usually eats bread and eggs. I drink a glass of milk."
    }
  },
  {
    id: 7,
    title: "Nghề nghiệp",
    englishTitle: "Jobs",
    themeColor: "from-indigo-500 to-purple-600",
    vocabulary: [
      { word: "scientist", ipa: "/ˈsaɪəntɪst/", meaning: "nhà khoa học", vietnamese: "nhà khoa học", example: "I would like to be a scientist when I grow up." },
      { word: "pilot", ipa: "/ˈpaɪlət/", meaning: "phi công", vietnamese: "phi công", example: "A pilot flies planes around the world." },
      { word: "tour guide", ipa: "/ˈtʊə ɡaɪd/", meaning: "hướng dẫn viên du lịch", vietnamese: "hướng dẫn viên", example: "A tour guide shows tourists beautiful places." },
      { word: "hairdresser", ipa: "/ˈheədresə(r)/", meaning: "thợ cắt tóc", vietnamese: "thợ làm tóc", example: "The hairdresser cut my hair beautifully." },
      { word: "designer", ipa: "/dɪˈzaɪnə(r)/", meaning: "nhà thiết kế", vietnamese: "nhà thiết kế", example: "A fashion designer designs nice clothes." },
      { word: "soccer player", ipa: "/ˈsɒkə ˈpleɪə(r)/", meaning: "cầu thủ bóng đá", vietnamese: "cầu thủ bóng đá", example: "Tom wants to be a professional soccer player." },
      { word: "zookeeper", ipa: "/ˈzuːkiːpə(r)/", meaning: "nhân viên sở thú", vietnamese: "người trông sở thú", example: "The zookeeper feeds lions and monkeys everyday." },
      { word: "baker", ipa: "/ˈbeɪkə(r)/", meaning: "thợ làm bánh", vietnamese: "thợ làm bánh", example: "A baker works in a bakery and makes bread." },
      { word: "astronaut", ipa: "/ˈæstrənɔːt/", meaning: "phi hành gia", vietnamese: "phi hành gia", example: "An astronaut travels in space to other planets." },
      { word: "engineer", ipa: "/ˌendʒɪˈnɪə(r)/", meaning: "kỹ sư", vietnamese: "kỹ sư", example: "Many people will be engineers in the future." }
    ],
    patterns: [
      "What would you like to be when you grow up? - I'd like to be a scientist.",
      "Tom likes sports. I think he'll be a soccer player.",
      "Will you be a baker in the future? - Yes, I will. I love baking. / No, I won't.",
      "What jobs will people do in the future? - I think many people will be engineers."
    ],
    dialogue: [
      { speaker: "Alfie", text: "What would you like to be when you grow up, Jill?", vietnamese: "Cậu muốn làm nghề gì khi lớn lên hả Jill?" },
      { speaker: "Jill", text: "I'd like to be a pilot because I want to fly in the sky!", vietnamese: "Tớ muốn trở thành phi công vì tớ muốn bay lượn trên bầu trời!" },
      { speaker: "Alfie", text: "That's a great job! What about Tom?", vietnamese: "Đó là một công việc tuyệt vời! Thế còn Tom thì sao?" },
      { speaker: "Jill", text: "Tom likes sports. I think he'll be a soccer player.", vietnamese: "Tom thích thể thao lắm. Tớ nghĩ cậu ấy sẽ là một cầu thủ bóng đá." }
    ],
    reading: {
      title: "Future Jobs",
      text: "Andy is in the fifth grade. This week, they learned about popular jobs in the future. Andy thinks being an astronaut will be very popular because people will want to live and travel in space. His teacher says we will also need many engineers to build eco-friendly roads, high bridges, and modern buildings. They will even build helpful robots to do difficult houseworks for us.",
      translation: "Andy đang học lớp năm. Tuần này, các bạn ấy đã học về những công việc phổ biến trong tương lai. Andy nghĩ rằng trở thành phi hành gia sẽ rất phổ biến vì mọi người sẽ muốn sống và du lịch trong không gian. Giáo viên của cậu ấy nói rằng chúng ta cũng sẽ cần nhiều kỹ sư để xây dựng những con đường thân thiện với môi trường, những cây cầu cao và những tòa nhà hiện đại. Họ thậm chí sẽ chế tạo những robot hữu ích để làm việc nhà khó khăn cho chúng ta.",
      questions: [
        {
          question: "Why does Andy think being an astronaut will be popular?",
          options: ["Because astronauts earn lots of money", "Because people will want to live in space", "Because they wear nice suits", "Because it is easy to learn"],
          answerIndex: 1,
          explanation: "Andy thinks so because 'people will want to live and travel in space.'"
        },
        {
          question: "Who will build eco-friendly roads and modern buildings?",
          options: ["Doctors", "Engineers", "Hairdressers", "Tour guides"],
          answerIndex: 1,
          explanation: "The passage says we will need 'many engineers to build eco-friendly roads...'"
        },
        {
          question: "What will robots do according to the text?",
          options: ["Teach English", "Do difficult houseworks", "Fly planes", "Feed animals in the zoo"],
          answerIndex: 1,
          explanation: "Robots will do difficult houseworks for us."
        }
      ]
    },
    exercises: [
      {
        id: "u7_ex1",
        type: "multiple-choice",
        question: "What would you like ____ be when you grow up?",
        options: ["to", "for", "at", "in"],
        answer: 0,
        explanation: "The structure is 'would like to do something' (would like to be)."
      },
      {
        id: "u7_ex2",
        type: "multiple-choice",
        question: "He likes playing the piano. I think he'll be a ____.",
        options: ["piano player", "soccer player", "zookeeper", "hairdresser"],
        answer: 0,
        explanation: "Someone who plays the piano is a 'piano player'."
      },
      {
        id: "u7_ex3",
        type: "fill-blank",
        question: "Will you be a zookeeper? - No, I _________.",
        answer: "won't",
        explanation: "The negative short answer for 'Will you...?' is 'No, I won't.'"
      }
    ],
    speakingPrompts: [
      {
        prompt: "Nói về ước mơ nghề nghiệp: 'I'd like to be a pilot.'",
        expected: "I would like to be a pilot",
        guide: "Phát âm rõ cụm viết tắt 'I'd like' (/aɪd laɪk/)."
      },
      {
        prompt: "Dự đoán nghề tương lai: 'I think many people will be engineers.'",
        expected: "I think many people will be engineers",
        guide: "Từ 'engineers' (/ˌendʒɪˈnɪəz/) có trọng âm rơi vào âm tiết cuối."
      }
    ],
    writingPrompt: {
      prompt: "Hãy viết 2-3 câu giới thiệu về công việc mà bạn muốn làm khi lớn lên và lý do vì sao bạn thích công việc đó.",
      guide: "Gợi ý: When I grow up, I'd like to be a... because I like... and I want to...",
      placeholder: "When I grow up, I'd like to be a teacher because I love children and I want to teach English."
    }
  },
  {
    id: 8,
    title: "Thời tiết",
    englishTitle: "Weather",
    themeColor: "from-blue-400 to-sky-500",
    vocabulary: [
      { word: "tonight", ipa: "/təˈnaɪt/", meaning: "tối nay", vietnamese: "tối nay", example: "It's going to rainstorm tonight." },
      { word: "tomorrow", ipa: "/təˈmɒrəʊ/", meaning: "ngày mai", vietnamese: "ngày mai", example: "I am going to visit the beach tomorrow." },
      { word: "humid", ipa: "/ˈhjuːmɪd/", meaning: "ẩm ướt", vietnamese: "ẩm ướt", example: "The weather is hot and humid today." },
      { word: "breezy", ipa: "/ˈbriːzi/", meaning: "có gió nhẹ", vietnamese: "có gió hiu hiu", example: "It's calm and breezy. Perfect to fly a kite!" },
      { word: "clear", ipa: "/klɪə(r)/", meaning: "trong xanh, quang đãng", vietnamese: "trong xanh, không mây", example: "It is a clear day today. The sun is shining." },
      { word: "rainstorm", ipa: "/ˈreɪnstɔːm/", meaning: "bão mưa lớn", vietnamese: "mưa bão", example: "There will be a rainstorm tonight, stay inside." },
      { word: "shower", ipa: "/ˈʃaʊə(r)/", meaning: "mưa rào", vietnamese: "mưa rào", example: "There will be some showers tomorrow morning." },
      { word: "spring", ipa: "/sprɪŋ/", meaning: "mùa xuân", vietnamese: "mùa xuân", example: "Flowers bloom beautifully in the spring." },
      { word: "summer", ipa: "/ˈsʌmə(r)/", meaning: "mùa hè", vietnamese: "mùa hè", example: "We go swimming in the summer." },
      { word: "winter", ipa: "/ˈwɪntə(r)/", meaning: "mùa đông", vietnamese: "mùa đông", example: "It is very cold and snowy in the winter." }
    ],
    patterns: [
      "I'm going to visit the beach tomorrow. I hope the weather is sunny.",
      "It's humid today. Oh, then I'm going to visit the water park.",
      "There will be some showers, so I'm going to bring my umbrella.",
      "What's the weather like in Melbourne in the summer? - It's warm and dry."
    ],
    dialogue: [
      { speaker: "Mai", text: "It's so rainy today! I don't want to go to the playground.", vietnamese: "Hôm nay trời mưa to quá! Tớ không muốn ra sân chơi đâu." },
      { speaker: "Tom", text: "Me too. What are you going to do tonight?", vietnamese: "Tớ cũng vậy. Tối nay cậu định làm gì?" },
      { speaker: "Mai", text: "I'm going to stay at home and read books.", vietnamese: "Tớ sẽ ở nhà đọc sách." },
      { speaker: "Tom", text: "I hope the weather tomorrow is breezy so we can fly a kite!", vietnamese: "Tớ hy vọng ngày mai trời có gió nhẹ để chúng ta đi thả diều!" }
    ],
    reading: {
      title: "Weather in Vietnam",
      text: "Huyen lives in Ho Chi Minh City, Vietnam. There are only two seasons here: the rainy season and the dry season. The rainy season is usually from May to November. It is often hot, humid, and has heavy rainstorms in the afternoon. The dry season is from December to April. It is very sunny, dry, and warm. Huyen loves the dry season because she can go for walks in the park and eat ice cream.",
      translation: "Huyền sống ở Thành phố Hồ Chí Minh, Việt Nam. Ở đây chỉ có hai mùa: mùa mưa và mùa khô. Mùa mưa thường kéo dài từ tháng Năm đến tháng Mười Một. Trời thường nóng, ẩm và có mưa giông lớn vào buổi chiều. Mùa khô kéo dài từ tháng Mười Hai đến tháng Tư. Trời rất nắng, khô ráo và ấm áp. Huyền thích mùa khô vì cô ấy có thể đi dạo trong công viên và ăn kem.",
      questions: [
        {
          question: "How many seasons are there in Ho Chi Minh City?",
          options: ["Four seasons", "Two seasons", "Three seasons", "Only one season"],
          answerIndex: 1,
          explanation: "The text says 'There are only two seasons here: the rainy season and the dry season.'"
        },
        {
          question: "When is the rainy season in Ho Chi Minh City?",
          options: ["From December to April", "From May to November", "In the winter", "All year round"],
          answerIndex: 1,
          explanation: "The rainy season is usually from May to November."
        },
        {
          question: "Why does Huyen love the dry season?",
          options: ["Because she can stay up late", "Because she can go for walks in the park", "Because it is snowy", "Because she doesn't like water"],
          answerIndex: 1,
          explanation: "She loves the dry season because she can go for walks in the park and eat ice cream."
        }
      ]
    },
    exercises: [
      {
        id: "u8_ex1",
        type: "multiple-choice",
        question: "I'm ____ to visit the beach tomorrow.",
        options: ["go", "going", "went", "goes"],
        answer: 1,
        explanation: "We use 'be going to' for planned future actions (I'm going to)."
      },
      {
        id: "u8_ex2",
        type: "multiple-choice",
        question: "There will be a rainstorm, ____ I'm going to bring my raincoat.",
        options: ["so", "because", "but", "or"],
        answer: 0,
        explanation: "We use 'so' (vì vậy) to show the result or consequence."
      },
      {
        id: "u8_ex3",
        type: "fill-blank",
        question: "What's the weather ______ in Hanoi today? - It's sunny.",
        answer: "like",
        explanation: "The pattern for asking about weather is 'What's the weather like...?'"
      }
    ],
    speakingPrompts: [
      {
        prompt: "Nói về kế hoạch ngày mai: 'I'm going to visit the beach tomorrow.'",
        expected: "I am going to visit the beach tomorrow",
        guide: "Chú ý phát âm rõ từ 'tomorrow' và 'beach' (âm /iː/ kéo dài)."
      },
      {
        prompt: "Nói về thời tiết: 'There will be some showers.'",
        expected: "There will be some showers",
        guide: "Phát âm rõ 'showers' (/ˈʃaʊəz/) có âm đuôi /z/."
      }
    ],
    writingPrompt: {
      prompt: "Hãy viết 2-3 câu giới thiệu thời tiết hôm nay ở thành phố của bạn và kế hoạch của bạn.",
      guide: "Gợi ý: Today the weather is... I'm going to... with my...",
      placeholder: "Today the weather is hot and sunny. I am going to go swimming with my friends."
    }
  }
];
