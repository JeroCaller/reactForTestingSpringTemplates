import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import '../css/page.css';

import * as utils from '../utils/utils';

const SignUp = () => {

  const form = useRef(null);
  const navigator = useNavigate();

  // 아이디 중복 체크 여부 확인용.
  const [ isChecked, setIsChecked ] = useState(false);

  // 아이디 중복 체크 결과를 담을 상태 변수. 
  // true 시 해당 아이디로 회원 가입 가능.
  // false 시 해당 아이디로 회원 가입 불가능.
  const [ isUsernameAllowed, setIsUsernameAllowed ] = useState(false);

  // 아이디 중복 체크 후 다른 아이디로 바꾸면 다시 중복 체크를 진행해야하는데, 
  // 이를 진행하지 않고 바로 회원가입하는 것을 방지하기 위해 
  // 가장 최근에 아이디 중복 체크를 마친 아이디를 상태 변수로 저장.
  const [ checkedUsername , setCheckedUsername ] = useState('');

  // 사용자에게 전달할 메시지
  const [ message, setMessage ] = useState('');

  // 아이디 중복 체크 결과 메시지
  const [ msgForUsernameCheck, setMsgForUsernameCheck ] = useState('');

  /**
   * 아이디 중복 체크
   * 
   * @param {Event} event 
   */
  const handleCheckUsername = (event) => {

    const username = form.current.username.value.trim();
    setCheckedUsername(username);

    if (username === '') {
      setIsChecked(true);
      setIsUsernameAllowed(false);
      setMsgForUsernameCheck("공백은 아이디로 사용할 수 없습니다.");
      return;
    }

    axios.get(`http://localhost:8080/test/members/${username}`)
      .then(response => {
        console.log(response.data);
        if (utils.isSuccessHttpStatusCode(response.status)) {
          const isAllowed = !response.data.data;
          setIsChecked(true);
          setIsUsernameAllowed(isAllowed);
          if (isAllowed) {
            setMsgForUsernameCheck("사용 가능한 아이디입니다.");
          } else {
            setMsgForUsernameCheck("이미 존재하는 아이디입니다. 다른 아이디로 가입해주세요");
          }
        } else {
          console.log("예상치 못한 예외 발생");
          console.log(response);
        }
      })
      .catch(error => {
        utils.defaultAxiosErrorHandler(error);
      });
  };

  /**
   * 사용자가 입력한 회원 정보로 회원 가입을 진행한다. 
   * 
   * @param {Event} event
   */
  const handleSignUpButtonClick = (event) => {

    if (!isChecked) {
      const alertMessage = "회원 가입 전 먼저 아이디 중복 체크부터 해주세요.";
      setMessage(alertMessage);
      return;
    }

    const formData = new FormData(form.current);
    const requestData = utils.extractJsonFromFormData(formData);

    // 특정 아이디로 아이디 중복 체크 후, 아이디 입력란에 다른 
    // 아이디로 바꾸고 중복 체크를 하지 않은 경우를 방지하기 위함.
    if (requestData.username !== checkedUsername) {
      const alertMessage = "중복 체크를 하지 않은 아이디입니다.";
      setMessage(alertMessage);
      setMsgForUsernameCheck('');
      setIsUsernameAllowed(false);
      return;
    }

    if (!isUsernameAllowed) {
      const alertMessage = "중복되는 아이디입니다. 다른 아이디로 회원가입해주세요.";
      setMessage(alertMessage);
      return;
    }

    // 패스워드 공백 비허용
    if (requestData.password.trim() === '') {
      const alertMessage = "공백은 패스워드로 사용 불가능합니다.";
      setMessage(alertMessage);
      return;
    }

    // 메시지 초기화
    setMessage('');

    // 테스트용
    //setMessage("테스트 - 회원가입 가능한 회원 정보입니다.");

    axios.post("http://localhost:8080/test/members/my", requestData)
      .then(response => {
        if (utils.isSuccessHttpStatusCode(response.status)) {
          alert(`회원 가입 성공! 로그인 화면에서 로그인해주세요. 
            회원 가입 아이디: ${response.data.data.username}`
          );
          navigator("/login");
        }
      })
      .catch(error => {
        const expectedStatus = [
          utils.ApiResponseCode.MEMBER_ALREADY_EXISTS,
        ];
        if (error.status in expectedStatus) {
          setMessage(`회원가입 실패. \n${error.response.data.message}`)
        } else {
          console.log("예상치 못한 에러 발생");
          console.log(error);
        }
      });

  };

  return (
    <div className="page-container">
      <h1>회원가입 페이지</h1>
      <form ref={form}>
        <ul>
          <li>
            <label htmlFor="id">아이디: </label>
            <input type="text" 
              id="username" 
              name="username" 
              required="required" 
            />
            <button type="button" onClick={handleCheckUsername}>중복 체크</button>
            <p>{
              isChecked ? 
              <span style={ 
                isUsernameAllowed ? {color: 'green'} : {color: 'red'}}
              >{msgForUsernameCheck}</span> : 
              ''
            }</p>
          </li>
          <li>
            <label htmlFor="password">패스워드: </label>
            <input type="password" id="password" name="password" required="required" />
          </li>
        </ul>
        <button type="button" onClick={handleSignUpButtonClick}>
          회원가입
        </button>
      </form>
      <p>{message}</p>
      <p>
        <Link to="/">회원가입 취소 후 로그인 화면으로 이동하기</Link>
      </p>
    </div>
  );
};

export default SignUp;
