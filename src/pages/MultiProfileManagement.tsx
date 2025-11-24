import React from "react";
import { Users, Plus, Settings } from "lucide-react";
// Make sure the Header component exists at the specified path, or update the path if needed.
import Header from "../components/Header";

const MultiProfileManagement = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="min-h-screen">
      <Header
        title="Multi-Profile Content Posting"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-purple-600 rounded-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Multi-Profile Content Posting
              </h1>
              <p className="text-gray-400">
                Manage multiple voices. One dashboard.
              </p>
            </div>
          </div>

          <div className="border border-purple-500/30 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-400">
                Premium Feature
              </h3>
            </div>
            <p className="text-purple-300">
              Handle multiple LinkedIn profiles for yourself, clients, or team
              members. Each profile has its own content calendar, tone settings,
              and permissions.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Connected Profiles
              </h3>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">NS</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Niko Saterio</h4>
                    <p className="text-sm text-gray-400">Personal Profile</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Posts this month:</span>
                    <span className="text-green-400">12</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Avg. engagement:</span>
                    <span className="text-blue-400">2.3k</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Status:</span>
                    <span className="text-green-400">Active</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Manage</span>
                </button>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 border-2 border-dashed border-gray-600">
                <div className="text-center py-8">
                  <Plus className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-400 mb-2">
                    Add New Profile
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Connect another LinkedIn account for clients or team members
                  </p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                    Connect Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Features per Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Individual content calendars</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Custom tone and voice settings</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Role-based content generation</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Performance analytics per profile</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Team member permissions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Bulk content operations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Get Notified When Available
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiProfileManagement;
