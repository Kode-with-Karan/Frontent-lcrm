import { Auth, sendEmailVerification } from "firebase/auth"
import { Shield } from "lucide-react"

function RenderVerficationSettings({ auth }: { auth: Auth }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Account Verification
        </h3>
        <div className="space-y-4">
          <div
            className="rounded-md p-4"
            style={{ background: "rgba(70, 70, 70, 0.25)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Email Verification</h4>
                <p className="text-gray-400 text-sm">Your email is {!auth.currentUser?.emailVerified && "not"} verified</p>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${!auth.currentUser?.emailVerified ? 'bg-yellow-400 text-yellow-700' : 'bg-green-900 text-green-300'}`}>
                <Shield className="w-3 h-3 mr-1" />
                {auth.currentUser?.emailVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>
          {
            !auth.currentUser?.emailVerified && (
              <div
                className="rounded-md p-4"
                style={{ background: "rgba(70, 70, 70, 0.25)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Email Verification</h4>
                    <p className="text-gray-400 text-sm">
                      Verify your Email number for added security
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      if (auth.currentUser) {
                        await sendEmailVerification(auth.currentUser);
                        alert("Verification email sent");
                      }
                    }}
                    className="btn btn--default font-medium text-sm"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )
          }

          <div
            className="rounded-md p-4"
            style={{ background: "rgba(70, 70, 70, 0.25)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Phone Verification</h4>
                <p className="text-gray-400 text-sm">
                  Verify your phone number for added security
                </p>
              </div>
              <button className="btn btn--default font-medium text-sm">
                Verify
              </button>
            </div>
          </div>
          <div
            className="rounded-md p-4"
            style={{ background: "rgba(70, 70, 70, 0.25)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">
                  Two-Factor Authentication
                </h4>
                <p className="text-gray-400 text-sm">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button className="btn btn--default font-medium text-sm">
                Enable
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RenderVerficationSettings