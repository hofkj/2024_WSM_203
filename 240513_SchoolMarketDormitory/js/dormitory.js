//selection 3개 가져오자
const selectionItemDivs = document.getElementsByClassName("selection-item");

// 각 페이지 요소 가져오자
const calendarDiv = document.getElementById("calendar");
const selectionWashingmachineTimeDiv = document.getElementById("selection-washingmachine-time");
const selectionRoomNameDiv = document.querySelector("#selection-room-name");
const boardDiv = document.querySelector("#board");
const pageDivs = [calendarDiv, selectionWashingmachineTimeDiv, selectionRoomNameDiv, boardDiv];
const washingmachineSelect = document.getElementById("washingmachine");
const timeSelect = document.querySelector("#time");
const roomSelect = document.getElementById("room"); //이거 시험 문제
const nameInput = document.querySelector("#name");  //**
const boardContainerDiv = document.getElementsByClassName("board-container")[0]; //***이거 시험 문제 */



// calendarDiv.style.display = "block";
// selectionRoomNameDiv.style.display = "block";
// boardDiv.style.display = "block";


const setPage = (page) => {
//clear select
for (const selectionItemDiv of selectionItemDivs) {
    selectionItemDiv.classList.remove("select");

}

if(selectionItemDivs.length -1 >= page) {       //4페이지 selection은 없음
    //select selection
    selectionItemDivs[page-1].classList.add("select");

}


    //clear pages
    pageDivs.forEach(pageDiv => {
        pageDiv.style.display = "none";         //모든 페이지 안 보이게 하자
    })
    //show page
    pageDivs[page-1].style.display = "block";           //1페이지 : calendar, 2페이지 : swt, 3페이지 : srn, 4페이지 : board

    //2페이지
    if(page === 1) {
        //원래는 백엔드에서 reservations 요청해서 가져오자
        //지금은 백엔드 안배웠으니까 LocalStorage에서 가져오자
        let storedReservations = localStorage.getItem("reservations");
        if(storedReservations) {    //저장된 reservations가 있으면
            reservations = JSON.parse(storedReservations);  //string -> JSON 객체
            reservations.map((reservation) => reservation.date = new Date(reservation.date));//reservatios에서 하나 꺼내서 .data에 있는 string -> Date 객체로 바꾸고 다시 .date에 넣자

        }
        else {  //없으면
            reservations = [];
        }

    }else if (page === 2) {           //세탁기, 시간
       
        initWashingmachineTime();
        


    } else if (page === 3) {            //호실, 이름
        //세탁기,시간 번호 기록하자
        newReservation.washingmachine = washingmachineSelect.value;
        newReservation.time = timeSelect.value;
        newReservations.push(newReservation);

        initRoomName();

    } else if (page === 4) {            //세탁기 예약 현황표
        //호실, 이름 기록하자
        newReservation.room = roomSelect.value;
        newReservation.name = nameInput.value;
        reservations.push(newReservation);

        initTable();

    }
}

let allData;                //모든 초기화 정보 : 세탁기, 시간, 호실 정보
let weeklyReservations;      //미리 요일별로 지정된 예약 정보
let newReservation;         //사용자가 입력하고 있는 예약 정보
let reservations = [];            //사용자가 예약 완료한 정보들
let reservation;


const intiData =  async () => {
    //allData 가져오자
    const getAllData = async (url) => {
        return fetch(url)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error.message));
    }
    
    
    //weeklyReservation 가져오자
    const getWeeklyReservation = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;

        }catch (error) {
            console.log(error.message);
        }
        
    }
    
    allData = await getAllData("js/allData.json");
    weeklyReservations = await getWeeklyReservation("js/weekly-reservation.json");

}

const clickDate = (event) => {
    // console.log(event);
    // console.log(event.target.textContent);
    console.log(event.target.dataset.date);     //<div class="item" data-date="뭐시기">텍스트</div> => 뭐시기 
    newReservation = {      //날짜, 세탁기, 시간, 호실, 이름, 알림
        "date" : undefined,
        "washingmachine" : undefined,
        "time" : undefined,
        "room" : undefined,
        "name" : undefined,
        "notification" : true,

    }

    let dateString = event.target.dataset.date;
    newReservation.date = new Date(dateString);        //클릭한 날짜 정보 새 예약에 기록하자        "년-월-일" -> 날짜 객체
    setPage(2);     //2페이지로 이동하자
}

intiData();
setPage(1);

const initWashingmachineTime = () => {
     //  1, 2,3번 세탁기 1, 2, 3 시간 초기화
     //{"1":["1", "2", "3"], "2":["1", "2", "3"], "3":["1", "2", "3"]};
    let allWashingmachineTime = {};

    //초기 세팅하자
    allData.washingmachine.forEach((washingmachine) => {        //1, 2, 3
        allWashingmachineTime[washingmachine] = Object.keys(allData.time);        //{"1": ["1", "2", "3"]}
    });

        // 클릭한 날짜와 요일 구하자
        let weekday = newReservation.date.getDay();
        // 미림 예약된 예약을 보고, 예약된세탁기와 예약된 시간이 있으면 초기화 항목에서 빼자
        weeklyReservations.forEach((weeklyReservation) => {
            if(weekday === weeklyReservation.weekday) {
                //초기화 한 데이터에서 weeklyTeservation에 예약된 세탁기 번호의 시간 번호를 빼자
                const {washingmachine, time} = weeklyReservation

                // const washingmachine = weeklyReservation.washingmachine;
                // const time = weeklyReservation.time;
                const index = allWashingmachineTime[washingmachine].indexOf(String(time));        //원하는 시간 찾아서
                if(index > -1) {
                    allWashingmachineTime[washingmachine].splice(index, 1);     //그 시간 삭제하자
                }
                
            }
        });

        //사용자가 예약한 예약을 보고, 예약된 세탁기와 예약된 시간이 있으면 초기화 항목에서 빼자
        reservations.forEach((reservation) => {
            if(newReservation.date.getFullYear() == reservation.date.getFullYear()
            && newReservation.date.getMonth() == reservation.date.getMonth()
            && newReservation.date.getDate() == reservation.date.getDate()) {
                const {washingmachine, time} = Reservation;
                const index = allWashingmachineTime[washingmachine].indexOf(String(time));        //원하는 시간 찾아서
                if(index > -1) {
                    allWashingmachineTime[washingmachine].splice(index, 1);     //그 시간 삭제하자
                }
            }
        });
        // 초기화 항목에서 예약된 시간 뺸 후, 모든 시간이 없는 세탁기는 뺴자
        let washingmachines = Object.keys(allWashingmachineTime).filter((washingmachine) => allWashingmachineTime[washingmachine].length > 0);


        //세탁기 select에 option 만들어 넣자
        washingmachineSelect.innerHTML = ""; //세탁기 옵션 없애자
    washingmachines.forEach((washingmachine) => {
        let newOption = document.createElement("option"); //<option></option>
        newOption.value = washingmachine; //<option value="세탁기번호"></option>
        newOption.textContent = `${washingmachine}번 세탁기`; //<option value="세탁기번호">세탁기 번호번 세탁기</option>
        washingmachineSelect.appendChild(newOption); //washingmachineSelect에 자식으로 넣자
    });
    //시간 select에 option 만들어 넣자
    const setTimeSelect = (event) => {
        timeSelect.innerHTML = ""; //시간 옵션 없애자
        const selectedWashingmachine = washingmachineSelect.value;
        let times = allWashingmachineTime[selectedWashingmachine]; //["1", "2", "3"]
        times.forEach((time) => {
            let newOption = document.createElement("option"); //<option></option>
            newOption.value = time; //<option value="시간값("1", "2", "3" 중 하나)"></option>
            newOption.textContent = allData["time"][time]; //<option value="시간값("1", "2", "3" 중 하나)">7시 ~ 8시 10분</option>

            //"1" => "7시 8시 10분", "2" => "8시 10분 ~ 9시 20분"
            timeSelect.appendChild(newOption);
        });

    };

    setTimeSelect();
    //세탁기 번호가 바뀌면, setTimeSelect() 호출하자
    washingmachineSelect.onchange = (event) => setTimeSelect(event);
    // [다음] 클릭 => 세탁기 번호, 시간번호를 보관하자 => setPage(3)
}

const initRoomName = () => {
    //모든 호실 표시하자
    let rooms = allData.room; //["701", "801"];
    //allData["room"]; 해도 나온다. 시험 문제 낼거임**


    // 방법1 : createElement -> select.appendChile()
    // roomSelect.innerHTML = "";
    // rooms.forEach((room) => {
    //     let newOption = document.createElement("option");
    //     newOption.value = room;
    //     newOption.textContent = `${room}호`;
    //     roomSelect.appendChild(newOption);
    // });

    //방법2 : string -> select.innerHTML
    // let roomString = "";
    // rooms.forEach((room) => {
    //     roomString += `<option value="${room}">${room}호</option>`;
    // });
    // roomSelect.innerHTML = roomString;


    //방법3 : map()
    roomSelect.innerHTML = rooms.map((room) => `<option value="${room}">${room}호</option>`).join("");


    //이름 초기화하자
    nameInput.value = "";

    //[다음] 클릭 => 호실, 이름 보관하자 => setPage(4)



}

const initTable = () => {
    let tableString = `
    <div class="item board-item header">이름</div>
    <div class="item board-item header">날짜</div>
    <div class="item board-item header">시간</div>
    <div class="item board-item header">세탁기</div>
    <div class="item board-item header">알림</div>
    <div class="item board-item header">호실</div>
    `;

    reservations.forEach((reservation) => {
        tableString += `
        <div class="item board-item">${reservation.name}</div>
        <div class="item board-item">${reservation["room"]}호</div>
        <div class="item board-item">${reservation.date.getFullYear()}년 ${reservation.date.getMonth() + 1}월 ${reservation.date.getDate.getDate()}일</div>
        <div class="item board-item">${allData.time[reservation.time]}</div>
        <div class="item board-item">${reservation.washingmachine}</div>
        <div class="item board-item">${reservation.notification?"🔔":"🔕"}</div>`
    });
    boardContainerDiv.innerHTML = tableString;
}