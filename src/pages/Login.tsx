import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.error(error);
      navigate("/login");
    }
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, error, navigate]);

  return (
    <div>
      <button onClick={async () => await signInWithGoogle()}>
        Sign in with Google
      </button>
    </div>
  );
}
