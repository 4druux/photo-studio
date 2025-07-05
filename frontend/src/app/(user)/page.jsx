import React from "react";
import Carousel from "@/layout/user/home/Carousel";
import About from "@/layout/user/home/About";
import Gallery from "@/layout/user/home/Gallery";
import Schedule from "@/layout/user/home/Schedule";

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
