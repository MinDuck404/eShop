import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { useContext, useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import emprtCart from '../../assets/images/myList.png';
import { deleteData, fetchDataFromApi } from "../../utils/api";

const MyList = () => {

    const [myListData, setmyListData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    const [isLogin,setIsLogin]  = useState(false);

    const history = useNavigate();

    useEffect(() => {
        window.scrollTo(0,0)
        
        const token = localStorage.getItem("token");
        if(token!=="" && token!==undefined  && token!==null){
setIsLogin(true);
        }
        else{
history("/signIn");
        }

        
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/my-list?userId=${user?.userId}`).then((res) => {
            setmyListData(res);
        })

        
    context.setEnableFilterTab(false);
    }, []);


    const removeItem = (id) => {
        setIsLoading(true);
        deleteData(`/api/my-list/${id}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Sản phẩm đã được xoá khỏi danh sách yêu thích"
            })

            const user = JSON.parse(localStorage.getItem("user"));
            fetchDataFromApi(`/api/my-list?userId=${user?.userId}`).then((res) => {
                setmyListData(res);
                setIsLoading(false);
            })
        })
    }
    return (
        <>
            <section className="section cartPage">
                <div className="container">

                    <div className="myListTableWrapper">
                        <h2 className="hd mb-1">Danh Sách Yêu Thích</h2>
                        <p>Có <b className="text-red">{myListData?.length}</b> sản phẩm trong danh sách của bạn</p>
                        {
                            myListData?.length !== 0 ?

                                <div className="row">
                                    <div className="col-md-12 pr-5">

                                        <div className="table-responsive myListTable">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th width="50%">Sản Phẩm</th>
                                                        <th width="15%">Đơn Giá</th>
                                                        <th width="10%">Xoá</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        myListData?.length !== 0 && myListData?.map((item, index) => {
                                                            return (
                                                                <tr>
                                                                    <td width="50%">
                                                                        <Link to={`/product/${item?.productId}`}>
                                                                            <div className="d-flex align-items-center cartItemimgWrapper">
                                                                                <div className="imgWrapper">
                                                                                    <img src={item?.image}
                                                                                        className="w-100" alt={item?.productTitle} />
                                                                                </div>

                                                                                <div className="info px-3">
                                                                                    <h6>
                                                                                        {item?.productTitle}

                                                                                    </h6>
                                                                                    <Rating name="read-only" value={item?.rating} readOnly size="small" />
                                                                                </div>

                                                                            </div>
                                                                        </Link>
                                                                    </td>
                                                                    <td width="15%">{item?.price}đ</td>


                                                                    <td width="10%"><span className="remove" onClick={() => removeItem(item?._id)}><IoIosClose /></span></td>
                                                                </tr>
                                                            )
                                                        })
                                                    }


                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                                :
                                <div className="empty d-flex align-items-center justify-content-center flex-column">
                                    <img src={emprtCart} width="150" />
                                    <h3>Danh sách yêu thích hiện tại đang trống</h3>
                                    <br />
                                    <Link to="/"> <Button className='btn-blue bg-red btn-lg btn-big btn-round'><FaHome /> &nbsp; Tiếp Tục Mua Sắm</Button></Link>
                                </div>
                        }
                    </div>
                </div>
            </section>
            {isLoading === true && <div className="loadingOverlay"></div>}
        </>
    )
}

export default MyList;