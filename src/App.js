import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import './App.css';

function App() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    bridge.send('VKWebAppInit');
  }, []);

  const questions = [
    {
      text: 'Ты любишь спать днём?',
      options: [
        { answer: 'Да', value: 2 },
        { answer: 'Иногда', value: 1 },
        { answer: 'Нет', value: 0 },
      ],
    },
    {
      text: 'Ты боишься воды?',
      options: [
        { answer: 'Очень', value: 2 },
        { answer: 'Скорее да', value: 1 },
        { answer: 'Нет', value: 0 },
      ],
    },
    {
      text: 'Ты любишь сидеть на окне и смотреть в окно?',
      options: [
        { answer: 'Да, это моё всё', value: 2 },
        { answer: 'Иногда', value: 1 },
        { answer: 'Нет, скучно', value: 0 },
      ],
    },
  ];

  const results = [
    {
      title: 'Сонная британка',
      description: 'Ты — воплощение уюта. Обожаешь мягкие подушки, неспешные прогулки и хороший сон.',
      image: '/images/british_cat.png',
    },
    {
      title: 'Игривая сфинкс',
      description: 'У тебя неуемная энергия и тяга к вниманию. Любишь быть в центре событий.',
      image: '/images/sphynx_cat.png',
    },
    {
      title: 'Задумчивый сибиряк',
      description: 'Независимость и мудрость — твой стиль. Ты наблюдателен и ценишь личное пространство.',
      image: '/images/siberian_cat.png',
    },
    {
      title: 'Боевой мейн-кун',
      description: 'Ты уверен в себе, громкий и харизматичный. Всегда готов действовать и защищать своих.',
      image: '/images/maine_coon_cat.png',
    },
  ];

  const handleAnswer = async (value) => {
    const nextStep = step + 1;
    setScore(score + value);
    if (nextStep >= questions.length) {
      try {
        await bridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' });
      } catch (error) {
        console.warn('Реклама не показана или недоступна:', error);
      }
      setShowResult(true);
    } else {
      setStep(nextStep);
    }
  };

  const restart = () => {
    setScore(0);
    setStep(0);
    setShowResult(false);
  };

  const getResult = () => {
    if (score <= 2) return results[0];
    if (score <= 4) return results[1];
    if (score <= 5) return results[2];
    return results[3];
  };

  const shareResult = async () => {
    const result = getResult();
    const message = `Я прошёл тест «Какой ты котик?» и оказался: ${result.title} 😺 Проверь себя тоже!`;
    try {
      await bridge.send('VKWebAppShare', {
        link: 'https://AntonSeimToo.github.io/vk-cat-test/',
        text: message,
      });
    } catch (error) {
      console.warn('Ошибка при попытке поделиться:', error);
    }
  };

  return (
    <div className="App">
      {!showResult ? (
        <div className="question-block">
          <h2>{questions[step].text}</h2>
          {questions[step].options.map((opt, idx) => (
            <button key={idx} onClick={() => handleAnswer(opt.value)}>
              {opt.answer}
            </button>
          ))}
        </div>
      ) : (
        <div className="result-block fade-in">
          <h2>{getResult().title}</h2>
          <img src={getResult().image} alt="cat result" />
          <p>{getResult().description}</p>
          <button onClick={restart} style={{ marginTop: '20px' }}>
            Пройти ещё раз
          </button>
          <button
            onClick={shareResult}
            style={{
              marginTop: '10px',
              backgroundColor: '#4a76a8',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            📤 Поделиться ВКонтакте
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
