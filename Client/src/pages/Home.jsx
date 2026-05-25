import React from 'react'
import Slider from '../components/Slider'
import Categories from '../components/Categories'
import Bestsellers from './../components/Bestsellers';
import Trending from '../components/Trending';
import Brand from '../components/Brand';
import Shop from '../components/Shop';
import Images from '../components/Images';

const Home = () => {
  return (
    <div>
      <Slider />
      <Categories />
      <Trending />
      <Brand />
      <Shop />
      <Images />
    </div>
  )
}

export default Home