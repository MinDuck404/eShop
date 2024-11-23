import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";

import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";

import { Link } from "react-router-dom";

import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";

import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import { GiConsoleController } from "react-icons/gi";
import EditSubCatBox from "./editSubCatBox";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

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

const SubCategory = () => {
  const [catData, setCatData] = useState([]);


  const context = useContext(MyContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    context.setProgress(20);
    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res);
      context.setProgress(100);
    });
  }, []);





  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
          <h5 className="mb-0">Sub Category List</h5>

          <div className="ml-auto d-flex align-items-center">
            <Breadcrumbs
              aria-label="breadcrumb"
              className="ml-auto breadcrumbs_"
            >
              <StyledBreadcrumb
                component="a"
                href="#"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />

              <StyledBreadcrumb
                label="Category"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>

            <Link to="/subCategory/add">
              <Button className="btn-blue  ml-3 pl-3 pr-3">
                Add Sub Category
              </Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4 w-75 res-full">
          <ul className="list list-inline list_">
            {catData?.length !== 0 &&
              catData?.map((item, index) => {
                return (
                  <li key={index} className="list-inline-item w-100 subCats mb-4">
                    <h6>{item?.name}</h6>
                    {item?.children?.length !== 0 && (
                      <ul className="list list-inline w-100">
                        {item?.children?.map((subCat, index_) => {
                          return (
                            <li key={index_} className="list-inline-item w-100 mb-2">
                              <EditSubCatBox name={subCat.name} setCatData={setCatData} subCatId={subCat?._id} index={index_} catData={catData} catId={item?._id} />

                              {subCat?.children?.length !== 0 && (
                                <ul className="list list-inline pl-4 pr-5 pt-2 pb-2">
                                  {subCat?.children?.map(
                                    (thirdLevel, index__) => {
                                      return (
                                        <li
                                          key={index__}
                                          className="list-inline-item w-100 mb-2"
                                        >
                                         <EditSubCatBox name={thirdLevel.name} setCatData={setCatData} subCatId={thirdLevel?._id} index={index__} catId={subCat?._id} catData={item?.children}/>
                                         
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
          </ul>

      
        </div>
      </div>
    </>
  );
};

export default SubCategory;
