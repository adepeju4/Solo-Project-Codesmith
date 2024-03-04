import { useStoreActions, useStoreState } from "easy-peasy";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";

function Provider({ user, children }) {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const setUser = useStoreActions((actions) => actions.setUser);

  const client = StreamChat.getInstance(import.meta.env.VITE_KEY);
  const token = cookies.get("token");

  useEffect(() => {
    if (user) setUser(user);
    if (!token && !user) {
      navigate("/signup");
    }
  }, [user, token]);

  return (
    user && (
      <Chat client={client} theme="messaging light">
        {children}
      </Chat>
    )
  );
}

export default Provider;
