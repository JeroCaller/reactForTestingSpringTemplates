import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import '../css/page.css';
import { selectors } from "../redux/actionHelper";
import * as utils from '../utils/utils';

const ProductUpdate = () => {

  const selectedProduct = useSelector(selectors.product);
  const formElement = useRef(null);
  const navigator = useNavigate();
  const [ errorMsg, setErrorMsg ] = useState('');

  /**
   * 
   * @param {Event} event 
   */
  const handleUpdate = (event) => {
    event.preventDefault();

    const formData = new FormData(formElement.current);
    const requestData = utils.extractJsonFromFormData(formData);

    axios.put('http://localhost:8080/test/products', requestData, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    })
      .then(response => {
        if (utils.isSuccessHttpStatusCode(response.status)) {
          alert("수정 성공");
          navigator("/product");
        } else {
          console.log('what???');
        }
      })
      .catch(error => {
        const responseData = utils.getResponseDataFromError(error);
        switch (responseData.code) {
          case utils.ApiResponseCode.PRODUCT_NOT_FOUND:
            setErrorMsg(responseData.message);
            break;
          case utils.ApiResponseCode.VALIDATION_FAILED:
            let details = `${responseData.message}\n`;
            details += utils.extractValidFailedMsg(responseData);
            setErrorMsg(details);
            break;
          default:
            utils.defaultAxiosErrorHandler(error);
        }
      });
  }

  return (
    <div className="page-container">
      <form ref={formElement}>
        <ul>
          <li>
            <input type="hidden" id="id" name="id" defaultValue={selectedProduct.id} />
          </li>
          <li>
            <label htmlFor="name">제품명: </label>
            <input type="text" 
              id="name" 
              name="name" 
              defaultValue={selectedProduct.name}
             />
          </li>
          <li>
            <label htmlFor="category">카테고리: </label>
            <input type="text" 
              id="category" 
              name="category" 
              defaultValue={selectedProduct.category} 
            />
          </li>
          <li>
            <label htmlFor="description">상세설명: </label>
            <textarea id="description" 
              name="description" 
              defaultValue={selectedProduct.description}
            ></textarea>
          </li>
          <li>
            <label htmlFor="amount">수량: </label>
            <input type="number" 
              id="amount" 
              name="amount" 
              defaultValue={selectedProduct.amount} 
            />
          </li>
          <li>
            <label htmlFor="price">가격: </label>
            <input type="number" 
              id="price"
              name="price"
              defaultValue={selectedProduct.price} 
            />
          </li>
        </ul>
        <button onClick={handleUpdate}>수정</button>
      </form>
      <p>
        <Link to="/product">되돌아가기</Link>
      </p>
      <p className="error-display">{ errorMsg }</p>
    </div>
  );
};

export default ProductUpdate;