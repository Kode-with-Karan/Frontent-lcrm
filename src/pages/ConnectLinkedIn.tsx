import React, { useState } from "react";
import { LinkedinIcon, Check, AlertCircle } from "lucide-react";
import Header from "../components/Header";

const ConnectLinkedIn = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Connect LinkedIn Profile"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-600 rounded-lg">
              <LinkedinIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Connect LinkedIn Profile
              </h1>
              <p className="text-gray-400">
                Link your LinkedIn account to start creating personalized
                content
              </p>
            </div>
          </div>

          {!isConnected ? (
            <form onSubmit={handleConnect} className="space-y-6">
              <div className="border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-400">
                      Secure Connection
                    </h3>
                    <p className="text-sm text-blue-300 mt-1">
                      Your credentials are encrypted and used only to access
                      your public profile information.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  LinkedIn Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your LinkedIn email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  LinkedIn Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your LinkedIn password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Connect LinkedIn Account
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Successfully Connected!
              </h2>
              <p className="text-gray-400 mb-6">
                Your LinkedIn profile is now connected and ready to use with all
                features.
              </p>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <LinkedinIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">Niko Saterio</p>
                    <p className="text-sm text-gray-400">
                      Lead Product Designer
                    </p>
                    <p className="text-xs text-green-400">Connected</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectLinkedIn;
