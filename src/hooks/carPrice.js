import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  postCars,
  putOrder,
  selectDetailCars,
  selectDetailOrder
} from '../redux/features/carSlice';
import { selectDateRange } from '../redux/features/dateSlice';

const carPrice = () => {
  const dates = useSelector(selectDateRange);
  const detailMobil = useSelector(selectDetailCars);
  const detailOrder = useSelector(selectDetailOrder);

  const orderId = detailOrder.id;
  const startRent = dayjs(detailOrder.start_rent_at);
  const finishRent = dayjs(detailOrder.finish_rent_at);
  const startRentAt = startRent.format('YYYY-MM-DD');
  const finishRentAt = finishRent.format('YYYY-MM-DD');
  const carId = detailOrder.CarId;

  const putData = {
    start_rent_at: startRentAt,
    finish_rent_at: finishRentAt,
    car_id: carId
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const firstDate = dayjs(dates[0]);
  const lastDate = dayjs(dates[1]);

  const date1 = firstDate.format('YYYY-MM-DD');
  const date2 = lastDate.format('YYYY-MM-DD');
  const dateDiff = lastDate.diff(firstDate, 'day') + 1;

  const finalPrice = dateDiff * detailMobil.price;

  const postData = {
    start_rent_at: date1,
    finish_rent_at: date2,
    car_id: detailMobil.id
  };

  const handlePost = async () => {
    try {
      const res = await dispatch(postCars(postData)).unwrap();
      console.log(res);
      navigate(`/Pembayaran/${res.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  // ini kupindahin ke konfirmasi
  const handlePut = async () => {
    try {
      const response = await dispatch(
        putOrder({ orderId, payload: putData })
      ).unwrap();
      console.log(response);
      navigate(`/Etiket/${response.id}`);
    } catch (e) {
      console.log(e);
    }
  };

  const location = useLocation();

  const authRedirect = () => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    if (!authData?.access_token) {
      navigate(`/SignIn?redirect_url=${location.pathname}`);
    }
  }

  return { finalPrice, dates, dateDiff, detailMobil, handlePost, handlePut, authRedirect };
};

export default carPrice;
