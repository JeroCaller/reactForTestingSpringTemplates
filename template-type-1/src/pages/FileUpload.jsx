import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import * as utils from '../utils/utils';

const FileUpload = () => {

  const formElement = useRef(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const navigator = useNavigate();

  /**
   * 사용자가 입력한 파일 정보 추출.
   * 
   * 참고) 
   * change 이벤트 리스너 내부에서 event.target.files 를 통해 
   * 사용자가 입력한 여러 개의 파일들의 정보를 FileList라는 객체를 통해 
   * 접근 및 확인할 수 있다. 
   * 
   * 참고사이트)
   * https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
   * 
   * @param {Event} event 
   */
  const handleFileChange = (event) => {
    const fileList = event.target.files;
    //console.log(fileList);
    //console.log(fileList[0]);

    setUploadFiles(fileList);
  };
  
  /**
   * 사용자가 입력한 여러 파일들을 서버에 업로드.
   * 
   * @param {Event} event 
   */
  const handleFileUpload = (event) => {
    const formData = new FormData(formElement.current);
    const keyName = "file";
    
    // 업로드하고자 하는 파일 정보를 요청 정보로 변환.
    // request body에 넣으며, key 이름은 files로, 스프링 서버에서 지정한 
    // 이름으로 고정.
    if (uploadFiles && uploadFiles.length > 0) {
      for (const entity of uploadFiles) {
        //console.log(entity);
        formData.append(keyName, entity);
      }
    } else {
      alert("입력된 파일이 없습니다. 업로드할 파일을 먼저 선택해주세요.");
      return;
    }

    let formDataJson = utils.extractJsonFromFormData(formData);
    //console.log(formDataJson);
    formDataJson = {...formDataJson, info: JSON.stringify({description: formDataJson.info})};
    //console.log(formDataJson);

    axios.post("http://localhost:8080/test/files/my", formDataJson, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        //console.log(response.data.message);
        alert(response.data.message);
        navigator("/mypage");
      })
      .catch(error => {
        if (error.status === utils.httpStatusMessages.INTERNAL_SERVER_ERROR) {
          alert(error.response.data.message);
        } else {
          utils.defaultAxiosErrorHandler(error);
        }
      });
  };
  
  return (
    <div>
      <h1>파일 업로드하기</h1>
      <form encType="multipart/form-data" ref={formElement}>
        {/* accept: 특정 유형의 파일만 받는다. 여기서는 이미지 파일만 받도록 설정. */}
        <ul>
          <li>
            <input type="file" 
              id="file" 
              name="file" 
              accept="image/*"
              required 
              onChange={handleFileChange}
            />
          </li>
          <li>
            <p>파일 설명</p>
            <textarea id="info" name="info" rows="5" cols="40"></textarea>
          </li>
        </ul>
        <button type="button" onClick={handleFileUpload}>파일 업로드하기</button>
      </form>
      <p><Link to="/mypage">업로드 취소</Link></p>
    </div>
  );
};

export default FileUpload;