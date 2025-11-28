import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import TwoFA from "./pages/2FA";
import {
  ProtectedRoute,
  UnverifiedOnlyRoute,
} from "./components/ProtectedRoute";
import { PublicRoute } from "./components/ProtectedRoute";

import Signup from "./pages/Signup";

import ReferenceBasedCloning from "./pages/ReferenceBasedCloning";
import CalendarAutomation from "./pages/CalendarAutomation/index";
import ProfileAnalyzer from "./pages/ProfileAnalyzer";
import InboxDelivery from "./pages/InboxDelivery";
import GoalBasedContent from "./pages/GoalBasedContent";
import NotesSync from "./pages/NotesSync/index";
import NotionCallback from "./pages/NotionCallback";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import YouTubeConverter from "./pages/YouTubeConverter";
import VoiceToPost from "./pages/VoiceToPost";
import ViralPostSearch from "./pages/ViralPostSearch";
import MultiProfileManagement from "./pages/MultiProfileManagement/index";
import LinkedInCallback from "./pages/MultiProfileManagement/LinkedInCallback";
import RoleBasedPersonalization from "./pages/RoleBasedPersonalization";
import KlypeChat from "./pages/KlypeChat/KlypeChat";
import RedditPost from "./pages/RedditPost";
import CreatePost from "./pages/CreatePost";
import HelpSupport from "./pages/HelpSupport";
// import EmailNotVerified from "./components/EmailNotverfied";
import EmailVerificationPage from "./components/EmailVerificationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/mfa"
          element={
            <PublicRoute>
              <TwoFA />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/verify-email"
          element={
            <UnverifiedOnlyRoute>
              <EmailNotVerified />
            </UnverifiedOnlyRoute>
          }
        /> */}
        <Route
          path="/redirect/email-verification"
          element={
            <UnverifiedOnlyRoute>
              <EmailVerificationPage />
            </UnverifiedOnlyRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viral-search"
          element={
            <ProtectedRoute>
              <ViralPostSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reference-cloning"
          element={
            <ProtectedRoute>
              <ReferenceBasedCloning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reddit-post-cloning"
          element={
            <ProtectedRoute>
              <RedditPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar-automation"
          element={
            <ProtectedRoute>
              <CalendarAutomation />
            </ProtectedRoute>
          }
        />
        <Route
          path=""
          element={
            <ProtectedRoute>
              <KlypeChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/role-personalization"
          element={
            <ProtectedRoute>
              <RoleBasedPersonalization />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes-sync"
          element={
            <ProtectedRoute>
              <NotesSync />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notion-callback"
          element={
            <ProtectedRoute>
              <NotionCallback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <HelpSupport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voice-to-post"
          element={
            <ProtectedRoute>
              <Layout>
                <VoiceToPost />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-analyzer"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfileAnalyzer />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox-delivery"
          element={
            <ProtectedRoute>
              
                <InboxDelivery />
              
            </ProtectedRoute>
          }
        />
        <Route
          path="/goal-based-content"
          element={
            <ProtectedRoute>
              <Layout>
                <GoalBasedContent />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/youtube-converter"
          element={
            <ProtectedRoute>
              <Layout>
                <YouTubeConverter />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/multi-profile-management"
          element={
            <ProtectedRoute>
              <Layout>
                <MultiProfileManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/linkedin-callback"
          element={
            <ProtectedRoute>
              <Layout>
                <LinkedInCallback />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
