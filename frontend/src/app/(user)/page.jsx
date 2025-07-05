import React from "react";
import Carousel from "@/layout/home/Carousel";
import About from "@/layout/home/About";
import Gallery from "@/layout/home/Gallery";
import Schedule from "@/layout/home/Schedule";

const page = () => {
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

export default page;
