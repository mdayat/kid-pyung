import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { ComponentType, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function withAuth<P extends object>(
  WrappedComponents: ComponentType<P>
) {
  const AuthenticatedComponent: ComponentType<P> = (props: P) => {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const [signOut] = useSignOut(auth);
    useEffect(() => {
      if (error) {
        console.error(error);
        navigate("/login");
      }
      if (!user && !loading) {
        navigate("/login");
      }
      if (!user?.email?.match(/@emteka.id$/)) {
        (async () => {
          await signOut();
          navigate("/login");
        })();
      }
    }, [user, loading, error, navigate, signOut]);

    return (
      <>{loading ? <h1>Loading...</h1> : <WrappedComponents {...props} />}</>
    );
  };

  return AuthenticatedComponent;
}
