class EnhancedQuizService {
  constructor() {
    // INTERESTS QUIZ - 15 questions about personality and preferences
    this.interestsQuiz = [
      {
        id: 1,
        category: 'Interests',
        question: "What kind of tasks do you naturally enjoy the most?",
        options: [
          { text: "Figuring out how things work (logic, systems, experiments)", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Planning, budgeting, or finding smart ways to earn/save money", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Creating something new (design, writing, music, ideas)", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Fixing/building things with your hands (practical, real-world)", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 2,
        category: 'Interests',
        question: "Which school activity would you happily do even without marks?",
        options: [
          { text: "Lab work, coding, robotics, or science projects", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Business fairs, selling products, or managing event budgets", weights: { science: 0, commerce: 3, arts: 0, vocational: 1 } },
          { text: "Drama, debates, creative writing, or media work", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Workshops like electrical, carpentry, cooking, or repair tasks", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 3,
        category: 'Interests',
        question: "If you had a free weekend, what would you pick?",
        options: [
          { text: "Watch documentaries or try a science/tech DIY project", weights: { science: 3, commerce: 0, arts: 0, vocational: 1 } },
          { text: "Follow business/news trends or learn investing basics", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Create content (art, writing, photography, video)", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Learn a hands-on skill (tools, cooking, styling, repairs)", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 4,
        category: 'Interests',
        question: "What type of problems feel most satisfying to solve?",
        options: [
          { text: "Complex puzzles that need logic and step-by-step reasoning", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Real-life money or business problems with trade-offs", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Human stories, emotions, or social issues", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Practical problems where you can quickly see results", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 5,
        category: 'Interests',
        question: "What kind of books or content do you prefer?",
        options: [
          { text: "Science fiction, technology, or self-help books", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Business biographies, finance, or entrepreneurship stories", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Novels, poetry, art books, or creative writing", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "DIY guides, manuals, or practical skill tutorials", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 6,
        category: 'Interests',
        question: "How do you prefer to work with others?",
        options: [
          { text: "Collaborate on technical projects and share knowledge", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Lead teams, organize events, or manage projects", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Brainstorm creative ideas or artistic collaborations", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Work together on practical, hands-on projects", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 7,
        category: 'Interests',
        question: "What career aspects attract you most?",
        options: [
          { text: "Innovation, research, and discovering new things", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Leadership, strategy, and financial success", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Self-expression, creativity, and making an impact", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Stability, practical skills, and tangible results", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 8,
        category: 'Interests',
        question: "Which environment do you work best in?",
        options: [
          { text: "Quiet, focused spaces with tools and equipment", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Busy, dynamic offices with lots of networking", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Creative studios or inspiring, flexible spaces", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Workshops, labs, or places with hands-on activities", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 9,
        category: 'Interests',
        question: "What motivates you most?",
        options: [
          { text: "Understanding complex systems and finding solutions", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Achieving financial goals and business success", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Expressing yourself creatively and inspiring others", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Creating tangible things and seeing immediate results", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 10,
        category: 'Interests',
        question: "How do you approach learning new things?",
        options: [
          { text: "Study theories, understand principles, and experiment", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Learn from case studies, analyze trends, and apply practically", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Explore creatively, experiment freely, and express yourself", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Learn by doing, practice hands-on, and master skills", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 11,
        category: 'Interests',
        question: "What kind of impact do you want to make?",
        options: [
          { text: "Advance knowledge and solve technical problems", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Build successful businesses and create economic value", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Create art, culture, or inspire social change", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Build practical solutions and help people directly", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 12,
        category: 'Interests',
        question: "Which subjects did you enjoy most in school?",
        options: [
          { text: "Mathematics, physics, chemistry, biology", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Economics, business studies, accounting", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Literature, arts, music, social studies", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Workshop, technical drawing, home science", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 13,
        category: 'Interests',
        question: "How do you handle stress or pressure?",
        options: [
          { text: "Analyze the problem logically and find systematic solutions", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Plan strategically and manage resources efficiently", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Express yourself creatively or find inspiration", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Focus on practical actions and immediate solutions", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 14,
        category: 'Interests',
        question: "What role do you usually take in group projects?",
        options: [
          { text: "The researcher or technical expert", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "The leader or coordinator", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "The creative director or idea generator", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "The builder or hands-on implementer", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      },
      {
        id: 15,
        category: 'Interests',
        question: "What excites you about the future?",
        options: [
          { text: "New technologies, scientific discoveries, and space exploration", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Startups, innovation, and global business opportunities", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "New art forms, cultural movements, and creative expression", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Sustainable living, practical skills, and community building", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } }
        ]
      }
    ];

    // APTITUDE & KNOWLEDGE QUIZ - 20 questions covering all course areas
    this.aptitudeQuiz = [
      // Mathematics & Science Aptitude
      {
        id: 101,
        category: 'Science Aptitude',
        question: "If 2x + 5 = 13, what is the value of x?",
        options: [
          { text: "x = 4", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "x = 8", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "x = 3", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "x = 6", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 102,
        category: 'Science Aptitude',
        question: "What is the chemical formula for water?",
        options: [
          { text: "H2O", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "CO2", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "O2", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "N2", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 103,
        category: 'Science Aptitude',
        question: "Which planet is known as the Red Planet?",
        options: [
          { text: "Mars", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Venus", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Jupiter", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Saturn", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 104,
        category: 'Science Aptitude',
        question: "What is the speed of light in vacuum?",
        options: [
          { text: "299,792,458 m/s", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "300,000,000 m/s", weights: { science: 2, commerce: 0, arts: 0, vocational: 0 } },
          { text: "150,000,000 m/s", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "500,000,000 m/s", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 105,
        category: 'Science Aptitude',
        question: "What is the process by which plants make their own food?",
        options: [
          { text: "Photosynthesis", weights: { science: 3, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Respiration", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Transpiration", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Germination", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },

      // Commerce & Business Aptitude
      {
        id: 106,
        category: 'Commerce Aptitude',
        question: "What is profit?",
        options: [
          { text: "Revenue - Expenses", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Revenue + Expenses", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Expenses - Revenue", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Revenue × Expenses", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 107,
        category: 'Commerce Aptitude',
        question: "What does ROI stand for?",
        options: [
          { text: "Return on Investment", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Rate of Interest", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Risk of Investment", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Return on Income", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 108,
        category: 'Commerce Aptitude',
        question: "What is a balance sheet?",
        options: [
          { text: "Assets = Liabilities + Equity", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Revenue - Expenses", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Cash flow statement", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Income statement", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 109,
        category: 'Commerce Aptitude',
        question: "What is inflation?",
        options: [
          { text: "Rate at which prices increase", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Rate at which prices decrease", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Stable prices", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Stock market performance", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 110,
        category: 'Commerce Aptitude',
        question: "What is a supply chain?",
        options: [
          { text: "Network from production to delivery", weights: { science: 0, commerce: 3, arts: 0, vocational: 0 } },
          { text: "Only manufacturing process", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Only retail stores", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Only transportation", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },

      // Arts & Creative Aptitude
      {
        id: 111,
        category: 'Arts Aptitude',
        question: "What are the primary colors?",
        options: [
          { text: "Red, Blue, Yellow", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Red, Green, Blue", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Black, White, Gray", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Orange, Purple, Green", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 112,
        category: 'Arts Aptitude',
        question: "What is perspective in art?",
        options: [
          { text: "Creating depth and dimension", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Bright colors only", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Abstract shapes", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Black and white only", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 113,
        category: 'Arts Aptitude',
        question: "What is a metaphor?",
        options: [
          { text: "Comparison without using 'like' or 'as'", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Direct comparison", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Rhyming words", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Factual statement", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 114,
        category: 'Arts Aptitude',
        question: "What is rhythm in music?",
        options: [
          { text: "Pattern of beats and timing", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Only melody", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Only lyrics", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Only volume", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 115,
        category: 'Arts Aptitude',
        question: "What is composition in visual arts?",
        options: [
          { text: "Arrangement of elements in artwork", weights: { science: 0, commerce: 0, arts: 3, vocational: 0 } },
          { text: "Only colors used", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Only size of artwork", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Only subject matter", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },

      // Vocational & Practical Aptitude
      {
        id: 116,
        category: 'Vocational Aptitude',
        question: "What is the first step in troubleshooting?",
        options: [
          { text: "Identify the problem", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } },
          { text: "Replace the device", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Call for help", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Ignore the problem", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 117,
        category: 'Vocational Aptitude',
        question: "What is a circuit?",
        options: [
          { text: "Path for electric current", weights: { science: 1, commerce: 0, arts: 0, vocational: 3 } },
          { text: "Only a battery", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Only a light bulb", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Only a switch", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 118,
        category: 'Vocational Aptitude',
        question: "What is measurement in carpentry?",
        options: [
          { text: "Marking and checking dimensions", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } },
          { text: "Only cutting wood", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Only painting", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Only sanding", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 119,
        category: 'Vocational Aptitude',
        question: "What is safety equipment?",
        options: [
          { text: "Protective gear for workplace safety", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } },
          { text: "Office supplies", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Decorative items", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Entertainment devices", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      },
      {
        id: 120,
        category: 'Vocational Aptitude',
        question: "What is a blueprint?",
        options: [
          { text: "Technical drawing for construction", weights: { science: 0, commerce: 0, arts: 0, vocational: 3 } },
          { text: "Artistic painting", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Photograph", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } },
          { text: "Sketch", weights: { science: 0, commerce: 0, arts: 0, vocational: 0 } }
        ]
      }
    ];
  }

  // Get interests quiz questions
  getInterestsQuestions() {
    return this.interestsQuiz;
  }

  // Get aptitude quiz questions
  getAptitudeQuestions() {
    return this.aptitudeQuiz;
  }

  // Calculate scores for interests quiz
  calculateInterestsScores(answers) {
    const scores = { science: 0, commerce: 0, arts: 0, vocational: 0 };
    
    answers.forEach(answer => {
      const question = this.interestsQuiz.find(q => q.id === answer.question_id);
      if (question && answer.selected_option_index >= 0 && answer.selected_option_index < question.options.length) {
        const weights = question.options[answer.selected_option_index].weights;
        Object.keys(weights).forEach(key => {
          scores[key] += weights[key];
        });
      }
    });

    return scores;
  }

  // Calculate scores for aptitude quiz
  calculateAptitudeScores(answers) {
    const scores = { science: 0, commerce: 0, arts: 0, vocational: 0 };
    let correctAnswers = 0;
    
    answers.forEach(answer => {
      const question = this.aptitudeQuiz.find(q => q.id === answer.question_id);
      if (question && answer.selected_option_index >= 0 && answer.selected_option_index < question.options.length) {
        const weights = question.options[answer.selected_option_index].weights;
        Object.keys(weights).forEach(key => {
          scores[key] += weights[key];
        });
        
        // Check if answer is correct (has positive weights)
        if (Object.values(weights).some(w => w > 0)) {
          correctAnswers++;
        }
      }
    });

    return {
      scores,
      accuracy: (correctAnswers / answers.length) * 100,
      correctAnswers,
      totalQuestions: answers.length
    };
  }

  // Combine scores from both quizzes
  combineScores(interestsScores, aptitudeScores) {
    const combined = { science: 0, commerce: 0, arts: 0, vocational: 0 };
    
    // Weight interests quiz more heavily (60%) and aptitude quiz (40%)
    const interestsWeight = 0.6;
    const aptitudeWeight = 0.4;
    
    Object.keys(combined).forEach(key => {
      combined[key] = (interestsScores[key] * interestsWeight) + (aptitudeScores.scores[key] * aptitudeWeight);
    });

    return combined;
  }

  // Determine dominant domain
  determineDominantDomain(scores) {
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  }

  // Generate course recommendations based on combined scores
  generateCourseRecommendations(combinedScores, userProfile) {
    const domain = this.determineDominantDomain(combinedScores);
    const recommendations = {
      primaryDomain: domain,
      scores: combinedScores,
      recommendedCourses: [],
      explanation: '',
      confidence: 0
    };

    // Calculate confidence based on score distribution
    const maxScore = Math.max(...Object.values(combinedScores));
    const totalScore = Object.values(combinedScores).reduce((a, b) => a + b, 0);
    recommendations.confidence = totalScore > 0 ? (maxScore / totalScore) * 100 : 0;

    // Generate explanation
    recommendations.explanation = `Based on your interests (${Math.round(combinedScores[domain] * 0.6)} points) and aptitude (${Math.round(combinedScores[domain] * 0.4)} points), you show strong aptitude for ${domain} stream.`;

    return recommendations;
  }

  // Validate answers
  validateAnswers(answers, quizType) {
    const errors = [];
    const quiz = quizType === 'interests' ? this.interestsQuiz : this.aptitudeQuiz;
    
    answers.forEach(answer => {
      const question = quiz.find(q => q.id === answer.question_id);
      if (!question) {
        errors.push(`Invalid question ID: ${answer.question_id}`);
      } else if (answer.selected_option_index < 0 || answer.selected_option_index >= question.options.length) {
        errors.push(`Invalid option index for question ${answer.question_id}`);
      }
    });

    return errors;
  }
}

module.exports = new EnhancedQuizService();
