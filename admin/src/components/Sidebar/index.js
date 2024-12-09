import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import { BiSolidCategory } from "react-icons/bi";
import { FaClipboardCheck, FaProductHunt } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { TbSlideshow } from "react-icons/tb";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const context = useContext(MyContext);

  const isOpenSubmenu = (index) => {
    setActiveTab(index);
    if(activeTab===index){
      setIsToggleSubmenu(!isToggleSubmenu);
    }else{
      setIsToggleSubmenu(false);
      setIsToggleSubmenu(true);
    }
  };
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);
    } else {
      history("/login");
    }
  }, []);

  const logout = () => {
    localStorage.clear();

    context.setAlertBox({
      open: true,
      error: false,
      msg: "Đăng xuất thành công",
    });

    setTimeout(() => {
      history("/login");
    }, 2000);
  };

  return (
    <>
      <div className="sidebar">
        <ul>
          <li>
            <NavLink exact activeClassName="is-active" to="/">
              <Button
                className={`w-100 ${activeTab === 0 ? "active" : ""}`}
                onClick={() => {
                  isOpenSubmenu(0);
                  context.setIsOpenNav(false);
                }}
              >
                <span className="icon">
                  <MdDashboard />
                </span>
                Dashboard
              </Button>
            </NavLink>
          </li>

          <li>
            <Button
              className={`w-100 ${
                activeTab === 1 && isToggleSubmenu === true ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(1)}
            >
              <span className="icon">
                <TbSlideshow />
              </span>
              Home Banner Slides
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 1 && isToggleSubmenu === true
                  ? "colapse"
                  : "colapsed"
              }`}
            >
              <ul className="submenu">
              <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/homeBannerSlide/list"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Quản lý Home Slides
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/homeBannerSlide/add"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Thêm Home Banner Slide
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Button
              className={`w-100 ${
                activeTab === 2 && isToggleSubmenu === true ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(2)}
            >
              <span className="icon">
                <BiSolidCategory />
              </span>
              Danh Mục
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 2 && isToggleSubmenu === true
                  ? "colapse"
                  : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Link
                    to="/category"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Quản Lý Danh Mục
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/add"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Thêm Danh Mục
                  </Link>
                </li>
                <li>
                  <Link
                    to="/subCategory"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Quản Lý Danh Mục Phụ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/subCategory/add"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Thêm Danh Mục Phụ
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Button
              className={`w-100 ${
                activeTab === 3 && isToggleSubmenu === true ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(3)}
            >
              <span className="icon">
                <FaProductHunt />
              </span>
              Sản Phẩm
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 3 && isToggleSubmenu === true
                  ? "colapse"
                  : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/products"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Quản Lý Sản Phẩm
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/product/upload"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Thêm Sản Phẩm
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/productRAMS/add"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Add Product RAMS
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/productWEIGHT/add"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Add Product WEIGHT
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/productSIZE/add"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Add Product SIZE
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <NavLink exact activeClassName="is-active" to="/orders">
              <Button
                className={`w-100 ${
                  activeTab === 4 && isToggleSubmenu === true ? "active" : ""
                }`}
                onClick={() => {
                  isOpenSubmenu(4);
                  context.setIsOpenNav(false);
                }}
              >
                <span className="icon">
                  {" "}
                  <FaClipboardCheck fontSize="small" />
                </span>
                Đơn Hàng
              </Button>
            </NavLink>
          </li>

          <li>
            <Button
              className={`w-100 ${
                activeTab === 5 && isToggleSubmenu === true ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(5)}
            >
              <span className="icon">
                <TbSlideshow />
              </span>
              Home Banners
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 5 && isToggleSubmenu === true
                  ? "colapse"
                  : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/banners"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Quản Lý Banner
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/banners/add"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Thêm Banner
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Button
              className={`w-100 ${
                activeTab === 6 && isToggleSubmenu === true ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(6)}
            >
              <span className="icon">
                <TbSlideshow />
              </span>
              Home Side Banners
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 6 && isToggleSubmenu === true
                  ? "colapse"
                  : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/homeSideBanners"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Quản Lý Banner
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/homeSideBanners/add"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Thêm Banner
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Button
              className={`w-100 ${
                activeTab === 7 && isToggleSubmenu === true ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(7)}
            >
              <span className="icon">
                <TbSlideshow />
              </span>
              Home Bottom Banners
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 7 && isToggleSubmenu === true
                  ? "colapse"
                  : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/homeBottomBanners"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Quản Lý Banner
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/homeBottomBanners/add"
                    onClick={() => context.setIsOpenNav(false)}
                  >
                    Thêm Banner
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        <div className="logoutWrapper">
          <div className="logoutBox">
            <Button
              variant="contained"
              onClick={() => {
                logout();
                context.setIsOpenNav(false);
              }}
            >
              <IoMdLogOut /> ĐĂNG XUẤT
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
