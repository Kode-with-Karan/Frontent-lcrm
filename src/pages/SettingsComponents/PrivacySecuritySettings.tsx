import { Auth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { useState } from "react"

function PrivacySecuritySettings({ auth }: { auth: Auth }) {
  const [error, setError] = useState('')

  const user = auth.currentUser

  async function reauthenticate(pw: string) {
    if (!user?.email) throw new Error('No user email found')
    const credential = EmailAuthProvider.credential(user.email, pw)
    await reauthenticateWithCredential(user, credential)
  }

  const handleDeleteClick = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action is irreversible.'
      )
    ) {
      let pw = ''
      if (user?.providerData[0]?.providerId === 'password') {
        pw = window.prompt('Please enter your password to confirm deletion') || ''
        if (!pw) return alert('Password is required')
      }

      setError('')
      try {
        if (!user) throw new Error('No user found')
        if (pw) await reauthenticate(pw)
        await deleteUser(user)
      } catch (e) {
        setError((e as Error).message)
      }
    }
  }


  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-1">
          Privacy & Security
        </h3>
        <p className="text-gray-400 text-sm">
          Manage your privacy preferences and security settings to keep your
          account safe.
        </p>
      </div>

      <div className="space-y-4">
        <div
          className="rounded-md p-4"
          style={{ background: "rgba(70, 70, 70, 0.25)" }}
        >
          <h4 className="text-white font-medium mb-2">Profile Visibility</h4>
          <div className="flex items-center gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="profileVisibility"
                value="public"
                defaultChecked
                className="w-4 h-4 text-blue-600 border-gray-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-300">Public</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="profileVisibility"
                value="private"
                className="w-4 h-4 text-blue-600 border-gray-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-300">Private</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Choose who can view your profile information.
          </p>
        </div>

        {/* Security Options */}
        <div
          className="rounded-md p-4"
          style={{ background: "rgba(70, 70, 70, 0.25)" }}
        >
          <h4 className="text-white font-medium mb-2">Login Alerts</h4>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">
              Email me when my account is accessed from a new device
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div
          className="rounded-md p-4"
          style={{ background: "rgba(70, 70, 70, 0.25)" }}
        >
          <h4 className="text-white font-medium mb-2">Data Download</h4>
          <button className="btn btn--default font-medium text-sm">
            Request My Data
          </button>
          <p className="text-xs text-gray-500 mt-2">
            You can request a copy of your personal data stored in our system.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-medium mb-2">Delete Account</h4>
          <button
            onClick={handleDeleteClick}
            className="btn btn--default font-medium text-sm bg-red-700 hover:bg-red-800 text-white"
          >
            Delete My Account
          </button>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          <p className="text-xs text-red-400 mt-2">
            Warning: This action is irreversible and will permanently delete your account and all
            associated data.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacySecuritySettings