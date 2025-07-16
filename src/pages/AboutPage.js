import React from "react";
import { motion } from "framer-motion";
import { Camera, Award, Users, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const stats = [
    { number: "500+", label: "Happy Clients", icon: Users },
    { number: "1000+", label: "Photos Taken", icon: Camera },
    { number: "5+", label: "Years Experience", icon: Award },
    { number: "100%", label: "Satisfaction Rate", icon: Heart },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Lead Photographer",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      bio: "With over 8 years of experience, Sarah specializes in wedding and portrait photography."
    },
    {
      name: "Mike Chen",
      role: "Creative Director",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      bio: "Mike brings artistic vision to every shoot, ensuring each photo tells a unique story."
    },
    {
      name: "Emma Davis",
      role: "Event Photographer",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
      bio: "Emma captures the energy and emotion of special events with her dynamic photography style."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-teal-600 to-teal-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">About Antika Studio</h1>
            <p className="text-xl leading-relaxed">
              We are passionate photographers dedicated to capturing life's most 
              precious moments. With years of experience and a keen eye for detail, 
              we transform ordinary moments into extraordinary memories.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-teal-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-900">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2019, Antika Studio began as a small passion project 
                  between friends who shared a love for photography. What started 
                  as weekend photo walks quickly evolved into a professional studio 
                  serving clients across the region.
                </p>
                <p>
                  Our philosophy is simple: every moment matters. Whether it's a 
                  wedding, family portrait, or corporate event, we approach each 
                  shoot with the same level of dedication and creativity.
                </p>
                <p>
                  Today, we're proud to have captured thousands of memories for 
                  hundreds of families, couples, and businesses. Our work has been 
                  featured in local publications and we continue to push the 
                  boundaries of creative photography.
                </p>
              </div>
              <Link
                to="/gallery"
                className="inline-flex items-center space-x-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors"
              >
                <span>View Our Work</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg"
                alt="Our Studio"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-500 rounded-2xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal-200 rounded-2xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our talented team of photographers and creatives work together to 
              bring your vision to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-teal-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at Antika Studio.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Authenticity",
                description: "We capture genuine moments and real emotions, not just posed shots.",
                icon: Heart
              },
              {
                title: "Excellence",
                description: "We strive for perfection in every aspect of our work, from planning to delivery.",
                icon: Award
              },
              {
                title: "Creativity",
                description: "We bring fresh perspectives and innovative ideas to every project.",
                icon: Camera
              }
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-teal-600 to-teal-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Work With Us?
            </h2>
            <p className="text-xl mb-8 leading-relaxed">
              Let's create something beautiful together. Contact us today to 
              discuss your photography needs and bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Get In Touch
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-teal-600 transition-colors"
              >
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;