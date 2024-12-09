import Button from "@mui/material/Button";
import React, { useContext, useState } from "react";
import { MdMenuOpen, MdNightlightRound, MdOutlineLightMode, MdOutlineMenu } from "react-icons/md";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

import { FaRegBell } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";

import Logout from "@mui/icons-material/Logout";
import PersonAdd from "@mui/icons-material/PersonAdd";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MyContext } from "../../App";

import { useNavigate } from "react-router-dom";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpennotificationDrop, setisOpennotificationDrop] = useState(false);
  const openMyAcc = Boolean(anchorEl);
  const openNotifications = Boolean(isOpennotificationDrop);

  const context = useContext(MyContext);

  const history = useNavigate();

  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
  };

  const handleOpenotificationsDrop = () => {
    setisOpennotificationDrop(true);
  };

  const handleClosenotificationsDrop = () => {
    setisOpennotificationDrop(false);
  };

  const changeTheme = () => {
    if (context.theme === "dark") {
      context.setTheme("light");
    } else {
      context.setTheme("dark");
    }
  };

  const logout = () => {
    localStorage.clear();

    setAnchorEl(null);

    context.setAlertBox({
      open: true,
      error: false,
      msg: "Logout successfull",
    });

    setTimeout(() => {
      history("/login");
    }, 2000);
  };

  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center w-100">
            {/* Logo Wraooer */}
            <div className="col-sm-2 part1 pr-0">
              <Link to={"/"} className="d-flex align-items-center logo">
                <img src={logo} />
                <span className="ml-2">GEARZONE</span>
              </Link>
            </div>

            {context.windowWidth > 992 && (
              <div className="col-sm-3 d-flex align-items-center part2">
                <Button
                  className="rounded-circle mr-3"
                  onClick={() =>
                    context.setIsToggleSidebar(!context.isToggleSidebar)
                  }
                >
                  {context.isToggleSidebar === false ? (
                    <MdMenuOpen />
                  ) : (
                    <MdOutlineMenu />
                  )}
                </Button>
                
              </div>
            )}

            <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
              <Button className="rounded-circle mr-3" onClick={changeTheme}>
                {context.theme === "light" ? (
                  <MdNightlightRound />
                ) : (
                  <MdOutlineLightMode />
                )}
              </Button>

              <div className="dropdownWrapper position-relative">
                <Button
                  className="rounded-circle mr-3"
                  onClick={handleOpenotificationsDrop}
                >
                  <FaRegBell />
                </Button>

                {context.windowWidth < 992 && (
                  <Button
                    className="rounded-circle mr-3"
                    onClick={() => context.openNav()}
                  >
                    <IoMenu />
                  </Button>
                )}

                <Menu
                  anchorEl={isOpennotificationDrop}
                  className="notifications dropdown_list"
                  id="notifications"
                  open={openNotifications}
                  onClose={handleClosenotificationsDrop}
                  onClick={handleClosenotificationsDrop}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <div className="head pl-3 pb-0">
                    <h4>Orders</h4>
                  </div>

                  <div className="pl-3 pr-3 w-100 pt-2 pb-1">
                    <Button className="btn-blue w-100">
                      Xem tất cả
                    </Button>
                  </div>
                </Menu>
              </div>

              {context.isLogin !== true ? (
                <Link to={"/login"}>
                  <Button className="btn-blue btn-lg btn-round">Đăng Nhập</Button>
                </Link>
              ) : (
                <div className="myAccWrapper">
                  <Button
                    className="myAcc d-flex align-items-center"
                    onClick={handleOpenMyAccDrop}
                  >
                    <div className="userImg">
                      <span className="rounded-circle">
                        {context.user?.name?.charAt(0)}
                      </span>
                    </div>

                    <div className="userInfo res-hide">
                      <h4>{context.user?.name}</h4>
                      <p className="mb-0">{context.user?.email}</p>
                    </div>
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={openMyAcc}
                    onClose={handleCloseMyAccDrop}
                    onClick={handleCloseMyAccDrop}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={handleCloseMyAccDrop}>
                    <Link to="/my-account">
                      <ListItemIcon>
                        <PersonAdd fontSize="small" />
                      </ListItemIcon>
                      TÀI KHOẢN
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={logout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      ĐĂNG XUẤT
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
