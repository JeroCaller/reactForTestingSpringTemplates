import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

import * as utils from '../utils/utils';

const Main = () => {

	const navigator = useNavigate();

	const goToPage = () => {
		axios.get("http://localhost:8080/test/members/my")
			.then(response => {
				if (utils.isSuccessHttpStatusCode(response.status)) {
					navigator("/mypage");
				}
			})
			.catch(error => {
				if (utils.getResponseDataFromError(error).code === utils.ApiResponseCode.NOT_AUTHENTICATED) {
					navigator("/login");
				} else {
					utils.defaultAxiosErrorHandler(error);
				}
			});
	}

  return (
    <div className="page-container">
      <h1>앨범 사이트</h1>
      <hr />
			<button type="button" onClick={goToPage}>내 앨범 보러가기</button>
			<div className="others">
				<p>
					<Link to="/product">제품 목록</Link>
				</p>
			</div>
    </div>
  );
};

export default Main;
