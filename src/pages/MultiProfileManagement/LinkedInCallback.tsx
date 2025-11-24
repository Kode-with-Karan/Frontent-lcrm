import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const LinkedInCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      // Get parameters from URL (these come from backend redirect)
      const success = searchParams.get('success');
      const error = searchParams.get('error');
      const profileId = searchParams.get('profileId');

      // If OAuth was successful (redirected from backend)
      if (success === '1') {
        // Send success message to parent window if in popup
        if (window.opener) {
          window.opener.postMessage({
            type: 'LINKEDIN_OAUTH_SUCCESS',
            data: { profileId }
          }, window.location.origin);
          window.close();
          return;
        }
        
        // Redirect to profiles page with success if not in popup
        navigate('/multi-profile?success=1');
        return;
      }

      // If OAuth failed
      if (error) {
        console.error('LinkedIn OAuth error:', error);
        
        // Send error message to parent window if in popup
        if (window.opener) {
          window.opener.postMessage({
            type: 'LINKEDIN_OAUTH_ERROR',
            error: decodeURIComponent(error)
          }, window.location.origin);
          window.close();
          return;
        }
        
        // Redirect to profiles page with error if not in popup
        navigate('/multi-profile?error=' + encodeURIComponent(error));
        return;
      }

      // If no parameters, assume we're still processing
      setTimeout(() => {
        if (window.opener) {
          window.opener.postMessage({
            type: 'LINKEDIN_OAUTH_ERROR',
            error: 'OAuth callback completed but no result received'
          }, window.location.origin);
          window.close();
        } else {
          navigate('/multi-profile');
        }
      }, 3000);
    };

    handleCallback();
  }, [searchParams, navigate]);

  // Show loading state
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Processing LinkedIn Connection
          </h2>
          <p className="text-gray-400">
            Please wait while we complete your LinkedIn profile connection...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkedInCallback;
