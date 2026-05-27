import React, { useState, useEffect } from 'react';

export default function Countdown() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    dias: '00',
    horas: '00',
    minutos: '00',
    segundos: '00',
  });

  useEffect(() => {
    // Data de abertura: 11 de Junho de 2026 às 18:00:00 (Fuso do México/Texas: UTC-5)
    const dataAbertura = new Date('2026-06-11T18:00:00-05:00').getTime();

    const atualizarTempo = () => {
      const agora = new Date().getTime();
      const diferenca = dataAbertura - agora;

      if (diferenca <= 0) {
        setStarted(true);
        return;
      }

      const umDia = 24 * 60 * 60 * 1000;
      const umaHora = 60 * 60 * 1000;
      const umMinuto = 60 * 1000;

      const dias = Math.floor(diferenca / umDia);
      const horas = Math.floor((diferenca % umDia) / umaHora);
      const minutos = Math.floor((diferenca % umaHora) / umMinuto);
      const segundos = Math.floor((diferenca % umMinuto) / 1000);

      setTimeLeft({
        dias: String(dias).padStart(2, '0'),
        horas: String(horas).padStart(2, '0'),
        minutos: String(minutos).padStart(2, '0'),
        segundos: String(segundos).padStart(2, '0'),
      });
    };

    atualizarTempo();
    const intervalo = setInterval(atualizarTempo, 1000);

    return () => clearInterval(intervalo);
  }, []);

  if (started) {
    return (
      <div className="countdown-widget" aria-label="A Copa do Mundo começou">
        <span className="countdown-started">🏆 A Copa do Mundo 2026 começou!</span>
      </div>
    );
  }

  return (
    <div className="countdown-widget" id="countdown" aria-label="Contagem regressiva para a abertura da Copa">
      <span className="countdown-label">Abertura em:</span>
      <span className="countdown-time"><strong>{timeLeft.dias}</strong>d</span>
      <span className="countdown-time"><strong>{timeLeft.horas}</strong>h</span>
      <span className="countdown-time"><strong>{timeLeft.minutos}</strong>m</span>
      <span className="countdown-time"><strong>{timeLeft.segundos}</strong>s</span>
    </div>
  );
}
