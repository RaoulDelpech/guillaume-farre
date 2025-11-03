"use client";
import Navigation from "@/components/navigation/Navigation";
import { useState } from "react";
import { useConfetti } from "@/hooks/useConfetti";
import { Link } from "@/i18n/routing";

const QUESTIONS = [
  {
    id: 1,
    question: "Quelle est votre relation avec l'automobile ?",
    options: [
      { text: "Je suis passionné(e), c'est ma vie", value: "passionate", emoji: "🏎️" },
      { text: "J'apprécie les belles voitures", value: "appreciator", emoji: "✨" },
      { text: "C'est surtout pratique pour moi", value: "practical", emoji: "🚗" },
      { text: "L'art avant tout, peu importe le support", value: "artist", emoji: "🎨" },
    ],
  },
  {
    id: 2,
    question: "Quel type d'œuvre d'art vous attire le plus ?",
    options: [
      { text: "Abstraite et énergique", value: "abstract", emoji: "💥" },
      { text: "Figurative et précise", value: "figurative", emoji: "🖼️" },
      { text: "Minimaliste et épurée", value: "minimalist", emoji: "⚪" },
      { text: "Colorée et vibrante", value: "colorful", emoji: "🌈" },
    ],
  },
  {
    id: 3,
    question: "Où imaginez-vous votre œuvre ?",
    options: [
      { text: "Dans mon bureau, pour m'inspirer", value: "office", emoji: "💼" },
      { text: "Dans mon salon, pièce maîtresse", value: "living", emoji: "🏠" },
      { text: "Dans ma collection privée", value: "collection", emoji: "🏛️" },
      { text: "Cadeau pour quelqu'un de spécial", value: "gift", emoji: "🎁" },
    ],
  },
  {
    id: 4,
    question: "Qu'est-ce qui vous motive dans l'achat d'art ?",
    options: [
      { text: "L'émotion et le coup de cœur", value: "emotion", emoji: "❤️" },
      { text: "L'investissement et la valeur", value: "investment", emoji: "💰" },
      { text: "L'exclusivité et la rareté", value: "exclusivity", emoji: "💎" },
      { text: "L'histoire et le sens", value: "meaning", emoji: "📖" },
    ],
  },
  {
    id: 5,
    question: "Votre couleur préférée parmi celles-ci ?",
    options: [
      { text: "Rouge Ferrari", value: "red", emoji: "🔴" },
      { text: "Or et jaune", value: "gold", emoji: "🟡" },
      { text: "Noir profond", value: "black", emoji: "⚫" },
      { text: "Argent métallique", value: "silver", emoji: "⚪" },
    ],
  },
];

const RESULTS = {
  empreinte: {
    title: "Empreinte Ferrari",
    description: "Vous êtes authentique et passionné(e). Les empreintes Ferrari capturent l'essence brute de la performance. Chaque trace raconte une histoire unique, comme votre personnalité.",
    image: "/photos/empreintes/empreinte-01.jpg",
    price: "À partir de 8 500€",
    link: "/boutique",
    traits: ["passionate", "emotion", "red", "abstract"],
  },
  projection: {
    title: "Projection Lumineuse",
    description: "Vous êtes moderne et visionnaire. Les projections lumineuses mêlent technologie et art. Vous appréciez l'innovation et les expériences visuelles uniques.",
    image: "/photos/projection/projection-01.jpg",
    price: "À partir de 6 500€",
    link: "/boutique",
    traits: ["artist", "colorful", "office", "minimalist"],
  },
  traces: {
    title: "Traces de Vitesse",
    description: "Vous êtes dynamique et audacieux(se). Les traces de vitesse incarnent l'énergie pure. Vous cherchez une œuvre qui bouge, qui vit, qui explose.",
    image: "/photos/atelier/ferrari-traces.jpg",
    price: "À partir de 12 000€",
    link: "/boutique",
    traits: ["passionate", "abstract", "investment", "gold"],
  },
  collection: {
    title: "Édition Limitée Exclusive",
    description: "Vous êtes collectionneur(se) averti(e). Les éditions limitées numérotées répondent à votre quête d'exclusivité. Vous savez reconnaître la valeur.",
    image: "/photos/empreintes/empreinte-02.jpg",
    price: "À partir de 15 000€",
    link: "/boutique",
    traits: ["appreciator", "exclusivity", "collection", "black"],
  },
  performance: {
    title: "Performance Live",
    description: "Vous êtes expérientiel(le) et unique. Assister à la création d'une œuvre en direct est ce qui vous fait vibrer. L'art doit être vécu, pas seulement vu.",
    image: "/photos/atelier/ferrari-action.jpg",
    price: "Places limitées",
    link: "/performances",
    traits: ["artist", "meaning", "gift", "silver"],
  },
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<keyof typeof RESULTS | null>(null);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const { fireCannonConfetti, fireFerrariConfetti } = useConfetti();

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculer le résultat
      calculateResult(newAnswers);
      fireCannonConfetti();
    }
  };

  const calculateResult = (finalAnswers: string[]) => {
    // Compter les traits dominants
    const traitCounts: Record<string, number> = {};

    finalAnswers.forEach((answer) => {
      traitCounts[answer] = (traitCounts[answer] || 0) + 1;
    });

    // Trouver quelle œuvre correspond le mieux
    let bestMatch: keyof typeof RESULTS = "empreinte";
    let bestScore = 0;

    Object.entries(RESULTS).forEach(([key, data]) => {
      let score = 0;
      data.traits.forEach((trait) => {
        score += traitCounts[trait] || 0;
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = key as keyof typeof RESULTS;
      }
    });

    setResult(bestMatch);
    setShowResult(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitted(true);
    fireFerrariConfetti();
    // Ici, envoyer l'email à un service (MailChimp, etc.)
    console.log("Email collecté:", email, "Résultat:", result);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResult(null);
    setEmail("");
    setEmailSubmitted(false);
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          {!showResult && (
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-primary rounded-full text-sm font-semibold mb-6">
                QUIZ INTERACTIF
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Quelle œuvre vous correspond ?
              </h1>
              <p className="text-xl text-muted-foreground">
                5 questions pour découvrir l'œuvre faite pour vous
              </p>

              {/* Progress bar */}
              <div className="mt-8 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Question {currentQuestion + 1} sur {QUESTIONS.length}
              </p>
            </div>
          )}

          {/* Questions */}
          {!showResult && (
            <div className="bg-card border-2 border-border rounded-3xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                {QUESTIONS[currentQuestion].question}
              </h2>

              <div className="grid gap-4">
                {QUESTIONS[currentQuestion].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="group relative bg-muted/30 hover:bg-muted border-2 border-border hover:border-primary rounded-xl p-6 text-left transition-all hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="text-lg font-medium group-hover:text-primary transition-colors">
                        {option.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {currentQuestion > 0 && (
                <button
                  onClick={() => {
                    setCurrentQuestion(currentQuestion - 1);
                    setAnswers(answers.slice(0, -1));
                  }}
                  className="mt-6 text-gray-400 hover:text-white transition-colors"
                >
                  ← Retour
                </button>
              )}
            </div>
          )}

          {/* Result */}
          {showResult && result && (
            <div>
              <div className="text-center mb-12">
                <div className="text-6xl mb-6">🎉</div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Votre œuvre idéale :
                </h1>
              </div>

              <div className="bg-card border-2 border-border rounded-3xl overflow-hidden">
                {/* Image */}
                <div className="relative h-80">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${RESULTS[result].image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-4xl font-bold mb-2">
                      {RESULTS[result].title}
                    </h2>
                    <p className="text-2xl text-primary font-semibold">
                      {RESULTS[result].price}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="p-8 md:p-12">
                  <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                    {RESULTS[result].description}
                  </p>

                  {!emailSubmitted ? (
                    <form onSubmit={handleEmailSubmit} className="mb-6">
                      <p className="text-center mb-4 text-muted-foreground">
                        Recevez un code promo de <strong className="text-foreground">-10%</strong> pour cette œuvre :
                      </p>
                      <div className="flex gap-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre@email.com"
                          required
                          className="flex-1 px-6 py-4 bg-muted border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                        />
                        <button
                          type="submit"
                          className="px-8 py-4 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg transition-all whitespace-nowrap"
                        >
                          Obtenir -10%
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-green-950/30 border-2 border-green-600/30 rounded-xl p-6 mb-6 text-center">
                      <div className="text-4xl mb-3">✅</div>
                      <p className="text-lg font-semibold text-green-500 mb-2">
                        Code promo envoyé !
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Vérifiez votre boîte mail (et les spams)
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={RESULTS[result].link}
                      className="flex-1 text-center px-8 py-4 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg transition-all"
                    >
                      Voir l'œuvre
                    </Link>
                    <button
                      onClick={restart}
                      className="px-8 py-4 bg-card hover:bg-accent/20 border-2 border-border text-foreground font-semibold rounded-lg transition-all"
                    >
                      Refaire le quiz
                    </button>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 text-center">
                <p className="text-gray-400 mb-4">Partagez votre résultat :</p>
                <div className="flex gap-3 justify-center">
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all">
                    Facebook
                  </button>
                  <button className="px-6 py-3 bg-black hover:bg-gray-900 rounded-lg font-bold transition-all">
                    Twitter
                  </button>
                  <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-bold transition-all">
                    Instagram
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
