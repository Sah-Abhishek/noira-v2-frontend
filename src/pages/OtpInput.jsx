import { useParams } from 'react-router-dom';
import React from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useUserStore from '../store/UserStore.jsx'

const OtpInput = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = React.useState('');
  const userEmail = localStorage.getItem('userEmail');
  const [errMsg, setErrMsg] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  const { purpose } = useParams();  // e.g. "login", "register", "password_reset"
  const { setUser } = useUserStore();

  const [loading, setLoading] = useState(false);
  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const handleVerify = async () => {
    if (otp.length < 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      console.log("This is the purpose");
      setLoading(true);
      const response = await axios.post(`${apiUrl}/verifyotp/${purpose}`, {
        otpCode: otp,
        email: userEmail,
      });

      if (response.data.success) {
        localStorage.setItem("userjwt", response.data.token);
        localStorage.setItem("userId", response.data.user._id);
        setUser(response.data.user);

        // Redirect based on purpose
        if (purpose === "login") {
          navigate(from, { replace: true });
        } else if (purpose === "register") {
          navigate("/user/userprofile");
        } else if (purpose === "password_reset") {
          navigate("/reset-password-success");
        } else {
          navigate("/");
        }
      } else {
        setErrMsg("OTP verification failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrMsg("Failed to verify OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black flex flex-col items-center justify-center px-4 sm:px-6">
      <h2 className="text-primary text-xl sm:text-2xl font-semibold mb-2">
        Enter OTP
      </h2>

      <p className="text-gray-400 text-sm sm:text-base mb-4 text-center">
        An OTP has been sent to your email address
      </p>

      <div className="flex justify-center flex-wrap gap-2 w-full max-w-md">
        <MuiOtpInput
          value={otp}
          onChange={handleChange}
          length={6}
          TextFieldsProps={{
            inputProps: {
              inputMode: 'numeric',     // mobile keyboards show numbers
              pattern: '[0-9]*',        // regex to restrict input to numbers
            },
            sx: {
              width: {
                xs: '36px',
                sm: '50px',
                md: '60px',
              },
              height: {
                xs: '44px',
                sm: '50px',
                md: '60px',
              },
              mx: {
                xs: 0.3,
                sm: 0.5,
              },
              '& .MuiInputBase-input': {
                color: '#FFD700',
                textAlign: 'center',
                fontSize: '1.25rem',
                padding: 0,
              },
              '& .MuiOutlinedInput-root': {
                height: '100%',
                borderRadius: '8px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFD700',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFD700',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFD700',
              },
            },
          }}
        />
      </div>

      <button
        onClick={handleVerify}
        disabled={otp.length !== 6}
        className={`mt-6 w-full max-w-xs sm:max-w-sm px-6 py-2 font-semibold rounded transition
  ${otp.length !== 6
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-amber-500 text-black'
          }
`}
      >
        Verify OTP
      </button>
      <div>
        {errMsg && <div className='mt-5 mb-3 text-sm text-center text-red-500'>{errMsg}</div>}
      </div>
    </div>
  );
};

export default OtpInput;
