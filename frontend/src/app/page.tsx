"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { motion } from "framer-motion";

const HomePage = () => {
  const router = useRouter();

  return (
    <Layout>
      {/* Full Page Container */}
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center text-center overflow-hidden px-4">
        {/* Floating Particles */}
        <motion.div
          className="absolute w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-3xl"
          initial={{ x: -200, y: -200 }}
          animate={{ x: [0, 200, -100, 0], y: [0, 200, -100, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        <motion.div
          className="absolute w-16 h-16 bg-gray-600 rounded-full opacity-10 blur-2xl"
          initial={{ x: 200, y: 200 }}
          animate={{ x: [-100, 100, 0, -200], y: [100, -100, 200, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        ></motion.div>

        {/* Animated Heading */}
        <motion.h1
          className="text-5xl font-extrabold text-blue-400 mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to the E-Learning Platform
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-lg text-gray-400 mb-6 max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Discover the best courses and resources to advance your knowledge. Join us today and start your learning journey!
        </motion.p>

        {/* Action Buttons */}
        <div className="space-y-4 w-full max-w-sm">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Log In
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              onClick={() => router.push("/register")}
              className="w-full bg-gray-800 hover:bg-gray-700 text-blue-400 font-bold py-2 px-4 border border-gray-600 rounded"
            >
              Create an Account
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;