import { useState } from "react";
import GlassCard from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageSquare, Phone, Mail, HelpCircle, FileText, Clock } from "lucide-react";

const SupportPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.fullName || user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would send the form data to the server
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  // FAQ data
  const faqs = [
    {
      question: "How does AutoVest work?",
      answer: "AutoVest allows you to invest in luxury and premium vehicles that generate returns. You choose an investment package, invest your desired amount (above the package minimum), and earn weekly returns. After the lock period, you can withdraw your initial investment plus earnings."
    },
    {
      question: "What are the minimum investment amounts?",
      answer: "Minimum investments vary by package. Economy packages start at $100, Premium packages at $500, Luxury packages at $1,000, and Supercar packages at $5,000. Each package has different risk levels and return rates."
    },
    {
      question: "How are returns generated?",
      answer: "Returns are generated through various automotive industry channels including: vehicle appreciation for rare models, rental income from premium vehicles, partial ownership earnings, and strategic partnerships with luxury car companies."
    },
    {
      question: "Is there a lock period for investments?",
      answer: "Yes, each investment package has a specified lock period during which your investment is committed. These typically range from 4 weeks to 52 weeks. Longer lock periods generally offer higher total returns."
    },
    {
      question: "How do I withdraw my earnings?",
      answer: "Once your investment completes its lock period, you can withdraw your initial investment plus earnings to your bank account through the Dashboard. Weekly returns can also be withdrawn before the lock period ends."
    },
    {
      question: "What happens if I need to withdraw early?",
      answer: "Early withdrawals before the lock period ends may be subject to an early withdrawal fee (typically 5-10% of the invested amount). Please contact support for assistance with early withdrawals."
    }
  ];

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Support Center</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get help with your investments and account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-start">
              <div className="mr-4 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Live Chat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Chat with our support team in real-time
                </p>
                <Button 
                  className="mt-3 bg-gradient-to-r from-blue-500 to-blue-700"
                  onClick={() => toast({
                    title: "Live chat coming soon",
                    description: "This feature is under development."
                  })}
                >
                  Start Chat
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-start">
              <div className="mr-4 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Phone Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Call us for immediate assistance
                </p>
                <p className="mt-3 font-medium">+1 (888) 123-4567</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Monday - Friday, 9am - 5pm EST
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-start">
              <div className="mr-4 w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Email Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Send us an email anytime
                </p>
                <p className="mt-3 font-medium">support@autovest.example.com</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  We respond within 24 hours
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                Frequently Asked Questions
              </h2>
              
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </GlassCard>
          </motion.div>
        </div>
        
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-6">Resources</h2>
              
              <div className="space-y-4">
                <a href="#" className="block p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center">
                    <div className="mr-3 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">User Guide</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        Learn how to navigate and use the platform
                      </p>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="block p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center">
                    <div className="mr-3 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Investment Guide</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        Tips for maximizing your investment returns
                      </p>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="block p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center">
                    <div className="mr-3 w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Troubleshooting</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        Solutions to common issues and problems
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-6">Contact Us</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email address"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="subject">
                Subject
              </label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="What's this about?"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1" htmlFor="message">
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="How can we help you?"
                rows={5}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-amber-500 to-amber-700"
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>Send Message</>
                )}
              </Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default SupportPage;