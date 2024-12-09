import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useContext, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { MyContext } from "../../App";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";

const EditSubCatBox = (props) => {
  const [editCatValue, setEditCatValue] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editModeIndex, setEditModeIndex] = useState();
  const [categoryVal, setcategoryVal] = useState("");

  const [formFields, setFormFields] = useState({
    name: "",
    images: [],
    color: "",
    parentId: null,
    parentCatName:null
  });
  const context = useContext(MyContext);

  const handleChangeCategory = (event) => {
    setcategoryVal(event.target.value);
  };
  
  const selectCat = (cat, id) => {
    formFields.parentId = id;
  };
  const onChangeInput = (e) => {
    setEditCatValue(e.target.value);
    setFormFields({
      name: e.target.value,
    });
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    console.log(formFields);
    formFields.parentCatName = formFields.name;
    editData(`/api/category/${id}`, formFields).then((res) => {
      context.setProgress({
        open: true,
        error: false,
        msg: "Danh mục đã được cập nhật!",
      });

      fetchDataFromApi("/api/category").then((res) => {
        props.setCatData(res);
        setTimeout(() => {
            setEditMode(false);
        }, 200);
        context.setProgress(100);
      });
    });
  };

  const editSubCat = (id, index) => {
    setEditMode(false);
    setEditMode(true);
    setEditModeIndex(index);

    fetchDataFromApi(`/api/category/${id}`).then((res) => {
        setcategoryVal(props.catId);

      setFormFields({
        name: res?.category?.name,
        color: res?.category?.color,
        parentId:props.catId,
        images: res?.category?.images,
        parentCatName:res?.category?.parentCatName
      });
      setEditCatValue(res?.category?.name);
    });
  };

  const deleteSubCat = (id) => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo?.email ) {
    context.setProgress(30);
    deleteData(`/api/category/${id}`).then((res) => {
      context.setProgress(100);
      fetchDataFromApi("/api/category").then((res) => {
        props.setCatData(res);
        context.setProgress(100);
        context.setProgress({
          open: true,
          error: false,
          msg: "Danh mục đã được xoá!",
        });
      });
    });
  }
  else{
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Chỉ quản trị viên mới có thể xóa danh mục phụ",
    });
  }
  };

  return (
    <div className="w-100 btn1_">
      {props.name}

      {editMode === true && (
        <form
          onSubmit={(e) => handleSubmit(e, props.subCatId)}
          className="form d-flex align-align-items-center m-auto"
          style={{ gap: "10px" }}
        >
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small" style={{zoom:'80%'}}>
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
              {props.catData?.length !== 0 &&
                props.catData?.map((cat, index) => {
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
          </FormControl>
          <input type="text" value={editCatValue} onChange={onChangeInput} />
          <Button className="btn-blue" type="submit">
            Chỉnh Sửa
          </Button>
          <Button
            variant="text"
            onClick={() => {
              setEditMode(false);
              setEditModeIndex(null);
            }}
          >
            Cancel
          </Button>
        </form>
      )}

      <div
        className="d-flex align-items-center  ml-auto"
        style={{ gap: "10px" }}
      >
        <MdOutlineEdit
          onClick={() => editSubCat(props.subCatId, props.index_)}
        />
        <IoCloseSharp
          className="cursor"
          onClick={() => deleteSubCat(props.subCatId)}
        />
      </div>
    </div>
  );
};

export default EditSubCatBox;
