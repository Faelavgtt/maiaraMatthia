import React from 'react';

interface StatisticCardProps {
  number: string;
  description: string;
  showPrimaryColor?: boolean;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  number,
  description,
  showPrimaryColor = true,
}) => {
  return (
    <div className="w-full">
      {/* 
        RESPONSIVIDADE DO CARD DE ESTATÍSTICA:
        - Mobile: Texto menor, padding reduzido
        - Tablet: Texto médio, padding médio
        - Desktop: Texto grande, padding completo
      */}
      <div className="grow flex flex-col w-full text-white">
        {/* Número da estatística */}
        <div className={`text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-2xl font-bold text-center sm:text-left ${
          showPrimaryColor ? 'text-primary uppercase' : ''
        }`}>
          {number}
        </div>
        
        {/* Descrição da estatística */}
        <p className="text-center text-md sm:text-base md:text-lg font-normal mt-2 sm:mt-3 md:mt-4 sm:text-left leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};