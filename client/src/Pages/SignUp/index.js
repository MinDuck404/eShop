import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import Logo from "../../assets/images/logo.jpg";

import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import GoogleImg from "../../assets/images/googleImg.png";
import { postData } from "../../utils/api";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formfields, setFormfields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    context.setisHeaderFooterShow(false);
    
    context.setEnableFilterTab(false);
  }, []);

  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value,
    }));
  };

  const register = (e) => {
    console.log(formfields);
    e.preventDefault();
    try {
      if (formfields.name === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Tên không được để trống!",
        });
        return false;
      }
  
      if (formfields.email === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Email không được để trống!",
        });
        return false;
      }
  
      if (formfields.phone === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Số điện thoại không được để trống!",
        });
        return false;
      }
  
      if (formfields.password === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Mật khẩu không được để trống!",
        });
        return false;
      }
  
      setIsLoading(true);
  
      postData("/api/user/signup", formfields)
        .then((res) => {
          if (res.status !== 'FAILED') {
  
            localStorage.setItem("userEmail", formfields.email);
  
            setTimeout(() => {
              setIsLoading(true);
              history("/verifyOTP");
              //window.location.href="/signIn";
            }, 2000);
          } else {
            setIsLoading(false);
            context.setAlertBox({
              open: true,
              error: true,
              msg: res.msg,
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error posting data:", error);
          // Handle error (e.g., show an error message)
        });
    } catch (error) {
      console.log(error);
    }
  };
  

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // Thông tin người dùng đã đăng nhập.
        const user = result.user;
  
        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          images: user.providerData[0].photoURL,
          phone: user.providerData[0].phoneNumber,
        };
  
        postData("/api/user/authWithGoogle", fields).then((res) => {
          try {
            if (res.error !== true) {
              localStorage.setItem("token", res.token);
  
              const user = {
                name: res.user?.name,
                email: res.user?.email,
                userId: res.user?.id,
              };
  
              localStorage.setItem("user", JSON.stringify(user));
  
              context.setAlertBox({
                open: true,
                error: false,
                msg: "Đăng nhập thành công!",
              });
  
              setTimeout(() => {
                history("/");
                context.setIsLogin(true);
                setIsLoading(false);
                context.setisHeaderFooterShow(true);
              }, 2000);
            } else {
              context.setAlertBox({
                open: true,
                error: true,
                msg: res.msg,
              });
              setIsLoading(false);
            }
          } catch (error) {
            console.log(error);
            setIsLoading(false);
          }
        });
  
        context.setAlertBox({
          open: true,
          error: false,
          msg: "Xác thực người dùng thành công!",
        });
  
        // window.location.href = "/";
      })
      .catch((error) => {
        // Xử lý lỗi tại đây.
        const errorCode = error.code;
        const errorMessage = error.message;
        // Email của tài khoản người dùng đã sử dụng.
        const email = error.customData.email;
        // Loại thông tin xác thực đã sử dụng.
        const credential = GoogleAuthProvider.credentialFromError(error);
        context.setAlertBox({
          open: true,
          error: true,
          msg: `Đã xảy ra lỗi: ${errorMessage}`,
        });
      });
  };
  
  return (
    <section className="section signInPage signUpPage">
      <div className="shape-bottom">
        {" "}
        <svg
          fill="#fff"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="0 0 1921 819.8"
          style={{ enableBackground: "new 0 0 1921 819.8" }}
        >
          {" "}
          <path
            className="st0"
            d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
          ></path>{" "}
        </svg>
      </div>
  
      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center">
            <img src={Logo} />
          </div>
  
          <form className="mt-2" onSubmit={register}>
            <h2 className="mb-3">Đăng Ký</h2>
  
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Họ Tên"
                    name="name"
                    onChange={onchangeInput}
                    type="text"
                    variant="standard"
                    className="w-100"
                  />
                </div>
              </div>
  
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Số Điện Thoại"
                    name="phone"
                    onChange={onchangeInput}
                    type="number"
                    variant="standard"
                    className="w-100"
                  />
                </div>
              </div>
            </div>
  
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Email"
                type="email"
                name="email"
                onChange={onchangeInput}
                variant="standard"
                className="w-100"
              />
            </div>
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Mật Khẩu"
                name="password"
                onChange={onchangeInput}
                type="password"
                variant="standard"
                className="w-100"
              />
            </div>
  
  
            <div className="d-flex align-items-center mt-3 mb-3 ">
              <div className="row w-100">
                <div className="col-md-6">
                  <Button
                    type="submit"
                    disabled={isLoading === true ? true : false}
                    className="btn-blue w-100 btn-lg btn-big"
                  >
                    {isLoading === true ? <CircularProgress /> : "Đăng Ký"}
                  </Button>
                </div>
                <div className="col-md-6 pr-0">
                  <Link to="/" className="d-block w-100">
                    {" "}
                    <Button
                      className="btn-lg btn-big w-100"
                      variant="outlined"
                      onClick={() => context.setisHeaderFooterShow(true)}
                    >
                      Hủy Bỏ
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
  
            <p className="txt">
              Đã Có Tài Khoản?{" "}
              <Link to="/signIn" className="border-effect">
                Đăng Nhập
              </Link>
            </p>
  
            <h6 className="mt-4 text-center font-weight-bold">
              Hoặc tiếp tục với tài khoản mạng xã hội
            </h6>
  
            <Button
              className="loginWithGoogle mt-2"
              variant="outlined"
              onClick={signInWithGoogle}
            >
              <img src={GoogleImg} /> Đăng Nhập Với Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  )}
  
  export default SignUp;
  
