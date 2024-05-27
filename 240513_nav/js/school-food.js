const API_KEY = "611647d9d8c244a39f4230a197efbc74";     //학교급식 API 키
const URL = "https://open.neis.go.kr/hub/mealServiceDietInfo";
const ATPT_OFCDC_SC_CODE = "B10";
const SD_SCHUL_CODE = "7011569";


let currentDate = new Date();

//급식 정보 제목 표시하자
const displayDate = () => {
    let days = "일월화수목금토";
    let month = currentDate.getMonth() + 1;
    let date = currentDate.getDate();
    let day = currentDate.getDay();
    days = days.split("");      /*요일을 문자열로 변환*/

    const schoolFoodTitleHeader = document.getElementsByClassName("school-food-title")[0];
    const titleText = `🍚 ${days[day]}요일(${month}/${date})의 메뉴🍚`;
    schoolFoodTitleHeader.innerText = titleText;
}

//급식 정보 날짜 바꾸자
const changeDate = (diff) => {
    currentDate.setDate(currentDate.getDate() + diff);
    displayDate();

    const dateData = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
    // 2024-05-23 -> 20240523 'YYYYMMDD'
    getSchoolFoodMenu(dateData);
}

//급식 API 이용해서 급식 정보 받아오자
const getSchoolFoodMenu = (dateData) => {
    let url = `${URL}?Type=json&KEY=${API_KEY}\
&pIndex=1\
&pSize=100\
&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}\
&SD_SCHUL_CODE=${SD_SCHUL_CODE}\
&MLSV_YMD=${dateData}`;
    
    //비동기로 url호출
    //error 없다면 then 함수 호출되고, response.json()으로 실제 데이터만 자겨오자
    //error 있다면 catch 함수 호출되고, 에러 출력하자
    fetch(url)
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

//받아온 급식 정보 웹사이트에 표시하자