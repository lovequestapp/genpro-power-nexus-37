
import { motion, Transition, TargetAndTransition } from 'framer-motion';
import { Shield, Star, CheckCircle2, Zap } from 'lucide-react';
import { useState } from 'react';

const QualityGuarantee = () => {
  const [isHovered, setIsHovered] = useState(false);

  const guarantees = [
    {
      icon: Shield,
      title: "Certified Excellence",
      description: "Factory-trained technicians and premium Generac equipment",
      color: "from-orange-500/20 to-orange-600/20",
      iconColor: "text-orange-500",
      glowColor: "group-hover:shadow-orange-500/20"
    },
    {
      icon: Star,
      title: "24/7 Protection",
      description: "Round-the-clock monitoring and emergency response",
      color: "from-accent/20 to-accent/30",
      iconColor: "text-accent",
      glowColor: "group-hover:shadow-accent/20"
    }
  ];

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { duration: 1, ease: "easeInOut" } 
    },
  };

  const powerPulse: { animate: TargetAndTransition; transition: Transition } = {
    animate: {
      strokeDashoffset: [0, -100],
      opacity: [1, 0.8, 1]
    },
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop" as const
    }
  };

  const sparkVariants: { initial: TargetAndTransition; animate: TargetAndTransition } = {
    initial: { opacity: 0, scale: 0.5 },
    animate: {
      opacity: [0, 1, 0],
      scale: [0.5, 1.2, 0.5],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "loop" as const
      }
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-steel-900 via-primary to-steel-800">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-6">Our Quality Guarantee</h2>
          <p className="text-xl text-white max-w-3xl mx-auto">Experience uninterrupted power with our comprehensive generator solutions</p>
        </motion.div>

        {/* Main Visualization */}
        <motion.div 
          className="relative max-w-5xl mx-auto mb-20 p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <svg width="100%" height="350" viewBox="0 0 800 350" fill="none" xmlns="http://www.w3.org/2000/svg">

            {/* Utility Pole */}
            <motion.rect 
              x="50" y="50" width="10" height="200" rx="5" fill="#6B7280"
              initial={{ y: 250, opacity: 0 }}
              animate={{ y: 50, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.line 
              x1="20" y1="100" x2="80" y2="100" stroke="#6B7280" strokeWidth="4" strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
            <motion.line 
              x1="20" y1="150" x2="80" y2="150" stroke="#6B7280" strokeWidth="4" strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
            {/* Utility Power Lines (Connected to house) - Dim/Active based on hover */}
            <motion.path 
              d="M80 150 C 150 150, 450 100, 550 180"
              stroke="#F97316" strokeWidth="4" fill="none"
              strokeLinecap="round" strokeLinejoin="round"
              variants={pathVariants}
              initial="visible"
              animate={isHovered ? "hidden" : "visible"}
            />

            {/* Generator */}
            <motion.rect 
              x="200" y="200" width="150" height="100" rx="10" fill="#E5E7EB"
              initial={{ x: 150, opacity: 0 }}
              animate={{ x: 200, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
            <motion.rect 
              x="210" y="210" width="130" height="80" rx="5" fill="#1F2937"
              initial={{ x: 160, opacity: 0 }}
              animate={{ x: 210, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
            <motion.text x="240" y="270" fontFamily="Arial" fontSize="16" fill="#F97316">GENERAC</motion.text>
            {/* HGP Emblem on Generator */}
            <motion.text 
              x="275" y="250" fontFamily="Arial" fontSize="20" fontWeight="bold" fill="#F97316"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >HGP</motion.text>

            {/* Generator Glow */}
            <motion.rect 
              x="195" y="195" width="160" height="110" rx="10" fill="none"
              stroke="#F97316" strokeWidth="8"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
              style={{ filter: "drop-shadow(0 0 15px #F97316)" }}
            />

            {/* House */}
            <motion.path 
              d="M550 150 L650 50 L750 150 Z" fill="#6B7280"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
            <motion.rect 
              x="550" y="150" width="200" height="150" rx="10" fill="#374151"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            />
            {/* House Windows - Glow when generator active */}
            <motion.rect 
              x="570" y="180" width="40" height="40" fill="#F97316" rx="5"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: isHovered ? 1 : 0.5 }}
              transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
              style={{ filter: isHovered ? "drop-shadow(0 0 10px #F97316)" : "none" }}
            /> 
            <motion.rect 
              x="630" y="180" width="40" height="40" fill="#F97316" rx="5"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: isHovered ? 1 : 0.5 }}
              transition={{ duration: 0.3, delay: 0.05, repeat: Infinity, repeatType: "reverse" }}
              style={{ filter: isHovered ? "drop-shadow(0 0 10px #F97316)" : "none" }}
            /> 
            <motion.rect 
              x="690" y="180" width="40" height="40" fill="#F97316" rx="5"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: isHovered ? 1 : 0.5 }}
              transition={{ duration: 0.3, delay: 0.1, repeat: Infinity, repeatType: "reverse" }}
              style={{ filter: isHovered ? "drop-shadow(0 0 10px #F97316)" : "none" }}
            />
            <motion.rect x="630" y="240" width="40" height="60" fill="#1F2937" rx="5" /> {/* Door */}

            {/* Power Lines - Generator to House (Backup Power) - Animated Surge */}
            <motion.path 
              d="M350 250 C 400 250, 500 280, 550 220"
              stroke="#F97316" strokeWidth="4" fill="none"
              strokeLinecap="round" strokeLinejoin="round"
              variants={pathVariants}
              initial="hidden"
              animate={isHovered ? "visible" : "hidden"}
            />
            {isHovered && (
              <motion.path 
                d="M350 250 C 400 250, 500 280, 550 220"
                stroke="white" strokeWidth="8" fill="none"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="100 100"
                animate={powerPulse.animate}
                transition={powerPulse.transition}
                style={{ filter: "drop-shadow(0 0 12px #F97316)" }}
              />
            )}

            {/* Electric Emblems/Sparks along the line */}
            {isHovered && (
              <>
                <motion.g 
                  initial="initial"
                  animate="animate"
                  variants={sparkVariants}
                >
                  <Zap x="400" y="230" width="20" height="20" fill="#F97316" style={{ filter: "drop-shadow(0 0 5px #F97316)" }} />
                </motion.g>
                <motion.g 
                  initial="initial"
                  animate="animate"
                  variants={sparkVariants}
                  transition={{ delay: 0.4 }}
                >
                  <Zap x="470" y="200" width="20" height="20" fill="#F97316" style={{ filter: "drop-shadow(0 0 5px #F97316)" }} />
                </motion.g>
              </>
            )}

          </svg>
        </motion.div>

        {/* Guarantee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className={`group relative p-8 rounded-2xl bg-gradient-to-br ${guarantee.color} 
                backdrop-blur-sm border border-white/10 transition-all duration-300 
                hover:scale-105 hover:shadow-2xl ${guarantee.glowColor}`}
            >
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-6 
                  group-hover:bg-white/20 transition-colors duration-300`}>
                  <guarantee.icon className={`w-8 h-8 ${guarantee.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{guarantee.title}</h3>
                <p className="text-white text-lg">{guarantee.description}</p>
              </div>

              {/* Interactive hover effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm 
            rounded-full border border-white/20">
            <CheckCircle2 className="w-5 h-5 text-accent mr-2" />
            <span className="text-white font-bold">100% Satisfaction Guaranteed</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QualityGuarantee;
