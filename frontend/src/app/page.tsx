"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { motion } from "framer-motion";

const HomePage = () => {
  const router = useRouter();

  const courses = [
    {
      title: "Introduction to Programming",
      image: "/images/programming.jpg",
    },
    {
      title: "Mathematics 1",
      image: "/images/mathematics.jpg",
    },
    {
      title: "Advanced Data Structures",
      image: "/images/data-structures.jpg",
    },
    {
      title: "Machine Learning",
      image: "/images/machine-learning.webp",
    },
    {
      title: "Data Engineering and Visualization",
      image: "/images/data-engineering.jpg",
    },
    {
      title: "Software Design and Architecture",
      image: "/images/programming.jpg",
    },
    {
      title: "Database Programming",
      image: "/images/database-programming.jpg",
    },
    {
      title: "Requirement Engineering",
      image: "/images/data-structures.jpg",
    },
    {
      title: "Software Mobile Security",
      image: "/images/mobile-security.jpg",
    },
    {
      title: "Cryptography",
      image: "/images/cryptography.jpg",
    },
  ];

  return (
    <Layout>
      {/* Sticky Header */}
      <div className="fixed top-0 right-0 z-50 flex items-center gap-4 bg-black px-6 py-4 shadow-md">
        <Button
          onClick={() => router.push("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Log In
        </Button>
        <Button
          onClick={() => router.push("/register")}
          className="bg-gray-800 hover:bg-gray-700 text-blue-400 font-bold py-2 px-4 rounded border border-gray-600"
        >
          Create an Account
        </Button>
      </div>

      {/* Full Page Container */}
      <div className="relative min-h-screen bg-black text-white px-4 pt-20 pb-8"> {/* Added pt-20 to prevent overlap */}
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-5xl font-extrabold text-blue-400 mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Welcome to the E-Learning Platform!
          </motion.h1>
          <motion.p
            className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Explore a variety of courses and connect with top instructors to advance your learning journey. Learn, grow, and excel from the comfort of your home.
          </motion.p>
        </div>

        {/* Most Popular Courses Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Most Popular Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.slice(0, 4).map((course, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded shadow-md hover:shadow-lg hover:bg-gray-700 transition"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-32 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-bold text-blue-400">{course.title}</h3>
                <p className="text-gray-400 mt-2">
                  Learn the essentials of {course.title} with expert instructors.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Our Courses Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Explore Our Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded shadow-md hover:shadow-lg hover:bg-gray-700 transition"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-32 object-cover rounded mb-4"
                />
                <h3 className="text-xl font-bold text-blue-400">{course.title}</h3>
                <p className="text-gray-400 mt-2">
                  Deep dive into {course.title} with our curated courses.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">About E-Learn</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            E-Learn is a cutting-edge platform offering a diverse range of courses
            designed to empower learners worldwide. From programming to data
            engineering, our expertly crafted content and experienced instructors
            ensure that you achieve your educational goals with ease and
            convenience.
          </p>
        </div>

        {/* Social Media Icons Section */}
        <div className="text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <a href="#" className="text-white hover:text-blue-400">
              <i className="fab fa-facebook-f text-2xl"></i>
            </a>
            <a href="#" className="text-white hover:text-blue-400">
              <i className="fab fa-linkedin-in text-2xl"></i>
            </a>
            <a href="#" className="text-white hover:text-blue-400">
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a href="#" className="text-white hover:text-blue-400">
              <i className="fab fa-youtube text-2xl"></i>
            </a>
            <a href="#" className="text-white hover:text-blue-400">
              <i className="fab fa-instagram text-2xl"></i>
            </a>
            <a href="#" className="text-white hover:text-blue-400">
              <i className="fab fa-tiktok text-2xl"></i>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
