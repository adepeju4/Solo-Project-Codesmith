import { useStoreActions } from "easy-peasy";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Cookies from "universal-cookie";

function Provider({ user, children, client }) {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const setUser = useStoreActions((actions) => actions.setUser);

  const token = cookies.get("token");

  useEffect(() => {
    if (token && client) {
      client
        .connectUser(
          {
            id: cookies.get("userId"),
            name: cookies.get("userName"),
            firstName: cookies.get("firstName"),
            lastName: cookies.get("lastName"),
            hashedPassword: cookies.get("hashedPassword"),
          },
          token
        )
        .then((user) => {
          setUser(user);
        });
    }
  }, [token, client]);

  useEffect(() => {
    if (user) setUser(user);
    if (!token && !user) {
      navigate("/signup");
    }
  }, [user, token]);

  return children;
}

export default Provider;
