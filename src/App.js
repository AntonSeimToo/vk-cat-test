import React, { useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import "./App.css";

const QUESTIONS = [
  {
    question: "Как ты проводишь выходной?",
    options: ["Сплю", "Гуляю", "Читаю", "Планирую мир"],
  },
  {
    question: "Выбери еду:",
    options: ["Молоко", "Рыба", "Паштет", "Мясо"],
  },
  {
    question: "Что тебе ближе?",
    options: ["Тишина", "Внимание", "Размышления", "Экшн"],
  },
];

const RESULTS = [
  {
    title: "Сонная британка",
    description: "Ты — воплощение уюта. Обожаешь мягкие подушки, неспешные прогулки и хороший сон.",
    image: "/images/british_cat.png"
  },
  {
    title: "Игривая сфинкс",
    description: "У тебя неуемная энергия и тяга к вниманию. Любишь быть в центре событий и радовать всех вокруг.",
    image: "/images/sphynx_cat.png"
  },
  {
    title: "Задумчивый сибиряк",
    description: "Независимость и мудрость — твой стиль. Ты наблюдателен, глубок и ценишь личное пространство.",
    image: "/images/siberian_cat.png"
  },
  {
    title: "Боевой мейн-кун",
    description: "Ты уверен в себе, громкий и харизматичный. Всегда готов действовать и защищать своих.",
    image: "/images/maine_coon_cat.png"
  }
];

function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [resultIndex, setResultIndex] = useState(0);

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (step + 1 === QUESTIONS.length) {
      showAdBeforeResult(newAnswers);
    } else {
      setStep(step + 1);
    }
  };

  const showAdBeforeResult = async (finalAnswers) => {
    try {
      const result = await bridge.send("VKWebAppShowNativeAds", { ad_format: "interstitial" });
      if (result.result) {
        console.log("Реклама показана");
      } else {
        console.log("Реклама не была показана");
      }
    } catch (error) {
      console.warn("Ошибка показа рекламы", error);
    }

    const index = getResultIndex(finalAnswers);
    setResultIndex(index);
    setShowResult(true);
  };

  const getResultIndex = (answers) => {
    const sum = answers.reduce((a, b) => a + b, 0);
    return sum % RESULTS.length;
  };

  const shareResult = async (textToShare) => {
    try {
      await bridge.send("VKWebAppShare", {
        link: "https://vk.com/appYOUR_APP_ID", // <-- Замени на ссылку на твоё мини-приложение
        text: textToShare
      });
    } catch (error) {
      console.error("Ошибка при попытке поделиться:", error);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setShowResult(false);
  };

  return (
    <div className="App">
      <h1>Какой ты котик?</h1>

      {!showResult ? (
        <>
          <h2>{QUESTIONS[step].question}</h2>
          <ul>
            {QUESTIONS[step].options.map((option, i) => (
              <li key={i}>
                <button onClick={() => handleAnswer(i)}>{option}</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="result">
          <h2>{RESULTS[resultIndex].title}</h2>
          <img src={RESULTS[resultIndex].image} alt="Котик" style={{ maxWidth: "250px", borderRadius: "16px" }} />
          <p>{RESULTS[resultIndex].description}</p>

          <button onClick={restart} style={{
            marginTop: "16px",
            padding: "10px 20px",
            backgroundColor: "#4a76a8",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer"
          }}>
            Пройти ещё раз
          </button>

          <button
            onClick={() => shareResult(`Я прошёл тест "Какой ты котик?" и стал: ${RESULTS[resultIndex].title} 😺 Проверь себя тоже!`)}
            style={{
              marginTop: "16px",
              padding: "10px 20px",
              backgroundColor: "#4a76a8",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            📤 Поделиться ВКонтакте
          </button>
        </div>
      )}

      <footer style={{
        marginTop: "40px",
        paddingTop: "20px",
        borderTop: "1px solid #ddd",
        fontSize: "14px",
        color: "#888",
        textAlign: "center"
      }}>
        <p>🐾 Версия 1.0 — Готовое мини-приложение</p>
        <p>© 2025 Антон. Все права защищены.</p>
        <a
          href="https://vk.com/id13607466"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#4a76a8",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          ✉ Написать автору
        </a>
      </footer>
    </div>
  );
}

export default App;
