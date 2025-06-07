'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function QuitSmokingApp() {
  const [cigarettesPerDay, setCigarettesPerDay] = useState(0);
  const [cigarettesPerPack, setCigarettesPerPack] = useState(20);
  const [packPrice, setPackPrice] = useState(0);
  const [quitDate, setQuitDate] = useState('');
  const [daysWithoutSmoking, setDaysWithoutSmoking] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('quitSmokingData');
    if (savedData) {
      const { 
        cigarettesPerDay: savedCigs, 
        cigarettesPerPack: savedPack, 
        packPrice: savedPrice, 
        quitDate: savedDate 
      } = JSON.parse(savedData);
      
      setCigarettesPerDay(savedCigs);
      setCigarettesPerPack(savedPack);
      setPackPrice(savedPrice);
      setQuitDate(savedDate);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (quitDate) {
      const calculateStats = () => {
        const now = new Date();
        const quit = new Date(quitDate);
        const diffTime = Math.abs(now - quit);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const cigsPerDay = parseFloat(cigarettesPerDay) || 0;
        const cigsPerPack = parseFloat(cigarettesPerPack) || 20;
        const price = parseFloat(packPrice) || 0;
        
        const money = (cigsPerDay / cigsPerPack) * price * diffDays;
        
        setDaysWithoutSmoking(diffDays);
        setMoneySaved(money.toFixed(2));
      };
      
      calculateStats();
      const interval = setInterval(calculateStats, 60000);
      
      return () => clearInterval(interval);
    }
  }, [quitDate, cigarettesPerDay, cigarettesPerPack, packPrice]);

  const handleSave = () => {
    const data = {
      cigarettesPerDay,
      cigarettesPerPack,
      packPrice,
      quitDate
    };
    localStorage.setItem('quitSmokingData', JSON.stringify(data));
    setIsInitialized(true);
  };

  const handleReset = () => {
    localStorage.removeItem('quitSmokingData');
    setCigarettesPerDay(0);
    setCigarettesPerPack(20);
    setPackPrice(0);
    setQuitDate('');
    setIsInitialized(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Smoke Free Life</h1>
        <p className={styles.subtitle}>Отслеживайте ваш прогресс в отказе от курения</p>
      </header>
      
      {!isInitialized ? (
        <div className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label>Сколько сигарет вы курили в день?</label>
            <input 
              type="number" 
              value={cigarettesPerDay}
              onChange={(e) => setCigarettesPerDay(e.target.value)}
              placeholder="Например: 15"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Сколько сигарет в пачке?</label>
            <input 
              type="number" 
              value={cigarettesPerPack}
              onChange={(e) => setCigarettesPerPack(e.target.value)}
              placeholder="Обычно 20"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Сколько стоила пачка сигарет?</label>
            <input 
              type="number" 
              value={packPrice}
              onChange={(e) => setPackPrice(e.target.value)}
              placeholder="Цена в рублях"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Когда вы бросили курить?</label>
            <input 
              type="date" 
              value={quitDate}
              onChange={(e) => setQuitDate(e.target.value)}
            />
          </div>
          
          <button 
            className={`${styles.button} ${styles.primaryButton}`} 
            onClick={handleSave}
          >
            Начать отслеживание
          </button>
        </div>
      ) : (
        <>
          <div className={styles.statsContainer}>
            <div className={styles.statBlock}>
              <h3>Дней без курения</h3>
              <p className={styles.statValue}>{daysWithoutSmoking}</p>
            </div>
            
            <div className={styles.statBlock}>
              <h3>Сэкономлено денег</h3>
              <p className={styles.statValue}>{moneySaved} Сум</p>
            </div>
            
            <div className={styles.statBlock}>
              <h3>Не выкурено сигарет</h3>
              <p className={styles.statValue}>
                {Math.round(cigarettesPerDay * daysWithoutSmoking)}
              </p>
            </div>
          </div>
          
          <button 
            className={`${styles.button} ${styles.dangerButton}`} 
            onClick={handleReset}
          >
            Сбросить данные
          </button>
          
          <div className={styles.healthBenefits}>
            <h2>Ваши достижения:</h2>
            <ul className={styles.benefitList}>
              <li className={styles.benefitItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {daysWithoutSmoking >= 1 && 'Первые 24 часа: снижается уровень CO в крови'}
              </li>
              <li className={styles.benefitItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {daysWithoutSmoking >= 3 && '3 дня: улучшается дыхание'}
              </li>
              <li className={styles.benefitItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {daysWithoutSmoking >= 14 && '2 недели: улучшается кровообращение'}
              </li>
              <li className={styles.benefitItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {daysWithoutSmoking >= 30 && '1 месяц: уменьшается кашель'}
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}