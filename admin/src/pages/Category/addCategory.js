import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { emphasize, styled } from "@mui/material/styles";
import React, { useContext, useEffect, useState } from "react";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import {
  deleteData,
  deleteImages,
  fetchDataFromApi,
  postData,
  uploadImage
} from "../../utils/api";

import CircularProgress from "@mui/material/CircularProgress";
import { IoCloseSharp } from "react-icons/io5";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

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

const AddCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    images: [],
    color: "",
    slug: "",
    parentId: "",
  });

  const [previews, setPreviews] = useState([]);

  const formdata = new FormData();

  const history = useNavigate();

  const context = useContext(MyContext);

  useEffect(() => {
    fetchDataFromApi("/api/imageUpload").then((res) => {
      res?.map((item) => {
        item?.images?.map((img) => {
          deleteImages(`/api/category/deleteImage?img=${img}`).then((res) => {
            deleteData("/api/imageUpload/deleteAllImages");
          });
        });
      });
    });
  }, []);

  const changeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  let img_arr = [];
  let uniqueArray = [];
  let selectedImages = [];


  const [currentImageURL, setCurrentImageURL] = useState("");
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

  
  const addCat = (e) => {
    e.preventDefault();
  
    // Sao chép previews vào formFields.images
    const updatedFormFields = {
      ...formFields,
      images: [...formFields.images], // Use formFields.images directly
      slug: formFields.name, 
    };
  
    // Log để kiểm tra
    console.log("FormFields chuẩn bị lưu:", updatedFormFields);
  
    if (
      updatedFormFields.name !== "" &&
      updatedFormFields.color !== "" &&
      updatedFormFields.images.length > 0
    ) {
      setIsLoading(true);
  
      postData(`/api/category/create`, updatedFormFields)
        .then((res) => {
          setIsLoading(false);
          context.fetchCategory();
          deleteData("/api/imageUpload/deleteAllImages");
          history("/category");
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Lỗi khi tạo danh mục:", error);
          context.setAlertBox({
            open: true,
            error: true,
            msg: "Đã xảy ra lỗi khi tạo danh mục",
          });
        });
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Vui lòng điền đầy đủ thông tin",
      });
    }
  };
  
  
  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
          <h5 className="mb-0">Thêm Danh Mục</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="#"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadcrumb
              component="a"
              label="Category"
              href="#"
              deleteIcon={<ExpandMoreIcon />}
            />
            <StyledBreadcrumb
              label="Add Category"
              deleteIcon={<ExpandMoreIcon />}
            />
          </Breadcrumbs>
        </div>
  
        <form className="form" onSubmit={addCat}>
          <div className="row">
            <div className="col-sm-9">
              <div className="card p-4 mt-0">
                <div className="form-group">
                  <h6>Tên Danh Mục</h6>
                  <input
                    type="text"
                    name="name"
                    value={formFields.name}
                    onChange={changeInput}
                  />
                </div>
  
                <div className="form-group">
                  <h6>Màu sắc</h6>
                  <input
                    type="text"
                    name="color"
                    value={formFields.color}
                    onChange={changeInput}
                  />
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

                <div className="form-group mt-3">
                  <button type="submit" className="btn btn-success w-100">
                    Thêm Danh Mục
                  </button>
                </div>
  
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
  
};

export default AddCategory;
