import axios from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as utils from '../utils/utils';

const ProductInsert = () => {

  const formElement = useRef(null);
  const [ errorMsg, setErrorMsg ] = useState('');
  const navigator = useNavigate();

  /**
   * 
   * @param {Event} event 
   */
  const handleInsert = (event) => {
    event.preventDefault();

    const formData = new FormData(formElement.current);
    const requestData = utils.extractJsonFromFormData(formData);

    axios.post("http://localhost:8080/test/products", requestData)
      .then(response => {
        if (utils.isSuccessHttpStatusCode(response.status)) {
          alert("새 제품 등록 완료");
          navigator("/product");
        } else {
          console.log("what???");
        }
      })
      .catch(error => {
        const responseData = utils.getResponseDataFromError(error);
        switch (responseData.code) {
          case utils.ApiResponseCode.PRODUCT_ALREADY_EXISTS:
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

  };

  return (
    <div className="page-container">
      <form ref={formElement}>
        <ul>
          <li>
            <label htmlFor="name">제품명: </label>
            <input type="text" 
              id="name" 
              name="name" 
              placeholder="1~30글자 사이"
              required
             />
          </li>
          <li>
            <label htmlFor="category">카테고리: </label>
            <input type="text" 
              id="category" 
              name="category"
              placeholder="1~30글자 사이"
              required
            />
          </li>
          <li>
            <label htmlFor="description">상세설명: </label>
            <textarea id="description" 
              name="description" 
            ></textarea>
          </li>
          <li>
            <label htmlFor="amount">수량: </label>
            <input type="number" 
              id="amount" 
              name="amount" 
            />
          </li>
          <li>
            <label htmlFor="price">가격: </label>
            <input type="number" 
              id="price"
              name="price"
            />
          </li>
        </ul>
        <button onClick={handleInsert}>등록</button>
      </form>
      <p>
        <Link to="/product">되돌아가기</Link>
      </p>
      <p className="error-display">{ errorMsg }</p>
    </div>
  );
};

export default ProductInsert;