import React, { useRef } from 'react';
import styles from '../css/HorizontalCarousel.module.css';
import { useNavigate } from 'react-router-dom';

interface CarouselItem {
  id: string;
  imageUrl: string;
  linkUrl: string;
}

interface HorizontalCarouselProps {
  title?: string;
  items: CarouselItem[];
  scrollAmount?: number;
}

const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
  title,
  items,
  scrollAmount = 300,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={styles.carouselWrapper}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.carouselContainer}>
        <button className={styles.navButtonLeft} onClick={() => scroll('left')}>
          &#8249;
        </button>

        <div ref={scrollRef} className={styles.carousel}>
          {items.map((item) => (
            <div
              key={item.id}
              className={styles.carouselItem}
              onClick={() => navigate(item.linkUrl)}
            >
              <img
                src={item.imageUrl}
                alt="Show"
                className={styles.image}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <button
          className={styles.navButtonRight}
          onClick={() => scroll('right')}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default HorizontalCarousel;
