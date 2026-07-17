import React from 'react';

interface PricingCardProps {
  type: 'early' | 'regular';
  title: string;
  subtitle?: string;
  price: string;
  installments: string;
  icon: string;
  backgroundImage: string;
  priceBackgroundImage: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  type,
  title,
  subtitle,
  price,
  installments,
  icon,
  backgroundImage,
  priceBackgroundImage,
}) => {
  const isEarly = type === 'early';
  const textColor = isEarly ? 'text-[rgba(171,82,42,1)]' : 'text-white';
  const priceTextColor = isEarly ? 'text-[rgba(171,82,42,1)]' : 'text-[rgba(171,82,42,1)]';
  const installmentsColor = isEarly ? 'text-[rgba(171,82,42,1)]' : 'text-[rgba(171,82,42,1)]';

  return (
    <div className="flex flex-col relative aspect-[0.758] grow items-stretch font-black text-center uppercase px-6 sm:px-8 md:px-12 lg:px-[67px] py-8 sm:py-10 md:py-12 lg:py-[52px]">
      {/* 
        RESPONSIVIDADE DO CARD DE PREÇO:
        - Mobile: Padding reduzido, textos menores
        - Tablet: Padding médio, textos médios 
        - Desktop: Padding completo, textos grandes
      */}
      
      {/* Background image */}
      <img
        src={backgroundImage}
        className="absolute h-full w-full object-cover inset-0 rounded-lg"
        alt="Fundo decorativo do cartão de preços"
      />
      
      {/* Ícone do cartão */}
      <img
        src={icon}
        className="aspect-[1.07] object-contain w-8 sm:w-10 md:w-12 lg:w-[47px] self-center relative z-10"
        alt="Ícone representativo do tipo de ingresso"
      />
      
      {/* Título do ingresso */}
      <div className={`relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-[46px] leading-tight mt-3 sm:mt-4 md:mt-5 ${isEarly ? 'text-white' : 'text-white'}`}>
        <span style={{ fontWeight: 300 }}>{title.split(' ')[0]}</span>
        <br />
        <span style={{ fontWeight: 700 }}>{title.split(' ')[1]}</span>
      </div>
      
      {/* Subtítulo (período) */}
      {subtitle && (
        <div className="relative z-10 text-sm sm:text-base md:text-lg lg:text-[23px] font-normal leading-relaxed text-white mt-2 sm:mt-3 md:mt-4">
          {subtitle}
        </div>
      )}
      
      {/* Container do preço */}
      <div className={`flex flex-col relative aspect-[3.924] items-stretch text-2xl sm:text-3xl md:text-4xl lg:text-[42px] whitespace-nowrap leading-none justify-center ${subtitle ? 'mt-8 sm:mt-12 md:mt-16 lg:mt-[65px]' : 'mt-16 sm:mt-20 md:mt-24 lg:mt-28'} px-6 sm:px-8 md:px-12 lg:px-[68px] py-2 sm:py-2.5`}>
        <img
          src={priceBackgroundImage}
          className="absolute h-full w-full object-cover inset-0 rounded-md"
          alt="Fundo do preço"
        />
        <div className={`relative z-10 ${priceTextColor}`}>
          {price}
        </div>
      </div>
      
      {/* Informações de parcelamento */}
      <div className={`relative z-10 text-xs sm:text-sm font-normal px-4 sm:px-6 md:px-8 lg:px-9 mt-6 sm:mt-8 md:mt-10 lg:mt-40 leading-relaxed ${installmentsColor}`}>
        {installments}
      </div>
    </div>
  );
};
