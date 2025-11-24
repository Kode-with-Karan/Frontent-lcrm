import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { ReactNode } from "react";
import Spinner from "./Spinner";

type ProtectedRouteProps = {
  children: ReactNode;
};
type PublicRouteProps = {
  children: ReactNode;
};

type RouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, loading] = useAuthState(auth);

  if (loading)
    return (
      <p className="h-screen w-full items-center justify-center flex">
        <Spinner size={25} />
      </p>
    );
  if (!user) return <Navigate to="/login" />;
  // if (!user.emailVerified) {
  //   return <Navigate to="/verify-email" />;
  // }
  return <>{children}</>;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const [user, loading] = useAuthState(auth);

  if (loading)
    return (
      <p className="h-screen w-full items-center justify-center flex">
        <Spinner size={25} />
      </p>
    );
  if (user) return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

export function UnverifiedOnlyRoute({ children }: RouteProps) {
  const [user, loading] = useAuthState(auth);

  if (loading)
    return (
      <p className="h-screen w-full items-center justify-center flex">
        <Spinner size={25} />
      </p>
    );
  if (!user) return <Navigate to="/login" />;
  if (user.emailVerified) return <Navigate to="/dashboard" />;

  return <>{children}</>;
}
