'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import emailjs from '@emailjs/browser'

export default function ContactPage() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    emailjs.init({ publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY! })
  }, [])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: [] as string[],
    message: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company/Organization is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: formData.name,
          email: formData.email,
          reply_to: formData.email,
          company: formData.company,
          phone: formData.phone || 'Not provided',
          interest: formData.interest.length > 0 ? formData.interest.join(', ') : 'Not specified',
          message: formData.message,
        }
      )

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        interest: [],
        message: '',
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage('Error submitting form. Try emailing us directly at CSC_growth@clawpointsecuritycollective.com')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      interest: prev.interest.includes(value)
        ? prev.interest.filter((i) => i !== value)
        : [...prev.interest, value],
    }))
  }

  return (
    <div className="bg-black relative min-h-screen">
      {/* Progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black z-50">
        <div
          className="h-full bg-gradient-to-r from-[var(--tactical-green)] via-[var(--night-vision)] to-[var(--tactical-green-light)] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Single split-screen section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Backgrounds */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(var(--tactical-green) 1px, transparent 1px), linear-gradient(90deg, var(--tactical-green) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>
        <div className="absolute inset-0">
          <Image
            src="/images/AdobeStock_241827782.jpeg"
            alt=""
            fill
            className="object-cover opacity-15 mix-blend-screen"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,transparent_0%,rgba(0,0,0,0.5)_60%,rgba(0,0,0,0.95)_100%)]" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">

          {/* Left: Heading */}
          <div className="lg:col-span-2 stalk-in flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-[var(--tactical-green)]" />
              <span className="text-[var(--tactical-green-light)] font-mono text-xs tracking-widest">CONTACT-INFO-01</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-mono tracking-wider mb-6">
              GET IN
              <span className="block text-[var(--night-vision)] text-glow mt-2">
                TOUCH
              </span>
            </h1>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">
              We respond to every inquiry.
            </p>
            <div className="mt-8 pt-8 border-t border-[var(--tactical-green-dark)]">
              <p className="text-gray-600 font-mono text-xs">
                We respect your privacy. Your information will never be shared with third parties.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3 emerge-from-forest" style={{ animationDelay: '0.2s' }}>
            <div className="border border-[var(--tactical-green)] bg-black/60 backdrop-blur-sm p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-white font-mono text-xs font-bold mb-2 tracking-wider">
                    FULL NAME *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-black border ${
                      errors.name ? 'border-red-500' : 'border-[var(--tactical-green)]'
                    } text-white font-mono text-sm focus:border-[var(--night-vision)] focus:outline-none transition-all`}
                    placeholder="John Smith"
                  />
                  {errors.name && <p className="text-red-400 font-mono text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-white font-mono text-xs font-bold mb-2 tracking-wider">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-black border ${
                      errors.email ? 'border-red-500' : 'border-[var(--tactical-green)]'
                    } text-white font-mono text-sm focus:border-[var(--night-vision)] focus:outline-none transition-all`}
                    placeholder="contact@organization.com"
                  />
                  {errors.email && <p className="text-red-400 font-mono text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Row 2: Company + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-white font-mono text-xs font-bold mb-2 tracking-wider">
                    COMPANY/ORGANIZATION *
                  </label>
                  <input
                    id="company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-black border ${
                      errors.company ? 'border-red-500' : 'border-[var(--tactical-green)]'
                    } text-white font-mono text-sm focus:border-[var(--night-vision)] focus:outline-none transition-all`}
                    placeholder="Your Organization"
                  />
                  {errors.company && <p className="text-red-400 font-mono text-xs mt-1">{errors.company}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-white font-mono text-xs font-bold mb-2 tracking-wider">
                    PHONE NUMBER (OPTIONAL)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-black border border-[var(--tactical-green)] text-white font-mono text-sm focus:border-[var(--night-vision)] focus:outline-none transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Interests */}
              <fieldset>
                <legend className="block text-white font-mono text-xs font-bold mb-2 tracking-wider">
                  I&apos;M INTERESTED IN (SELECT ALL THAT APPLY)
                </legend>
                <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                  {[
                    { value: 'consultation', label: "Scheduling a consultation" },
                    { value: 'infinite-view', label: "Learning more about Infinite View" },
                    { value: 'careers', label: "Career opportunities" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.interest.includes(option.value)}
                        onChange={() => handleCheckboxChange(option.value)}
                        className="w-4 h-4 bg-black border-2 border-[var(--tactical-green)] checked:bg-[var(--night-vision)] checked:border-[var(--night-vision)] focus:outline-none transition-all"
                      />
                      <span className="text-gray-300 font-mono text-xs group-hover:text-white transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-white font-mono text-xs font-bold mb-2 tracking-wider">
                  MESSAGE *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2.5 bg-black border ${
                    errors.message ? 'border-red-500' : 'border-[var(--tactical-green)]'
                  } text-white font-mono text-sm focus:border-[var(--night-vision)] focus:outline-none transition-all resize-none`}
                  placeholder="Describe your security requirements or inquiry..."
                />
                {errors.message && <p className="text-red-400 font-mono text-xs mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full px-8 py-3 font-mono font-bold text-sm tracking-wider transition-all border-2 ${
                  status === 'submitting'
                    ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                    : 'bg-[var(--night-vision)] text-black border-[var(--night-vision)] hover:bg-white hover:border-white hover:shadow-[0_0_30px_rgba(0,255,65,0.8)]'
                }`}
              >
                {status === 'submitting' ? 'SENDING MESSAGE...' : 'SEND MESSAGE'}
              </button>

              {status === 'success' && (
                <div className="border-2 border-[var(--night-vision)] bg-[var(--tactical-green-dark)] p-4 text-center">
                  <p className="text-[var(--night-vision)] font-mono text-sm font-bold mb-1">MESSAGE RECEIVED</p>
                  <p className="text-gray-300 font-mono text-xs">We&apos;ll get back to you shortly.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="border-2 border-red-500 bg-red-950/50 p-4 text-center">
                  <p className="text-red-400 font-mono text-sm font-bold mb-1">TRANSMISSION FAILED</p>
                  <p className="text-gray-300 font-mono text-xs">
                    Error submitting form. Try emailing us directly at{' '}
                    <a href="mailto:CSC_growth@clawpointsecuritycollective.com" className="text-[var(--night-vision)] hover:underline break-all">
                      CSC_growth@clawpointsecuritycollective.com
                    </a>
                  </p>
                </div>
              )}
            </form>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
