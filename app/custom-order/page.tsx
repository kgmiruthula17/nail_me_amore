"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle2, ChevronRight, Ruler, Sparkles, User, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCountry } from "../components/CountryProvider";
import { CUSTOM_ORDER_BASE_INR } from "../lib/currencyConfig";

const SIZES = [
  { id: "S", label: "Small", desc: "14-10-11-10-7 (mm)" },
  { id: "M", label: "Medium", desc: "15-11-12-11-8 (mm)" },
  { id: "L", label: "Large", desc: "16-12-13-12-9 (mm)" },
];

const SHAPES = [
  { id: "SHORT_ALMOND", label: "Short Almond" },
  { id: "MEDIUM_ALMOND", label: "Medium Almond" },
  { id: "LONG_ALMOND", label: "Long Almond" },
  { id: "COFFIN", label: "Coffin" },
  { id: "XXXL_COFFIN", label: "XXXL Coffin" },
];

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

// Note: Using Phone icon path for WhatsApp if MessageCircle is missing, but actually let's use a proper WhatsApp SVG if possible.
// Actually let's use a simple speech bubble for "Additional Notes" and "WhatsApp".
function MessageIcon({ size = 18, className }: { size?: number, className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function CustomOrderPage() {
  const { displayPrice } = useCountry();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [size, setSize] = useState<string>("");
  const [shape, setShape] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFiles([file]);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setImageFiles([]);
    setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const isStep1Valid = formData.name && formData.phone;
  const isStep2Valid = previewUrl !== null;
  const isStep3Valid = size !== "" && shape !== "";

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-cream text-charcoal relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-dusty-pink/20 rounded-full blur-3xl rounded-full mix-blend-multiply filter opacity-50 animate-float"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-rose-gold/20 rounded-full blur-3xl rounded-full mix-blend-multiply filter opacity-50 animate-float-delayed"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-heading text-charcoal mb-4">
            Design Your Custom Set
          </h1>
          <p className="text-charcoal/70 text-lg max-w-xl mx-auto">
            Upload your inspiration, choose your shape and size, and let us bring your vision to life.
          </p>
        </div>

        {/* Progress Bar */}
        {!isSuccess && (
          <div className="flex justify-between items-center mb-8 relative">
            <div className="absolute left-0 top-1/3 -translate-y-1/2 w-full h-1 bg-soft-gray -z-10"></div>
            <div 
              className="absolute left-0 top-1/3 -translate-y-1/2 h-1 bg-dusty-pink transition-all duration-500 ease-in-out -z-10"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {[
              { num: 1, label: "Details", icon: User },
              { num: 2, label: "Inspo", icon: ImageIcon },
              { num: 3, label: "Specs", icon: Ruler }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    step >= s.num ? "bg-dusty-pink text-white" : "bg-soft-gray text-charcoal/40"
                  }`}
                >
                  <s.icon size={18} />
                </div>
                <span className={`text-xs mt-2 font-medium ${step >= s.num ? "text-charcoal" : "text-charcoal/40"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="glass rounded-3xl p-6 md:p-10 shadow-sm border border-white/40">
          <AnimatePresence mode="wait">
            
            {/* SUCCESS STATE */}
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-500" size={40} />
                </div>
                <h2 className="text-3xl font-heading mb-4">Request Received!</h2>
                <p className="text-charcoal/70 mb-8 max-w-md mx-auto">
                  Thank you for submitting your custom order idea. We'll review your inspiration and get back to you shortly with a confirmation and next steps.
                </p>
                <Link 
                  href="/"
                  className="bg-charcoal text-white px-8 py-3 rounded-full hover:bg-charcoal/90 transition-colors inline-block"
                >
                  Return Home
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* STEP 1: Personal Details */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-heading mb-6 flex items-center gap-2">
                      <User className="text-dusty-pink" /> 
                      Your Information
                    </h2>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name *</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-white/50 border border-warm-white focus:border-dusty-pink rounded-xl px-4 py-3 outline-none transition-all"
                          placeholder="Jane Doe"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number *</label>
                        <input 
                          type="tel" 
                          required
                          className="w-full bg-white/50 border border-warm-white focus:border-dusty-pink rounded-xl px-4 py-3 outline-none transition-all"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Shipping Address (Optional for now)</label>
                        <textarea 
                          className="w-full bg-white/50 border border-warm-white focus:border-dusty-pink rounded-xl px-4 py-3 outline-none transition-all min-h-[100px]"
                          placeholder="Your full shipping address"
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}


                {/* STEP 2: Inspiration Image */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                     <h2 className="text-2xl font-heading mb-6 flex items-center gap-2">
                      <Sparkles className="text-dusty-pink" /> 
                      Upload Inspiration
                    </h2>
                    <p className="text-sm text-charcoal/70 mb-6">
                      Upload a picture of the design you want us to recreate. Please ensure it's a clear photo.
                    </p>

                    <div 
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                        previewUrl ? 'border-dusty-pink bg-dusty-pink/5' : 'border-gray-300 hover:border-dusty-pink bg-white/40 hover:bg-white/60'
                      }`}
                    >
                      {previewUrl ? (
                        <div className="relative inline-block">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-h-64 rounded-xl shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-3 -right-3 bg-white text-rose-500 rounded-full p-1 shadow-md hover:bg-gray-100 transition"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="flex flex-col items-center justify-center cursor-pointer py-8"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="w-16 h-16 bg-dusty-pink/10 rounded-full flex items-center justify-center mb-4 text-dusty-pink">
                            <Upload size={28} />
                          </div>
                          <p className="font-medium mb-1">Click to upload an image</p>
                          <p className="text-xs text-charcoal/50">PNG, JPG or WEBP (max. 5MB)</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/png, image/jpeg, image/webp" 
                        className="hidden" 
                      />
                    </div>
                  </motion.div>
                )}


                {/* STEP 3: Size & Shape */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Size Selection */}
                    <div>
                      <h2 className="text-2xl font-heading mb-4 flex items-center gap-2">
                        <Ruler className="text-dusty-pink" /> 
                        Choose Your Size
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SIZES.map((s) => (
                          <div 
                            key={s.id}
                            onClick={() => setSize(s.id)}
                            className={`border rounded-xl p-4 cursor-pointer transition-all ${
                              size === s.id 
                                ? 'border-dusty-pink bg-dusty-pink/10 shadow-sm ring-1 ring-dusty-pink' 
                                : 'border-black/10 bg-white/50 hover:border-dusty-pink/50'
                            }`}
                          >
                            <div className="font-medium text-lg">{s.label}</div>
                            <div className="text-xs text-charcoal/60 mt-1">{s.desc}</div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-charcoal/50 mt-3 flex justify-end">
                        <Link href="/sizing-guide" className="underline hover:text-dusty-pink">Need measuring help?</Link>
                      </p>
                    </div>

                    {/* Shape Selection */}
                    <div>
                      <h2 className="text-2xl font-heading mb-4">
                        Nail Shape
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {SHAPES.map((sh) => (
                          <div 
                            key={sh.id}
                            onClick={() => setShape(sh.id)}
                            className={`border rounded-full px-5 py-2 cursor-pointer transition-all ${
                              shape === sh.id 
                                ? 'border-dusty-pink bg-dusty-pink text-white shadow-sm' 
                                : 'border-black/10 bg-white/50 hover:bg-dusty-pink/10'
                            }`}
                          >
                            <div className="font-medium text-sm">{sh.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <h2 className="text-2xl font-heading mb-2 flex items-center gap-2">
                        <MessageIcon className="text-dusty-pink" size={22} />
                        Additional Notes
                      </h2>
                      <p className="text-sm text-charcoal/60 mb-3">
                        Have something specific in mind? Let us know any extra details — colours, charms, finishes, or anything else!
                      </p>
                      <textarea
                        className="w-full bg-white/50 border border-warm-white focus:border-dusty-pink rounded-xl px-4 py-3 outline-none transition-all min-h-[120px] resize-y placeholder:text-charcoal/40"
                        placeholder="E.g. I'd love holographic flakes with a soft pink base, matte finish on thumb only…"
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                      />
                    </div>

                    {/* Order Summary (Just Flat Fee Display) */}
                    <div className="bg-white/40 rounded-xl p-5 border border-white mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Custom Design Base Fee</span>
                        <span className="font-heading text-xl text-rose-gold">{displayPrice(CUSTOM_ORDER_BASE_INR)}</span>
                      </div>
                      <p className="text-xs text-charcoal/60">
                        Final quote will be confirmed upon design review. This acts as an initial request.
                      </p>
                    </div>

                    {/* Want to Discuss More? */}
                    <div className="bg-gradient-to-r from-dusty-pink/10 to-rose-gold/10 rounded-2xl p-5 mt-4 border border-dusty-pink/20">
                      <h3 className="font-heading text-lg mb-2 text-center">Want to discuss more?</h3>
                      <p className="text-sm text-charcoal/60 text-center mb-4">
                        Reach out to us directly — we'd love to chat about your dream set!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                          href="https://www.instagram.com/nail_me_amore/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity text-sm font-medium shadow-sm"
                        >
                          <InstagramIcon size={18} />
                          DM on Instagram
                        </a>
                        <a
                          href="https://wa.me/917891393926"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity text-sm font-medium shadow-sm"
                        >
                          <MessageIcon size={18} />
                          Chat on WhatsApp
                        </a>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-black/5 mt-8">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-2 rounded-full border border-charcoal/20 hover:bg-black/5 transition-colors"
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                  ) : (
                    <div></div> // Spacer
                  )}

                  <button
                    type="submit"
                    disabled={
                      (step === 1 && !isStep1Valid) || 
                      (step === 2 && !isStep2Valid) || 
                      (step === 3 && !isStep3Valid) ||
                      isSubmitting
                    }
                    className="bg-dusty-pink text-white px-8 py-2 rounded-full hover:bg-rose-gold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : step === 3 ? (
                      "Submit Request"
                    ) : (
                      <>Next Step <ChevronRight size={18} /></>
                    )}
                  </button>
                </div>

              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
