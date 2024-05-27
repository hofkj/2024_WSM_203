let currentDate = new Date();

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

const changeDate = (diff) => {
    currentDate.setDate(currentDate.getDate() + diff);

    const dateData = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
    // 2024-05-23 -> 20240523 'YYYYMMDD'
    displayDate();
}