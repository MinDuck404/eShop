import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import Select from "@mui/material/Select";
import { emphasize, styled } from "@mui/material/styles";
import { useContext, useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from "react-router-dom";
import Select2 from "react-select";
import { MyContext } from "../../App";
import {
  deleteData,
  deleteImages,
  fetchDataFromApi,
  postData,
  uploadImage,
} from "../../utils/api";

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ProductUpload = () => {
  const [categoryVal, setcategoryVal] = useState("");
  const [subCatVal, setSubCatVal] = useState("");
  const [currentImageURL, setCurrentImageURL] = useState("");

  
  const [productRams, setProductRAMS] = useState([]);
  const [productWeight, setProductWeight] = useState([]);
  const [productSize, setProductSize] = useState([]);

  const [productRAMSData, setProductRAMSData] = useState([]);
  const [productWEIGHTData, setProductWEIGHTData] = useState([]);
  const [productSIZEData, setProductSIZEData] = useState([]);

  const [ratingsValue, setRatingValue] = useState(1);
  const [isFeaturedValue, setisFeaturedValue] = useState("");

  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [previews, setPreviews] = useState([]);

  const [isDisable, setIsDisable] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const history = useNavigate();

  const [formFields, setFormFields] = useState({
    name: "",
    subCat: "",
    subCatName: "",
    description: "",
    brand: "",
    price: null,
    oldPrice: null,
    subCatId: "",
    catName: "",
    catId: "",
    category: "",
    countInStock: null,
    rating: 0,
    isFeatured: null,
    discount: null,
    productRam: [],
    size: [],
    productWeight: [],
    images: [],
  });

  const productImages = useRef();

  const context = useContext(MyContext);

  const formdata = new FormData();

  useEffect(() => {
    const newData = {
      value:'All',
      label:'All'
    };
    const updatedArray = [...context?.countryList];
    updatedArray.unshift(newData);
    setCountryList(updatedArray);
  }, [context?.countryList]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCatData(context.catData);

    fetchDataFromApi("/api/imageUpload").then((res) => {
      res?.map((item) => {
        item?.images?.map((img) => {
          deleteImages(`/api/products/deleteImage?img=${img}`).then((res) => {
            deleteData("/api/imageUpload/deleteAllImages");
          });
        });
      });
    });

    fetchDataFromApi("/api/productWeight").then((res) => {
      setProductWEIGHTData(res);
    });
    fetchDataFromApi("/api/productRAMS").then((res) => {
      setProductRAMSData(res);
    });
    fetchDataFromApi("/api/productSIZE").then((res) => {
      setProductSIZEData(res);
    });
  }, []);

  useEffect(() => {
    formFields.location = context.selectedCountry;
  }, [context.selectedCountry]);

  useEffect(() => {
    const subCatArr = [];

    context.catData?.categoryList?.length !== 0 &&
      context.catData?.categoryList?.map((cat, index) => {
        if (cat?.children.length !== 0) {
          cat?.children?.map((subCat) => {
            subCatArr.push(subCat);
          });
        }
      });

    setSubCatData(subCatArr);
  }, [context.catData]);

  const handleChangeCategory = (event) => {
    setcategoryVal(event.target.value);
    setFormFields(() => ({
      ...formFields,
      category: event.target.value,
    }));
  };

  const handleChangeSubCategory = (event) => {
    setSubCatVal(event.target.value);
  };

  const checkSubCatName = (subCatName) => {
    formFields.subCatName = subCatName;
  };

  const handleChangeProductRams = (event) => {
    // setProductRAMS(event.target.value);
    // setFormFields(() => ({
    //     ...formFields,
    //     productRam: event.target.value
    // }))

    const {
      target: { value },
    } = event;
    setProductRAMS(
      typeof value === "string" ? value.split(",") : value
    );

    formFields.productRam = value;
  };

  const handleChangeProductWeight = (event) => {
    // setProductWeight(event.target.value);
    // setFormFields(() => ({
    //     ...formFields,
    //     productWeight: event.target.value
    // }))

    const {
      target: { value },
    } = event;
    setProductWeight(
      typeof value === "string" ? value.split(",") : value
    );

    formFields.productWeight = value;
  };

  const handleChangeProductSize = (event) => {
    // setProductSize(event.target.value);
    // setFormFields(() => ({
    //     ...formFields,
    //     size: event.target.value
    // }))

    const {
      target: { value },
    } = event;
    setProductSize(
      typeof value === "string" ? value.split(",") : value
    );

    formFields.size = value;
  };

  const handleChangeisFeaturedValue = (event) => {
    setisFeaturedValue(event.target.value);
    setFormFields(() => ({
      ...formFields,
      isFeatured: event.target.value,
    }));
  };

  const inputChange = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const selectCat = (cat, id) => {
    formFields.catName = cat;
    formFields.catId = id;
  };

  const selectSubCat = (subCat, id) => {
    setFormFields(() => ({
      ...formFields,
      subCat: subCat,
      subCatName: subCat,
      subCatId: id,
    }));
  };

  let img_arr = [];
  let uniqueArray = [];

  const onChangeFile = async (e) => {
    try {
        const files = e.target.files;
        const imageUrls = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Kiểm tra loại file
            if (
                file &&
                (file.type === "image/jpeg" ||
                 file.type === "image/png" ||
                 file.type === "image/webp")
            ) {
                // Upload lên server cục bộ hoặc lưu file vào thư mục tĩnh
                const formData = new FormData();
                formData.append("image", file);

                const response = await fetch("/api/uploadImage", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();
                if (result.url) {
                    imageUrls.push(result.url);
                }
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Vui lòng chọn file JPG hoặc PNG.",
                });
                return;
            }
        }

        // Cập nhật danh sách URL vào state và formFields
        setPreviews([...previews, ...imageUrls]);
        setFormFields({ ...formFields, images: [...formFields.images, ...imageUrls] });
    } catch (error) {
        console.error("Lỗi khi tải ảnh lên:", error);
    }
};

    // Hàm thêm URL ảnh
    const addImageURL = () => {
      if (currentImageURL.trim()) {
        // Cập nhật mảng images trong formFields
        setFormFields((prev) => ({
          ...prev,
          images: [...prev.images, currentImageURL.trim()], // Thêm URL vào mảng images
        }));
        setCurrentImageURL(""); // Reset input URL sau khi thêm
      }
    };
    
    
   // Hàm xóa URL ảnh
   const removeImageURL = (index) => {
    setFormFields((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  

  const removeImg = async (index, imgUrl) => {
    const imgIndex = previews.indexOf(imgUrl);

    deleteImages(`/api/category/deleteImage?img=${imgUrl}`).then((res) => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Ảnh đã được xoá!",
      });
    });

    if (imgIndex > -1) {
      previews.splice(index, 1);
    }
  };

  const addProduct = (e) => {
    e.preventDefault();

    const appendedArray = [...previews, ...uniqueArray];

    img_arr = [];

    formdata.append("name", formFields.name);
    formdata.append("description", formFields.description);
    formdata.append("brand", formFields.brand);
    formdata.append("price", formFields.price);
    formdata.append("oldPrice", formFields.oldPrice);
    formdata.append("subCatId", formFields.subCatId);
    formdata.append("catId", formFields.catId);
    formdata.append("catName", formFields.catName);
    formdata.append("category", formFields.category);
    formdata.append("subCat", formFields.subCat);
    formdata.append("countInStock", formFields.countInStock);
    formdata.append("rating", formFields.rating);
    formdata.append("isFeatured", formFields.isFeatured);
    formdata.append("discount", formFields.discount);
    formdata.append("productRam", formFields.productRam);
    formdata.append("size", formFields.size);
    formdata.append("productWeight", formFields.productWeight);
    formdata.append("location", formFields.location);

    formFields.location = selectedLocation;

    formdata.append("images", JSON.stringify(formFields.images));




    if (formFields.name === "") {
      context.setAlertBox({
        open: true,
        msg: "Vui lòng thêm tên sản phẩm",
        error: true,
      });
      return false;
    }

    if (formFields.description === "") {
      context.setAlertBox({
        open: true,
        msg: "Vui lòng thêm mô tả sản phẩm",
        error: true,
      });
      return false;
    }

    if (formFields.brand === "") {
      context.setAlertBox({
        open: true,
        msg: "Vui lòng thêm thương hiệu sản phẩm",
        error: true,
      });
      return false;
    }

    if (formFields.price === null) {
      context.setAlertBox({
        open: true,
        msg: "Vui lòng thêm giá sản phẩm",
        error: true,
      });
      return false;
    }

    if (formFields.oldPrice === null) {
      context.setAlertBox({
        open: true,
        msg: "Vui lòng thêm giá cũ của sản phẩm",
        error: true,
      });
      return false;
    }

    if (formFields.category === "") {
      context.setAlertBox({
        open: true,
        msg: "Vui lòng chọn một danh mục",
        error: true,
      });
      return false;
    }

    // if (formFields.subCat === "") {
    //     context.setAlertBox({
    //         open: true,
    //         msg: 'please select sub category',
    //         error: true
    //     })
    //     return false;
    // }

    if (formFields.countInStock === null) {
      context.setAlertBox({
        open: true,
        msg: "Vui lòng thêm số lượng sản phẩm trong kho",
        error: true,
      });
      return false;
    }

    if (formFields.rating === 0) {
      context.setAlertBox({
        open: true,
        msg: "Vui lòng chọn đánh giá sản phẩm",
        error: true,
      });
      return false;
    }

    if (formFields.isFeatured === null) {
      context.setAlertBox({
        open: true,
        msg: "Vui lòng chọn xem sản phẩm có phải là sản phẩm nổi bật hay không?",
        error: true,
      });
      return false;
    }

    if (formFields.discount === null) {
      context.setAlertBox({
        open: true,
        msg: "Vui lòng chọn giảm giá sản phẩm",
        error: true,
      });
      return false;
    }

    // if (previews.length === 0) {
    //   context.setAlertBox({
    //     open: true,
    //     msg: "Vui lòng chọn hình ảnh",
    //     error: true,
    //   });
    //   return false;
    // }

    setIsLoading(true);
    console.log("Dữ liệu gửi đi:", formFields); // Kiểm tra dữ liệu trước khi gửi
    postData("/api/products/create", formFields).then((res) => {
      context.setAlertBox({
        open: true,
        msg: "Sản phẩm đã được tạo!",
        error: false,
      });

      setIsLoading(false);
      deleteData("/api/imageUpload/deleteAllImages");

      history("/products");
    });
  };


  const handleChangeLocation = (selectedOptions) => {
    setSelectedLocation(selectedOptions);
    console.log(selectedOptions);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Tải Lên Sản Phẩm</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="#"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />

            <StyledBreadcrumb
              component="a"
              label="Products"
              href="#"
              deleteIcon={<ExpandMoreIcon />}
            />
            <StyledBreadcrumb
              label="Product Upload"
              deleteIcon={<ExpandMoreIcon />}
            />
          </Breadcrumbs>
        </div>

        <form className="form" onSubmit={addProduct}>
          <div className="row">
            <div className="col-md-12">
              <div className="card p-4 mt-0">
                <h5 className="mb-4">Thông Tin Cơ Bản</h5>

                <div className="form-group">
                  <h6>TÊN SẢN PHẨM</h6>
                  <input
                    type="text"
                    name="name"
                    value={formFields.name}
                    onChange={inputChange}
                  />
                </div>

                <div className="form-group">
                  <h6>MÔ TẢ</h6>
                  <textarea
                    rows={5}
                    cols={10}
                    value={formFields.description}
                    name="description"
                    onChange={inputChange}
                  />
                </div>

                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <h6>DANH MỤC</h6>
                      <Select
                        value={categoryVal}
                        onChange={handleChangeCategory}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="w-100"
                      >
                        <MenuItem value="">
                          <em value={null}>Không có</em>
                        </MenuItem>
                        {context.catData?.categoryList?.length !== 0 &&
                          context.catData?.categoryList?.map((cat, index) => {
                            return (
                              <MenuItem
                                className="text-capitalize"
                                value={cat._id}
                                key={index}
                                onClick={() => selectCat(cat.name, cat._id)}
                              >
                                {cat.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <h6>DANH MỤC PHỤ</h6>
                      <Select
                        value={subCatVal}
                        onChange={handleChangeSubCategory}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="w-100"
                      >
                        <MenuItem value="">
                          <em value={null}>Không có</em>
                        </MenuItem>
                        {subCatData?.length !== 0 &&
                          subCatData?.map((subCat, index) => {
                            return (
                              <MenuItem
                                className="text-capitalize"
                                value={subCat._id}
                                key={index}
                                onClick={() =>
                                  selectSubCat(subCat.name, subCat._id)
                                }
                              >
                                {subCat.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <h6>GIÁ</h6>
                      <input
                        type="text"
                        name="price"
                        value={formFields.price}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <h6>GIÁ CŨ</h6>
                      <input
                        type="text"
                        name="oldPrice"
                        value={formFields.oldPrice}
                        onChange={inputChange}
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <h6 className="text-uppercase">NỔI BẬT</h6>
                      <Select
                        value={isFeaturedValue}
                        onChange={handleChangeisFeaturedValue}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="w-100"
                      >
                        <MenuItem value="">
                          <em value={null}>Không</em>
                        </MenuItem>
                        <MenuItem value={true}>YES</MenuItem>
                        <MenuItem value={false}>NO</MenuItem>
                      </Select>
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <h6>SỐ LƯỢNG SẢN PHẨM</h6>
                      <input
                        type="text"
                        name="countInStock"
                        value={formFields.countInStock}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>THƯƠNG HIỆU</h6>
                      <input
                        type="text"
                        name="brand"
                        value={formFields.brand}
                        onChange={inputChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>GIẢM GIÁ</h6>
                      <input
                        type="text"
                        name="discount"
                        value={formFields.discount}
                        onChange={inputChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>PRODUCT RAMS</h6>
                      <Select
                        multiple
                        value={productRams}
                        onChange={handleChangeProductRams}
                        displayEmpty
                        className="w-100"
                        MenuProps={MenuProps}
                      >
                        {productRAMSData?.map((item, index) => {
                          return (
                            <MenuItem value={item.productRam}>
                              {item.productRam}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>PRODUCT WEIGHT</h6>
                      <Select
                        multiple
                        value={productWeight}
                        onChange={handleChangeProductWeight}
                        displayEmpty
                        MenuProps={MenuProps}
                        className="w-100"
                      >
                        {productWEIGHTData?.map((item, index) => {
                          return (
                            <MenuItem value={item.productWeight}>
                              {item.productWeight}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>PRODUCT SIZE</h6>
                      <Select
                        multiple
                        value={productSize}
                        onChange={handleChangeProductSize}
                        displayEmpty
                        MenuProps={MenuProps}
                        className="w-100"
                      >
                        {productSIZEData?.map((item, index) => {
                          return (
                            <MenuItem value={item.size}>{item.size}</MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>ĐÁNH GIÁ</h6>
                      <Rating
                        name="simple-controlled"
                        value={ratingsValue}
                        onChange={(event, newValue) => {
                          setRatingValue(newValue);
                          setFormFields(() => ({
                            ...formFields,
                            rating: newValue,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <h6>VỊ TRÍ</h6>

                      <Select2
                        isMulti
                        name="location"
                        options={countryList}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleChangeLocation}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <h6>Thêm URL Ảnh</h6>
            <div className="d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập URL của ảnh"
                value={currentImageURL}
                onChange={(e) => setCurrentImageURL(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary ml-2"
                onClick={addImageURL}
              >
                Thêm
              </button>
            </div>
          </div>
          <div className="form-group">
            <h6>Danh sách URL Ảnh</h6>
            <ul>
              {formFields.images.map((url, index) => (
                <li key={index} className="d-flex align-items-center">
                  <img style={{ maxWidth: "150px" }} src={url}></img> {/* Hiển thị URL ảnh */}
                  <button
                    type="button"
                    className="btn btn-danger btn-sm ml-2"
                    onClick={() => removeImageURL(index)}
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button type="submit" className="btn btn-success">
            Tạo Sản Phẩm
          </button>
        </form>
      </div>
    </>
  );
};

export default ProductUpload;
