import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useContext, useEffect, useState } from "react";
import { IoBagCheckOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi, postData } from "../../utils/api";

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

    console.log(cartData);

    console.log(formFields);
    if (formFields.fullName === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng điền tên đầy đủ",
      });
      return false;
    }

    if (formFields.country === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng điền quốc gia",
      });
      return false;
    }

    if (formFields.streetAddressLine1 === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng điền địa chỉ",
      });
      return false;
    }

    if (formFields.streetAddressLine2 === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng điền địa chỉ đường",
      });
      return false;
    }

    if (formFields.city === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng điền thành phố",
      });
      return false;
    }

    if (formFields.state === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng điền tiểu bang",
      });
      return false;
    }

    if (formFields.zipCode === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng điền mã bưu điện",
      });
      return false;
    }

    if (formFields.phoneNumber === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng điền số điện thoại",
      });
      return false;
    }

    if (formFields.email === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng điền email",
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

    var options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET,
      amount: parseInt(totalAmount * 100),
      currency: "INR",
      order_receipt: "order_rcptid_" + formFields.fullName,
      name: "E-Bharat",
      description: "for testing purpose",
      handler: function (response) {
        console.log(response);

        const paymentId = response.razorpay_payment_id;

        const user = JSON.parse(localStorage.getItem("user"));

        const payLoad = {
          name: addressInfo.name,
          phoneNumber: formFields.phoneNumber,
          address: addressInfo.address,
          pincode: addressInfo.pincode,
          amount: parseInt(totalAmount),
          paymentId: paymentId,
          email: user.email,
          userid: user.userId,
          products: cartData,
          date:addressInfo?.date
        };

        console.log(payLoad)
          

        postData(`/api/orders/create`, payLoad).then((res) => {
fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
            res?.length!==0 && res?.map((item)=>{
                deleteData(`/api/cart/${item?.id}`).then((res) => {
                })
            })
                setTimeout(()=>{
                    context.getCartData();
                },1000);
                history("/orders");
          });
        });
      },

      theme: {
        color: "#3399cc",
      },
    };

    var pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <section className="section">
      <div className="container">
        <form className="checkoutForm" onSubmit={checkout}>
          <div className="row">
            <div className="col-md-8">
              <h2 className="hd">CHI TIẾT THANH TOÁN</h2>

              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Full Name *"
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
                      label="Country *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="country"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Tên đường</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="House number and street name"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="streetAddressLine1"
                      onChange={onChangeInput}
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      label="Apartment, suite, unit, etc. (optional)"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="streetAddressLine2"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Thị trấn / Thành phố *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="City"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="city"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Tiểu bang / Quận *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="State"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="state"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Mã bưu điện / ZIP *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="ZIP Code"
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
                      label="Phone Number"
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
                      label="Email Address"
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
                        <th>Tạm tính</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cartData?.length !== 0 &&
                        cartData?.map((item, index) => {
                          return (
                            <tr>
                              <td>
                                {item?.productTitle?.substr(0, 20) + "..."}{" "}
                                <b>× {item?.quantity}</b>
                              </td>

                              <td>
                                {item?.subTotal?.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "INR",
                                })}
                              </td>
                            </tr>
                          );
                        })}

                      <tr>
                        <td>Tạm tính </td>

                        <td>
                          {(cartData?.length !== 0
                            ? cartData
                                ?.map(
                                  (item) => parseInt(item.price) * item.quantity
                                )
                                .reduce((total, value) => total + value, 0)
                            : 0
                          )?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Button
                  type="submit"
                  className="btn-blue bg-red btn-lg btn-big"
                >
                  <IoBagCheckOutline /> &nbsp; Thanh toán
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
