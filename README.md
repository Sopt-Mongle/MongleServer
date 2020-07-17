
<br><br>

<div align="center" style="display:flex;"><img src="https://user-images.githubusercontent.com/41534832/86881142-c4090700-c128-11ea-85e1-de398680a3a9.png" width="20%"></div>
<div align="center" style="display:flex;"><img src="https://user-images.githubusercontent.com/41534832/86881182-d6834080-c128-11ea-9f99-caa82b7850d0.png" width="30%"></div>

<div align="center">
📚 나를 위한 문장이 모이는 곳, 몽글
</div>

<br><br>

```
📌 책도 가볍게 즐길 수 없을까?
📌 우리가 만드는 문장 큐레이션 플랫폼
```

<br>

- - -

<br><br>

### 📒 Main Function
- 메인
	- 에디터's Pick 테마 보여주기
    - 지금 인기있는 테마와 문장들 보여주기
    - 지금 인기있는 큐레이터 보여주기
- 검색
     - 최근 검색어, 추천 검색어 보여주기
     - 검색어에 해당하는 큐레이터, 테마, 문장 보여주기
- 작성
    - 테마 만들기
    - 문장 올리기
        - 문장이 속한 책 정보 검색하기
- 큐레이터
	- 구독 중인 큐레이터 목록 보여주기
		- 구독/구독 취소
	- 큐레이터 상세 정보 보여주기
		- 큐레이터 프로필
		- 작성한/저장한 테마와 문장
- 내 서재
	- 내 상세 정보 봉주기
		- 내 프로필
		- 작성한/저장한 테마와 문장

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

![Screen Shot 2020-07-16 at 11 02 37 PM](https://user-images.githubusercontent.com/41534832/87680539-83f4f480-c7b8-11ea-96bf-3239aebdaf49.png)

### :closed_book: 배포

* AWS EC2 - 클라우드 컴퓨팅 시스템
* AWS RDS - 
### :books: 사용된 도구

* [Node.js](https://nodejs.org/ko/) - 런타임 환경
* [Express.js](http://expressjs.com/ko/) - 익스프레스 프레임워크 
* [NPM](https://rometools.github.io/rome/) - 노드 패키지 관리자
* [PM2](http://pm2.keymetrics.io/) - 프로세스 관리자
* [MySql](https://miro.medium.com/max/800/0*GFfnMZ1sESpT9uYs.jpg) - 데이터베이스

### 📘 Members
| 김해리 | 박현주 |
| :---: | :---: |
| <img src="https://avatars2.githubusercontent.com/u/41534832?s=400&u=12354b310724861914d139cae2a378adf10a3a1d&v=4" width="50%"></img> | <img src="https://avatars3.githubusercontent.com/u/58289478?s=400&v=4" width="50%"></img>  |
| [Github 링크](https://github.com/khl6235) | [Github 링크](https://github.com/HyeonJooo) |
| >  - 구독 중인 큐레이터 목록 조회
>  - 제목으로 책 검색
>  - 큐레이터 구독/구독 취소
>  - 메인에서 에디터's Pick 컨텐츠 조회
>  - 문장 검색
>  - 테마 검색
>  - API 문서 작성 | >  - 문장 상세 조회
>  - 문장 좋아요
>  - 문장 북마크
>  - 테마 좋아요
>  - 테마 북마크
>  - 큐레이터 상세 조회
>  - 내 서재 상세 조회
>  - API 문서 작성 |



<br>

#### [API 문서 바로가기❗️](https://github.com/Sopt-Mongle/MongleServer/wiki)
#### [기능 명세서 바로가기❗️](https://docs.google.com/spreadsheets/d/19oIWAG0WNR7ldLuVWfylbdrmZumOtTE1EQWJmJRgPAo/edit#gid=0)

