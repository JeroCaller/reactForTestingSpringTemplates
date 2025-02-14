/**
 * form 태그 내부의 input 요소들의 key - value 쌍을
 * 하나의 JSON 객체로 추출.
 * 요청 바디에 담을 요청 정보로써 사용.
 *
 * @param {FormData} formData
 * @returns {Object} - JSON 형태로 바뀐 요청 데이터들.
 */
const extractJsonFromFormData = (formData) => {
  const jsonData = {};

  for (const [key, value] of formData.entries()) {
    jsonData[key] = value;
  }

  return jsonData;
};

/**
 * HTTP Status Code가 2XX대인지, 즉 응답 성공인지 확인.
 * 
 * @param {number} httpStatus - 3자리 수의 HTTP Status Code
 * @returns {boolean} 2XX 이면 true, 그 외는 false
 */
const isSuccessHttpStatusCode = (httpStatus) => {
	return Math.trunc(httpStatus / 100) === 2 ? true : false; 
};

/**
 * 객체 리터럴이 빈 객체인지 확인하는 함수.
 * 배열도 객체이므로 오로지 객체 리터럴만을 대상으로 
 * 체크함. 
 * 
 * 참고 사이트)
 * https://swtpumpkin.github.io/javascript/checkEmptyObject/
 * 
 * @param {Object} target 
 * @returns 
 */
const isEmptyObject = (target) => {
  return Object.keys(target).length === 0 && target.constructor === Object;
}

/**
 * axios.catch() 에서 사용할 기본 에러 처리 함수.
 * 
 * @param {*} error 
 */
const defaultAxiosErrorHandler = (error) => {
  console.log("예상치 못한 에러 발생");
  console.log(error);
}

/**
 * axios -> catch() 내에서 발생하는 error 객체로부터 
 * response data를 반환.
 * data를 얻는 구조는 REST API에 의존됨.
 * 
 * @param {*} error 
 * @returns 
 */
const getResponseDataFromError = (error) => {
  return error.response.data;
};

/**
 * 유효성 검사 실패 데이터 추출.
 * 
 * @param {*} responseData - error.response.data
 * @returns 
 */
const extractValidFailedMsg = (responseData) => {
  if (responseData.validFailedMsg === null) {
    if (responseData.response != null && responseData.response.data != null) {
      // responseData가 error인 경우.
      responseData = responseData.response.data;
    } else {
      return '';
    }
  }

  let message = '';
  for (const key in responseData.validFailedMsg) {
    message += `${key} : ${responseData.validFailedMsg[key]}`;
  }

  return message;
}

const httpStatusMessages = {
  OK: 200,
  CREATED: 201,
  PARTIAL_CONTENT: 206,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const ApiResponseCode = {
  NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
  MEMBER_ALREADY_EXISTS: "MEMBER_ALREADY_EXISTS",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  LOGIN_FAILED: "LOGIN_FAILED",
  FILE_NOT_FOUND: "FILE_NOT_FOUND",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  PRODUCT_ALREADY_EXISTS: "PRODUCT_ALREADY_EXISTS",
};

export { 
  extractJsonFromFormData, 
  isSuccessHttpStatusCode,
  isEmptyObject,
  defaultAxiosErrorHandler,
  getResponseDataFromError,
  extractValidFailedMsg,
  httpStatusMessages,
  ApiResponseCode
};
