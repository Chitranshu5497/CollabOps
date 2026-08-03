import { useEffect } from "react";

import { getMe, refresh } from "../../services/auth.service";
import { useAuthStore } from "../../store/auth.store";

const AuthInitializer = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const initialize = async () => {
      try {
        const refreshResponse = await refresh();

        const token = refreshResponse.data.accessToken;

        // Store the token FIRST
        setAccessToken(token);

        // Now Axios interceptor will attach it
        const me = await getMe();

        setAuth(me.data, token);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [setAuth, setAccessToken, setLoading]);

  return null;
};

export default AuthInitializer;