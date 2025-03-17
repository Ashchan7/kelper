
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page since we're using Google auth
    navigate("/login");
  }, [navigate]);
  
  return null;
};

export default SignupPage;
