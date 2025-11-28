import React from "react";
import { CreditCard, Check, Crown, Star, Zap } from "lucide-react";
import Layout from "../components/Layout";
import Header from "../components/Header";

const Billing = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <Layout>
      <Header
        title="Billing & Subscription"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackButton={true}
      />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent" />
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 text-yellow-400" />
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    Current Plan: Value+
                  </h4>
                  <p className="text-gray-400 text-sm">
                    $18 per month • Next billing: August 31, 2025
                  </p>
                </div>
              </div>
              <button className="btn btn--default font-medium text-sm">
                Manage Plan
              </button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                <Check className="w-3 h-3 mr-1" />
                Active
              </span>
              <span className="text-gray-400">Auto-renewal enabled</span>
            </div>
          </div>

          {/* Subscription Plans */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">
              Available Plans
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Value+ Plan */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-6 border border-yellow-500/30 relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                    Current
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">Value+</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-white">$18</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">$199 Annually</p>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      7-Days Personalized Content Calendar
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Reference Based Post Cloning
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      LinkedIn Profile Optimizer
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Keywords-Based Content (Algorithm friendly)
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      IP/Region Based Content
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Viral Post Generator (through Knowledge Base)
                    </span>
                  </li>
                </ul>

                <button
                  className="w-full btn btn--default font-medium text-sm bg-gray-600 text-gray-300 cursor-not-allowed"
                  disabled
                >
                  Current Plan
                </button>
              </div>

              {/* Standard Plan */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-6 border border-blue-500/30 relative">
                <div className="absolute top-4 right-4">
                  <Star className="w-5 h-5 text-blue-400" />
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Standard
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-white">$45</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">$450 Annually</p>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Everything in Value+
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Convert Voice Notes to Post
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Convert YouTube Shorts to Post
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Advanced Analytics
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Full Content Calendar Automation
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Strategic Goal Based Content
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Generate Inbound Leads through targeted content
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Email Delivery of Posts for Automated Scheduling
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Personalized Post Recommendations
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Notes/Google Docs/Apple Notes Sync
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Role Based Personalization
                    </span>
                  </li>
                </ul>

                <button className="w-full btn btn--default font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white">
                  Upgrade to Standard
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/30 relative">
                <div className="absolute top-4 right-4">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Enterprise
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-white">
                      Contact for pricing
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Everything in Standard
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Custom LinkedIn CRM AI for you & your organization
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Whitelabeling Option
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Dedicated Brand Manager
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Advanced Analytics
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Custom Workflows for all Social Media Channels
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      Outreach Engines + Organic Growth Accelerator
                    </span>
                  </li>
                </ul>

                <button className="w-full btn btn--default font-medium text-sm bg-purple-600 hover:bg-purple-700 text-white">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
            <h4 className="text-lg font-semibold text-white mb-4">
              Billing History
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <p className="text-white font-medium">Value+ Monthly</p>
                  <p className="text-gray-400 text-sm">January 31, 2025</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">$18.00</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                    Paid
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <p className="text-white font-medium">Value+ Monthly</p>
                  <p className="text-gray-400 text-sm">December 31, 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">$18.00</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                    Paid
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-white font-medium">Value+ Monthly</p>
                  <p className="text-gray-400 text-sm">November 30, 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">$18.00</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                    Paid
                  </span>
                </div>
              </div>
            </div>
            <button className="btn btn--default font-medium text-sm mt-4">
              View All History
            </button>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
            <h4 className="text-lg font-semibold text-white mb-4">
              Payment Method
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-white font-medium">•••• •••• •••• 1234</p>
                  <p className="text-gray-400 text-sm">Expires 12/27</p>
                </div>
              </div>
              <button className="btn btn--default font-medium text-sm">
                Update Payment Method
              </button>
            </div>
          </div>

          {/* Billing Settings */}
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
            <h4 className="text-lg font-semibold text-white mb-4">
              Billing Settings
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-white font-medium">Auto-renewal</h5>
                  <p className="text-gray-400 text-sm">
                    Automatically renew your subscription
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-white font-medium">Email Receipts</h5>
                  <p className="text-gray-400 text-sm">
                    Receive email receipts for payments
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Cancel Subscription */}
          <div className="bg-red-900/20 rounded-lg p-6 border border-red-500/30">
            <h4 className="text-lg font-semibold text-white mb-2">
              Cancel Subscription
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              You can cancel your subscription at any time. You'll continue to
              have access until the end of your billing period.
            </p>
            <button className="btn btn--default font-medium text-sm bg-red-700 hover:bg-red-800 text-white">
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Billing;
