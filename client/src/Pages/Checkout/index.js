import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoBagCheckOutline } from "react-icons/io5";

import { MyContext } from "../../App";
import { fetchDataFromApi, postData, deleteData } from "../../utils/api";

import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [formFields, setFormFields] = useState({
    fullName: "",
    country: "",
    streetAddressLine1: "",
    streetAddressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
  });

  const [cartData, setCartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);

    context.setEnableFilterTab(false);
    const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
      setCartData(res);

      setTotalAmount(
        res.length !== 0 &&
          res
            .map((item) => parseInt(item.price) * item.quantity)
            .reduce((total, value) => total + value, 0)
      );
    });
  }, []);

  const onChangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const context = useContext(MyContext);
  const history = useNavigate();

  const checkout = (e) => {
    e.preventDefault();

    // Kiểm tra thông tin form
    if (formFields.fullName === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập Họ và Tên",
      });
      return false;
    }

    if (formFields.country === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập Quốc gia",
      });
      return false;
    }

    if (formFields.streetAddressLine1 === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập Địa chỉ Đường",
      });
      return false;
    }

    if (formFields.streetAddressLine2 === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập Thông tin Địa chỉ bổ sung",
      });
      return false;
    }

    if (formFields.city === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập Thành phố",
      });
      return false;
    }

    if (formFields.state === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập Tỉnh/Thành",
      });
      return false;
    }

    if (formFields.zipCode === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập Mã Bưu chính",
      });
      return false;
    }

    if (formFields.phoneNumber === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập Số điện thoại",
      });
      return false;
    }

    if (formFields.email === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng nhập Email",
      });
      return false;
    }

    const addressInfo = {
      name: formFields.fullName,
      phoneNumber: formFields.phoneNumber,
      address: formFields.streetAddressLine1 + formFields.streetAddressLine2,
      pincode: formFields.zipCode,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    const user = JSON.parse(localStorage.getItem("user"));

    const payLoad = {
      name: addressInfo.name,
      phoneNumber: formFields.phoneNumber,
      address: addressInfo.address,
      pincode: addressInfo.pincode,
      amount: parseInt(totalAmount),
      email: user.email,
      userid: user.userId,
      products: cartData,
      date: addressInfo.date,
    };

    // Gửi yêu cầu thanh toán tới MoMo
    postData(`/api/payment/pay`, payLoad).then((res) => {
      if (res.success) {
        // Chuyển hướng tới URL thanh toán MoMo
        window.location.href = res.payUrl;
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Thanh toán thất bại, vui lòng thử lại.",
        });
      }
    });
  };

  return (
    <section className="section">
      <div className="container">
        <form className="checkoutForm" onSubmit={checkout}>
          <div className="row">
            <div className="col-md-8">
              <h2 className="hd">THÔNG TIN THANH TOÁN</h2>

              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Họ và Tên *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="fullName"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Quốc gia *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="country"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Địa chỉ *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="Số nhà và tên đường"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="streetAddressLine1"
                      onChange={onChangeInput}
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      label="Căn hộ, phòng, v.v. (tuỳ chọn)"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="streetAddressLine2"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Thành phố *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="Thành phố"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="city"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Tỉnh / Thành phố *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="Tỉnh/Thành phố"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="state"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Mã Bưu chính *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="Mã Bưu chính"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="zipCode"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Số điện thoại"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="phoneNumber"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Email"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="email"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card orderInfo">
                <h4 className="hd">ĐƠN HÀNG CỦA BẠN</h4>
                <div className="table-responsive mt-3">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{parseInt(item.price) * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="total">
                    <h6>Tổng cộng: {totalAmount}</h6>
                  </div>

                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    size="large"
                    startIcon={<IoBagCheckOutline />}
                  >
                    Đặt hàng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
