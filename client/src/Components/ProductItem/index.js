import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Skeleton from "@mui/material/Skeleton";
import { useContext, useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { IoIosImages, IoMdHeartEmpty } from "react-icons/io";
import { TfiFullscreen } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";

const ProductItem = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddedToMyList, setSsAddedToMyList] = useState(false);

  const context = useContext(MyContext);

  const sliderRef = useRef();

  var settings = {
    dots: true,
    infinite: true,
    loop: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: 100,
  };

  const viewProductDetails = (id) => {
    context.openProductDetailsModal(id, true);
  };

  const handleMouseEnter = (id) => {
    if (isLoading === false) {
      setIsHovered(true);
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.slickPlay();
        }
      }, 20);
    }

    const user = JSON.parse(localStorage.getItem("user"));

    fetchDataFromApi(
      `/api/my-list?productId=${id}&userId=${user?.userId}`
    ).then((res) => {
      if (res.length !== 0) {
        setSsAddedToMyList(true);
      }
    });
  };

  const handleMouseLeave = () => {
    if (isLoading === false) {
      setIsHovered(false);
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.slickPause();
        }
      }, 20);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const addToMyList = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user !== undefined && user !== null && user !== "") {
      const data = {
        productTitle: props?.item?.name,
        image: props.item?.images[0],
        rating: props?.item?.rating,
        price: props?.item?.price,
        productId: id,
        userId: user?.userId,
      };
      postData(`/api/my-list/add/`, data).then((res) => {
        if (res.status !== false) {
          context.setAlertBox({
            open: true,
            error: false,
            msg: "Sản phẩm đã được thêm vào danh sách",
          });

          fetchDataFromApi(
            `/api/my-list?productId=${id}&userId=${user?.userId}`
          ).then((res) => {
            if (res.length !== 0) {
              setSsAddedToMyList(true);
            }
          });
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.msg,
          });
        }
      });
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng đăng nhập để tiếp tục",
      });
    }
  };

  return (
    <>
      <div
        className={`productItem ${props.itemView}`}
        onMouseEnter={() =>
          handleMouseEnter(
            props?.itemView === "recentlyView"
              ? props.item?.prodId
              : props.item?.id
          )
        }
        onMouseLeave={handleMouseLeave}
        
      >
        <div className="img_rapper">
          <Link
            to={`/product/${
              props?.itemView === "recentlyView"
                ? props.item?.prodId
                : props.item?.id
            }`}
          >
            <div className="productItemSliderWrapper">

            {isLoading === true ? (
              <Skeleton variant="rectangular" width={300} height={400}>
                <IoIosImages />
              </Skeleton>
            ) : (
              <img src={props.item?.images[0]} className="w-100 img1" />
            )}

            {props.item?.images.length > 1 && (
              <img src={props.item?.images[1]} className="w-100 img2" />
            )}


              {
                // isHovered === true &&
                // <Slider {...settings} ref={sliderRef} className='productItemSlider'>
                //     {
                //         props.item?.images?.map((image, index) => {
                //             return (
                //                 <div className='slick-slide' key={index}>
                //                     <img src={image} className="w-100" />
                //                 </div>
                //             )
                //         })
                //     }
                // </Slider>
              }
            </div>

            
          </Link>

          <span className="badge badge-primary">{props.item?.discount}%</span>
          <div className="actions">
            <Button
              onClick={() =>
                viewProductDetails(
                  props?.itemView === "recentlyView"
                    ? props.item?.prodId
                    : props.item?.id
                )
              }
            >
              <TfiFullscreen />
            </Button>

            <Button
              className={isAddedToMyList === true && "active"}
              onClick={() =>
                addToMyList(
                  props?.itemView === "recentlyView"
                    ? props.item?.prodId
                    : props.item?.id
                )
              }
            >
              {isAddedToMyList === true ? (
                <FaHeart style={{ fontSize: "20px" }} />
              ) : (
                <IoMdHeartEmpty style={{ fontSize: "20px" }} />
              )}
            </Button>
          </div>
        </div>

        <div className="info" title={props?.item?.name}>
          <Link
            to={`/product/${
              props?.itemView === "recentlyView"
                ? props.item?.prodId
                : props.item?.id
            }`}
          >
            <h4>{props?.item?.name?.substr(0, 20) + "..."}</h4>
          </Link>

          {props?.item?.countInStock >= 1 ? (
            <span className="text-success d-block">Còn Hàng</span>
          ) : (
            <span className="text-danger d-block">Hết Hàng</span>
          )}

          <Rating
            className="mt-2 mb-2"
            name="read-only"
            value={props?.item?.rating}
            readOnly
            size="small"
            precision={0.5}
          />

          <div className="d-flex">
            <span className="oldPrice">
              {props?.item?.oldPrice?.toLocaleString("vi-VN")}₫
            </span>
            <span className="netPrice text-danger ml-2">
              {props?.item?.price?.toLocaleString("vi-VN")}₫
            </span>

          </div>
        </div>
      </div>

      {/*<ProductModel/> */}
    </>
  );
};

export default ProductItem;
