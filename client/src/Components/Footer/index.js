import Button from "@mui/material/Button";
import { useState } from "react";
import { CiBadgeDollar } from "react-icons/ci";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import { IoMailOutline } from "react-icons/io5";
import { TbDiscount2, TbTruckDelivery } from "react-icons/tb";
import { Link } from "react-router-dom";
import newsLetterImg from "../../assets/images/newsletter.png";

const Footer = () => {
  const [bannerList, setBannerList] = useState([]);

  return (
    <>
      
      <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="text-white mb-1">
              Giảm 10% cho đơn hàng đầu tiên của bạn
              </p>
              <h3 className="text-white">Tham gia cùng GearZone để nhận nhiều ưu đãi</h3>
              <p className="text-light">
              Tham gia đăng ký email của chúng tôi ngay bây giờ để nhận cập nhật về
                <br /> Khuyến mãi và mã giảm giá.
              </p>

              <form className="mt-4">
                <IoMailOutline />
                <input type="text" placeholder="Nhập Địa Chỉ Email Của Bạn" />
                <Button>Đăng Ký</Button>
              </form>
            </div>

            <div className="col-md-6">
              <img src={newsLetterImg} />
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="container">
          <div className="topInfo row">
            <div className="col d-flex align-items-center">
              <span>
                <FaComputer />
              </span>
              <span className="ml-2">Sản phẩm công nghệ</span>
            </div>

            <div className="col d-flex align-items-center">
              <span>
                <TbTruckDelivery />
              </span>
              <span className="ml-2">Miễn phí giao hàng cho đơn hàng trên 100$</span>
            </div>

            <div className="col d-flex align-items-center">
              <span>
                <TbDiscount2 />
              </span>
              <span className="ml-2">Siêu Giảm Giá Mỗi Tháng</span>
            </div>

            <div className="col d-flex align-items-center">
              <span>
                <CiBadgeDollar />
              </span>
              <span className="ml-2">Giá tốt nhất trên thị trường</span>
            </div>
          </div>

          <div className="row mt-5 linksWrap">
            <div className="col">
              <h5>LAPTOP</h5>
              <ul>
                <li>
                  <Link to="#">Laptop Mới Ra Mắt</Link>
                </li>
                <li>
                  <Link to="#">Phụ Kiện Laptop</Link>
                </li>
                <li>
                  <Link to="#">Laptop Chính Hãng</Link>
                </li>
                <li>
                  <Link to="#">Laptop Gaming</Link>
                </li>
                <li>
                  <Link to="#">Laptop Cao Cấp</Link>
                </li>
                <li>
                  <Link to="#">Laptop Văn Phòng</Link>
                </li>
                <li>
                  <Link to="#">Laptop Khuyến Mãi</Link>
                </li>
              </ul>
            </div>

            <div className="col">
              <h5>MÁY ẢNH</h5>
              <ul>
                <li>
                  <Link to="#">Máy Ảnh Mới Ra Mắt</Link>
                </li>
                <li>
                  <Link to="#">Máy Ảnh Chính Hãng</Link>
                </li>
                <li>
                  <Link to="#">Máy Ảnh DSLR</Link>
                </li>
                <li>
                  <Link to="#">Máy Ảnh Mirrorless</Link>
                </li>
                <li>
                  <Link to="#">Máy Ảnh Compact</Link>
                </li>
                <li>
                  <Link to="#">Máy Ảnh Action Camera</Link>
                </li>
                <li>
                  <Link to="#">Máy Ảnh Độ Phân Giải Cao</Link>
                </li>
                <li>
                  <Link to="#">Máy Ảnh Chống Rung</Link>
                </li>
                <li>
                  <Link to="#">Phụ Kiện Máy Ảnh</Link>
                </li>
              </ul>
            </div>

            <div className="col">
              <h5>XÂY DỰNG CẤU HÌNH PC</h5>
              <ul>
                <li>
                  <Link to="#">PC Gaming</Link>
                </li>
                <li>
                  <Link to="#">PC Làm việc</Link>
                </li>
                <li>
                  <Link to="#">PC Học tập</Link>
                </li>
                <li>
                  <Link to="#">PC Stream</Link>
                </li>
                <li>
                  <Link to="#">PC Giá Rẻ</Link>
                </li>
                <li>
                  <Link to="#">PC Tầm Trung</Link>
                </li>
                <li>
                  <Link to="#">PC Cao Cấp</Link>
                </li>
              </ul>
            </div>

            <div className="col">
              <h5>MÀN HÌNH</h5>
              <ul>
                <li>
                  <Link to="#">Màn Hình Gaming</Link>
                </li>
                <li>
                  <Link to="#">Màn Hình Đồ Hoạ</Link>
                </li>
                <li>
                  <Link to="#">Màn Hình Văn Phòng</Link>
                </li>
                <li>
                  <Link to="#">Màn Hình Cong</Link>
                </li>
                <li>
                  <Link to="#">Màn Hình 4K</Link>
                </li>
                <li>
                  <Link to="#">Màn hình OLED</Link>
                </li>
                <li>
                  <Link to="#">Màn hình IPS</Link>
                </li>
              </ul>
            </div>

            <div className="col">
              <h5>PHỤ KIỆN</h5>
              <ul>
                <li>
                  <Link to="#">Bàn Phím</Link>
                </li>
                <li>
                  <Link to="#">Chuột</Link>
                </li>
                <li>
                  <Link to="#">Tai Nghe</Link>
                </li>
                <li>
                  <Link to="#">Loa</Link>
                </li>
                <li>
                  <Link to="#">Cáp Sạc & Cổng Kết Nối</Link>
                </li>
                <li>
                  <Link to="#">Mic</Link>
                </li>
                <li>
                  <Link to="#">Bàn & Ghế</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="copyright mt-3 pt-3 pb-3 d-flex">
            <p className="mb-0">Copyright 2024. All rights reserved</p>
            <ul className="list list-inline ml-auto mb-0 socials">
              <li className="list-inline-item">
                <Link to="#">
                  <FaFacebookF />
                </Link>
              </li>

              <li className="list-inline-item">
                <Link to="#">
                  <FaTwitter />
                </Link>
              </li>

              <li className="list-inline-item">
                <Link to="#">
                  <FaInstagram />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
