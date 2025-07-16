import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Heart, 
  Users, 
  Briefcase, 
  Baby, 
  Sparkles,
  Check,
  ArrowRight,
  Clock,
  MapPin,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: "wedding",
      title: "Wedding Photography",
      icon: Heart,
      price: "Starting from $1,200",
      duration: "8-12 hours",
      description: "Capture every precious moment of your special day with our comprehensive wedding photography packages.",
      features: [
        "Pre-wedding consultation",
        "Full day coverage",
        "Professional editing",
        "Online gallery",
        "Print release",
        "USB with high-res images"
      ],
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      packages: [
        {
          name: "Essential",
          price: "$1,200",
          hours: "6 hours",
          photos: "300+ edited photos",
          extras: ["Online gallery", "Print release"]
        },
        {
          name: "Premium",
          price: "$1,800",
          hours: "8 hours",
          photos: "500+ edited photos",
          extras: ["Online gallery", "Print release", "Engagement session", "USB drive"]
        },
        {
          name: "Luxury",
          price: "$2,500",
          hours: "12 hours",
          photos: "800+ edited photos",
          extras: ["Online gallery", "Print release", "Engagement session", "USB drive", "Wedding album", "Second photographer"]
        }
      ]
    },
    {
      id: "portrait",
      title: "Portrait Sessions",
      icon: Camera,
      price: "Starting from $200",
      duration: "1-2 hours",
      description: "Professional portrait photography for individuals, couples, and families in studio or on location.",
      features: [
        "Professional lighting",
        "Multiple outfit changes",
        "Retouched images",
        "Online gallery",
        "Print options",
        "Same-day preview"
      ],
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      packages: [
        {
          name: "Individual",
          price: "$200",
          hours: "1 hour",
          photos: "15 edited photos",
          extras: ["Online gallery", "2 outfit changes"]
        },
        {
          name: "Couple",
          price: "$300",
          hours: "1.5 hours",
          photos: "25 edited photos",
          extras: ["Online gallery", "Multiple locations", "3 outfit changes"]
        },
        {
          name: "Family",
          price: "$400",
          hours: "2 hours",
          photos: "35 edited photos",
          extras: ["Online gallery", "Multiple locations", "Group and individual shots"]
        }
      ]
    },
    {
      id: "corporate",
      title: "Corporate Events",
      icon: Briefcase,
      price: "Starting from $500",
      duration: "2-8 hours",
      description: "Professional event photography for conferences, meetings, and corporate gatherings.",
      features: [
        "Event coverage",
        "Professional headshots",
        "Candid moments",
        "Quick turnaround",
        "Digital delivery",
        "Usage rights included"
      ],
      image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
      packages: [
        {
          name: "Half Day",
          price: "$500",
          hours: "4 hours",
          photos: "100+ edited photos",
          extras: ["Online gallery", "24-hour delivery"]
        },
        {
          name: "Full Day",
          price: "$800",
          hours: "8 hours",
          photos: "200+ edited photos",
          extras: ["Online gallery", "24-hour delivery", "Headshot session"]
        },
        {
          name: "Multi-Day",
          price: "$1,200",
          hours: "16 hours",
          photos: "400+ edited photos",
          extras: ["Online gallery", "Same-day delivery", "Headshot sessions", "Event highlights video"]
        }
      ]
    },
    {
      id: "family",
      title: "Family Photography",
      icon: Users,
      price: "Starting from $300",
      duration: "1-2 hours",
      description: "Capture beautiful family moments with our warm and relaxed photography style.",
      features: [
        "Lifestyle photography",
        "Multiple generations",
        "Pet-friendly sessions",
        "Seasonal themes",
        "Print packages",
        "Holiday cards"
      ],
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
      packages: [
        {
          name: "Mini Session",
          price: "$300",
          hours: "1 hour",
          photos: "20 edited photos",
          extras: ["Online gallery", "Print release"]
        },
        {
          name: "Standard",
          price: "$450",
          hours: "1.5 hours",
          photos: "35 edited photos",
          extras: ["Online gallery", "Print release", "Holiday cards"]
        },
        {
          name: "Extended",
          price: "$600",
          hours: "2 hours",
          photos: "50 edited photos",
          extras: ["Online gallery", "Print release", "Holiday cards", "Canvas print"]
        }
      ]
    },
    {
      id: "maternity",
      title: "Maternity & Newborn",
      icon: Baby,
      price: "Starting from $350",
      duration: "1-3 hours",
      description: "Gentle and beautiful photography celebrating new life and growing families.",
      features: [
        "Maternity sessions",
        "Newborn photography",
        "Family integration",
        "Props included",
        "Comfortable environment",
        "Flexible scheduling"
      ],
      image: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg",
      packages: [
        {
          name: "Maternity",
          price: "$350",
          hours: "1 hour",
          photos: "25 edited photos",
          extras: ["Online gallery", "Maternity gown included"]
        },
        {
          name: "Newborn",
          price: "$450",
          hours: "2-3 hours",
          photos: "30 edited photos",
          extras: ["Online gallery", "Props included", "Parent shots"]
        },
        {
          name: "Bundle",
          price: "$700",
          hours: "4 hours total",
          photos: "50 edited photos",
          extras: ["Both sessions", "Online gallery", "Props and gowns", "Print credit"]
        }
      ]
    },
    {
      id: "special",
      title: "Special Events",
      icon: Sparkles,
      price: "Starting from $400",
      duration: "2-6 hours",
      description: "Birthday parties, graduations, anniversaries, and other milestone celebrations.",
      features: [
        "Event documentation",
        "Candid photography",
        "Group photos",
        "Detail shots",
        "Quick preview",
        "Social media ready"
      ],
      image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg",
      packages: [
        {
          name: "Celebration",
          price: "$400",
          hours: "2 hours",
          photos: "75 edited photos",
          extras: ["Online gallery", "Social media package"]
        },
        {
          name: "Milestone",
          price: "$600",
          hours: "4 hours",
          photos: "150 edited photos",
          extras: ["Online gallery", "Social media package", "Group photos"]
        },
        {
          name: "Grand Event",
          price: "$900",
          hours: "6 hours",
          photos: "250 edited photos",
          extras: ["Online gallery", "Social media package", "Group photos", "Event highlights"]
        }
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah & John",
      service: "Wedding Photography",
      rating: 5,
      text: "Absolutely amazing! They captured every moment perfectly and made us feel so comfortable throughout our special day."
    },
    {
      name: "Maria Rodriguez",
      service: "Family Portrait",
      rating: 5,
      text: "The family photos turned out beautiful. The photographer was great with our kids and very patient."
    },
    {
      name: "Tech Corp Inc.",
      service: "Corporate Event",
      rating: 5,
      text: "Professional service and quick delivery. The photos from our conference were exactly what we needed."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl leading-relaxed">
              From intimate portraits to grand celebrations, we offer comprehensive 
              photography services tailored to capture your most important moments 
              with artistry and professionalism.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedService(service)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="text-lg font-bold text-teal-600">
                      {service.price}
                    </div>
                  </div>
                  
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Antika Studio?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine technical expertise with artistic vision to deliver 
              exceptional photography experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Camera,
                title: "Professional Equipment",
                description: "State-of-the-art cameras and lighting equipment for perfect shots."
              },
              {
                icon: Users,
                title: "Experienced Team",
                description: "Skilled photographers with years of experience in various styles."
              },
              {
                icon: Clock,
                title: "Timely Delivery",
                description: "Quick turnaround times without compromising on quality."
              },
              {
                icon: Heart,
                title: "Personal Touch",
                description: "We work closely with you to capture your unique vision."
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients 
              have to say about their experience with us.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.service}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Book Your Session?
            </h2>
            <p className="text-xl mb-8 leading-relaxed">
              Let's discuss your photography needs and create something beautiful 
              together. Contact us today to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                Get In Touch
              </Link>
              <Link
                to="/formulir"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-teal-600 transition-colors"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900"
                >
                  ×
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <selectedService.icon className="w-8 h-8 text-teal-600" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    {selectedService.title}
                  </h2>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {selectedService.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {selectedService.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Package Options
                    </h3>
                    <div className="space-y-4">
                      {selectedService.packages.map((pkg, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                            <span className="text-lg font-bold text-teal-600">{pkg.price}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{pkg.hours} • {pkg.photos}</p>
                          <ul className="text-sm text-gray-500">
                            {pkg.extras.map((extra, idx) => (
                              <li key={idx}>• {extra}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/contact"
                    className="flex-1 text-center px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Get Quote
                  </Link>
                  <Link
                    to="/formulir"
                    className="flex-1 text-center px-6 py-3 border border-teal-500 text-teal-500 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesPage;