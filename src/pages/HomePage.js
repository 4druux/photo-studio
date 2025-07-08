import React from "react";
import Carousel from "../components/home/Carousel";
import About from "../components/home/About";
import Gallery from "../components/home/Gallery";
import Schedule from "../components/home/Schedule";

const HomePage = () => {
  return (
    <div className="">
      <section id="home">
        <Carousel />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="gallery">
        <Gallery />
      </section>

      <section id="schedule">
        <Schedule />
      </section>
    </div>
  );
};

export default HomePage;