import React, { FC, ReactElement } from 'react';
import { Swiper as _Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination, EffectCoverflow, Lazy, EffectFade } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.less';
import './index.less';

SwiperCore.use([Autoplay, Pagination, EffectCoverflow, Lazy, EffectFade]);
const imgs = [
  { src: 'http://localhost:3001/img/hdU3WnWuHHVQutUVBUCeStl07Xtz4did.jpg', title: '1' },
  { src: 'http://localhost:3001/img/c5OmB8hNmgmreCH64ct4A7YWu2hgB3VQ.jpg', title: '2' },
  { src: 'http://localhost:3001/img/TmfXG4RQXbK3SWE6CCnM8OnWSNgn4dMb.jpg', title: '3' },
  { src: 'http://localhost:3001/img/ZLpgNRjtO79X9joEfiGFWv98gE048psx.jpg', title: '4' },
  { src: 'http://localhost:3001/img/yjYjLwY5w0bQU6Wq61xAdOfq2C1gkJWM.jpg', title: '5' },
];
const Swiper: FC = (): ReactElement => {
  return (
    <_Swiper
      spaceBetween={100}
      slidesPerView={1}
      onSlideChange={swiper => console.log((swiper as any).realIndex)}
      autoplay={{
        delay: 5000,
        disableOnInteraction: true,
      }}
      className="swiper transition-5"
      pagination={{
        clickable: true,
      }}
      effect="fade"
      loop
      lazy={{
        loadPrevNext: true,
      }}
      parallax
    >
      {imgs.map(img => {
        return (
          <SwiperSlide key={img.src}>
            <img src={img.src} alt={img.title} title={img.title} className="swiper-img" />
          </SwiperSlide>
        );
      })}
    </_Swiper>
  );
};
export default Swiper;
