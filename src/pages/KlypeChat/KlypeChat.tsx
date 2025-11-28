import React from "react";
import Header from "../../components/Header";
import Layout from "../../components/Layout";

const KlypeChat = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <Layout>
      <div className="pt-4">
        <Header
          title="Klype Chat"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showBackButton
        />
      </div>
      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />
      {/* Content area with proper padding */}
      <div className="w-full p-7">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-3xl font-bold text-[#d9d9d9] mb-4">LinkedIn CRM Chat</h2>
          <p className="text-lg text-[#b0b0b0] max-w-xl text-center mb-8">
            Welcome to LinkedIn CRM Chat! This feature will allow you to generate
            personalized posts and interact with the LinkedIn CRM Agent. Stay tuned for
            updates.
          </p>          
          {/* Chat UI or coming soon message can go here */}
          <div className="rounded-lg bg-[#232323] p-8 shadow-lg text-[#d9d9d9]">
            <span className="text-xl font-semibold">Coming Soon...</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default KlypeChat;
