import React, { useState } from "react";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Book,
  Video,
  FileText,
  Users,
  Zap,
  Send,
} from "lucide-react";
import Layout from "../components/Layout";
import Header from "../components/Header";

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("faq");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium",
  });

  const faqData = [
    {
      question: "How do I get started with LinkedIn CRM AI?",
      answer:
        "Getting started is easy! After signing up, you'll be taken to your dashboard where you can explore our features. Start with the 'Create a Post' tool to generate your first AI-powered content, or try our 'YouTube to Post' converter to transform existing content.",
    },
    {
      question: "What's included in the Value+ plan?",
      answer:
        "The Value+ plan includes: 7-Days Personalized Content Calendar, Reference Based Post Cloning, LinkedIn Profile Optimizer, Keywords-Based Content (Algorithm friendly), IP/Region Based Content, and Viral Post Generator through our Knowledge Base.",
    },
    {
      question: "How does the AI content generation work?",
      answer:
        "Our AI analyzes your input, whether it's a topic, reference post, or YouTube video, and generates engaging LinkedIn content tailored to your audience. The AI considers factors like tone, industry, target audience, and current trends to create relevant, high-quality posts.",
    },
    {
      question: "Can I customize the generated content?",
      answer:
        "Absolutely! All generated content can be edited and customized to match your voice and brand. You can adjust tone, add personal touches, modify calls-to-action, and ensure the content aligns with your messaging strategy.",
    },
    {
      question: "How does the Reference Based Post Cloning work?",
      answer:
        "Reference Based Post Cloning analyzes successful posts in your industry and creates similar content while maintaining originality. You can set the similarity percentage and our AI will generate posts that capture the essence and structure of high-performing content.",
    },
    {
      question: "What is the Content Calendar Automation?",
      answer:
        "Our Content Calendar Automation schedules and plans your posts for optimal engagement. It analyzes your audience's activity patterns and suggests the best times to post, helping you maintain a consistent presence on LinkedIn.",
    },
    {
      question: "How secure is my data with LinkedIn CRM AI?",
      answer:
        "We take data security seriously. All your information is encrypted and stored securely. We never share your content or personal data with third parties. Your LinkedIn credentials are handled through secure OAuth protocols.",
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer:
        "Yes, you can change your subscription plan at any time from the Billing & Plans section. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.",
    },
    {
      question: "How does the Voice to Post feature work?",
      answer:
        "Simply record your thoughts, ideas, or speaking points using our voice recorder. Our AI transcribes your audio and transforms it into a well-structured LinkedIn post, maintaining your key messages while optimizing for engagement.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We offer multiple support channels: email support for all users, priority support for premium subscribers, live chat during business hours, comprehensive documentation, video tutorials, and a community forum for user discussions.",
    },
  ];

  const quickLinks = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of LinkedIn CRM AI",
      icon: Book,
      link: "#",
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step tutorials",
      icon: Video,
      link: "#",
    },
    {
      title: "API Documentation",
      description: "Integrate with our API",
      icon: FileText,
      link: "#",
    },
    {
      title: "Community Forum",
      description: "Connect with other users",
      icon: Users,
      link: "#",
    },
  ];

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: Mail,
      contact: "support@LinkedIn CRM.ai",
      available: "24/7",
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageCircle,
      contact: "Comming soon",
      // available: "Mon-Fri, 9AM-6PM EST",
    },
    {
      title: "Priority Support",
      description: "Premium users get faster response",
      icon: Zap,
      contact: "premium@LinkedIn CRM.ai",
      available: "24/7 - 4 hour response",
    },
  ];

  // Filter FAQs based on search query
  const filteredFaqData = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Contact form submitted:", contactForm);
    // Reset form
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      priority: "medium",
    });
    alert("Thank you for your message! We'll get back to you soon.");
  };

  const renderFAQ = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-2">
          Frequently Asked Questions
        </h3>
        <p className="text-gray-400">
          Find answers to common questions about LinkedIn CRM AI
        </p>
      </div>

      {/* FAQ Search Bar */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
        <div className="relative">
          <Search className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQ questions and answers..."
            value={faqSearchQuery}
            onChange={(e) => setFaqSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent"
            style={{ background: "rgba(70, 70, 70, 0.25)" }}
          />
        </div>
        {faqSearchQuery && (
          <p className="text-gray-400 text-sm mt-2">
            Found {filteredFaqData.length} result
            {filteredFaqData.length !== 1 ? "s" : ""} for "{faqSearchQuery}"
          </p>
        )}
      </div>

      <div className="space-y-3">
        {filteredFaqData.length > 0 ? (
          filteredFaqData.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedFaq(expandedFaq === index ? null : index)
                }
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/20 transition-colors"
              >
                <h4 className="text-white font-medium">{faq.question}</h4>
                {expandedFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {expandedFaq === index && (
                <div className="px-4 pb-4">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 text-center">
            <div className="text-gray-400 mb-2">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            </div>
            <h4 className="text-white font-medium mb-1">No results found</h4>
            <p className="text-gray-400 text-sm">
              Try adjusting your search terms or browse all questions below
            </p>
            <button
              onClick={() => setFaqSearchQuery("")}
              className="mt-3 px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderQuickLinks = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-2">
          Quick Links & Resources
        </h3>
        <p className="text-gray-400">
          Access documentation, tutorials, and community resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <a
              key={index}
              href={link.link}
              className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">{link.title}</h4>
                  <p className="text-gray-400 text-sm">{link.description}</p>
                  <div className="flex items-center mt-2 text-blue-400 text-sm">
                    <span>Learn more</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-2">
          Contact Our Support Team
        </h3>
        <p className="text-gray-400">
          Get in touch with our expert support team for personalized assistance
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <div
              key={index}
              className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 text-center"
            >
              <div className="inline-flex p-3 rounded-lg bg-purple-500/20 mb-4">
                <Icon className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white font-medium mb-2">{method.title}</h4>
              <p className="text-gray-400 text-sm mb-3">{method.description}</p>
              <div className="text-blue-400 font-medium text-sm">
                {method.contact}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                {method.available}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Form */}
      <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
        <h4 className="text-lg font-semibold text-white mb-4">
          Send us a Message
        </h4>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent"
                style={{ background: "rgba(70, 70, 70, 0.25)" }}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent"
                style={{ background: "rgba(70, 70, 70, 0.25)" }}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject *
              </label>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm({ ...contactForm, subject: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent"
                style={{ background: "rgba(70, 70, 70, 0.25)" }}
                placeholder="Brief description of your issue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={contactForm.priority}
                onChange={(e) =>
                  setContactForm({ ...contactForm, priority: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent"
                style={{ background: "rgba(70, 70, 70, 0.25)" }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message *
            </label>
            <textarea
              required
              rows={6}
              value={contactForm.message}
              onChange={(e) =>
                setContactForm({ ...contactForm, message: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent resize-none"
              style={{ background: "rgba(70, 70, 70, 0.25)" }}
              placeholder="Please describe your issue or question in detail..."
            />
          </div>

          <button
            type="submit"
            className="w-full btn btn--default font-medium flex items-center justify-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "faq":
        return renderFAQ();
      case "resources":
        return renderQuickLinks();
      case "contact":
        return renderContact();
      default:
        return renderFAQ();
    }
  };

  return (
    <Layout>
      <div>
        <Header
          title="Help & Support"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showBackButton={true}
        />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex min-h-[600px] gap-6">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-700 p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection("faq")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
                  activeSection === "faq"
                    ? "bg-white text-gray-900"
                    : "text-gray-300 hover:bg-white hover:text-gray-900"
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">FAQ</span>
              </button>
              <button
                onClick={() => setActiveSection("resources")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
                  activeSection === "resources"
                    ? "bg-white text-gray-900"
                    : "text-gray-300 hover:bg-white hover:text-gray-900"
                }`}
              >
                <Book className="w-5 h-5" />
                <span className="font-medium">Resources</span>
              </button>
              <button
                onClick={() => setActiveSection("contact")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
                  activeSection === "contact"
                    ? "bg-white text-gray-900"
                    : "text-gray-300 hover:bg-white hover:text-gray-900"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Contact Us</span>
              </button>
            </nav>

            {/* Quick Search */}
            {/* <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <h4 className="text-white font-medium mb-3">Quick Search</h4>
              <div className="relative">
                <Search className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search help topics..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent text-sm"
                  style={{ background: "rgba(70, 70, 70, 0.25)" }}
                />
              </div>
            </div> */}

            {/* Status */}
            <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-500/30">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-300 text-sm font-medium">
                  All systems operational
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpSupport;
