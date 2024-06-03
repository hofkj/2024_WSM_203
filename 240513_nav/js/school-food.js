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

    if(currentDate.getDay() === 0) {
        currentDate.setDate(currentDate.getDate() - 2);
    };
    
    if( currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 2);
    }




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
    .then((data) => setSchoolFoodMenu(data))
    .catch((error) => console.log(error));
}

//받아온 급식 정보 웹사이트에 표시하자
const setSchoolFoodMenu = (data) => {
    // breakfastMenuUl 가져오자
    //lunchMenuUl 가져오자
    //dinnerMenuUl 가져오자
    const breakfastMenuUl = document.getElementsByClassName("menu breakfast")[0];
    const lunchMenuUl = document.getElementsByClassName("menu lunch")[0];
    const dinnerMenuUl = document.getElementsByClassName("menu dinner")[0];
    breakfastMenuUl.innerHTML = "<li>급식 메뉴를 불러오지 못했습니다.</li>"
    lunchMenuUl.innerHTML = "<li>급식 메뉴를 불러오지 못했습니다.</li>"
    dinnerMenuUl.innerHTML = "<li>급식 메뉴를 불러오지 못했습니다.</li>"


    //data에서 메뉴들 가져오자(조식,중식, 석식)
    if(data["mealServiceDietInfo"] === undefined) return;

    const menuData= data["mealServiceDietInfo"][1]["row"];

    //하나씩 돌면서 clean 작업하자
    menuData.forEach((menuRow) => {

        let cleanedMenu = menuRow.DDISH_NM;
        //(...)없애자
        cleanedMenu = cleanedMenu.replace(/\([^\)]*\)/g, "");     
        //.없애자
        cleanedMenu = cleanedMenu.replace(/\./g, "");       
        //.점 문자 찾아서 "" 대체

        //*없애자
        cleanedMenu = cleanedMenu.replace(/\*/g, "");
        //* 문자 찾아서 "" 대체
        
        //<br/>태그로 나누자
        let cleanedMenuArray = cleanedMenu.split("<br/>");
        
        //빈칸 없애자
        cleanedMenuArray = cleanedMenuArray.map((item) => item.trim());
        
        let menuFoodLis = "";
        cleanedMenuArray.forEach((menuFood) => {
            menuFoodLis += `<li class="menu-food">${menuFood}</li>\n`;
        });
        console.log(menuFoodLis);


        //<li class="menu-food">가져온 메뉴 음식 하나씩</li>
        if(menuRow["MMEAL_SC_NM"] === "조식") {
            //조식의 경우, breakfastMenuUl에 넣자
            breakfastMenuUl.innerHTML = menuFoodLis;
        } else if(menuRow["MMEAL_SC_NM"] === "중식") {
            //중식의 경우, lunchMenuUl에 넣자
            lunchMenuUl.innerHTML = menuFoodLis;
        } else if (menuRow["MMEAL_SC_NM"] === "석식") {
            //석식의 경우, dinnerMenuUl에 넣자 js -> HTML
            dinnerMenuUl.innerHTML = menuFoodLis;
        }

    });




    // console.log("setSchoolFoodMenu", data["mealServiceDietInfo"]);
    // console.log("중식 : ", data["mealServiceDietInfo"][1]["row"][1]["DDISH_NM"]);
    // let breakfastMenu 
    // const TEMP_JSON = {
    //     'name' : '변우석',
    //     'height' : '189',
    //     'filmography' : ['선재업고튀어', '청춘기록'],
    // };
    // console.log(TEMP_JSON.name);
    // console.log(TEMP_JSON["name"]);
    // console.log(TEMP_JSON.height);
    // console.log(TEMP_JSON.filmography);
    // console.log(TEMP_JSON["filmography"][0]);

}

changeDate(0);