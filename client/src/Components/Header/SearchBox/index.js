import { ClickAwayListener } from "@mui/base";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../../App";
import { fetchDataFromApi } from "../../../utils/api";
const SearchBox = (props) => {
  const [searchFields, setSearchFields] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState([]);

  const context = useContext(MyContext);

  const history = useNavigate();

  const onChangeValue = (e) => {
    setSearchFields(e.target.value);
    if (e.target.value !== "") {
      fetchDataFromApi(`/api/search?q=${e.target.value}`).then((res) => {
        setSearchData(res);
      });
    } else {
      setSearchData([]);
    }
  };

  const searchProducts = () => {
    if (searchFields !== "") {
      setIsLoading(true);
      setSearchData([]);
      fetchDataFromApi(`/api/search?q=${searchFields}`).then((res) => {
        context.setSearchData(res);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        props.closeSearch();
        history("/search");
      });
    }
  };

  //   useEffect(() => {
  //     if (searchData.length > 0) console.log(searchData);
  //     setSearchData(searchData);
  //   }, [searchData]);

  return (
    <ClickAwayListener onClickAway={() => setSearchData([])}>
      <div className="headerSearch ml-3 mr-3">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          onChange={onChangeValue}
        />
        <Button onClick={searchProducts}>
          {isLoading === true ? <CircularProgress /> : <IoIosSearch />}
        </Button>

        {searchData?.length > 0 && (
          <div className="searchResults res-hide">
            {searchData?.map((item, index) => {
              return (
                <div className="d-flex align-items-center result">
                  <div className="img">
                    <Link to={`/product/${item?.id}`}>
                      <img src={item?.images[0]} className="w-100" />
                    </Link>
                  </div>

                  <div className="info ml-3">
                    <Link to={`/product/${item?.id}`}>
                      <h4 className="mb-1">
                        {item?.name.substr(0, 50) + "..."}
                      </h4>
                    </Link>
                    <span>Rs. {item?.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default SearchBox;
