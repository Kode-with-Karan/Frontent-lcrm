import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Key, Bell, Shield, CreditCard } from "lucide-react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import RenderProfileSettings from "./SettingsComponents/RenderProfileSettings";
import ResetPassword from "./SettingsComponents/ResetPass";
import { auth } from "../firebase";
import RenderNotificationSetting from "./SettingsComponents/renderNotificationSetting";
import RenderVerficationSettings from "./SettingsComponents/renderVerficationSettings";
import PrivacySecuritySettings from "./SettingsComponents/PrivacySecuritySettings";
import { RecaptchaVerifier } from "firebase/auth";

const AccountSettings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("profile");
  const navigate = useNavigate();
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  useEffect(() => {
    if (!recaptchaVerifier.current && typeof window !== "undefined") {
      recaptchaVerifier.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
      recaptchaVerifier.current.render().catch(console.error);
    }
  }, []);

  const sidebarSections = [
    {
      id: "profile",
      label: "Profile Settings",
      icon: User,
    },
    {
      id: "password",
      label: "Password",
      icon: Key,
    },
    {
      id: "billing",
      label: "Billing",
      icon: CreditCard,
    },
    {
      id: "privacy&security",
      label: "Privacy & Security",
      icon: Shield,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "verification",
      label: "Verification",
      icon: Shield,
    },
  ];

  const renderProfileSettings = () => <RenderProfileSettings auth={auth} />;

  const renderPasswordSettings = () => <ResetPassword auth={auth} />;

  const renderNotificationSettings = () => <RenderNotificationSetting />;

  const renderVerificationSettings = () => (
    <RenderVerficationSettings auth={auth} />
  );

  const renderPrivacySecuritySettings = () => (
    <PrivacySecuritySettings auth={auth} />
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings();
      case "password":
        return renderPasswordSettings();
      case "notifications":
        return renderNotificationSettings();
      case "verification":
        return renderVerificationSettings();
      case "privacy&security":
        return renderPrivacySecuritySettings();
      case "billing":
        navigate("/billing");
        return null;
    }
  };

  return (
    <Layout>
      <div id="recaptcha-container"></div>
      <div>
        <Header
          title="Settings"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showBackButton={true}
        />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="rounded-md flex min-h-[600px]">
          {/* Sidebar */}
          <div
            className="w-64 border-r border-gray-700 p-6"
            // style={{ background: "rgba(70, 70, 70, 0.25)" }}
          >
            <nav className="space-y-2">
              {sidebarSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeSection === section.id
                        ? "bg-white text-gray-900"
                        : "text-gray-300 hover:bg-white hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div
            className="flex-1 p-8 "
            style={{ background: "rgba(70, 70, 70, 0.11)" }}
          >
            <div className="max-w-3xl">{renderContent()}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountSettings;
