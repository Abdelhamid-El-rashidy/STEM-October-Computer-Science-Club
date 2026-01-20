"use client"

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, MapPin, Code2, Facebook, Instagram } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Github, href: 'https://github.com/stemcomputerscienceclub', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/stem-computer-science-club/?viewAsMember=true', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=100094026166056', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/stem_computer_science_club/', label: 'Instagram' },
    { icon: Mail, href: 'mailto:csse@stemegypt.edu.eg', label: 'Email' },
  ]

  const quickLinks = [
    { name: 'Home', path: 'https://stemcsclub.org' },
    { name: 'About', path: 'https://stemcsclub.org/about' },
    { name: 'Tracks', path: 'https://stemcsclub.org/tracks' },
    { name: 'Workshops', path: 'https://stemcsclub.org/workshops' },
  ]

  const resources = [
    { name: 'Leaderboard', href: 'https://leaderboard-seven-pi.vercel.app/' },
    { name: 'Articles', path: 'https://stemcsclub.org/articles' },
    { name: 'Verify Certificate', path: '/' },
  ]

  return (
    <footer className="bg-secondary-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Club Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/imgs/official-logo.png"
                  alt="STEM CS Club"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">STEM CS Club</h3>
                <p className="text-sm text-secondary-400">Programming Community</p>
              </div>
            </div>
            
            <p className="text-secondary-300 text-sm leading-relaxed">
              Empowering students with cutting-edge programming skills and fostering innovation 
              in computer science through hands-on learning and collaborative projects.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-secondary-800 hover:bg-primary-600 rounded-lg transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.name}>
                  {resource.href ? (
                    <a
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-300 hover:text-primary-400 transition-colors duration-300 text-sm"
                    >
                      {resource.name}
                    </a>
                  ) : resource.path ? (
                    resource.path.startsWith('http') ? (
                      <a
                        href={resource.path}
                        className="text-secondary-300 hover:text-primary-400 transition-colors duration-300 text-sm"
                      >
                        {resource.name}
                      </a>
                    ) : (
                      <Link
                        href={resource.path}
                        className="text-secondary-300 hover:text-primary-400 transition-colors duration-300 text-sm"
                      >
                        {resource.name}
                      </Link>
                    )
                  ) : null}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-secondary-300">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>STEM High School for Boys - 6th of October</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-secondary-300">
                <Mail className="w-4 h-4 text-primary-400" />
                <a
                  href="mailto:csse@stemegypt.edu.eg"
                  className="hover:text-primary-400 transition-colors"
                >
                  csse@stemegypt.edu.eg
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-secondary-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-secondary-400">
              <Code2 className="w-4 h-4" />
              <span>
                © {currentYear} STEM CS Club. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-secondary-400">
              <button className="hover:text-primary-400 transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <button className="hover:text-primary-400 transition-colors cursor-pointer">
                Terms of Service
              </button>
              <button className="hover:text-primary-400 transition-colors cursor-pointer">
                Code of Conduct
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
