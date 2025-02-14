import { useEffect, useState } from 'react';
import axios from 'axios';

import '../css/page.css';
import '../css/product.css';
import * as utils from '../utils/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { dispatchers } from '../redux/actionHelper';


/**
 * 제품 목록 본 페이지.
 * 
 * @returns 
 */
const Product = () => {

  // 서버로부터 조회해온 모든 제품 정보들을 담기 위한 상태 변수.
  const [ products, setProducts ] = useState([]);

  const [ errorMessage, setErrorMessage ] = useState('');
  const productDispatcher = useDispatch();
  const navigator = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/test/products')
      .then(response => {
        if (utils.isSuccessHttpStatusCode(response.status)) {
          const responseData = response.data.data;
          //console.log(responseData);
          setProducts(responseData);

          setErrorMessage('');
        }
      })
      .catch(error => {
        const responseData = utils.getResponseDataFromError(error);
        switch (responseData.code) {
          case utils.ApiResponseCode.PRODUCT_NOT_FOUND:
            setProducts([]);
            setErrorMessage(responseData.message);
            break;
          default:
            utils.defaultAxiosErrorHandler(error);
        }
      });
  }, []);

  if (!products) {
    return (
      <div className='page-container'>
        <p>{ errorMessage }</p>
      </div>
    );
  }

  /**
   * 
   * @param {Object} data
   */
  const handleUpdateProduct = (data) => {
    productDispatcher(dispatchers.product.saveProduct(data));
    navigator("/product/update");
  };

  /**
   * 
   * @param {Event} event 
   */
  const handleDeleteProduct = (data) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios.delete(`http://localhost:8080/test/products/${data.id}`)
        .then(response => {
          if (utils.isSuccessHttpStatusCode(response.status)) {
            let newData = [];
            for (const prod of products) {
              if (prod.id !== data.id) {
                newData.push(prod);
              }
            }
            setProducts(newData);
          }
        })
        .catch(error => {
          utils.defaultAxiosErrorHandler(error);
        });
    }
  };

  return (
    <div className="page-container">
      <p>
        <Link to="/">메인 페이지로</Link>
      </p>
      <table border="1">
        <thead>
          <tr>
            <th>제품명</th>
            <th>카테고리</th>
            <th>상세설명</th>
            <th>수량</th>
            <th>가격</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          { products ? products.map(data => <tr key={data.id}>
            <td>{data.name}</td>
            <td>{data.category}</td>
            <td>{data.description}</td>
            <td>{data.amount}</td>
            <td>{data.price}</td>
            <td><button onClick={() => handleUpdateProduct(data)}>수정</button></td>
            <td><button onClick={() => handleDeleteProduct(data)}>삭제</button></td>
          </tr>) : 
          <tr><td colSpan="7">조회된 제품 없음</td></tr>}
        <tr><td colSpan="7">제품 수: {products.length}</td></tr>
        </tbody>
      </table>
      <p>
        <Link to="/product/insert">새 제품 등록</Link>
      </p>
    </div>
  );
};

export default Product;