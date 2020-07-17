
<br><br>

<div align="center" style="display:flex;"><img src="https://user-images.githubusercontent.com/41534832/86881142-c4090700-c128-11ea-85e1-de398680a3a9.png" width="20%"></div>
<div align="center" style="display:flex;"><img src="https://user-images.githubusercontent.com/41534832/86881182-d6834080-c128-11ea-9f99-caa82b7850d0.png" width="30%"></div>

<div align="center">
📚 나를 위한 문장이 모이는 곳, 몽글
</div>

<br><br>

```
📌 책도 가볍게 즐길 수 없을까?

📌 책 속에 담겨있는 짧지만 강렬한 문장들은 우리에게 영감을 주기도 하고, 마음 속 커다란 울림을 주기도 합니다.

📌 몽글은 문장들에 호기심이 많고 감수성이 뛰어난 이들에게 새로운 문장공유 경험을 제공합니다.

📌 우리가 만드는 문장 큐레이션 플랫폼
```

<br>

- - -

<br><br>

### ⚡️ SOPT 26th APPJAM
* 개발 기간 : 2020.06.27 ~ 2020.07.18

<br>

### 📒 Main Function
- **메인**
	- 오늘의 문장, 지금 인기있는 큐레이터, 오늘 하루 저장이 많이 된/문장을 기다리는/최근 조회수가 많은 테마 등을 정렬하여 보여줍니다.
	
- **검색**
	- 검색어에 해당하는 테마, 문장, 큐레이터에 대한 정보를 찾을 수 있습니다.
	- 최근 검색어와 추천 검색어를 통해 사용자는 보다 쉽게 원하는 결과를 얻을 수 있습니다.
	
- **작성**
	- 테마 이름과 몽글만의 이미지를 선택하여 테마를 생성할 수 있습니다.
	- 제목으로 책을 검색하여 올리고 싶은 문장에 대한 정보를 빠르게 찾고, 최근에 문장이 들어간 테마들을 확인해 테마를 지정해 문장을 올릴 수 있습니다.
	- 테마를 아직 정하지 못했다면, 테마 없는 나만의 문장으로 저장해두고 나중에 다시 올릴 수 있습니다.

- **큐레이터**
	- 추천 큐레이터 목록에서 활발하게 문장을 올리는 큐레이터를 확인합니다.
	- 테마 속 큐레이터 목록에서 많은 큐레이터들이 참여한 테마와 그 안의 큐레이터들을 확인합니다.
	- 6개의 키워드로 원하는 느낌의 큐레이터를 볼 수 있습니다.
	- 큐레이터 상세보기로 마음에 드는 큐레이터가 쓴 문장과 테마를 볼 수 있고, 구독 또는 구독 취소할 수 있습니다.

- **조회**
	- 테마와 문장을 확인할 수 있습니다.
	- 마음에 드는 테마를 북마크, 마음에 드는 문장을 공감과 북마크해 내 서재에서 볼 수 있습니다.
	- 문장이 속한 테마의 다른 문장을 함께 확인해서 비슷한 느낌의 문장도 읽을 수 있습니다.

- **내 서재**
	- 나의 프로필을 볼 수 있는 내 서재입니다.
	- 내가 북마크하거나 직접 쓴 테마와 문장을 모아 볼 수 있습니다.
	- 내가 구독 중인 큐레이터들을 모아 볼 수 있습니다.
	- 프로필 사진과 소개글, 나를 표현하는 키워드를 바꿀 수 있습니다.

- **유저**
	- 회원가입으로 몽글에 유저가 될 수 있습니다.
	- 로그인으로 몽글에 접속할 수 있습니다.
	- 몽글을 그만두신다면, 회원탈퇴로 내 정보를 지울 수 있습니다.

<br>

### 📕 Dependencies
```json
{
  "name": "mongle",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "nodemon ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "jade": "~1.11.0",
    "jsonwebtoken": "^8.5.1",
    "moment": "^2.27.0",
    "morgan": "~1.9.1",
    "mysql": "^2.18.1",
    "nodemon": "^2.0.4",
    "pbkdf2": "^3.1.1",
    "promise": "^8.1.0",
    "promise-mysql": "^4.1.3",
    "rand-token": "^1.0.1",
    "request": "^2.88.2"
  }
}
```

<br>

### 📗 ERD

![Screen Shot 2020-07-17 at 10 05 54 PM](https://user-images.githubusercontent.com/41534832/87789281-c03c5980-c879-11ea-8001-5c33534f5ce3.png)


<br>


### :closed_book: 배포

* AWS EC2 - 클라우드 컴퓨팅 시스템
* AWS RDS - 데이터베이스 관리 시스템

<br>

### :books: 사용된 도구

* [Node.js](https://nodejs.org/ko/) - 런타임 환경
* [Express.js](http://expressjs.com/ko/) - 익스프레스 프레임워크 
* [NPM](https://rometools.github.io/rome/) - 노드 패키지 관리자
* [PM2](http://pm2.keymetrics.io/) - 프로세스 관리자
* [MySql](https://miro.medium.com/max/800/0*GFfnMZ1sESpT9uYs.jpg) - 데이터베이스

<br>

### 📘 Members
| 김해리 | 박현주 |
| :---: | :---: |
| <img src="https://avatars2.githubusercontent.com/u/41534832?s=400&u=12354b310724861914d139cae2a378adf10a3a1d&v=4" width="50%"></img> | <img src="https://avatars3.githubusercontent.com/u/58289478?s=400&v=4" width="50%"></img>  |
| [Github 링크](https://github.com/khl6235) | [Github 링크](https://github.com/HyeonJooo) |
| **검색**<br> - 큐레이터 검색<br> - 문장 검색<br> - 테마 검색<br> - 최근 키워드<br> - 최근 키워드 전체삭제<br> - 추천 키워드<br><br> **작성**<br> - 테마 만들기<br> - 문장 올리기<br> - 제목으로 책 검색<br> - 선택할 테마 목록 조회<br> - 테마 없는 문장 목록 조회<br> - 테마 없는 문장 테마 지정하기<br><br> **큐레이터**<br> - 큐레이터 구독/구독취소<br> - 큐레이터 상세보기<br> - 테마 속 큐레이터 목록 조회<br><br> **조회**<br> - 테마 상세조회<br> - 문장 상세조회<br> - 이 테마의 다른 문장 조회<br><br> **내 서재**<br> - 내 서재 프로필 조회<br> - 내 서재 테마 조회<br> - 내 서재 문장 조회<br> - 내 서재 구독 조회<br> - 내 정보 수정<br> - 내가 쓴 문장 수정<br> - 내가 쓴 문장 삭제<br><br> **API 문서 작성**<br>**인프라 구축** |   **메인**<br> - 오늘의 문장 목록 조회<br> - 지금 인기있는 큐레이터 목록 조회<br> - 오늘 저장이 많이된 테마목록 조회<br> - 문장을 기다리고 있는 테마목록 조회<br> - 최근 3일 조회수 많은 테마목록 조회<br><br> **큐레이터**<br> - 큐레이터 상세보기<br> - 추천 큐레이터 목록 조회<br> - 테마 속 큐레이터 목록 조회<br> - 키워드로 큐레이터 목록 조회<br><br> **작성**<br> - 테마 만들기<br> - 문장 올리기<br> - 선택할 테마 목록 조회<br> - 테마없는 문장 목록 조회<br> - 테마 이미지 조회<br><br> **조회**<br>  - 테마 북마크하기<br> - 문장 좋아요 누르기<br> - 문장 북마크하기<br><br> **내 서재**<br> - 내 서재 프로필 조회<br> - 내 서재 테마 조회<br> - 내 서재 문장 조회<br> - 내 서재 구독 조회<br> - 내 정보 수정<br> - 내가 쓴 문장 수정<br> - 내가 쓴 문장 삭제<br><br> **유저**<br> - 회원가입<br> - 로그인<br> - 회원탈퇴<br><br> **API 문서 작성**<br>**인프라 구축**  |



<br>

#### [API 문서 바로가기❗️](https://github.com/Sopt-Mongle/MongleServer/wiki)
#### [기능 명세서 바로가기❗️](https://docs.google.com/spreadsheets/d/19oIWAG0WNR7ldLuVWfylbdrmZumOtTE1EQWJmJRgPAo/edit#gid=0)


<div align="right" style="display:flex;"><img src="https://user-images.githubusercontent.com/41534832/87791813-df3cea80-c87d-11ea-9740-f96e155e171f.jpg" width = "30%"></div>
