import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleInView } from './useSimpleInView';
import './CategoryList.css';

interface Category {
  name: string;
  link: string;
  image: string;
}

const categories: Category[] = [
  { name: 'Homeware', link: '/category/homeware', image: '/images/image_4.jpg' },
  { name: 'Accessories', link: '/category/accessories', image: '/images/image_5.jpg' },
  { name: 'Planters', link: '/category/planters', image: '/images/image_6.jpg' },
  { name: 'Gifts', link: '/category/gifts', image: '/images/image_7.jpg' },
];

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const { inView } = useSimpleInView(listRef, {
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={listRef} className="category-list-container">
      <div className="category-grid">
        {categories.map((category, index) => (
          <div 
            key={category.name} 
            className={`category-card ${inView ? 'is-visible' : ''}`}
            onClick={() => navigate(category.link)}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <img src={category.image} alt={category.name} className="category-image" />
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>Shop {category.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList; 