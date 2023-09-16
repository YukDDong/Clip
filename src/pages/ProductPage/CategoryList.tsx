import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import * as S from '@/components/MainPage/ListItemComponent/AllProductList.styles';
import ListItem from '@/components/MainPage/ListItemComponent/ListItem';

interface Product {
  productId: number;
  imageUrl: string;
  name: string;
  price: number;
  shopName: string;
  ageCategory: string;
  genderCategory: string;
}

interface CategoryListProps {
  category: string | null;
  age: string | null;
  gender: string | null;
}

const CategoryList: React.FC<CategoryListProps> = ({ category, age, gender }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [ref, inView] = useInView();

  const productFetch = async () => {
    try {
      let url = `https://pet-commerce.shop/v1/api/product/category/${category}?pageNumber=${page}`;

      if (age !== null && age !== undefined) {
        url += `&ageCategory=${age}`;
      }

      if (gender !== null && gender !== undefined) {
        url += `&genderCategory=${gender}`;
      }

      const response = await axios.get(url);
      console.log('RESPONSE', response.data);
      setProducts((prevProducts) => [...prevProducts, ...response.data]);
      // if (age || gender) {
      //   // setPage(1);
      // setPage((prevPage) => prevPage + 1);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // if (inView) return;
    if (age === '나이' && gender === '성별') return;

    console.log('age gender 변경 호출', page);

    setPage(1);
    setProducts([]);
    // productFetch();
    // setPage((prev) => prev + 1);
    setTimeout(() => {
      productFetch();
      // setPage((prev) => prev + 1);
      setPage(page + 1);
    }, 100);

    console.log(page);
  }, [age, gender]);

  // console.log('페이지구별', page, inView, 'age', age, gender);

  useEffect(() => {
    // if (products.length === 0) {
    //   return;
    // }

    if (inView) {
      console.log(inView, '무한 스크롤 요청 🎃', page);
      productFetch();
      // setPage((prevPage) => prevPage + 1);
      setPage(page + 1);
    }
  }, [inView]);

  return (
    <S.ListContainer>
      {products.map((product, index) => (
        <ListItem
          key={index}
          productId={product.productId}
          imageUrl={product.imageUrl}
          name={product.name}
          price={product.price}
          shopName={product.shopName}
        />
      ))}
      <div ref={ref}></div> {/* 여기에 닿으면 스크롤 */}
    </S.ListContainer>
  );
};

export default CategoryList;
