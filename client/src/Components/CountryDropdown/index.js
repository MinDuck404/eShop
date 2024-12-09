import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import React, { useContext, useEffect, useState } from 'react';
import { FaAngleDown } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { MyContext } from '../../App';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDropdown = () => {

    const [isOpenModal, setisOpenModal] = useState(false);
    const [selectedTab, setselectedTab] = useState(null);

    const [countryList, setcountryList] = useState([]);

    const context = useContext(MyContext);

    const selectCountry = (index, country) => {
        setselectedTab(index);
        setisOpenModal(false);
        context.setselectedCountry(country);
        localStorage.setItem("location", country);
        window.location.href = "/";
    }

    useEffect(() => {
        setcountryList(context.countryList);
    }, [])

    const filterList = (e) => {
        const keyword = e.target.value.toLowerCase();

        if (keyword !== "") {
            const list = countryList.filter((item) => {
                return item.country.toLowerCase().includes(keyword);
            });
            setcountryList(list);
        } else {
            setcountryList(context.countryList);
        }
    }

    return (
        <>
            <Button className='countryDrop' onClick={() => {
                setisOpenModal(true);
                setcountryList(context.countryList);
            }}>
                <div className='info d-flex flex-column'>
                    <span className='label'>VỊ TRÍ HIỆN TẠI</span>
                    <span className='name'>{context.selectedCountry !== "" ? context.selectedCountry.length > 10 ? context.selectedCountry?.substr(0, 10) + '...' : context.selectedCountry : 'Select Location'}</span>
                </div>
                <span className='ml-auto'><FaAngleDown /></span>
            </Button>


            <Dialog open={isOpenModal} onClose={() => setisOpenModal(false)} className='locationModal' TransitionComponent={Transition}>
                <h4 className='mb-0'>Chọn địa chỉ giao hàng của bạn</h4>
                <p>Nhập địa chỉ của bạn và chúng tôi sẽ chỉ ra các ưu đãi cho khu vực của bạn.</p>
                <Button className='close_' onClick={() => setisOpenModal(false)}><MdClose /></Button>

                <div className='headerSearch w-100'>
                    <input type='text' placeholder='Tìm kiếm khu vực của bạn...' onChange={filterList} />
                    <Button><IoIosSearch /></Button>
                </div>

                <ul className='countryList mt-3'>
                    <li><Button onClick={() => selectCountry(0, "All")}
                    >All</Button></li>
                    {
                        countryList?.length !== 0 && countryList?.map((item, index) => {
                            return (
                                <li key={index}><Button onClick={() => selectCountry(index, item.iso2)}
                                    className={`${selectedTab === index ? 'active' : ''}`}
                                >{item.country}</Button></li>
                            )
                        })
                    }


                </ul>

            </Dialog>


        </>
    )
}

export default CountryDropdown;