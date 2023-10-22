# CLIP

## 💻 프로젝트 소개
- 여러 쇼핑몰을 한 곳에 모아 사용자들이 좀 더 쉽게 다양한 쇼핑몰에 접근할 수 있도록 만든 쇼핑몰 사이트입니다.
<br/>

## 🧑‍🤝‍🧑 멤버
- 프론트엔드 개발자 5명
- 백엔드 개발자 5명
<br/>

## 📆 프로젝트 기간
- 2023.08 ~ 2023.09
<br/>

## 📖 사용기술 및 라이브러리
- TypeScript, React, Recoil, Axios
- Emotion, React-Query
<br/>

## 🔔 주요기능
- **SelectBox 공통 컴포넌트 구현 ( [소스링크](https://github.com/supercoding-commerce/FE/blob/dev/src/components/common/SelectBox/SelectBox.tsx) )**
    
    개발 작업이 들어가기 전 SelectBox 공통 컴포넌트를 구현하는 작업을 진행 하였습니다. 
    
    공통 컴포넌트는 재사용이 용이하게 만들어져야 했기 때문에 다른 컴포넌트에서 props로 전달하는 값들에 의해 SelectBox가 동작하도록 option부분에 들어갈 `optionList`, 현재 선택 된 값을 나타내는 `value`, option을 클릭했을 때 value값을 바꿔줄 `onChange함수`를 props로 받아서 동작하도록 기능 구현을 하였습니다.
    
    이를 통해 **단일 책임 원칙 준수 및 추상화를 하였고, 팀의 개발 생산성을 향상시킬 수 있었습니다.**
  <br/>
  <br/>
    

- **Axios Interceptors를 이용한 Token 관리 ( [소스링크](https://github.com/supercoding-commerce/FE/blob/dev/src/apis/index.ts) )**
    
    api 요청을 보내는 경우 매번 요청시에 Token을 넣어서 보내야하는데, 이 과정이 반복적인 작업이라는 느낌을 받았습니다. 이를 효율적으로 만들고 싶어 **Interceptors를 통해 Token 기반 Authorization을 처리했습니다.**
    
    요청을 보낼 때 LocalStorage에 Token이 있다면 해당 Token을 요청헤더에 담아서 보내는 과정을 자동화하였고,  응답에도 Interceptors를 추가해서 응답값에 Token이 있다면 자동으로 LocalStorage에 입력시키도록 로직 구현을 하였습니다. 이러한 과정을 통해서 **api 모듈화 시 재사용성을 높힐 수 있었고, 팀원들의 개발 생산성을 향상시킬 수 있었습니다.**
  <br/>
  <br/>
  
    
- **모바일에 최적화된 모바일 퍼스트 디자인**
    
    기획을 진행할 때 모바일 퍼스트 디자인에 대한 논의를 거쳤습니다. 구글링을 통해 모바일과 데스크탑의 점유율의 통계를 찾아보았었는데, **모바일이 데스크탑보다 약 2배정도 높은 점유율**을 보였습니다.
    
    이러한 통계를 통해 **사용자들의 접근성을 고려하여 모바일 환경을 우선적으로 고려**하는 모바일 퍼스트 디자인으로 프로젝트를 진행하였습니다.
