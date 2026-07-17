import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  backgroundImage: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  backgroundImage,
}) => {
  return (
    <div className="flex flex-col relative w-[800px] h-[300px] gap-4 border border-primary rounded-[50%] max-w-[320px] mx-auto font-bold text-center uppercase pt-16 sm:pt-20 md:pt-24 lg:pt-[80px]  pb-9 sm:pb-10 md:pb-11 px-[60px] sm:px-12 md:px-16 lg:px-[63px] xl:px-[50px]">
      {/* 
        RESPONSIVIDADE DO CARD DE FUNCIONALIDADE:
        - Mobile: Padding reduzido, textos menores
        - Tablet: Padding médio, textos médios
        - Desktop: Padding completo, textos grandes
      */}
    
      
      {/* Título */}
      <div className="relative text-primary text-2xl sm:text-2xl md:text-3xl lg:text-[27px] xl:text-[28px] self-center">
        {title}
      </div>
      
      {/* Descrição */}
      <div className="relative text-white text-[15px] sm:text-sm md:text-sm lg:text-[13px] xl:text-[12px]  leading-relaxed">
        {description}
      </div>
    </div>
  );
};
