import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  stat?: string;
  statLabel?: string;
  index: number;
}

const FeatureCard = ({ title, description, icon: Icon, stat, statLabel, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative hover-lift"
    >
      <div className="card-glass p-8 relative overflow-hidden">
        <div className="absolute inset-0 accent-gradient opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-100">
              <Icon className="w-7 h-7 text-accent" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-3 text-steel-900">
            {title}
          </h3>
          
          <p className="text-steel-800 leading-relaxed mb-6">
            {description}
          </p>
          
          {stat && (
            <div className="pt-6 border-t border-steel-200/30">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold accent-gradient bg-clip-text text-transparent">
                  {stat}
                </span>
                {statLabel && (
                  <span className="ml-2 text-steel-700">
                    {statLabel}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const WhyChooseUs = () => {
  const { theme } = useTheme();
  
  return (
    <section className="section-padding premium-gradient dark:bg-steel-900/50">
      <div className="container mx-auto container-padding relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gradient mb-6"
          >
            Why Choose HOU GEN PROS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-steel-600 dark:text-steel-400"
          >
            Experience unmatched expertise and reliability with Houston's leading generator solutions provider
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Expert Installation",
              description: "Our certified technicians bring years of experience to ensure your generator system is installed with precision and care.",
              stat: "1,000+",
              statLabel: "Installations",
              icon: (props: any) => (
                <svg
                  {...props}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              ),
            },
            {
              title: "24/7 Support",
              description: "Round-the-clock emergency service and dedicated support to ensure your power never fails when you need it most.",
              stat: "24/7",
              statLabel: "Emergency Response",
              icon: (props: any) => (
                <svg
                  {...props}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              ),
            },
            {
              title: "Quality Guarantee",
              description: "We use only premium parts and follow rigorous quality control measures to ensure lasting performance.",
              stat: "100%",
              statLabel: "Satisfaction Rate",
              icon: (props: any) => (
                <svg
                  {...props}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ),
            },
          ].map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <a
            href="/contact"
            className="btn-accent px-8 py-4 rounded-full inline-flex items-center gap-2"
          >
            Schedule a Consultation
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 