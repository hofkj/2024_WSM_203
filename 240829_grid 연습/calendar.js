//이전/다음 버튼 클릭하면이전달/다음달로 변경하자

//현재 날짜 구하자
currentDate = new Date();

//제목 표시하자
//HTML -> JS 변수 가져오자
const calendarHeader = document.getElementById("calendar-header");
const calendarHeaderH1 = calendarHeader.getElementsByTagName("h1")[0];
// const calendarHeaderH1 = document.querySelector("#calendar-header h1");
//querySelector 시험에 나옴

//이전/다음 버튼 클릭했을 때, 이전달/다음달로 변경하자
//HTML -> js변수
//click event 발생했을 때, 해야할 일 정하자
const prevMonthButton = document.getElementById("prev-month");
//prevMonthButton.addEventListener("click", console.log("이전"));  //리턴값이 undefined => 클릭했을 때, 가만히 있으라
prevMonthButton.addEventListener("click", () => changeMonth(-1));       //시험 문제 나온다, 함수를 넣는다.
const nextMonthButton = document.querySelector("#next-month");
nextMonthButton.onclick = () => changeMonth(1);

const changeMonth = (diff) => {
    currentDate.setMonth(currentDate.getMonth() + diff);
    //년 구하자
    const year = currentDate.getFullYear();
    //월 구하자
    const month = currentDate.getMonth();
    //제목 바꾸자
    // console.log(`${year}년 ${month +1}월`)

    //js 변수에 innerHTML = `${year}년 ${month +1}월`
    calendarHeaderH1.innerHTML = `<i>${year}년 ${month + 1}월</i>`;

}

changeMonth(0);     //현재 달 출력하자