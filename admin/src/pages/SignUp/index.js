import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { FaPhoneAlt, FaUserCircle } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff, IoMdHome } from "react-icons/io";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import googleIcon from "../../assets/images/googleIcon.png";
import Logo from "../../assets/images/logo.png";
import patern from "../../assets/images/pattern.webp";
import { firebaseApp } from "../../firebase";
import { postData } from "../../utils/api";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setisShowPassword] = useState(false);
  const [isShowConfirmPassword, setisShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formfields, setFormfields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: true,
  });

  const history = useNavigate();

  const context = useContext(MyContext);

  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
  }, []);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value,
    }));
  };

  const signUp = (e) => {
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

      if (formfields.confirmPassword === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Xác nhận mật khẩu không được để trống!",
        });
        return false;
      }

      if (formfields.confirmPassword !== formfields.password) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Mật khẩu xác nhận không khớp!",
        });
        return false;
      }

      setIsLoading(true);

      postData("/api/user/signup", formfields)
        .then((res) => {
          console.log(res);

          if (res.status !== "FAILED") {
            localStorage.setItem("userEmail", formfields.email);

            setTimeout(() => {
              setIsLoading(true);
              history("/verify-account");
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
          console.error("Lỗi gửi dữ liệu:", error);
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

        const user = result.user;

        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          images: user.providerData[0].photoURL,
          phone: user.providerData[0].phoneNumber,
          isAdmin: true,
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
                msg: res.msg,
              });

              setTimeout(() => {
                context.setIsLogin(true);
                history("/dashboard");
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
          msg: "Đăng nhập người dùng thành công!",
        });

        // window.location.href = "/";
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        context.setAlertBox({
          open: true,
          error: true,
          msg: errorMessage,
        });
        // ...
      });
  };

  return (
    <>
      <img src={patern} className="loginPatern" />
      <section className="loginSection signUpSection">
        <div className="row">
          <div className="col-md-8 d-flex align-items-center flex-column part1 justify-content-center">
            <h1>
              GEARZONE - CÔNG NGHỆ SỐ{" "}
              <span className="text-sky">THIẾT BỊ CÔNG NGHỆ MỚI NHẤT</span>
            </h1>
            <p>
              GearZone chuyên cung cấp các thiết bị công nghệ số tiên tiến, từ
              smartphone, máy tính bảng, laptop đến các phụ kiện số, đáp ứng mọi
              nhu cầu công nghệ của bạn. Khám phá ngay các sản phẩm công nghệ
              số mới nhất tại GearZone.
            </p>

            <div className="w-100 mt-4">
              <Link to={"/"}>
                <Button className="btn-blue btn-lg btn-big">
                  <IoMdHome /> Trở về Trang Chủ
                </Button>
              </Link>
            </div>
          </div>

          <div className="col-md-4 pr-0">
            <div className="loginBox">
              <Link
                to={"/"}
                className="d-flex align-items-center flex-column logo"
              >
                <img src={Logo} />
                <span className="ml-2">GearZone</span>
              </Link>

              <div className="wrapper mt-3 card border">
                <form onSubmit={signUp}>
                  <div
                    className={`form-group position-relative ${
                      inputIndex === 0 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <FaUserCircle />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập tên của bạn"
                      onFocus={() => focusInput(0)}
                      onBlur={() => setInputIndex(null)}
                      autoFocus
                      name="name"
                      onChange={onchangeInput}
                    />
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 1 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <MdEmail />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Nhập email của bạn"
                      onFocus={() => focusInput(1)}
                      onBlur={() => setInputIndex(null)}
                      name="email"
                      onChange={onchangeInput}
                    />
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 2 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <FaPhoneAlt />
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Nhập số điện thoại của bạn"
                      onFocus={() => focusInput(2)}
                      onBlur={() => setInputIndex(null)}
                      name="phone"
                      onChange={onchangeInput}
                    />
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 3 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <RiLockPasswordFill />
                    </span>
                    <input
                      type={`${isShowPassword === true ? "text" : "password"}`}
                      className="form-control"
                      placeholder="Nhập mật khẩu của bạn"
                      onFocus={() => focusInput(3)}
                      onBlur={() => setInputIndex(null)}
                      name="password"
                      onChange={onchangeInput}
                    />

                    <span
                      className="toggleShowPassword"
                      onClick={() => setisShowPassword(!isShowPassword)}
                    >
                      {isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />}
                    </span>
                  </div>

                  <div
  className={`form-group position-relative ${
    inputIndex === 4 && "focus"
  }`}
>
  <span className="icon">
    <IoShieldCheckmarkSharp />
  </span>
  <input
    type={`${
      isShowConfirmPassword === true ? "text" : "password"
    }`}
    className="form-control"
    placeholder="Xác nhận mật khẩu của bạn"
    onFocus={() => focusInput(4)}
    onBlur={() => setInputIndex(null)}
    name="confirmPassword"
    onChange={onchangeInput}
/>

<span
  className="toggleShowPassword"
  onClick={() =>
    setisShowConfirmPassword(!isShowConfirmPassword)
  }
>
  {isShowConfirmPassword === true ? (
    <IoMdEyeOff />
  ) : (
    <IoMdEye />
  )}
</span>
</div>

<div className="form-group">
  <Button
    type="submit"
    className="btn-blue btn-lg w-100 btn-big"
  >
    {isLoading === true ? <CircularProgress /> : "Đăng Ký"}
  </Button>
</div>

<div className="form-group text-center mb-0">
  <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
    <span className="line"></span>
    <span className="txt">hoặc</span>
    <span className="line"></span>
  </div>

  <Button
    variant="outlined"
    className="w-100 btn-lg btn-big loginWithGoogle"
    onClick={signInWithGoogle}
  >
    <img src={googleIcon} width="25px" /> &nbsp; Đăng nhập với Google
  </Button>
</div>

</form>

<span className="text-center d-block mt-3">
  Bạn đã có tài khoản?
  <Link to={"/login"} className="link color ml-2">
    Đăng nhập
  </Link>
</span>
</div>
</div>
</div>
</div>
</section>
</>
  );
};

export default SignUp;
